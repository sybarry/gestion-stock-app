<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\Produit;
use Doctrine\ORM\EntityManagerInterface;

class ProduitProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        $name = $operation->getName() ?? '';
        switch ($name) {
            case 'api_delete_produit':
                return $this->supprimeProduit($data, $uriVariables, $context);
            case 'api_patch_produit':
                return $this->modifieProduit($data, $uriVariables, $context);
            case 'api_create_produit':
                return $this->ajouteProduit($data, $uriVariables, $context);
            default:
                throw new \RuntimeException('Opération non supportée : ' . $name);
        }
    }

    private function supprimeProduit($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? ($data instanceof Produit ? $data->getId() : null);
        if (!$id) {
            throw new \RuntimeException('ID reçu pour suppression: ' . json_encode($uriVariables) . ' | Contexte: ' . json_encode($context));
        }
        $conn = $this->em->getConnection();
        $sql = 'DELETE FROM produit WHERE id = :id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('id', $id);
        $result = $stmt->executeStatement();
        return [
            'success' => $result > 0,
            'message' => $result > 0 ? 'Produit supprimé avec succès (SQL direct)' : 'Aucune ligne supprimée',
            'id' => $id,
            'rows_deleted' => $result
        ];
    }

    private function modifieProduit($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? null;
        if (!$id) {
            throw new \RuntimeException('Identifiant produit manquant pour la modification.');
        }
        $produit = $this->em->getRepository(Produit::class)->find($id);
        if (!$produit) {
            throw new \RuntimeException('Produit non trouvé pour la modification.');
        }
        if ($data->getNomP() !== null) $produit->setNomP($data->getNomP());
        if ($data->getQteP() !== null) $produit->setQteP($data->getQteP());
        if ($data->getPrix() !== null) $produit->setPrix($data->getPrix());
        
        // Gestion de la relation fournisseur via fournisseur_id
        if ($data->getFournisseurId() !== null) {
            $fournisseur = $this->em->getRepository(\App\Entity\Fournisseur::class)->findOneBy(['num_f' => $data->getFournisseurId()]);
            if ($fournisseur) {
                $produit->setFournisseur($fournisseur);
            } else {
                throw new \RuntimeException('Fournisseur avec num_f ' . $data->getFournisseurId() . ' non trouvé.');
            }
        }
        // Recalcul automatique du total
        $produit->setTotal($produit->getQteP() * $produit->getPrix());
        $this->em->flush();
        // Recharge l'entité pour garantir la présence de tous les champs
        $produit = $this->em->getRepository(Produit::class)->find($id);
        return $produit;
    }

    private function ajouteProduit($data, array $uriVariables, array $context) {
        // Gestion de la relation fournisseur via fournisseur_id
        if ($data->getFournisseurId() !== null) {
            $fournisseur = $this->em->getRepository(\App\Entity\Fournisseur::class)->findOneBy(['num_f' => $data->getFournisseurId()]);
            if ($fournisseur) {
                $data->setFournisseur($fournisseur);
            } else {
                throw new \RuntimeException('Fournisseur avec num_f ' . $data->getFournisseurId() . ' non trouvé.');
            }
        }
        
        // Calcul automatique du total
        if ($data->getQteP() && $data->getPrix()) {
            $data->setTotal($data->getQteP() * $data->getPrix());
        }
        
        try {
            $this->em->persist($data);
            $this->em->flush();
        } catch (\Exception $e) {
            throw new \RuntimeException('Produit non ajouté : ' . $e->getMessage());
        }
        if (null === $data->getId()) {
            throw new \RuntimeException('Produit non ajouté : identifiant non généré.');
        }
        return $data;
    }
}
