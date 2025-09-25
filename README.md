# Gestion Stock App

## Lancer le projet avec Docker

```bash
docker-compose up --build
```

## Accès aux services dans le navigateur

- **Frontend (React/Vite)** : [http://localhost:3000](http://localhost:3000)
- **Backend (Symfony/PHP)** : [http://localhost:8080](http://localhost:8000)
- **phpMyAdmin** : [http://localhost:8081](http://localhost:8081)

## Accès base de données
- Host : `db`
- Port : `3306`
- Utilisateur : `user`
- Mot de passe : `password`
- Base : `gestion_stock`

---

Modifiez les ports dans `docker-compose.yml` si besoin.
