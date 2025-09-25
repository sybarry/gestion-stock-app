<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
// ...existing code...
use App\Entity\Fournisseur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\DTO\ResponseBuilder;

class FournisseurProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}


    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null {
        $name = $context['item_operation_name'] ?? $context['collection_operation_name'] ?? $context['operation_name'] ?? null;
        if ($name === 'api_get_fournisseur') {
            return $this->getFournisseur($uriVariables);
        }
        if ($name === 'api_get_fournisseurs') {
            return $this->getFournisseurs();
        }
        return null;
    }

    private function getFournisseur(array $uriVariables)
    {
        try {
            $numF = $uriVariables['num_f'] ?? $uriVariables['id'] ?? null;
            if (!$numF) {
                throw new NotFoundHttpException('Identifiant fournisseur manquant dans la requête.');
            }
            $repo = $this->em->getRepository(Fournisseur::class);
            $fournisseur = $repo->find($numF);
            if (!$fournisseur) {
                throw new NotFoundHttpException('Fournisseur non trouvé pour l\'ID ' . $numF);
            }
            return $fournisseur;
        } catch (\Exception $e) {
            throw new NotFoundHttpException($e->getMessage());
        }
    }

    private function getFournisseurs()
    {
        try {
            $repo = $this->em->getRepository(Fournisseur::class);
            $fournisseurs = $repo->findAll();
            if (!$fournisseurs) {
                throw new NotFoundHttpException('Aucun fournisseur trouvé.');
            }
            return $fournisseurs;
        } catch (\Exception $e) {
            throw new NotFoundHttpException($e->getMessage());
        }
    }

}
