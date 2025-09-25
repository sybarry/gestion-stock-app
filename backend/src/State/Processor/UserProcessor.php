<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Entity\Client;
use App\Entity\Fournisseur;
use App\Entity\Admin;
use Doctrine\ORM\EntityManagerInterface;

class UserProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        $name = $operation->getName() ?? '';
        switch ($name) {
            case 'api_delete_user':
                return $this->supprimeUser($data, $uriVariables, $context);
            case 'api_patch_user':
                return $this->modifieUser($data, $uriVariables, $context);
            case 'api_create_user':
                return $this->ajouteUser($data, $uriVariables, $context);
            default:
                throw new \RuntimeException('Opération non supportée : ' . $name);
        }
    }

    private function supprimeUser($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? ($data instanceof User ? $data->getId() : null);
        if (!$id) {
            throw new \RuntimeException('ID reçu pour suppression: ' . json_encode($uriVariables) . ' | Contexte: ' . json_encode($context));
        }
        
        // Vérifier si l'utilisateur est référencé par des clients
        $conn = $this->em->getConnection();
        $checkSql = 'SELECT COUNT(*) as count FROM client WHERE user_id = :id';
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindValue('id', $id);
        $result = $checkStmt->executeQuery();
        $count = $result->fetchAssociative()['count'];
        
        if ($count > 0) {
            throw new \RuntimeException(
                "Impossible de supprimer l'utilisateur (ID: $id). Il est référencé par $count client(s). " .
                "Veuillez d'abord supprimer ou modifier les clients associés."
            );
        }
        
        // Vérifier si l'utilisateur est référencé par des admins
        $checkAdminSql = 'SELECT COUNT(*) as count FROM admin WHERE user_id = :id';
        $checkAdminStmt = $conn->prepare($checkAdminSql);
        $checkAdminStmt->bindValue('id', $id);
        $adminResult = $checkAdminStmt->executeQuery();
        $adminCount = $adminResult->fetchAssociative()['count'];
        
        if ($adminCount > 0) {
            throw new \RuntimeException(
                "Impossible de supprimer l'utilisateur (ID: $id). Il est référencé par $adminCount admin(s). " .
                "Veuillez d'abord supprimer ou modifier les admins associés."
            );
        }
        
        // Si aucune référence, procéder à la suppression
        $sql = 'DELETE FROM user WHERE id = :id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('id', $id);
        $deleteResult = $stmt->executeStatement();
        return [
            'success' => $deleteResult > 0,
            'message' => $deleteResult > 0 ? 'User supprimé avec succès' : 'Aucune ligne supprimée',
            'id' => $id,
            'rows_deleted' => $deleteResult
        ];
    }

    private function modifieUser($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? null;
        if (!$id) {
            throw new \RuntimeException('Identifiant user manquant pour la modification.');
        }
        $user = $this->em->getRepository(User::class)->find($id);
        if (!$user) {
            throw new \RuntimeException('User non trouvé pour la modification.');
        }
        if ($data->getNomUser() !== null) $user->setNomUser($data->getNomUser());
        if ($data->getPassword() !== null) $user->setPassword($data->getPassword());
        if ($data->getRole() !== null) $user->setRole($data->getRole());
        $this->em->flush();
        // Recharge l'entité pour garantir la présence de tous les champs
        $user = $this->em->getRepository(User::class)->find($id);
        return $user;
    }

    private function ajouteUser($data, array $uriVariables, array $context) {
        try {
            // 1. Créer d'abord l'utilisateur
            $this->em->persist($data);
            $this->em->flush();
            
            if (null === $data->getId()) {
                throw new \RuntimeException('User non ajouté : identifiant non généré.');
            }
            
            // 2. Récupérer les données de la requête originale
            $requestData = $context['request']->getContent();
            $requestArray = json_decode($requestData, true);
            
            // 3. Créer l'entité correspondante selon le rôle avec les données fournies
            $role = $data->getRole();
            switch (strtolower($role)) {
                case 'client':
                    $this->createClientWithData($data, $requestArray);
                    break;
                case 'fournisseur':
                    $this->createFournisseurWithData($data, $requestArray);
                    break;
                case 'admin':
                    $this->createAdminWithData($data, $requestArray);
                    break;
                case 'user':
                    // Rôle de base, pas d'entité supplémentaire à créer
                    break;
            }
            
            return $data;
        } catch (\Exception $e) {
            throw new \RuntimeException('User non ajouté : ' . $e->getMessage());
        }
    }
    
    private function createClientWithData(User $user, array $data) {
        if (!isset($data['nom_c'])) {
            return; // Pas de données client fournies
        }
        
        $client = new Client();
        $client->setUser($user);
        $client->setNomC($data['nom_c'] ?? '');
        $client->setPrenomC($data['prenom_c'] ?? '');
        $client->setTelC($data['tel_c'] ?? '');
        $client->setAdresseC($data['adresse_c'] ?? '');
        $client->setMailC($data['mail_c'] ?? '');
        
        if (isset($data['datecreation_c'])) {
            $client->setDatecreationC(new \DateTime($data['datecreation_c']));
        } else {
            $client->setDatecreationC(new \DateTime());
        }
        
        $this->em->persist($client);
        $this->em->flush();
    }
    
    private function createFournisseurWithData(User $user, array $data) {
        if (!isset($data['nom_f'])) {
            return; // Pas de données fournisseur fournies
        }
        
        $fournisseur = new Fournisseur();
        $fournisseur->setUser($user);
        $fournisseur->setNomF($data['nom_f'] ?? '');
        $fournisseur->setTelF($data['tel_f'] ?? '');
        $fournisseur->setAdrF($data['adr_f'] ?? '');
        $fournisseur->setMailF($data['mail_f'] ?? '');
        
        if (isset($data['datecreation_f'])) {
            $fournisseur->setDatecreationF(new \DateTime($data['datecreation_f']));
        } else {
            $fournisseur->setDatecreationF(new \DateTime());
        }
        
        $this->em->persist($fournisseur);
        $this->em->flush();
    }
    
    private function createAdminWithData(User $user, array $data) {
        if (!isset($data['nom_a'])) {
            return; // Pas de données admin fournies
        }
        
        $admin = new Admin();
        $admin->setUser($user);
        $admin->setNomA($data['nom_a'] ?? '');
        $admin->setPrenomA($data['prenom_a'] ?? '');
        $admin->setTelA($data['tel_a'] ?? '');
        $admin->setAdrA($data['adr_a'] ?? '');
        $admin->setMailA($data['mail_a'] ?? '');
        
        if (isset($data['datecreation_a'])) {
            $admin->setDatecreationA(new \DateTime($data['datecreation_a']));
        } else {
            $admin->setDatecreationA(new \DateTime());
        }
        
        $this->em->persist($admin);
        $this->em->flush();
    }
}