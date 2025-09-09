<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\FOURNISSEUR;
use App\Entity\PRODUIT;
use App\Entity\CLIENT;
use App\Entity\COMMANDE;
use Faker\Factory as FakerFactory;


class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Fixture désactivée : utiliser les fichiers séparés pour chaque entité
    }
}
