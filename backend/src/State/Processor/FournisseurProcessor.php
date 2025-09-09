<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
// ...existing code...
use App\Entity\FOURNISSEUR;
use Doctrine\ORM\EntityManagerInterface;

class FournisseurProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em) {}


    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        if ($data instanceof FOURNISSEUR) {
            $method = $context['request_method'] ?? null;
            if ($method === 'DELETE') {
                // Recharge l'entité depuis la base pour garantir la suppression
                $id = $data->getNumF() ?? $uriVariables['NumF'] ?? null;
                if ($id) {
                    $entity = $this->em->getRepository(FOURNISSEUR::class)->find($id);
                    if ($entity) {
                        $this->em->remove($entity);
                        $this->em->flush();
                    }
                }
                return null;
            }
            // PATCH ou POST
            $this->em->persist($data);
            $this->em->flush();
            return $data;
        }
        return null;
    }

}
