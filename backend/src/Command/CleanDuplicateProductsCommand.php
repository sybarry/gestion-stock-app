<?php

namespace App\Command;

use App\Entity\Produit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:clean-duplicate-products',
    description: 'Nettoie les produits en double en fusionnant leurs quantités'
)]
class CleanDuplicateProductsCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Nettoyage des produits en double');

        // Récupérer tous les produits groupés par nom
        $query = $this->em->createQuery('
            SELECT p.nom_p, COUNT(p.id) as count_products 
            FROM App\Entity\Produit p 
            GROUP BY p.nom_p 
            HAVING COUNT(p.id) > 1
        ');

        $duplicates = $query->getResult();

        if (empty($duplicates)) {
            $io->success('Aucun doublon trouvé !');
            return Command::SUCCESS;
        }

        $io->info(sprintf('Trouvé %d produits avec des doublons', count($duplicates)));

        foreach ($duplicates as $duplicate) {
            $productName = $duplicate['nom_p'];
            $io->section("Traitement de : $productName");

            // Récupérer tous les produits avec ce nom
            $products = $this->em->getRepository(Produit::class)->findBy(['nom_p' => $productName]);

            if (count($products) <= 1) {
                continue;
            }

            // Garder le premier produit et fusionner les autres
            $mainProduct = $products[0];
            $totalQuantity = $mainProduct->getQteP();
            $latestPrice = $mainProduct->getPrix();

            $io->text("Produit principal : ID {$mainProduct->getId()}, Quantité: {$mainProduct->getQteP()}");

            // Fusionner les autres produits
            for ($i = 1; $i < count($products); $i++) {
                $productToMerge = $products[$i];
                $totalQuantity += $productToMerge->getQteP();
                
                // Garder le prix le plus récent (ID le plus élevé = plus récent)
                if ($productToMerge->getId() > $mainProduct->getId() && $productToMerge->getPrix() > 0) {
                    $latestPrice = $productToMerge->getPrix();
                }

                $io->text("Fusion avec : ID {$productToMerge->getId()}, Quantité: {$productToMerge->getQteP()}");

                // Supprimer le produit en double
                $this->em->remove($productToMerge);
            }

            // Mettre à jour le produit principal
            $mainProduct->setQteP($totalQuantity);
            $mainProduct->setPrix($latestPrice);
            $mainProduct->setTotal($totalQuantity * $latestPrice);

            $io->text("Résultat final : Quantité totale = $totalQuantity, Prix = $latestPrice");
        }

        // Sauvegarder les changements
        $this->em->flush();

        $io->success('Nettoyage des doublons terminé avec succès !');

        return Command::SUCCESS;
    }
}