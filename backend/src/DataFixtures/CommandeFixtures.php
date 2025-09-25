<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Commande;
use App\Entity\Client;
use App\Entity\Produit;
use Faker\Factory as FakerFactory;

class CommandeFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create('fr_FR');
        $clients = [];
        for ($i = 1; $i <= 20; $i++) {
            $clients[] = $this->getReference('client_' . $i, \App\Entity\Client::class);
        }
        $produits = [];
        for ($i = 1; $i <= 20; $i++) {
            $produits[] = $this->getReference('produit_' . $i, \App\Entity\Produit::class);
        }
        for ($i = 1; $i <= 20; $i++) {
            $client = $faker->randomElement($clients);
            $produit = $faker->randomElement($produits);
            $qteC = $faker->numberBetween(1, 5);
            $com = new Commande();
            $com->setNumCom('COM-' . $i . '-' . $faker->unique()->randomNumber(5));
            $com->setClient($client);
            $com->setProduit($produit);
            $com->setQteC($qteC);
            $com->setDateCommande(new \DateTime());
            $manager->persist($com);
        }
        $manager->flush();
    }
    public function getDependencies(): array
    {
        return [
            \App\DataFixtures\ClientFixtures::class,
            \App\DataFixtures\ProduitFixtures::class
        ];
    }
}
