<?php

namespace App\Entity;

use App\Repository\CLIENTRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: CLIENTRepository::class)]
class CLIENT
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'NumC', type: 'integer')]
    private ?int $NumC = null;

    #[ORM\Column(name: 'NomC', type: 'string', length: 20)]
    private ?string $NomC = null;

    #[ORM\Column(name: 'PrenomC', type: 'string', length: 20)]
    private ?string $PrenomC = null;

    #[ORM\Column(name: 'TelC', type: 'string', length: 20)]
    private ?string $TelC = null;

    #[ORM\Column(name: 'AdrC', type: 'string', length: 20)]
    private ?string $AdrC = null;

    public function getNumC(): ?int
    {
        return $this->NumC;
    }

    // Suppression du setter car l'id est auto-incrémenté

    public function getNomC(): ?string
    {
        return $this->NomC;
    }

    public function setNomC(string $NomC): static
    {
        $this->NomC = $NomC;
        return $this;
    }

    public function getPrenomC(): ?string
    {
        return $this->PrenomC;
    }

    public function setPrenomC(string $PrenomC): static
    {
        $this->PrenomC = $PrenomC;
        return $this;
    }

    public function getTelC(): ?string
    {
        return $this->TelC;
    }

    public function setTelC(string $TelC): static
    {
        $this->TelC = $TelC;
        return $this;
    }

    public function getAdrC(): ?string
    {
        return $this->AdrC;
    }

    public function setAdrC(string $AdrC): static
    {
        $this->AdrC = $AdrC;
        return $this;
    }
}
