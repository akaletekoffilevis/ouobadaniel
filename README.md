# Impact Création — Portfolio de Ouoba Lamourdjoa Daniel

Portfolio bilingue (FR/EN) pour **Ouoba Lamourdjoa Daniel** — Graphiste · Designer · Formateur en infographie — fondateur d'**Impact Création** (Niamey, Niger).

Stack : **Next.js 16 (App Router) + Supabase** (base de données Postgres + stockage des images), déployable sur **Vercel**.

## Fonctionnalités

- Site vitrine une page : Accueil, À propos, Services, Formations, Portfolio, Contact
- Bascule **Français / Anglais** (mémorisée)
- Galerie qui **adapte chaque image à son format** (aucune découpe) + lightbox
- **Dashboard admin** (`/admin`) :
  - Ajouter / supprimer des œuvres (upload image → Supabase Storage)
  - Modifier les coordonnées (WhatsApp, téléphone, email, localisation)
  - Changer le mot de passe
- Contact direct via **WhatsApp** (+227 74 82 64 86) et formulaire « message rapide »

## Installation

```bash
npm install
```

### 1. Créer le projet Supabase

1. https://supabase.com → **New project** (région proche : Paris / Frankfurt)
2. **SQL Editor** → coller le contenu de `supabase/schema.sql` → **Run**
3. **Storage → New bucket** : nom `works`, **Public** activé

### 2. Fichier de configuration

```bash
cp .env.example .env.local
```

Renseignez dans `.env.local` :
- `SUPABASE_URL` → Project Settings → **API** → Project URL
- `SUPABASE_SERVICE_ROLE_KEY` → Project Settings → **API** → service_role (jamais exposer cette clé publiquement)
- `AUTH_SECRET` → générez-en une : `openssl rand -base64 32`

### 3. Importer les œuvres existantes (optionnel)

Le dossier `works-source/` contient les créations à importer :

```bash
npm run seed
```

Le script upload les images vers Supabase Storage et remplit la table `works` et les coordonnées par défaut.

> 🔑 **Mot de passe admin par défaut : `impact2026`** — changez-le dès la première connexion dans `/admin`.

## Développement

```bash
npm run dev
```

- Site : http://localhost:3000
- Dashboard : http://localhost:3000/admin

## Déploiement sur Vercel

1. Poussez le projet sur **GitHub** (`git init && git add . && git commit -m "init"` puis créez un dépôt)
2. https://vercel.com → **Add New Project** → importez le dépôt
3. Dans les **Environment Variables** du projet, ajoutez :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_SECRET`
4. **Deploy** → c'est en ligne.

## Structure

```
app/
  page.tsx               # Site public
  admin/page.tsx         # Dashboard admin
  api/
    public/              # GET données publiques (œuvres + coordonnées)
    login/               # POST connexion / DELETE déconnexion
    admin/works/         # GET list / POST ajout (upload)
    admin/works/[id]/    # DELETE suppression
    admin/settings/      # GET/PUT coordonnées + mot de passe
components/              # Navbar, Hero, About, Services, Training, Gallery, Contact, Footer
lib/                     # supabase, auth (HMAC + scrypt), i18n FR/EN
supabase/schema.sql      # Schéma de la base
scripts/seed.mjs         # Import des œuvres + coordonnées
```

## Sécurité

- Les clés Supabase ne sont utilisées que côté serveur (Route Handlers).
- Les sessions admin sont des tokens signés (HMAC) en cookie `httpOnly`.
- Les mots de passe sont hachés en **scrypt** avec sel.
