<?php

namespace App\Entity;

use App\Repository\COMMANDERepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: COMMANDERepository::class)]
class COMMANDE
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 30)]
    private ?string $NumCom = null;

    #[ORM\ManyToOne(targetEntity: CLIENT::class)]
    #[ORM\JoinColumn(name: 'NumC', referencedColumnName: 'NumC', onDelete: 'CASCADE')]
    private ?CLIENT $client = null;

    #[ORM\ManyToOne(targetEntity: PRODUIT::class)]
    #[ORM\JoinColumn(name: 'ProduitId', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?PRODUIT $produit = null;
    public function getId(): ?int
    {
        return $this->id;
    }

    #[ORM\Column]
    private ?int $QteC = null;

    public function getNumCom(): ?string
    {
        return $this->NumCom;
    }

    public function setNumCom(string $NumCom): static
    {
        $this->NumCom = $NumCom;
        return $this;
    }

    public function getClient(): ?CLIENT
    {
        return $this->client;
    }

    public function setClient(?CLIENT $client): static
    {
        $this->client = $client;
        return $this;
    }

    public function getProduit(): ?PRODUIT
    {
        return $this->produit;
    }

    public function setProduit(?PRODUIT $produit): static
    {
        $this->produit = $produit;
        return $this;
    }

    public function setNomP(string $NomP): static
    {
        $this->NomP = $NomP;

        return $this;
    }

    public function getQteC(): ?int
    {
        return $this->QteC;
    }

    public function setQteC(int $QteC): static
    {
        $this->QteC = $QteC;

        return $this;
    }
}
