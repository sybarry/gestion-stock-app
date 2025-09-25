<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation->getName() === 'api_get_user') {
            $id = $uriVariables['id'] ?? null;
            if (!$id) {
                throw new \RuntimeException('Identifiant user manquant pour la récupération.');
            }
            $user = $this->em->getRepository(User::class)->find($id);
            if (!$user) {
                throw new \RuntimeException('User non trouvé.');
            }
            return $user;
        }
        if ($operation->getName() === 'api_get_users') {
            return $this->em->getRepository(User::class)->findAll();
        }
        throw new \RuntimeException('Opération non supportée : ' . $operation->getName());
    }
}