<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Client;
use Faker\Factory as FakerFactory;

class ClientFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create('fr_FR');
        for ($i = 1; $i <= 20; $i++) {
            $user = new \App\Entity\User();
            $user->setNomUser('client' . $i . '@email.com');
            $user->setPassword($faker->password);
            $user->setRole('client');
            $manager->persist($user);

            $c = new Client();
            $c->setNomC('Client' . $i);
            $c->setPrenomC('Prenom' . $i);
            $c->setTelC('06000000' . str_pad($i, 2, '0', STR_PAD_LEFT));
            $c->setAdresseC('Ville' . $i . ', France');
            $c->setMailC('client' . $i . '@email.com');
            $c->setDatecreationC(new \DateTime());
            $c->setUser($user);
            $manager->persist($c);
            $this->addReference('client_' . $i, $c);
        }
        $manager->flush();
    }
}
