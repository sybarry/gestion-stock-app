<?php
namespace App\State\Processor;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\Commande;
use Doctrine\ORM\EntityManagerInterface;

class CommandeProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function process($data, $operation, array $uriVariables = [], array $context = []) {
        $name = $operation->getName() ?? '';
        switch ($name) {
            case 'api_delete_commande':
                return $this->supprimeCommande($data, $uriVariables, $context);
            case 'api_patch_commande':
                return $this->modifieCommande($data, $uriVariables, $context);
            case 'api_create_commande':
                return $this->ajouteCommande($data, $uriVariables, $context);
            default:
                throw new \RuntimeException('Opération non supportée : ' . $name);
        }
    }

    private function supprimeCommande($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? ($data instanceof Commande ? $data->getId() : null);
        if (!$id) {
            throw new \RuntimeException('ID reçu pour suppression: ' . json_encode($uriVariables) . ' | Contexte: ' . json_encode($context));
        }
        
        // Récupérer la commande avant suppression pour remettre le stock
        $commande = $this->em->getRepository(Commande::class)->find($id);
        if ($commande) {
            $produit = $commande->getProduit();
            if ($produit) {
                // Remettre la quantité en stock
                $nouvelleQuantite = $produit->getQteP() + $commande->getQteC();
                $produit->setQteP($nouvelleQuantite);
                
                // Recalculer le total du produit
                $produit->setTotal($nouvelleQuantite * $produit->getPrix());
                
                // Sauvegarder les modifications du produit
                $this->em->flush();
            }
        }
        
        $conn = $this->em->getConnection();
        $sql = 'DELETE FROM commande WHERE id = :id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('id', $id);
        $result = $stmt->executeStatement();
        return [
            'success' => $result > 0,
            'message' => $result > 0 ? 'Commande supprimée avec succès et stock remis à jour' : 'Aucune ligne supprimée',
            'id' => $id,
            'rows_deleted' => $result
        ];
    }

    private function modifieCommande($data, array $uriVariables, array $context) {
        $id = $uriVariables['id'] ?? null;
        if (!$id) {
            throw new \RuntimeException('Identifiant commande manquant pour la modification.');
        }
        $commande = $this->em->getRepository(Commande::class)->find($id);
        if (!$commande) {
            throw new \RuntimeException('Commande non trouvée pour la modification.');
        }
        
        // Traiter les données JSON brutes pour les modifications
        $requestData = $context['request'] ?? null;
        $jsonData = [];
        if ($requestData && $requestData->getContent()) {
            $jsonData = json_decode($requestData->getContent(), true);
        }
        
        // Gérer la modification de quantité avec ajustement du stock
        if (isset($jsonData['qte_c']) && $jsonData['qte_c'] !== $commande->getQteC()) {
            $ancienneQuantite = $commande->getQteC();
            $nouvelleQuantite = $jsonData['qte_c'];
            $produit = $commande->getProduit();
            
            if ($produit) {
                // Calculer la différence de stock
                $differenceStock = $ancienneQuantite - $nouvelleQuantite;
                $nouveauStockProduit = $produit->getQteP() + $differenceStock;
                
                // Vérifier que le stock ne devient pas négatif
                if ($nouveauStockProduit < 0) {
                    throw new \RuntimeException('Stock insuffisant. Stock disponible: ' . $produit->getQteP() . ', quantité supplémentaire demandée: ' . abs($differenceStock));
                }
                
                // Mettre à jour le stock du produit
                $produit->setQteP($nouveauStockProduit);
                $produit->setTotal($nouveauStockProduit * $produit->getPrix());
            }
            
            $commande->setQteC($nouvelleQuantite);
        }
        
        // Gérer les autres modifications
        if ($data->getNumCom() !== null) $commande->setNumCom($data->getNumCom());
        if ($data->getClient() !== null) $commande->setClient($data->getClient());
        
        // Gérer le changement de produit (plus complexe car il faut ajuster les stocks de deux produits)
        if ($data->getProduit() !== null && $data->getProduit() !== $commande->getProduit()) {
            $ancienProduit = $commande->getProduit();
            $nouveauProduit = $data->getProduit();
            
            // Remettre le stock à l'ancien produit
            if ($ancienProduit) {
                $nouveauStockAncien = $ancienProduit->getQteP() + $commande->getQteC();
                $ancienProduit->setQteP($nouveauStockAncien);
                $ancienProduit->setTotal($nouveauStockAncien * $ancienProduit->getPrix());
            }
            
            // Décrémenter le stock du nouveau produit
            if ($nouveauProduit) {
                if ($nouveauProduit->getQteP() < $commande->getQteC()) {
                    throw new \RuntimeException('Stock insuffisant pour le nouveau produit. Stock disponible: ' . $nouveauProduit->getQteP() . ', quantité demandée: ' . $commande->getQteC());
                }
                $nouveauStockNouveau = $nouveauProduit->getQteP() - $commande->getQteC();
                $nouveauProduit->setQteP($nouveauStockNouveau);
                $nouveauProduit->setTotal($nouveauStockNouveau * $nouveauProduit->getPrix());
            }
            
            $commande->setProduit($nouveauProduit);
        }
        
        $this->em->flush();
        return $commande;
    }

    private function ajouteCommande($data, array $uriVariables, array $context) {
        try {
            // Traiter les données JSON brutes si nécessaire
            $requestData = $context['request'] ?? null;
            if ($requestData && $requestData->getContent()) {
                $jsonData = json_decode($requestData->getContent(), true);
                
                // Gestion de la relation client via client_id
                if (isset($jsonData['client_id'])) {
                    $client = $this->em->getRepository(\App\Entity\Client::class)->findOneBy(['num_c' => $jsonData['client_id']]);
                    if ($client) {
                        $data->setClient($client);
                    } else {
                        throw new \RuntimeException('Client avec num_c ' . $jsonData['client_id'] . ' non trouvé.');
                    }
                }
                
                // Gestion de la relation produit via produit_id
                if (isset($jsonData['produit_id'])) {
                    $produit = $this->em->getRepository(\App\Entity\Produit::class)->find($jsonData['produit_id']);
                    if ($produit) {
                        $data->setProduit($produit);
                        
                        // Vérifier et décrémenter le stock
                        $quantiteCommande = $jsonData['qte_c'] ?? 0;
                        if ($quantiteCommande > 0) {
                            if ($produit->getQteP() < $quantiteCommande) {
                                throw new \RuntimeException('Stock insuffisant. Stock disponible: ' . $produit->getQteP() . ', quantité demandée: ' . $quantiteCommande);
                            }
                            
                            // Décrémenter le stock
                            $nouvelleQuantite = $produit->getQteP() - $quantiteCommande;
                            $produit->setQteP($nouvelleQuantite);
                            
                            // Recalculer le total du produit
                            $produit->setTotal($nouvelleQuantite * $produit->getPrix());
                        }
                    } else {
                        throw new \RuntimeException('Produit avec id ' . $jsonData['produit_id'] . ' non trouvé.');
                    }
                }
                
                // Gestion de la quantité
                if (isset($jsonData['qte_c'])) {
                    $data->setQteC($jsonData['qte_c']);
                }
            }
            
            // Générer automatiquement le numéro de commande si non fourni
            if ($data->getNumCom() === null) {
                // Obtenir le prochain ID en regardant le maximum actuel
                $conn = $this->em->getConnection();
                $sql = 'SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM commande';
                $result = $conn->executeQuery($sql);
                $nextId = $result->fetchOne();
                
                // Générer un numéro aléatoire
                $randomNum = rand(1000, 99999);
                $numCom = "COM-{$nextId}-{$randomNum}";
                $data->setNumCom($numCom);
            }
            
            // Définir la date actuelle si non fournie (normalisée à minuit)
            if ($data->getDateCommande() === null) {
                $dateAujourdhui = new \DateTime();
                $dateAujourdhui->setTime(0, 0, 0); // Normaliser à 00:00:00
                $data->setDateCommande($dateAujourdhui);
            }
            
            $this->em->persist($data);
            $this->em->flush();
        } catch (\Exception $e) {
            throw new \RuntimeException('Commande non ajoutée : ' . $e->getMessage());
        }
        if (null === $data->getId()) {
            throw new \RuntimeException('Commande non ajoutée : identifiant non généré.');
        }
        return $data;
    }
}
