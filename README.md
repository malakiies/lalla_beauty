# 🌸 Lalla Beauty E-Commerce

Une plateforme e-commerce premium de niveau startup dédiée à l'art de la beauté marocaine. 
Ce projet a été entièrement repensé pour offrir une expérience utilisateur haut de gamme, moderne et fluide, s'inspirant des leaders de l'industrie (Sephora, Rare Beauty).

## ✨ Fonctionnalités Principales

- **Design Premium & Minimaliste** : Interface "Glassmorphism", micro-animations (Framer Motion), et typographie soignée (Playfair Display & Inter).
- **Lalla AI - Assistante Beauté Intégrée** : Un chatbot intelligent propulsé par OpenAI capable de recommander des produits du catalogue et de donner des conseils skincare.
- **Tableau de Bord Administrateur** : Gestion complète des produits, commandes, catégories et utilisateurs, avec statistiques détaillées (Recharts).
- **Catalogue & Recherche Intelligente** : Navigation fluide, filtres, et fiches produits élégantes.
- **Panier & Paiement** : Expérience d'achat sans friction.
- **Base de données robuste** : MongoDB avec intégration Cloudinary pour le stockage des images.

## 🛠️ Technologies Utilisées

**Frontend :**
- React 19 / Vite
- Bootstrap 5 (Customisé avec des CSS Variables pour un look Premium)
- Framer Motion (Animations fluides)
- Recharts (Data visualisation Dashboard Admin)

**Backend :**
- Node.js & Express
- MongoDB (Mongoose)
- OpenAI API (OpenRouter) pour le Chatbot IA
- Cloudinary (Stockage des images produits)
- JWT (Authentification sécurisée)

## 🚀 Installation & Démarrage

### Prérequis
- Node.js (v18+)
- Compte MongoDB (Atlas ou local)
- Clés API pour Cloudinary, OpenAI (OpenRouter), et JWT Secret.

### Configuration du Backend
1. Naviguer vers le dossier backend : `cd backend`
2. Installer les dépendances : `npm install`
3. Créer un fichier `.env` à la racine du dossier `backend` et y ajouter vos clés (voir `.env.example` si existant).
4. Démarrer le serveur en mode dev : `npm run dev`

### Configuration du Frontend
1. Naviguer vers le dossier frontend : `cd frontend`
2. Installer les dépendances : `npm install`
3. Lancer l'application Vue/React : `npm run dev`

---
*Créé avec passion pour sublimer la beauté naturelle.* ✨

## 🔐 Accès Administrateur (Admin)

Voici les identifiants de l'administrateur par défaut pour vous connecter au tableau de bord (Dashboard) de votre site :
- **Email :** `admin@lallabeauty.ma`
- **Mot de passe :** `password123`
