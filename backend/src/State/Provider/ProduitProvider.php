<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
use App\Entity\Produit;
use Doctrine\ORM\EntityManagerInterface;

class ProduitProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation->getName() === 'api_get_produit') {
            $id = $uriVariables['id'] ?? null;
            if (!$id) {
                throw new \RuntimeException('Identifiant produit manquant pour la récupération.');
            }
            $produit = $this->em->getRepository(Produit::class)->find($id);
            if (!$produit) {
                throw new \RuntimeException('Produit non trouvé.');
            }
            return $produit;
        }
        if ($operation->getName() === 'api_get_produits') {
            return $this->em->getRepository(Produit::class)->findAll();
        }
        throw new \RuntimeException('Opération non supportée : ' . $operation->getName());
    }
}
