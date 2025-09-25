<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
use App\Entity\Commande;
use Doctrine\ORM\EntityManagerInterface;

class CommandeProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation->getName() === 'api_get_commande') {
            $id = $uriVariables['id'] ?? null;
            if (!$id) {
                throw new \RuntimeException('Identifiant commande manquant pour la récupération.');
            }
            $commande = $this->em->getRepository(COMMANDE::class)->find($id);
            if (!$commande) {
                throw new \RuntimeException('Commande non trouvée.');
            }
            return $commande;
        }
        if ($operation->getName() === 'api_get_commandes') {
            return $this->em->getRepository(COMMANDE::class)->findAll();
        }
        throw new \RuntimeException('Opération non supportée : ' . $operation->getName());
    }
}
