<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\Admin;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AdminProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        $name = $operation->getName() ?? '';
        switch ($name) {
            case 'api_delete_admin':
                return $this->supprimeAdmin($data, $uriVariables, $context);
            case 'api_patch_admin':
                return $this->modifieAdmin($data, $uriVariables, $context);
            case 'api_post_admin':
                return $this->ajouteAdmin($data, $uriVariables, $context);
            default:
                throw new \RuntimeException('Opération non supportée : ' . $name);
        }
    }

    private function supprimeAdmin($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? ($data instanceof Admin ? $data->getId() : null);
        if (!$id) {
            throw new \RuntimeException('ID reçu pour suppression: ' . json_encode($uriVariables) . ' | Contexte: ' . json_encode($context));
        }
        $conn = $this->em->getConnection();
        $sql = 'DELETE FROM admin WHERE id = :id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('id', $id);
        $result = $stmt->executeStatement();
        return [
            'success' => $result > 0,
            'message' => $result > 0 ? 'Admin supprimé avec succès (SQL direct)' : 'Aucune ligne supprimée',
            'id' => $id,
            'rows_deleted' => $result
        ];
    }

    private function modifieAdmin($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? null;
        if (!$id) {
            throw new \RuntimeException('Identifiant admin manquant pour la modification.');
        }
        $admin = $this->em->getRepository(Admin::class)->find($id);
        if (!$admin) {
            throw new \RuntimeException('Admin non trouvé pour la modification.');
        }
        if ($data->getNomA() !== null) $admin->setNomA($data->getNomA());
        if ($data->getPrenomA() !== null) $admin->setPrenomA($data->getPrenomA());
        if ($data->getTelA() !== null) $admin->setTelA($data->getTelA());
        if ($data->getAdrA() !== null) $admin->setAdrA($data->getAdrA());
        if ($data->getDatecreationA() !== null) $admin->setDatecreationA($data->getDatecreationA());
        if ($data->getMailA() !== null) $admin->setMailA($data->getMailA());
        if ($data->getUser() !== null) $admin->setUser($data->getUser());
        $this->em->flush();
        // Recharge l'entité pour garantir la présence de tous les champs
        $admin = $this->em->getRepository(Admin::class)->find($id);
        return $admin;
    }

    private function ajouteAdmin($data, array $uriVariables, array $context) {
        try {
            // Récupérer les données brutes depuis différentes sources
            $request = $context['request'] ?? null;
            $requestData = [];
            
            // Essayer de récupérer depuis la requête
            if ($request) {
                $content = $request->getContent();
                $requestData = json_decode($content, true) ?? [];
            }
            
            // Essayer de récupérer depuis le contexte input
            if (empty($requestData['password']) && isset($context['input'])) {
                $input = $context['input'];
                if (is_array($input)) {
                    $requestData = array_merge($requestData, $input);
                }
            }
            
            // Essayer de récupérer depuis les données désérialisées
            if (empty($requestData['password']) && isset($context['data'])) {
                $contextData = $context['data'];
                if (is_array($contextData)) {
                    $requestData = array_merge($requestData, $contextData);
                }
            }
            
            // Créer d'abord un User associé
            $user = new User();
            
            // Utiliser le nom d'utilisateur fourni ou générer un par défaut
            $nomUser = $requestData['nom_user'] ?? ($data->getNomA() . ' ' . $data->getPrenomA());
            $user->setNomUser($nomUser);
            
            // Utiliser le mot de passe fourni ou un par défaut
            $password = $requestData['password'] ?? 'admin123';
            
            // Stocker le mot de passe en clair comme pour les clients
            $user->setPassword($password);
            $user->setRole('admin'); // Rôle admin
            
            // Persister le User d'abord
            $this->em->persist($user);
            $this->em->flush(); // Flush pour obtenir l'ID du User
            
            // Associer le User à l'Admin
            $data->setUser($user);
            
            // Persister l'Admin
            $this->em->persist($data);
            $this->em->flush();
        } catch (\Exception $e) {
            throw new \RuntimeException('Admin non ajouté : ' . $e->getMessage());
        }
        if (null === $data->getId()) {
            throw new \RuntimeException('Admin non ajouté : identifiant non généré.');
        }
        return $data;
    }
}