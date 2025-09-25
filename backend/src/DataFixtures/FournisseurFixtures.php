<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Fournisseur;
use Faker\Factory as FakerFactory;

class FournisseurFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create('fr_FR');
        for ($i = 1; $i <= 20; $i++) {
            $user = new \App\Entity\User();
            $user->setNomUser('fournisseur' . $i . '@email.com');
            $user->setPassword($faker->password);
            $user->setRole('fournisseur');
            $manager->persist($user);

            $f = new Fournisseur();
            $f->setNomF('Fournisseur' . $i);
            $f->setTelF('07000000' . str_pad($i, 2, '0', STR_PAD_LEFT));
            $f->setAdrF('Ville' . $i . ', France');
            $f->setMailF('fournisseur' . $i . '@email.com');
            $f->setDatecreationF(new \DateTime());
            $f->setUser($user);
            $manager->persist($f);
            $this->addReference('fournisseur_' . $i, $f);
        }
        $manager->flush();
    }

}
