<?php

namespace App\Entity;

use App\Repository\CommandeRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\State\Processor\CommandeProcessor;
use App\State\Provider\CommandeProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Patch(),
        new Delete(processor: CommandeProcessor::class),
    ],
    normalizationContext: ['groups' => ['commande:read']],
    denormalizationContext: ['groups' => ['commande:write']]
)]

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/commandes/{id}/commande',
            name: 'api_get_commande',
            provider: CommandeProvider::class,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/commandes',
            name: 'api_get_commandes',
            provider: CommandeProvider::class,
            deserialize: false,
            validate: false,
        ),
        new Post(
            uriTemplate: '/commandes/create_commande',
            name: 'api_create_commande',
            processor: CommandeProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Patch(
            uriTemplate: '/commandes/{id}/modifier',
            name: 'api_patch_commande',
            processor: CommandeProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Delete(
            uriTemplate: '/commandes/{id}/supprimer',
            name: 'api_delete_commande',
            processor: CommandeProcessor::class,
            validate: false,
        ),
    ],
    formats: [ 'json', 'jsonld', 'html', ],
    normalizationContext: ['groups' => ['commande:read']],
    denormalizationContext: ['groups' => ['commande:write']]
)]
#[ORM\Entity(repositoryClass: CommandeRepository::class)]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?int $id = null;

    #[ORM\Column(name: 'num_com', type: 'string', length: 30)]
    #[Groups(['commande:read', 'commande:write'])]
    private ?string $num_com = null;

    #[ORM\ManyToOne(targetEntity: Client::class)]
    #[ORM\JoinColumn(name: 'num_c', referencedColumnName: 'num_c', onDelete: 'CASCADE')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?Client $client = null;

    #[ORM\ManyToOne(targetEntity: Produit::class)]
    #[ORM\JoinColumn(name: 'produit_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?Produit $produit = null;
    public function getId(): ?int
    {
        return $this->id;
    }

    #[ORM\Column(name: 'qte_c', type: 'integer')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?int $qte_c = null;

    #[ORM\Column(name: 'date_commande', type: 'datetime', nullable: true)]
    #[Groups(['commande:read', 'commande:write'])]
    private ?\DateTimeInterface $date_commande = null;



    public function getNumCom(): ?string
    {
        return $this->num_com;
    }

    public function setNumCom(string $num_com): static
    {
        $this->num_com = $num_com;
        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;
        return $this;
    }

    public function getProduit(): ?Produit
    {
        return $this->produit;
    }

    public function setProduit(?Produit $produit): static
    {
        $this->produit = $produit;
        return $this;
    }


    public function getQteC(): ?int
    {
        return $this->qte_c;
    }

    public function setQteC(int $qte_c): static
    {
        $this->qte_c = $qte_c;
        return $this;
    }


    public function getDateCommande(): ?\DateTimeInterface
    {
        return $this->date_commande;
    }

    public function setDateCommande(?\DateTimeInterface $date_commande): static
    {
        $this->date_commande = $date_commande;
        return $this;
    }


}
