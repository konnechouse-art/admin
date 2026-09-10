# Konnect House — Admin

Back-office administrateur (Next.js).

Dossier local : `admin` · API : projet `nest`.

## Fonctions

- Connexion email/mot de passe (**ADMIN** uniquement)
- Tableau de bord (biens, users, réservations, revenus, commissions)
- Validation / publication / masquage des biens
- Activation / suspension / ban des fournisseurs et clients
- Liste des réservations et paiements

## Démarrage

```bash
cp .env.example .env.local
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_API_URL` doit pointer vers l’API Nest (Railway).

Sur l’API, ajoute `http://localhost:3000` dans `CORS_ORIGINS`.
