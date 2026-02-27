# Guide du Système d'Inscription en Plusieurs Étapes

## 📋 Vue d'ensemble

Le nouveau système d'inscription permet aux clients de s'enregistrer facilement en suivant un processus guidé en **5 étapes simples**, conçu spécialement pour les utilisateurs qui ne maîtrisent pas bien la technologie.

## ✨ Caractéristiques principales

### Interface Simplifiée
- **Grandes icônes** visuelles pour chaque étape
- **Couleurs vives** et contrastes élevés pour une meilleure visibilité
- **Boutons larges** et faciles à cliquer
- **Textes clairs** et en français
- **Indicateur de progression** visuel en haut de page

### Les 5 Étapes d'Inscription

#### 📝 Étape 1 : Informations Personnelles
- **Icône** : 👤
- **Champs** :
  - Nom complet
  - Adresse email
  - Mot de passe
  - Confirmation du mot de passe
- **Couleur** : Bleu

#### 🏗️ Étape 2 : Choix du Projet
- **Icône** : 🏗️
- **Affichage** : Grandes cartes cliquables avec nom, description et localisation
- **Navigation** : Sélection visuelle avec icône de validation
- **Couleur** : Bleu

#### 📍 Étape 3 : Choix du Secteur
- **Icône** : 📍
- **Affichage** : Cartes par secteur du projet sélectionné
- **Information** : Nom et description du secteur
- **Couleur** : Vert

#### 🏢 Étape 4 : Choix de l'Immeuble
- **Icône** : 🏢
- **Affichage** : Grille d'immeubles disponibles
- **Information** : Nom de l'immeuble
- **Couleur** : Violet

#### 🏠 Étape 5 : Choix de l'Appartement
- **Icône** : 🏠
- **Affichage** : Grille d'appartements disponibles
- **Information** : Numéro d'appartement et étage
- **Couleur** : Orange
- **Finalisation** : Bouton vert "Terminer l'inscription"

## 🎨 Design UX/UI

### Principes de Design
1. **Simplicité** : Une seule question à la fois
2. **Visibilité** : Grandes icônes et textes lisibles
3. **Guidage** : Indicateur de progression et navigation claire
4. **Feedback** : États visuels (sélectionné, hover, disabled)
5. **Accessibilité** : Couleurs contrastées et boutons larges

### Éléments Visuels
- **Animations** : Transitions douces entre les étapes
- **Spinner** : Indicateur de chargement pendant la récupération des données
- **États** :
  - ✓ Complété (vert avec icône)
  - ● En cours (bleu avec anneau pulsant)
  - ○ À faire (gris)

### Navigation
- **Bouton "Précédent"** : Retour à l'étape précédente (gris)
- **Bouton "Suivant"** : Passage à l'étape suivante (bleu)
- **Bouton "Terminer"** : Finalisation de l'inscription (vert)
- **Désactivation** : Les boutons sont désactivés si les champs requis ne sont pas remplis

## 🔧 Implémentation Technique

### Backend (Laravel)

#### Migrations
```php
// 2026_01_19_165518_add_project_selection_to_users_table.php
- projet_id (nullable, foreign key)
- secteur_id (nullable, foreign key)
- immeuble_id (nullable, foreign key)
- appartement_id (nullable, foreign key)
- registration_completed (boolean)
```

#### API Routes
- `GET /api/registration/projets` - Liste des projets actifs
- `GET /api/registration/secteurs?projet_id=X` - Secteurs d'un projet
- `GET /api/registration/immeubles?secteur_id=X` - Immeubles d'un secteur
- `GET /api/registration/appartements?immeuble_id=X` - Appartements disponibles

#### Modèles avec Relations
- **User** → appartient à Projet, Secteur, Immeuble, Appartement
- **Projet** → a plusieurs Secteurs et Users
- **Secteur** → appartient à Projet, a plusieurs Immeubles et Users
- **Immeuble** → appartient à Secteur, a plusieurs Appartements et Users
- **Appartement** → appartient à Immeuble, a plusieurs Users

### Frontend (React/Inertia.js)

#### Composants
1. **StepIndicator.jsx** : Affiche la progression et les étapes
2. **Register.jsx** : Composant principal avec gestion des états

#### Gestion d'État
- `currentStep` : Étape actuelle (1-5)
- `projets/secteurs/immeubles/appartements` : Données chargées dynamiquement
- `loading` : État de chargement
- `data` : Formulaire Inertia avec tous les champs

#### Chargement Dynamique
- Les données sont chargées au moment où l'utilisateur atteint chaque étape
- Reset automatique des sélections suivantes quand on change une sélection précédente
- Gestion des états vides avec messages appropriés

## 📊 Données de Test

Utilisez le seeder pour créer des données de test :

```bash
php artisan db:seed --class=CompleteTestDataSeeder
```

### Données Créées
- **2 projets** : Résidence Al Majd, Les Jardins de Sidi Othman
- **4 secteurs** par projet
- **2-3 immeubles** par secteur
- **20 appartements** par immeuble (5 étages × 4 appartements)

### Compte Admin
- **Email** : admin@test.com
- **Mot de passe** : password

## 🚀 Installation et Configuration

### 1. Exécuter les migrations
```bash
php artisan migrate
```

### 2. Générer les données de test
```bash
php artisan db:seed --class=CompleteTestDataSeeder
```

### 3. Compiler les assets
```bash
npm run build
# ou pour le développement
npm run dev
```

### 4. Démarrer le serveur
```bash
php artisan serve
```

### 5. Accéder à l'inscription
Ouvrez votre navigateur : `http://localhost:8000/register`

## 📱 Responsive Design

L'interface s'adapte à toutes les tailles d'écran :
- **Mobile** : Cartes empilées verticalement
- **Tablette** : Grille de 2 colonnes
- **Desktop** : Grille de 3-4 colonnes pour les appartements

## 🎯 Recommandations pour les Utilisateurs

### Pour une expérience optimale
1. Utiliser un **grand écran** si possible
2. **Prendre son temps** à chaque étape
3. Lire les **descriptions** des projets/secteurs
4. Vérifier la **sélection** avant de passer à l'étape suivante
5. Utiliser le bouton **"Précédent"** pour revenir en arrière si nécessaire

### Messages d'Aide
- Spinners de chargement avec texte explicatif
- Messages quand aucune donnée n'est disponible
- Validation en temps réel des champs obligatoires
- Désactivation visuelle des boutons quand l'action n'est pas possible

## 🔐 Sécurité

- Validation côté serveur de tous les champs
- Vérification de l'existence des IDs (foreign keys)
- Protection CSRF par défaut avec Laravel
- Hashage des mots de passe
- Validation des emails

## 📈 Améliorations Futures

Suggestions pour enrichir le système :
1. Ajout de photos pour chaque projet/secteur/immeuble
2. Vue 3D ou plan des appartements
3. Filtres par prix/surface
4. Système de réservation temporaire
5. Notification par email à chaque étape
6. Sauvegarde du progrès (inscription partielle)
7. Support multilingue (Arabe, Français, Anglais)

## 🐛 Dépannage

### Problème : Les projets ne s'affichent pas
**Solution** : Vérifier que le seeder a été exécuté et que la base de données contient des données

### Problème : Erreur lors du chargement
**Solution** : Vérifier la console du navigateur et les logs Laravel (`storage/logs/laravel.log`)

### Problème : Interface pas à jour
**Solution** : Recompiler les assets avec `npm run build` ou `npm run dev`

## 📞 Support

Pour toute question ou problème, consultez :
- La documentation Laravel : https://laravel.com/docs
- La documentation Inertia.js : https://inertiajs.com
- La documentation React : https://react.dev

---

**Créé le** : 19 Janvier 2026  
**Version** : 1.0  
**Auteur** : Système de Gestion de Réserves - Sidi Othman

