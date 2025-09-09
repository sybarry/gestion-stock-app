<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
// ...existing code...
use App\Entity\FOURNISSEUR;
use Doctrine\ORM\EntityManagerInterface;

class FournisseurProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}


    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null {
        $name = $context['item_operation_name'] ?? $context['collection_operation_name'] ?? $context['operation_name'] ?? null;
        if ($name === 'api_get_fournisseur') {
            $fournisseur = $this->getFournisseur($uriVariables);
            return $fournisseur;
        }
        if ($name === 'api_get_fournisseurs') {
            return $this->getFournisseurs();
        }
        return null;
    }

    private function getFournisseur(array $uriVariables)
    {
        $numF = $uriVariables['NumF'] ?? $uriVariables['id'] ?? null;
        if (!$numF) {
            return null;
        }
        $repo = $this->em->getRepository(FOURNISSEUR::class);
        $fournisseur = $repo->find($numF);
        if (!$fournisseur) {
            return null;
        }
        return $fournisseur;
    }

    private function getFournisseurs()
    {
        $repo = $this->em->getRepository(FOURNISSEUR::class);
        return $repo->findAll();
    }


}
