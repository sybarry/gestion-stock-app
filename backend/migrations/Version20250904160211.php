<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250904160211 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
    $this->addSql('CREATE TABLE client (NumC INT AUTO_INCREMENT NOT NULL, NomC VARCHAR(20) NOT NULL, PrenomC VARCHAR(20) NOT NULL, TelC VARCHAR(20) NOT NULL, AdrC VARCHAR(20) NOT NULL, PRIMARY KEY(NumC)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    $this->addSql('CREATE TABLE commande (id INT AUTO_INCREMENT NOT NULL, num_com VARCHAR(30) NOT NULL, qte_c INT NOT NULL, NumC INT NOT NULL, ProduitId INT NOT NULL, INDEX IDX_6EEAA67D37335F69 (NumC), INDEX IDX_COMMANDE_PRODUITID (ProduitId), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    $this->addSql('CREATE TABLE fournisseur (NumF INT AUTO_INCREMENT NOT NULL, nom_f VARCHAR(20) NOT NULL, tel_f VARCHAR(20) NOT NULL, adr_f VARCHAR(20) NOT NULL, PRIMARY KEY(NumF)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    $this->addSql('CREATE TABLE produit (id INT AUTO_INCREMENT NOT NULL, NomP VARCHAR(30) NOT NULL, qte_p INT NOT NULL, prix INT NOT NULL, total INT NOT NULL, NumF INT NOT NULL, INDEX IDX_29A5EC274759ABE6 (NumF), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67D37335F69 FOREIGN KEY (NumC) REFERENCES client (NumC) ON DELETE CASCADE');
    $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_COMMANDE_PRODUITID FOREIGN KEY (ProduitId) REFERENCES produit (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE produit ADD CONSTRAINT FK_29A5EC274759ABE6 FOREIGN KEY (NumF) REFERENCES fournisseur (NumF) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67D37335F69');
        $this->addSql('ALTER TABLE produit DROP FOREIGN KEY FK_29A5EC274759ABE6');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE fournisseur');
        $this->addSql('DROP TABLE produit');
    }
}
