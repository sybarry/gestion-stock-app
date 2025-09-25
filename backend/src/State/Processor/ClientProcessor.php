<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Entity\Client;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class ClientProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private RequestStack $requestStack
    ) {}

    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        if ($operation instanceof Post) {
            return $this->ajouteClient($data, $uriVariables, $context);
        }
        if ($operation instanceof Patch) {
            return $this->modifieClient($data, $uriVariables, $context);
        }
        if ($operation instanceof Delete) {
            return $this->supprimeClient($data, $uriVariables, $context);
        }
        
        throw new \RuntimeException('Opération non supportée: ' . get_class($operation));
    }

    private function supprimeClient($data, array $uriVariables, array $context) {
        $id = $uriVariables['num_c'] ?? ($data instanceof Client ? $data->getNumC() : null);
        if (!$id) {
            throw new \RuntimeException('ID reçu pour suppression: ' . json_encode($uriVariables) . ' | Contexte: ' . json_encode($context));
        }
        
        try {
            // Récupérer le client avec son utilisateur associé
            $client = $this->em->getRepository(Client::class)->find($id);
            if (!$client) {
                throw new \RuntimeException('Client non trouvé avec l\'ID: ' . $id);
            }
            
            $user = $client->getUser();
            
            // Supprimer d'abord le client
            $this->em->remove($client);
            
            // Puis supprimer l'utilisateur associé si il existe
            if ($user) {
                $this->em->remove($user);
            }
            
            $this->em->flush();
            
            return [
                'success' => true,
                'message' => 'Client et utilisateur supprimés avec succès',
                'id' => $id,
                'user_deleted' => $user ? true : false
            ];
        } catch (\Exception $e) {
            throw new \RuntimeException('Erreur lors de la suppression: ' . $e->getMessage());
        }
    }

    private function modifieClient($data, array $uriVariables, array $context) {
    $id = $uriVariables['num_c'] ?? null;
        if (!$id) {
            throw new \RuntimeException('Identifiant client manquant pour la modification.');
        }
        $client = $this->em->getRepository(CLIENT::class)->find($id);
        if (!$client) {
            throw new \RuntimeException('Client non trouvé pour la modification.');
        }
    if ($data->getNomC() !== null) $client->setNomC($data->getNomC());
    if ($data->getPrenomC() !== null) $client->setPrenomC($data->getPrenomC());
    if ($data->getTelC() !== null) $client->setTelC($data->getTelC());
    if ($data->getAdresseC() !== null) $client->setAdresseC($data->getAdresseC());
    if ($data->getMailC() !== null) $client->setMailC($data->getMailC());
        $this->em->flush();
        return $client;
    }

    private function ajouteClient($data, array $uriVariables, array $context) {
        try {
            // Récupérer user_id depuis la requête
            $request = $this->requestStack->getCurrentRequest();
            $requestData = json_decode($request->getContent(), true);
            $userId = $requestData['user_id'] ?? null;
            
            if ($userId) {
                $user = $this->em->getRepository(User::class)->find($userId);
                if (!$user) {
                    throw new \RuntimeException('Utilisateur non trouvé avec l\'ID: ' . $userId);
                }
                $data->setUser($user);
            } else {
                throw new \RuntimeException('ID utilisateur requis pour créer un client');
            }
            
            // Définir automatiquement la date de création
            if ($data->getDatecreationC() === null) {
                $data->setDatecreationC(new \DateTime());
            }
            
            $this->em->persist($data);
            $this->em->flush();
        } catch (\Exception $e) {
            throw new \RuntimeException('Client non ajouté : ' . $e->getMessage());
        }
        if (null === $data->getNumC()) {
            throw new \RuntimeException('Client non ajouté : identifiant non généré.');
        }
        return $data;
    }
}
