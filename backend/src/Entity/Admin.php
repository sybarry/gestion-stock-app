<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\User;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\State\Processor\AdminProcessor;
use App\State\Provider\AdminProvider;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/admins/{id}/admin',
            name: 'api_get_admin',
            provider: AdminProvider::class,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/admins',
            name: 'api_get_admins',
            provider: AdminProvider::class,
            deserialize: false,
            validate: false,
        ),
        new Patch(
            uriTemplate: '/admins/{id}/modifier',
            name: 'api_patch_admin',
            processor: AdminProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Delete(
            uriTemplate: '/admins/{id}/supprimer',
            name: 'api_delete_admin',
            processor: AdminProcessor::class,
            validate: false,
        ),
    ],
    formats: [ 'json', 'jsonld', 'html', ],
    normalizationContext: ['groups' => ['admin:read'], 'max_depth' => 1],
    denormalizationContext: ['groups' => ['admin:write']]
)]
#[ORM\Entity]
class Admin
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['admin:read', 'admin:write'])]
    private ?int $id = null;

    #[ORM\Column(name: 'nom_a', length: 100)]
    #[Groups(['admin:read', 'admin:write'])]
    private ?string $nom_a = null;

    #[ORM\Column(name: 'prenom_a', length: 100)]
    #[Groups(['admin:read', 'admin:write'])]
    private ?string $prenom_a = null;

    #[ORM\Column(name: 'tel_a', length: 20)]
    #[Groups(['admin:read', 'admin:write'])]
    private ?string $tel_a = null;

    #[ORM\Column(name: 'adr_a', length: 255)]
    #[Groups(['admin:read', 'admin:write'])]
    private ?string $adr_a = null;

    #[ORM\Column(name: 'datecreation_a', type: 'datetime')]
    #[Groups(['admin:read', 'admin:write'])]
    private ?\DateTimeInterface $datecreation_a = null;

    #[ORM\Column(name: 'mail_a', length: 180)]
    #[Groups(['admin:read', 'admin:write'])]
    private ?string $mail_a = null;

    #[ORM\OneToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['admin:read'])]
    #[MaxDepth(1)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomA(): ?string
    {
        return $this->nom_a;
    }

    public function setNomA(string $nom_a): static
    {
        $this->nom_a = $nom_a;
        return $this;
    }

    public function getPrenomA(): ?string
    {
        return $this->prenom_a;
    }

    public function setPrenomA(string $prenom_a): static
    {
        $this->prenom_a = $prenom_a;
        return $this;
    }

    public function getTelA(): ?string
    {
        return $this->tel_a;
    }

    public function setTelA(string $tel_a): static
    {
        $this->tel_a = $tel_a;
        return $this;
    }

    public function getAdrA(): ?string
    {
        return $this->adr_a;
    }

    public function setAdrA(string $adr_a): static
    {
        $this->adr_a = $adr_a;
        return $this;
    }

    public function getDatecreationA(): ?\DateTimeInterface
    {
        return $this->datecreation_a;
    }

    public function setDatecreationA(\DateTimeInterface $datecreation_a): static
    {
        $this->datecreation_a = $datecreation_a;
        return $this;
    }

    public function getMailA(): ?string
    {
        return $this->mail_a;
    }

    public function setMailA(string $mail_a): static
    {
        $this->mail_a = $mail_a;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }
}
