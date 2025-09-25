<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;

class ClientProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation->getName() === 'api_get_client') {
            $id = $uriVariables['num_c'] ?? null;
            if (!$id) {
                throw new \RuntimeException('Identifiant client manquant pour la récupération.');
            }
            $client = $this->em->getRepository(Client::class)->find($id);
            if (!$client) {
                throw new \RuntimeException('Client non trouvé.');
            }
            return $client;
        }
        if ($operation->getName() === 'api_get_clients') {
            return $this->em->getRepository(Client::class)->findAll();
        }
        throw new \RuntimeException('Opération non supportée : ' . $operation->getName());
    }
}
