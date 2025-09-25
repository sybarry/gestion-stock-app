<?php
namespace App\State\Provider;

use ApiPlatform\State\ProviderInterface;
use App\Entity\Admin;
use Doctrine\ORM\EntityManagerInterface;

class AdminProvider implements ProviderInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function provide(\ApiPlatform\Metadata\Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation->getName() === 'api_get_admin') {
            $id = $uriVariables['id'] ?? null;
            if (!$id) {
                throw new \RuntimeException('Identifiant admin manquant pour la récupération.');
            }
            $admin = $this->em->getRepository(Admin::class)->find($id);
            if (!$admin) {
                throw new \RuntimeException('Admin non trouvé.');
            }
            return $admin;
        }
        if ($operation->getName() === 'api_get_admins') {
            return $this->em->getRepository(Admin::class)->findAll();
        }
        throw new \RuntimeException('Opération non supportée : ' . $operation->getName());
    }
}