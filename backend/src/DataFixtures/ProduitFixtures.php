<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\PRODUIT;
use App\Entity\Fournisseur;
use Faker\Factory as FakerFactory;

class ProduitFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create('fr_FR');
        // On suppose que les fournisseurs sont déjà chargés
        $fournisseurs = [];
            for ($i = 1; $i <= 20; $i++) {
                $fournisseurs[] = $this->getReference('fournisseur_' . $i, Fournisseur::class);
            }
            for ($i = 1; $i <= 20; $i++) {
                $nomP = 'Produit ' . $i;
                $fournisseur = $fournisseurs[($i-1)%count($fournisseurs)];
                $produit = new PRODUIT();
                $produit->setNomP($nomP);
                $produit->setFournisseur($fournisseur);
                $qteP = $faker->numberBetween(1, 10);
                $prix = $faker->numberBetween(10000, 1000000);
                $produit->setQteP($qteP);
                $produit->setPrix($prix);
                $produit->setTotal($qteP * $prix);
                $manager->persist($produit);
                $this->addReference('produit_' . $i, $produit);
            }
            $manager->flush();
    }
    public function getDependencies(): array
    {
        return [
            \App\DataFixtures\FournisseurFixtures::class
        ];
    }
}
