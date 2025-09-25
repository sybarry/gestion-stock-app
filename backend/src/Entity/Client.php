<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use App\State\Provider\ClientProvider;
use App\State\Processor\ClientProcessor;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/clients/{num_c}/client',
            name: 'api_get_client',
            provider: ClientProvider::class,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/clients',
            name: 'api_get_clients',
            provider: ClientProvider::class,
            deserialize: false,
            validate: false,
        ),
        new Post(
            uriTemplate: '/clients/create_client',
            name: 'api_create_client',
            processor: ClientProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Patch(
            uriTemplate: '/clients/{num_c}/modifier',
            name: 'api_patch_client',
            processor: ClientProcessor::class,
            deserialize: true,
            validate: false,
            normalizationContext: ['groups' => ['client:read']],
        ),
        new Delete(
            uriTemplate: '/clients/{num_c}/supprimer',
            name: 'api_delete_client',
            processor: ClientProcessor::class,
            validate: false,
        ),
    ],
    formats: [ 'json', 'jsonld', 'html', ],
    normalizationContext: ['groups' => ['client:read']],
    denormalizationContext: ['groups' => ['client:write']]
)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'num_c', type: 'integer')]
    #[Groups(['client:read', 'client:write'])]
    private ?int $num_c = null;

    #[ORM\Column(name: 'nom_c', type: 'string', length: 20)]
    #[Groups(['client:read', 'client:write'])]
    private ?string $nom_c = null;

    #[ORM\Column(name: 'prenom_c', type: 'string', length: 20)]
    #[Groups(['client:read', 'client:write'])]
    private ?string $prenom_c = null;

    #[ORM\Column(name: 'adresse_c', type: 'string', length: 50)]
    #[Groups(['client:read', 'client:write'])]
    private ?string $adresse_c = null;

    #[ORM\Column(name: 'tel_c', type: 'string', length: 20)]
    #[Groups(['client:read', 'client:write'])]
    private ?string $tel_c = null;

    #[ORM\Column(name: 'mail_c', type: 'string', length: 100, nullable: true)]
    #[Groups(['client:read', 'client:write'])]
    private ?string $mail_c = null;

    #[ORM\Column(name: 'datecreation_c', type: 'datetime', nullable: true)]
    #[Groups(['client:read'])]
    private ?\DateTimeInterface $datecreation_c = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['client:read', 'client:write'])]
    private ?User $user = null;

    public function getNumC(): ?int
    {
        return $this->num_c;
    }

    public function setNumC(int $num_c): static
    {
        $this->num_c = $num_c;
        return $this;
    }

    public function getNomC(): ?string
    {
        return $this->nom_c;
    }

    public function setNomC(string $nom_c): static
    {
        $this->nom_c = $nom_c;
        return $this;
    }

    public function getPrenomC(): ?string
    {
        return $this->prenom_c;
    }

    public function setPrenomC(string $prenom_c): static
    {
        $this->prenom_c = $prenom_c;
        return $this;
    }

    public function getAdresseC(): ?string
    {
        return $this->adresse_c;
    }

    public function setAdresseC(string $adresse_c): static
    {
        $this->adresse_c = $adresse_c;
        return $this;
    }

    public function getTelC(): ?string
    {
        return $this->tel_c;
    }

    public function setTelC(string $tel_c): static
    {
        $this->tel_c = $tel_c;
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

    public function getMailC(): ?string
    {
        return $this->mail_c;
    }

    public function setMailC(?string $mail_c): static
    {
        $this->mail_c = $mail_c;
        return $this;
    }

    public function getDatecreationC(): ?\DateTimeInterface
    {
        return $this->datecreation_c;
    }

    public function setDatecreationC(?\DateTimeInterface $datecreation_c): static
    {
        $this->datecreation_c = $datecreation_c;
        return $this;
    }

    // Champ virtuel pour faciliter la sérialisation du user_id
    #[Groups(['client:write'])]
    public function getUserId(): ?int
    {
        return $this->user ? $this->user->getId() : null;
    }

    #[Groups(['client:write'])]
    public function setUserId(?int $userId): static
    {
        // Ce setter sera utilisé par le processor pour récupérer l'ID
        // La logique de récupération de l'entité User sera dans le processor
        return $this;
    }
}
