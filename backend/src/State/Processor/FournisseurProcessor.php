<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\Fournisseur;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\DTO\ApiSuccessResponse;

class FournisseurProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $entityManager) {}


    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        $name = $operation->getName() ?? '';
        switch ($name) {
            case 'api_delete_fournisseur':
                return $this->supprimeFournisseur($data, $uriVariables, $context);
            case 'api_patch_fournisseur':
                return $this->modifieFournisseur($data, $uriVariables, $context);
            case 'api_create_fournisseur':
                return $this->ajouteFournisseur($data, $uriVariables, $context);
            default:
                throw new \RuntimeException('Opération non supportée : ' . $name);
        }
    }
    private function ajouteFournisseur($data, array $uriVariables, array $context) {
        try {
            // Si un user_id est fourni, récupérer l'utilisateur
            if ($data->getUserId()) {
                $user = $this->entityManager->getRepository(User::class)->find($data->getUserId());
                if (!$user) {
                    throw new \RuntimeException('Utilisateur non trouvé avec l\'ID : ' . $data->getUserId());
                }
                $data->setUser($user);
            }

            // Définir automatiquement la date de création
            if ($data->getDatecreationF() === null) {
                $data->setDatecreationF(new \DateTime());
            }

            $this->entityManager->persist($data);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            throw new \RuntimeException('Fournisseur non ajouté : ' . $e->getMessage());
        }
        if (null === $data->getNumF()) {
            throw new \RuntimeException('Fournisseur non ajouté : identifiant non généré.');
        }
        return $data;
    }
    private function modifieFournisseur($data, array $uriVariables, array $context) {
        $id = $uriVariables['num_f'] ?? null;
        if (!$id) {
            throw new \RuntimeException('Identifiant fournisseur manquant pour la modification.');
        }
        $fournisseur = $this->entityManager->getRepository(Fournisseur::class)->find($id);
        if (!$fournisseur) {
            throw new \RuntimeException('Fournisseur non trouvé pour la modification.');
        }
        if ($data->getNomF() !== null) $fournisseur->setNomF($data->getNomF());
        if ($data->getTelF() !== null) $fournisseur->setTelF($data->getTelF());
        if ($data->getAdrF() !== null) $fournisseur->setAdrF($data->getAdrF());
        // Conversion explicite de la date si string
        $date = $data->getDatecreationF();
        if ($date !== null) {
            if (is_string($date)) {
                $date = \DateTime::createFromFormat('Y-m-d\TH:i:sP', $date) ?: new \DateTime($date);
            }
            $fournisseur->setDatecreationF($date);
        }
        if ($data->getMailF() !== null) $fournisseur->setMailF($data->getMailF());
        $this->entityManager->flush();
        // Recharge l'entité pour garantir la présence de tous les champs
        $fournisseur = $this->entityManager->getRepository(Fournisseur::class)->find($id);
        return $fournisseur;
    }

    public function supprimeFournisseur(Fournisseur $fournisseur, array $uriVariables = [], array $context = []): void
    {
        // Récupère le fournisseur avec son utilisateur associé
        $fournisseurWithUser = $this->entityManager->find(Fournisseur::class, $fournisseur->getNumF());
        $user = $fournisseurWithUser->getUser();
        
        // Supprime d'abord le fournisseur
        $this->entityManager->remove($fournisseurWithUser);
        
        // Puis supprime l'utilisateur associé si il existe
        if ($user) {
            $this->entityManager->remove($user);
        }
        
        $this->entityManager->flush();
    }


}
