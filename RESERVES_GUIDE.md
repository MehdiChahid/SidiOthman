# 📋 Guide du Système de Gestion des Réserves

## 🎯 Vue d'ensemble

Le système de gestion des réserves permet aux clients de **signaler facilement des problèmes** dans leur appartement avec photos et de **suivre leur résolution** en temps réel.

## ✨ Fonctionnalités Principales

### 🏠 Page d'Accueil (Dashboard)

L'accueil propose deux actions principales avec de **grandes cartes visuelles** :

#### ➕ Créer une Réserve
- **Grande carte verte** avec icône et flèche
- Accès direct au formulaire de création
- Animation au survol pour faciliter le clic

#### 📋 Mes Réserves
- **Grande carte bleue** avec icône et flèche
- Vue d'ensemble de toutes les réserves créées
- Suivi de l'état de chaque réserve

### ➕ Création d'une Réserve

Interface **simple et guidée** en une seule page :

#### 1️⃣ Informations de l'Appartement
- Affichage automatique :
  - 🏗️ Projet
  - 📍 Secteur
  - 🏢 Immeuble
  - 🏠 Appartement (numéro et étage)

#### 2️⃣ Détails de la Réserve

**Titre** ✏️
- Champ texte large
- Exemple: "Fissure dans le mur du salon"
- **Obligatoire**

**Catégorie** 🏷️
- Sélection visuelle par cartes :
  - 🔧 Plomberie
  - ⚡ Électricité
  - 🎨 Peinture
  - 🪟 Menuiserie
  - 🏺 Carrelage
  - 📦 Autre
- **Obligatoire**

**Priorité** ⚡
- 3 niveaux visuels avec icônes :
  - 🟢 **Basse** - Pas urgent
  - 🟡 **Moyenne** - À traiter (par défaut)
  - 🔴 **Haute** - Urgent
- **Obligatoire**

**Description** 📄
- Zone de texte grande
- Détails complémentaires
- Optionnel

**Photos** 📸
- Upload multiple de photos
- Formats acceptés: JPEG, PNG, GIF
- Taille max: 10 MB par photo
- Aperçu immédiat des photos
- Possibilité de retirer une photo avant envoi
- **Zone de dépôt** avec bordures en pointillés
- Optionnel mais recommandé

#### 3️⃣ Validation
- Bouton **"Créer la réserve"** (vert, large)
- Bouton **"Annuler"** (gris)
- Validation automatique des champs obligatoires
- Indication visuelle de progression pendant l'upload

### 📋 Liste des Réserves

Interface de **consultation simple** :

#### Affichage des Réserves
Chaque réserve est présentée dans une **grande carte** avec :

**En-tête**
- 📝 Titre en grand et gras
- 🔴🟡🟢 Badge de priorité avec icône et couleur
- 📊 Statut actuel (badge coloré)

**Informations**
- 🏷️ Catégorie
- 🏠 Numéro d'appartement et étage
- 📅 Date de création
- 📄 Description (si présente)

**Photos**
- 📸 Miniatures des 4 premières photos
- Indicateur du nombre total de photos
- Badge "+X" si plus de 4 photos

**Actions**
- Bouton **"Voir les détails"** (bleu, en bas à droite)

#### État Vide
Si aucune réserve :
- 📋 Grande icône
- Message encourageant
- Bouton **"Créer ma première réserve"**

### 🔍 Détails d'une Réserve

Page de **consultation complète** :

#### En-tête
- Titre de la réserve
- Badges de priorité et statut

#### Sections

**📍 Localisation**
- 4 cartes colorées :
  - Projet (bleu)
  - Secteur (vert)
  - Immeuble (violet)
  - Appartement (orange)

**📋 Détails**
- Catégorie avec icône
- Date de création
- Description complète

**📸 Photos**
- Galerie de toutes les photos
- Grille responsive (2/3/4 colonnes)
- Clic pour agrandir
- Modal plein écran pour visualisation
- Fermeture par clic ou bouton X

**📊 Suivi**
- Statut actuel
- Description du suivi
- Date de dernière mise à jour

## 🎨 Design et UX

### Principes de Design

1. **Simplicité Maximale**
   - Une action = un grand bouton
   - Icônes emojis universelles
   - Textes en français simple

2. **Visibilité**
   - Grandes cartes cliquables
   - Couleurs vives et contrastées
   - Boutons larges (facile à cliquer)

3. **Guidage**
   - Étapes claires
   - Validation en temps réel
   - Messages d'erreur explicites

4. **Feedback Visuel**
   - Animations au survol
   - États clairs (sélectionné/non sélectionné)
   - Spinners de chargement

### Palette de Couleurs

**Priorités**
- 🟢 Basse : Vert (#10B981)
- 🟡 Moyenne : Jaune/Orange (#F59E0B)
- 🔴 Haute : Rouge (#EF4444)

**Actions**
- Créer : Vert dégradé (#10B981 → #059669)
- Consulter : Bleu (#3B82F6)
- Annuler : Gris (#6B7280)

**Statuts**
- En attente : Orange
- En cours : Bleu
- Résolue : Vert
- Rejetée : Rouge

### Responsive Design

**Mobile (< 768px)**
- Cartes empilées verticalement
- 2 colonnes pour photos
- Boutons pleine largeur

**Tablette (768px - 1024px)**
- 2 colonnes pour cartes
- 3 colonnes pour photos

**Desktop (> 1024px)**
- 2 colonnes pour grandes cartes
- 4 colonnes pour photos
- Espacement généreux

## 🔧 Architecture Technique

### Base de Données

#### Table `reserves`
```
- id
- appartement_id (FK)
- immeuble_id (FK)
- secteur_id (FK)
- projet_id (FK)
- user_id (FK)
- title (string)
- description (text, nullable)
- categor_id (FK)
- priority (enum: basse, moyenne, haute)
- fichie_id (FK)
- reported_at (date)
- closed_at (date, nullable)
```

#### Table `fichies`
```
- id
- user_id (FK, nullable)
```

#### Table `fichierdetails`
```
- id
- fichie_id (FK)
- nom_fichier (string)
- nom_stockage (string, unique)
- chemin_complet (string)
- taille_octets (bigInteger)
- type_mime (string)
- extension (string)
- uploadeur_id (FK users)
- statut_id (FK)
- description (text, nullable)
- storage_public (boolean)
```

#### Table `suivis`
```
- id
- date (date)
- statut_id (FK)
- description (text, nullable)
- fichie_id (FK)
```

#### Table `categors`
```
- id
- name (string)
- description (text, nullable)
```

#### Table `statuts`
```
- id
- name (string)
```

### Routes

```php
Route::middleware('auth')->group(function () {
    Route::resource('reserves', ReserveController::class);
});
```

**URLs générées :**
- GET `/reserves` - Liste des réserves (index)
- GET `/reserves/create` - Formulaire de création (create)
- POST `/reserves` - Enregistrement (store)
- GET `/reserves/{id}` - Détails (show)
- GET `/reserves/{id}/edit` - Formulaire d'édition (edit)
- PUT/PATCH `/reserves/{id}` - Mise à jour (update)
- DELETE `/reserves/{id}` - Suppression (destroy)

### Contrôleur

**ReserveController.php**
- `index()` - Liste des réserves de l'utilisateur
- `create()` - Affiche le formulaire avec catégories
- `store()` - Gère l'upload photos + création réserve + suivi
- `show()` - Affiche les détails avec photos
- `destroy()` - Supprime réserve et photos

### Modèles et Relations

**Reserve**
- belongsTo: User, Appartement, Immeuble, Secteur, Projet, Suivi, Categor, Fichie

**Fichie**
- hasMany: Fichierdetails, Reserves, Suivis
- belongsTo: User

**Fichierdetail**
- belongsTo: Fichie, User (uploadeur), Statut

**Suivi**
- belongsTo: Statut, Fichie
- hasMany: Reserves

**Categor**
- hasMany: Reserves

## 📦 Stockage des Photos

### Configuration
- **Disk**: `public`
- **Dossier**: `storage/app/public/reserves/`
- **Accès public**: Via lien symbolique `public/storage/`

### Process d'Upload
1. Validation du fichier (type, taille)
2. Génération UUID pour nom unique
3. Stockage dans `reserves/`
4. Création enregistrement `fichierdetail`
5. Association au `fichie` de la réserve

### Affichage
```html
<img src="/storage/reserves/{nom_stockage}" />
```

## 📊 Données de Test

### Catégories Créées
1. 🔧 **Plomberie** - Fuites, robinetterie
2. ⚡ **Électricité** - Prises, éclairage
3. 🎨 **Peinture** - Défauts, fissures
4. 🪟 **Menuiserie** - Portes, fenêtres
5. 🏺 **Carrelage** - Cassé, mal posé
6. 📦 **Autre** - Autres problèmes

### Statuts Créés
1. 🟠 En attente
2. 🔵 En cours de traitement
3. 🔵 En cours de réparation
4. 🟢 Résolue
5. 🔴 Rejetée
6. ⚫ Annulée

## 🚀 Installation et Utilisation

### 1. Générer les données de test
```bash
php artisan db:seed --class=CompleteTestDataSeeder
```

### 2. Créer le lien symbolique pour les photos
```bash
php artisan storage:link
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

### 5. Se connecter
1. Créer un compte via `/register`
2. Compléter l'inscription en 5 étapes
3. Accéder au dashboard

## 💡 Guide d'Utilisation pour les Clients

### Créer une Réserve

1. **Accéder au Dashboard**
   - Cliquer sur la grande carte verte **"Créer une Réserve"**

2. **Remplir le Formulaire**
   - Entrer un titre clair
   - Choisir la catégorie qui correspond
   - Sélectionner la priorité
   - Ajouter une description (optionnel)
   - Ajouter des photos (optionnel mais recommandé)

3. **Valider**
   - Cliquer sur **"Créer la réserve"**
   - Attendre la confirmation

### Consulter mes Réserves

1. **Accéder à la Liste**
   - Dashboard → Carte bleue **"Mes Réserves"**
   - Ou menu → **Mes Réserves**

2. **Voir les Détails**
   - Cliquer sur **"Voir les détails"** sur une réserve
   - Consulter toutes les informations
   - Voir les photos en grand (clic sur miniature)

### Suivre l'État

- Le **badge coloré** en haut à droite indique l'état
- Section **"Suivi"** affiche les dernières informations
- Les techniciens mettront à jour le statut

## 🎯 Bonnes Pratiques

### Pour les Clients

**Photos**
- Prendre plusieurs photos sous différents angles
- Bien éclairer la zone
- Montrer l'ensemble ET le détail

**Description**
- Être précis sur la localisation (quelle pièce)
- Indiquer depuis quand le problème existe
- Mentionner les éventuelles conséquences

**Priorité**
- 🔴 **Haute** : Fuite d'eau, problème électrique dangereux
- 🟡 **Moyenne** : Gêne quotidienne, à réparer bientôt
- 🟢 **Basse** : Problème esthétique, pas urgent

### Pour les Techniciens (à venir)

- Mettre à jour le statut régulièrement
- Ajouter des commentaires pour informer le client
- Marquer comme "Résolue" une fois terminé

## 🔒 Sécurité

- ✅ Authentification requise pour toutes les actions
- ✅ Un utilisateur ne voit QUE ses propres réserves
- ✅ Vérification de propriété avant affichage/modification
- ✅ Validation des fichiers uploadés (type, taille)
- ✅ Noms de fichiers uniques (UUID) pour éviter les conflits
- ✅ Protection CSRF automatique (Laravel)

## 📱 Compatibilité

**Navigateurs**
- ✅ Chrome / Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (non supporté)

**Appareils**
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablettes (iOS, Android)
- ✅ Smartphones (iOS, Android)

## 🆘 Dépannage

### Les photos ne s'affichent pas
**Solution** : Vérifier que le lien symbolique existe
```bash
php artisan storage:link
```

### Erreur lors de l'upload
**Solutions** :
- Vérifier la taille du fichier (max 10MB)
- Vérifier le format (JPEG, PNG, GIF uniquement)
- Vérifier les permissions du dossier `storage/`

### La réserve ne se crée pas
**Solutions** :
- Vérifier que tous les champs obligatoires sont remplis
- Consulter la console du navigateur (F12)
- Vérifier les logs Laravel : `storage/logs/laravel.log`

## 📈 Statistiques (À venir)

Fonctionnalités prévues :
- Nombre total de réserves
- Répartition par catégorie
- Temps moyen de résolution
- Taux de satisfaction

---

**Version** : 1.0  
**Date** : 19 Janvier 2026  
**Auteur** : Système de Gestion de Réserves - Sidi Othman

