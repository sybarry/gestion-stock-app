<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\State\Processor\UserProcessor;
use App\State\Provider\UserProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/users/{id}/user',
            name: 'api_get_user',
            provider: UserProvider::class,
            deserialize: false,
            validate: false,
        ),
        new GetCollection(
            uriTemplate: '/users',
            name: 'api_get_users',
            provider: UserProvider::class,
            deserialize: false,
            validate: false,
        ),
        new Post(
            uriTemplate: '/users/create_user',
            name: 'api_create_user',
            processor: UserProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Patch(
            uriTemplate: '/users/{id}/modifier',
            name: 'api_patch_user',
            processor: UserProcessor::class,
            deserialize: true,
            validate: false,
        ),
        new Delete(
            uriTemplate: '/users/{id}/supprimer',
            name: 'api_delete_user',
            processor: UserProcessor::class,
            validate: false,
        ),
    ],
    formats: [ 'json', 'jsonld', 'html', ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']]
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fournisseur:read', 'client:read', 'user:read', 'user:write', 'admin:read'])]
    private ?int $id = null;

    #[ORM\Column(name: 'nom_user', length: 100)]
    #[Groups(['user:read', 'user:write', 'admin:read'])]
    private ?string $nom_user = null;

    #[ORM\Column(name: 'password', length: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $password = null;

    #[ORM\Column(name: 'role', length: 30)]
    #[Groups(['user:read', 'user:write', 'admin:read'])]
    private ?string $role = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomUser(): ?string
    {
        return $this->nom_user;
    }

    public function setNomUser(string $nomuser): static
    {
        $this->nom_user = $nomuser;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): static
    {
        $this->role = $role;

        return $this;
    }
}
