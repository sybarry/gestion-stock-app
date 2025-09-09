<?php

namespace App\Entity;

use App\Repository\PRODUITRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: PRODUITRepository::class)]
class PRODUIT
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(name: 'NomP', type: 'string', length: 30)]
    private ?string $NomP = null;

    #[ORM\ManyToOne(targetEntity: FOURNISSEUR::class)]
    #[ORM\JoinColumn(name: 'NumF', referencedColumnName: 'NumF', nullable: false, onDelete: 'CASCADE')]
    private ?FOURNISSEUR $fournisseur = null;
    public function getId(): ?int
    {
        return $this->id;
    }

    #[ORM\Column]
    private ?int $QteP = null;

    #[ORM\Column]
    private ?int $Prix = null;

    #[ORM\Column]
    private ?int $Total = null;

    public function getNomP(): ?string
    {
        return $this->NomP;
    }

    public function setNomP(string $NomP): static
    {
        $this->NomP = $NomP;
        return $this;
    }

    public function getFournisseur(): ?FOURNISSEUR
    {
        return $this->fournisseur;
    }

    public function setFournisseur(?FOURNISSEUR $fournisseur): static
    {
        $this->fournisseur = $fournisseur;
        return $this;
    }

    public function getQteP(): ?int
    {
        return $this->QteP;
    }

    public function setQteP(int $QteP): static
    {
        $this->QteP = $QteP;

        return $this;
    }

    public function getPrix(): ?int
    {
        return $this->Prix;
    }

    public function setPrix(int $Prix): static
    {
        $this->Prix = $Prix;

        return $this;
    }

    public function getTotal(): ?int
    {
        return $this->Total;
    }

    public function setTotal(int $Total): static
    {
        $this->Total = $Total;

        return $this;
    }
}
