<?php

namespace App\Entity;

use App\Repository\FournisseurRepository;
use Symfony\Component\Serializer\Annotation\Groups;
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
        new Get(
            uriTemplate: '/fournisseurs/{num_f}/fournisseur',
            name: 'api_get_fournisseur',
            provider: FournisseurProvider::class,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/fournisseurs',
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
            uriTemplate: '/fournisseurs/{num_f}/modifier',
            name: 'api_patch_fournisseur',
            processor: FournisseurProcessor::class,
            deserialize: true,
            validate: false,
            normalizationContext: ['groups' => ['fournisseur:read']],
        ),
        new Delete(
            uriTemplate: '/fournisseurs/{num_f}/supprimer',
            name: 'api_delete_fournisseur',
            processor: FournisseurProcessor::class,
            validate: false,
        ),
    ],
    formats: [ 'json', 'jsonld', 'html', ],
    normalizationContext: ['groups' => ['fournisseur:read']],
    denormalizationContext: ['groups' => ['fournisseur:write']]
)]
#[ORM\Entity(repositoryClass: FournisseurRepository::class)]
class Fournisseur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'num_f', type: 'integer')]
    #[Groups(['fournisseur:read', 'fournisseur:write', 'produit:read'])]
    private ?int $num_f = null;

    #[ORM\Column(name: 'nom_f', type: 'string', length: 20)]
    #[Groups(['fournisseur:read', 'fournisseur:write', 'produit:read'])]
    private ?string $nom_f = null;

    #[ORM\Column(name: 'tel_f', type: 'string', length: 20)]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?string $tel_f = null;

    #[ORM\Column(name: 'adr_f', type: 'string', length: 20)]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?string $adr_f = null;


    #[ORM\Column(name: 'datecreation_f', type: 'datetime', nullable: true)]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?\DateTimeInterface $datecreation_f = null;

    #[ORM\Column(name: 'mail_f', type: 'string', length: 180, nullable: true)]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?string $mail_f = null;

    public function getNumF(): ?int
    {
        return $this->num_f;
    }

    public function setNumF(int $num_f): static
    {
        $this->num_f = $num_f;
        return $this;
    }

    public function getNomF(): ?string
    {
        return $this->nom_f;
    }

    public function setNomF(string $nom_f): static
    {
        $this->nom_f = $nom_f;
        return $this;
    }

    public function getTelF(): ?string
    {
        return $this->tel_f;
    }

    public function setTelF(string $tel_f): static
    {
        $this->tel_f = $tel_f;
        return $this;
    }

    public function getAdrF(): ?string
    {
        return $this->adr_f;
    }

    public function setAdrF(string $adr_f): static
    {
        $this->adr_f = $adr_f;
        return $this;
    }

    public function getDatecreationF(): ?\DateTimeInterface
    {
        return $this->datecreation_f;
    }

    public function setDatecreationF(?\DateTimeInterface $datecreation_f): static
    {
        $this->datecreation_f = $datecreation_f;
        return $this;
    }

    public function getMailF(): ?string
    {
        return $this->mail_f;
    }

    public function setMailF(?string $mail_f): static
    {
        $this->mail_f = $mail_f;
        return $this;
    }

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['fournisseur:read'])]
    #[\Symfony\Component\Serializer\Annotation\MaxDepth(1)]
    private ?User $user = null;

    #[Groups(['fournisseur:write'])]
    private ?int $user_id = null;

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(?int $user_id): static
    {
        $this->user_id = $user_id;
        return $this;
    }
}
