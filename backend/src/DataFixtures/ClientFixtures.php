<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\CLIENT;
use Faker\Factory as FakerFactory;

class ClientFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create('fr_FR');
        for ($i = 1; $i <= 20; $i++) {
            $c = new CLIENT();
            $c->setNomC(substr($faker->lastName, 0, 20));
            $c->setPrenomC(substr($faker->firstName, 0, 20));
            $c->setTelC(substr($faker->phoneNumber, 0, 20));
            $c->setAdrC(substr($faker->city, 0, 20));
            $manager->persist($c);
            $this->addReference('client_' . $i, $c);
        }
        $manager->flush();
    }
}
