<?php

namespace App\Repository;

use App\Entity\Facture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Facture>
 */
class FactureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Facture::class);
    }

    /**
     * Trouve les factures par client
     */
    public function findByClient(int $clientId): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.client = :client_id')
            ->setParameter('client_id', $clientId)
            ->orderBy('f.date_facture', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les factures par statut
     */
    public function findByStatut(string $statut): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.statut = :statut')
            ->setParameter('statut', $statut)
            ->orderBy('f.date_facture', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les factures impayées (statut != 'payee')
     */
    public function findUnpaid(): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.statut != :statut')
            ->setParameter('statut', 'payee')
            ->orderBy('f.date_facture', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Génère le prochain numéro de facture
     */
    public function generateNextNumber(): string
    {
        $lastFacture = $this->createQueryBuilder('f')
            ->orderBy('f.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        $nextId = $lastFacture ? $lastFacture->getId() + 1 : 1;
        $year = date('Y');
        
        return sprintf('FAC-%s-%04d', $year, $nextId);
    }
}