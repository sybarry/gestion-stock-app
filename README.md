# 📦 Gestion Stock App

> **Application complète de gestion de stock** développée avec **Symfony (API Platform)** en backend et **React + TypeScript** en frontend.

## 📋 Table des matières

- [🎯 Vue d'ensemble](#vue-densemble)
- [🏗️ Architecture](#architecture)
- [⚙️ Technologies utilisées](#technologies-utilisées)
- [📁 Structure du projet](#structure-du-projet)
- [🚀 Installation et démarrage](#installation-et-démarra---

## 🐳 Gestion des conteneurs Docker

### ▶️ **Démarrer l'application :**

```bash
# Démarrer tous les services en arrière-plan
docker-compose up -d

# Démarrer avec construction des images (première fois ou après modifications)
docker-compose up --build -d

# Démarrer avec logs visibles (pour debug)
docker-compose up
```

### ⏹️ **Arrêter l'application :**

```bash
# Arrêter tous les conteneurs (garde les données)
docker-compose stop

# Arrêter et supprimer les conteneurs (garde les volumes/données)
docker-compose down

# Arrêt complet avec suppression des volumes (⚠️ perte de données)
docker-compose down --volumes
```

### 🔄 **Redémarrer l'application :**

```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
docker-compose restart db
docker-compose restart frontend

# Arrêter puis redémarrer complètement
docker-compose down && docker-compose up -d
```

### 📊 **Vérifier l'état des conteneurs :**

```bash
# Voir l'état de tous les services
docker-compose ps

# Voir les conteneurs en cours d'exécution
docker ps

# Voir tous les conteneurs (actifs et arrêtés)
docker ps -a
```

---

## 🛠️ Dépannage Docker

### ❌ **Problèmes courants :**

#### **Port déjà utilisé**
```bash
# Erreur: "port 3307 already in use"
# Solution 1: Arrêter les conteneurs existants
docker-compose down

# Solution 2: Trouver et arrêter le processus utilisant le port
sudo lsof -i :3307
sudo kill -9 [PID]
```

#### **Conteneurs corrompus**
```bash
# Nettoyage complet
docker-compose down --volumes --remove-orphans
docker system prune -f
docker-compose up --build -d
```

#### **Base de données non initialisée**
```bash
# Vérifier que MySQL est prêt
docker-compose logs db

# Recreer le schéma si nécessaire
docker-compose exec backend php bin/console doctrine:schema:update --force
docker-compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

#### **Images obsolètes**
```bash
# Forcer la reconstruction sans cache
docker-compose build --no-cache
docker-compose up -d
```

#### **Permissions Docker (Linux)**
```bash
# Si erreur "permission denied"
sudo systemctl restart docker

# Ajouter votre utilisateur au groupe docker (puis redémarrer)
sudo usermod -aG docker $USER
```

### 🐛 **Debug et logs :**
```bash
# Voir tous les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f phpmyadmin

# Entrer dans un conteneur pour debug
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec db mysql -u sabarry -psaikou1993 gestion_stock

# Voir l'utilisation des ressources
docker stats
```

### 💾 **Gestion des données :**
```bash
# Sauvegarder la base de données
docker-compose exec db mysqldump -u sabarry -psaikou1993 gestion_stock > backup.sql

# Restaurer la base de données
docker-compose exec -T db mysql -u sabarry -psaikou1993 gestion_stock < backup.sql

# Voir les volumes Docker
docker volume ls

# Nettoyer les volumes non utilisés
docker volume prune
```
- [🔧 Configuration](#configuration)
- [📊 Base de données](#base-de-données)
- [🔌 API Endpoints](#api-endpoints)
- [🎨 Interface utilisateur](#interface-utilisateur)
- [🧪 Tests avec Bruno](#tests-avec-bruno)
- [📈 Fonctionnalités](#fonctionnalités)

---

## 🎯 Vue d'ensemble

**Gestion Stock App** est une application web moderne pour la gestion complète des stocks d'une entreprise. Elle permet de gérer :

- 👥 **Clients** et **Fournisseurs** avec leurs informations complètes
- 📦 **Produits** avec quantités et prix
- 🛒 **Commandes** client avec suivi complet
- 👤 **Utilisateurs** et **Administrateurs** avec système d'authentification
- 📋 **Factures** client par date et client

---

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │ ◄──────────────────► │                 │
│  Frontend (SPA) │                     │  Backend (API)  │
│  React + TS     │                     │  Symfony + PHP  │
│  Vite           │                     │  API Platform   │
└─────────────────┘                     └─────────────────┘
                                                  │
                                                  ▼
                                        ┌─────────────────┐
                                        │                 │
                                        │  Base de données│
                                        │  MySQL          │
                                        └─────────────────┘
```

---

## ⚙️ Technologies utilisées

### 🔥 Backend
- **PHP 8.2** avec **Symfony 6.4**
- **API Platform 3** pour l'API REST automatisée
- **Doctrine ORM** pour la gestion de la base de données
- **MySQL** comme SGBD
- **Docker** pour la containerisation

### ⚛️ Frontend
- **React 18** avec **TypeScript**
- **Vite** comme bundler et serveur de développement
- **React Router** pour la navigation
- **Axios** pour les appels API
- **CSS3** moderne avec design responsive

### 🧪 Tests et développement
- **Bruno** pour les tests d'API
- **phpMyAdmin** pour l'administration de la base de données
- **Docker Compose** pour l'orchestration des services

---

## 📁 Structure du projet

```
gestion-stock-app/
├── 📁 backend/              # API Symfony
│   ├── 📁 src/
│   │   ├── 📁 Entity/       # Entités Doctrine (Client, Produit, etc.)
│   │   ├── 📁 Repository/   # Repositories pour l'accès aux données
│   │   ├── 📁 State/        # Providers et Processors API Platform
│   │   ├── 📁 DataFixtures/ # Données de test
│   │   └── 📁 DTO/          # Objets de transfert de données
│   ├── 📁 config/           # Configuration Symfony
│   ├── 📁 migrations/       # Migrations de base de données
│   └── 📄 composer.json     # Dépendances PHP
├── 📁 frontend/             # Interface React
│   ├── 📁 src/
│   │   ├── 📁 components/   # Composants React par module
│   │   ├── 📁 services/     # Services API (axios)
│   │   └── 📁 context/      # Contexte d'authentification
│   ├── 📄 package.json      # Dépendances Node.js
│   └── 📄 vite.config.ts    # Configuration Vite
├── 📁 Bruno/                # Tests d'API par module
├── 📁 Factures/             # Factures générées
├── 📄 docker-compose.yml    # Configuration Docker
└── 📄 README.md             # Documentation
```

---

## 🚀 Installation et démarrage

### 🐳 Option 1 : Avec Docker (Recommandé)

#### **Prérequis :**
- Docker et Docker Compose installés sur votre système

#### **Lancement rapide :**
```bash
# Cloner le repository
git clone https://github.com/sybarry/gestion-stock-app.git
cd gestion-stock-app

# Construire et lancer en arrière-plan
docker-compose up --build -d

# Voir le statut des services
docker-compose ps
```

#### **Première fois (avec logs) :**
```bash
# Pour voir les logs en temps réel (première installation)
docker-compose up --build

# Une fois que tout est prêt, arrêter avec Ctrl+C puis relancer en arrière-plan
docker-compose up -d
```

#### **Commandes utiles :**
```bash
# Voir les logs en temps réel
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Arrêter tous les services
docker-compose down

# Redémarrer tous les services
docker-compose restart

# Nettoyage complet (supprime tout)
docker-compose down --volumes --remove-orphans
docker system prune -f
```

#### **Temps d'installation :**
- **Première fois :** 3-5 minutes (construction des images)
- **Démarrages suivants :** 30-60 secondes

### 🔧 Option 2 : Installation manuelle

#### Backend
```bash
cd backend/
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
symfony server:start
```

#### Frontend
```bash
cd frontend/
npm install
npm run dev
```

---

## 🔧 Configuration

### 🌐 Accès aux services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Interface utilisateur React |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | API REST Symfony |
| **phpMyAdmin** | [http://localhost:8081](http://localhost:8081) | Administration base de données |
| **Documentation API** | [http://localhost:8000/api](http://localhost:8000/api) | Interface API Platform |

### 🔑 Comptes par défaut

**Administrateur :**
- Login : `admin`
- Password : `admin123`

---

## 📊 Base de données

### 🗃️ Configuration MySQL

#### **Avec Docker :**
- **Host :** `localhost` (depuis l'extérieur) ou `db` (entre conteneurs)
- **Port :** `3307` (mappé depuis le port 3306 du conteneur)
- **Base :** `gestion_stock`
- **Utilisateur :** `user`
- **Mot de passe :** `password`
- **Root password :** `root`

#### **Installation manuelle :**
- **Host :** `localhost`
- **Port :** `3306`
- **Base :** `gestion_stock`
- **Utilisateur :** `user`
- **Mot de passe :** `password`

#### **Accès phpMyAdmin (Docker uniquement) :**
- **URL :** http://localhost:8081
- **Serveur :** `db`
- **Utilisateur :** `user` ou `root`
- **Mot de passe :** `password` ou `root`

### 📋 Tables principales

| Table | Description | Champs clés |
|-------|-------------|-------------|
| `user` | Utilisateurs système | `nom_user`, `password`, `role` |
| `admin` | Administrateurs | `nom_a`, `prenom_a`, `mail_a` |
| `client` | Clients de l'entreprise | `nom_c`, `prenom_c`, `tel_c`, `user_id` |
| `fournisseur` | Fournisseurs | `nom_f`, `tel_f`, `adr_f`, `user_id` |
| `produit` | Produits en stock | `nom_p`, `qte_p`, `prix`, `fournisseur_id` |
| `commande` | Commandes client | `num_com`, `client`, `produit`, `qte_c` |

---

## 🔌 API Endpoints

L'API utilise des **routes personnalisées** au lieu des routes REST standards :

### 👥 Clients
```
GET    /api/clients                    # Liste tous les clients
GET    /api/clients/{id}/client        # Détails d'un client
POST   /api/clients/create_client      # Créer un client
PATCH  /api/clients/{id}/modifier      # Modifier un client
DELETE /api/clients/{id}/supprimer     # Supprimer un client
```

### 🏪 Fournisseurs
```
GET    /api/fournisseurs                    # Liste tous les fournisseurs
GET    /api/fournisseurs/{id}/fournisseur   # Détails d'un fournisseur
POST   /api/fournisseurs/create_fournisseur # Créer un fournisseur
PATCH  /api/fournisseurs/{id}/modifier      # Modifier un fournisseur
DELETE /api/fournisseurs/{id}/supprimer     # Supprimer un fournisseur
```

### 📦 Produits
```
GET    /api/produits                   # Liste tous les produits
GET    /api/produits/{id}/produit      # Détails d'un produit
POST   /api/produits/create_produit    # Créer un produit
PATCH  /api/produits/{id}/modifier     # Modifier un produit
DELETE /api/produits/{id}/supprimer    # Supprimer un produit
```

### 🛒 Commandes
```
GET    /api/commandes                     # Liste toutes les commandes
GET    /api/commandes/{id}/commande       # Détails d'une commande
POST   /api/commandes/create_commande     # Créer une commande
PATCH  /api/commandes/{id}/modifier       # Modifier une commande
DELETE /api/commandes/{id}/supprimer      # Supprimer une commande
```

### 👤 Utilisateurs
```
GET    /api/users                 # Liste tous les utilisateurs
GET    /api/users/{id}/user       # Détails d'un utilisateur
POST   /api/users/create_user     # Créer un utilisateur
PATCH  /api/users/{id}/modifier   # Modifier un utilisateur
DELETE /api/users/{id}/supprimer  # Supprimer un utilisateur
```

---

## 🎨 Interface utilisateur

### 🏠 Pages principales

1. **Dashboard** - Vue d'ensemble avec statistiques
   - Nombre de clients, fournisseurs, produits, commandes
   - Navigation rapide vers tous les modules

2. **Gestion Clients** 
   - Liste paginée avec recherche
   - Formulaire de création/modification
   - Suppression avec confirmation

3. **Gestion Fournisseurs**
   - Interface identique aux clients
   - Gestion des utilisateurs associés

4. **Gestion Produits**
   - Stock, prix, fournisseur associé
   - Indicateurs de stock faible

5. **Gestion Commandes**
   - Suivi des commandes client
   - Calcul automatique des totaux

6. **Factures Client**
   - Génération par client et date
   - Exportation PDF disponible

### 🎨 Design et UX

- **Design moderne** avec CSS3 et Flexbox/Grid
- **Responsive** : compatible mobile, tablette, desktop
- **Interface intuitive** avec navigation claire
- **Confirmations** pour les actions destructrices
- **Messages d'erreur** explicites
- **Indicateurs visuels** (stock faible, statuts, etc.)

---

## 🧪 Tests avec Bruno

Le dossier `Bruno/` contient tous les tests d'API organisés par module :

```
Bruno/
├── Client/          # Tests pour l'API clients
├── Fournisseur/     # Tests pour l'API fournisseurs
├── Produit/         # Tests pour l'API produits
├── Commande/        # Tests pour l'API commandes
├── User/            # Tests pour l'API utilisateurs
└── Admin/           # Tests pour l'API admin
```

**Utilisation :**
1. Installer **Bruno** ([bruno.dev](https://bruno.dev))
2. Ouvrir le dossier `Bruno/` dans Bruno
3. Exécuter les tests par collection

---

## 📈 Fonctionnalités

### ✅ Fonctionnalités implémentées

#### 🔐 Authentification et autorisation
- [x] Système d'authentification utilisateur
- [x] Gestion des rôles (admin, user)
- [x] Routes protégées dans l'interface

#### 👥 Gestion des utilisateurs
- [x] CRUD complet pour les utilisateurs
- [x] Association utilisateur-client/fournisseur
- [x] Suppression en cascade lors de suppression d'utilisateur

#### 👤 Gestion des clients
- [x] CRUD complet avec routes personnalisées
- [x] Création automatique d'utilisateur associé
- [x] Interface React complète avec validation
- [x] Recherche et filtrage

#### 🏪 Gestion des fournisseurs
- [x] CRUD complet identique aux clients
- [x] Interface React avec même design
- [x] Gestion du cycle de vie utilisateur

#### 📦 Gestion des produits
- [x] CRUD avec gestion du stock
- [x] Association avec fournisseur
- [x] Interface avec indicateurs visuels

#### 🛒 Gestion des commandes
- [x] Création de commandes client-produit
- [x] Calcul automatique des totaux
- [x] Génération automatique des numéros de commande
- [x] Interface de suivi complète

#### 📋 Facturation
- [x] Génération de factures par client et date
- [x] Regroupement des commandes par facture
- [x] Interface de sélection client/date
- [x] Export PDF (via navigateur)

#### 🗄️ Base de données
- [x] Schema complet avec relations
- [x] Migrations Doctrine
- [x] Fixtures pour données de test
- [x] Contraintes d'intégrité

#### 🎨 Interface utilisateur
- [x] Design responsive moderne
- [x] Navigation intuitive
- [x] Formulaires avec validation
- [x] Messages d'erreur explicites
- [x] Confirmations pour suppressions

### 🔮 Fonctionnalités futures possibles

- [ ] **Notifications** : alertes stock bas, commandes urgentes
- [ ] **Reporting avancé** : graphiques, statistiques détaillées  
- [ ] **Gestion des stocks** : mouvements, inventaires
- [ ] **Multi-devise** : support monnaies étrangères
- [ ] **API mobile** : endpoints optimisés mobile
- [ ] **Backup automatique** : sauvegarde programmée
- [ ] **Audit trail** : historique des modifications
- [ ] **Permissions granulaires** : rôles personnalisés

---

## 🤝 Contribution

Pour contribuer au projet :

1. **Fork** le repository
2. Créer une **branche feature** (`git checkout -b feature/ma-fonctionnalité`)
3. **Commiter** les changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. **Pousser** vers la branche (`git push origin feature/ma-fonctionnalité`)
5. Ouvrir une **Pull Request**

---

## � Dépannage Docker

---
**Accès aux services :**
- 🌐 **Frontend (React)** : http://localhost:3000
- 🔧 **Backend (Symfony API)** : http://localhost:8000
- 📊 **PhpMyAdmin** : http://localhost:8081
- 🗄️ **Base de données MySQL** : localhost:3307

---

*Développé avec ❤️ par SAIKOUZ TECH*
