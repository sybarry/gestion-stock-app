<?php

namespace App\Entity;

use App\Repository\ProduitRepository;
use Doctrine\ORM\Mapping as ORM;
 
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\State\Processor\ProduitProcessor;
use App\State\Provider\ProduitProvider;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Patch(),
    new Delete(processor: ProduitProcessor::class),
    ],
    normalizationContext: ['groups' => ['produit:read']],
    denormalizationContext: ['groups' => ['produit:write']]
)]

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/produits/{id}/produit',
            name: 'api_get_produit',
            provider: ProduitProvider::class,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/produits',
            name: 'api_get_produits',
            provider: ProduitProvider::class,
            deserialize: false,
            validate: false,
        ),
        new Post(
            uriTemplate: '/produits/create_produit',
            name: 'api_create_produit',
            processor: ProduitProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Patch(
            uriTemplate: '/produits/{id}/modifier',
            name: 'api_patch_produit',
            processor: ProduitProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Delete(
            uriTemplate: '/produits/{id}/supprimer',
            name: 'api_delete_produit',
            processor: ProduitProcessor::class,
            validate: false,
        ),
    ],
    formats: [ 'json', 'jsonld', 'html', ],
    normalizationContext: ['groups' => ['produit:read']],
    denormalizationContext: ['groups' => ['produit:write']]
)]
#[ORM\Entity(repositoryClass: ProduitRepository::class)]
class Produit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['produit:read', 'produit:write'])]
    private ?int $id = null;

    #[ORM\Column(name: 'nom_p', type: 'string', length: 30)]
    #[Groups(['produit:read', 'produit:write'])]
    private ?string $nom_p = null;

    #[ORM\ManyToOne(targetEntity: Fournisseur::class)]
    #[ORM\JoinColumn(name: 'num_f', referencedColumnName: 'num_f', nullable: false, onDelete: 'CASCADE')]
    #[Groups(['produit:read'])]
    private ?Fournisseur $fournisseur = null;

    #[Groups(['produit:write'])]
    private ?int $fournisseur_id = null;
    public function getId(): ?int
    {
        return $this->id;
    }

    #[ORM\Column(name: 'qte_p', type: 'integer')]
    #[Groups(['produit:read', 'produit:write'])]
    private ?int $qte_p = null;

    #[ORM\Column(name: 'prix', type: 'integer')]
    #[Groups(['produit:read', 'produit:write'])]
    private ?int $prix = null;

    #[ORM\Column(name: 'total', type: 'integer')]
    #[Groups(['produit:read', 'produit:write'])]
    private ?int $total = null;

    public function getNomP(): ?string
    {
        return $this->nom_p;
    }

    public function setNomP(string $nom_p): static
    {
        $this->nom_p = $nom_p;
        return $this;
    }

    public function getFournisseur(): ?Fournisseur
    {
        return $this->fournisseur;
    }

    public function setFournisseur(?Fournisseur $fournisseur): static
    {
        $this->fournisseur = $fournisseur;
        return $this;
    }

    public function getQteP(): ?int
    {
        return $this->qte_p;
    }

    public function setQteP(int $qte_p): static
    {
        $this->qte_p = $qte_p;
        return $this;
    }

    public function getPrix(): ?int
    {
        return $this->prix;
    }

    public function setPrix(int $prix): static
    {
        $this->prix = $prix;
        return $this;
    }

    public function getTotal(): ?int
    {
        return $this->total;
    }

    public function setTotal(int $total): static
    {
        $this->total = $total;
        return $this;
    }

    public function getFournisseurId(): ?int
    {
        return $this->fournisseur_id;
    }

    public function setFournisseurId(?int $fournisseur_id): static
    {
        $this->fournisseur_id = $fournisseur_id;
        return $this;
    }
}
