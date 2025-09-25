<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use App\Entity\Admin;

class AdminFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // 20 admins
        for ($i = 1; $i <= 20; $i++) {
            $user = new User();
            $user->setNomUser('Admin' . $i);
            $user->setPassword($i . 'admin');
            $user->setRole('admin');
            $manager->persist($user);

            $admin = new Admin();
            $admin->setNomA('Admin' . $i);
            $admin->setPrenomA('Prenom' . $i);
            $admin->setTelA('08000000' . str_pad($i, 2, '0', STR_PAD_LEFT));
            $admin->setAdrA('Ville' . $i);
            $admin->setDatecreationA(new \DateTime());
            $admin->setMailA('admin' . $i . '@example.com');
            $admin->setUser($user);
            $manager->persist($admin);
        }
        $manager->flush();
    }
}
