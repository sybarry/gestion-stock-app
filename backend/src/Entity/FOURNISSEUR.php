<?php

namespace App\Entity;

use App\Repository\FOURNISSEURRepository;
use App\State\Provider\FournisseurProvider;
use App\State\Processor\FournisseurProcessor;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Core\Annotation\ApiOperation;

#[ApiResource( 
    operations: [ 
        new Get(), 
        new GetCollection(), 
        new Post(), 
        new Patch(), 
        new Delete(), 
    ], 
    security: "is_granted('ROLE_SUPER_ADMIN')", 
)]

#[ApiResource( 
    operations: [ 
        new Get( 
            uriTemplate: '/fournisseurs/{NumF}/fournisseur',
            name: 'api_get_fournisseur', 
            provider: FournisseurProvider::class,
            deserialize: false, 
            validate: false,        
        ), 
        new GetCollection( 
            uriTemplate: '/fournisseurs/fournisseur',
            name: 'api_get_fournisseurs', 
            provider: FournisseurProvider::class,
            deserialize: false, 
            validate: false,        
        ), 
        new Post( 
            uriTemplate: '/fournisseurs/create_fournisseur',
            name: 'api_create_fournisseur', 
            processor: FournisseurProcessor::class,
            deserialize: true, 
            validate: false,        
        ),
        new Patch(
            uriTemplate: '/fournisseurs/{NumF}/modifier',
            name: 'api_patch_fournisseur',
            processor: FournisseurProcessor::class,
            validate: false,
        ),
        new Delete(
            uriTemplate: '/fournisseurs/{NumF}/supprimer',
            name: 'api_delete_fournisseur',
            processor: FournisseurProcessor::class,
            validate: false,
        ),
    ], 
    formats: [ 'jsonld', 'json', 'html', ], 
)] 

#[ORM\Entity(repositoryClass: FOURNISSEURRepository::class)]
class FOURNISSEUR
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'NumF', type: 'integer')]
    private ?int $NumF = null;

    #[ORM\Column(length: 20)]
    private ?string $NomF = null;

    #[ORM\Column(length: 20)]
    private ?string $TelF = null;

    #[ORM\Column(length: 20)]
    private ?string $AdrF = null;

    public function getNumF(): ?int
    {
        return $this->NumF;
    }

    public function getNomF(): ?string
    {
        return $this->NomF;
    }

    public function setNomF(string $NomF): static
    {
        $this->NomF = $NomF;
        return $this;
    }

    public function getTelF(): ?string
    {
        return $this->TelF;
    }

    public function setTelF(string $TelF): static
    {
        $this->TelF = $TelF;

        return $this;
    }


    public function getAdrF(): ?string
    {
        return $this->AdrF;
    }

    public function setAdrF(string $AdrF): static
    {
        $this->AdrF = $AdrF;

        return $this;
    }

}
