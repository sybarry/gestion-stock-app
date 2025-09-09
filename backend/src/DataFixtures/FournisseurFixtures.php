<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\FOURNISSEUR;
use Faker\Factory as FakerFactory;

class FournisseurFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create('fr_FR');
        for ($i = 1; $i <= 20; $i++) {
            $f = new FOURNISSEUR();
            $f->setNomF(substr($faker->company, 0, 20));
            $f->setTelF(substr($faker->phoneNumber, 0, 20));
            $f->setAdrF(substr($faker->city, 0, 20));
            $manager->persist($f);
            // La référence utilisera l'index entier
            $this->addReference('fournisseur_' . $i, $f);
        }
        $manager->flush();
    }

}
