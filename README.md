# Tempora - Plateforme E-commerce de Montres de Luxe

Tempora est une plateforme e-commerce complète dédiée aux montres de luxe, avec une interface frontend responsive construite en HTML, CSS et JavaScript, et un backend robuste alimenté par Node.js et Express avec une intégration de base de données MySQL via WAMP.

## Fonctionnalités

- Authentification des utilisateurs et gestion de compte
- Exploration des produits avec options de filtrage et de tri
- Pages de produits détaillées
- Panier d'achat avec gestion des stocks
- Fonctionnalité de favoris/liste de souhaits
- Navigation par catégories
- Design responsive pour tous les appareils

## Installation

### Prérequis

- WAMP Server (ou XAMPP, MAMP)
- Node.js (v14 ou supérieur)
- Git

### Étape 1 : Cloner le dépôt

```bash
git clone https://github.com/Dimi3grn/boutique.git
cd boutique
```

### Étape 2 : Configuration de la base de données avec WAMP

1. Démarrez votre serveur WAMP

2. Ouvrez phpMyAdmin en accédant à `http://localhost/phpmyadmin` dans votre navigateur

3. Connectez-vous avec vos identifiants (par défaut : utilisateur "root", mot de passe vide)

4. Créez une nouvelle base de données nommée "roberto"

5. Importez le fichier SQL :
   - Cliquez sur la base de données "roberto"
   - Cliquez sur l'onglet "Importer"
   - Sélectionnez le fichier "roberto.sql" fourni dans le projet
   - Cliquez sur "Exécuter"

### Étape 3 : Configuration du Backend

1. Naviguez vers le répertoire backend :

```bash
cd BACKEND
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez la connexion à la base de données :
   
   Modifiez le fichier `db.js` pour correspondre à vos identifiants WAMP :

```javascript
// BACKEND/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // Utilisateur par défaut de WAMP
  password: '',  // Mot de passe vide par défaut sur WAMP
  database: 'roberto',
  port: 3306     // Port par défaut MySQL de WAMP
});

module.exports = pool;
```

4. Configurez les tables d'authentification :

```bash
npm run setup-auth
```

5. Démarrez le serveur backend :

```bash
npm start
```

Le serveur devrait maintenant fonctionner sur `http://localhost:3000`.

### Étape 4 : Configuration du Frontend

Pour lancer le frontend, le moyen le plus simple est d'utiliser l'extension Live Server dans Visual Studio Code :

1. Ouvrez le dossier `FRONTEND` dans Visual Studio Code

2. Si vous n'avez pas encore l'extension Live Server, installez-la :
   - Cliquez sur l'icône des extensions dans la barre latérale (ou appuyez sur Ctrl+Shift+X)
   - Recherchez "Live Server"
   - Installez l'extension "Live Server" de Ritwick Dey

3. Une fois l'extension installée :
   - Naviguez vers le dossier `/pages`
   - Faites un clic droit sur le fichier `landing_page.html`
   - Sélectionnez "Open with Live Server"

Une fenêtre de navigateur s'ouvrira automatiquement et affichera la page d'accueil de l'application. Le serveur Live Server s'occupera de recharger automatiquement la page lorsque vous effectuez des modifications.

### Étape 5 : Accéder à l'application

Ouvrez votre navigateur et naviguez vers :

- Frontend : `http://127.0.0.1:5500/pages/landing_page.html`
- API Backend : `http://localhost:3000/api/watches` (pour tester si l'API fonctionne)

## Fichiers de Configuration

Si vous configurez le projet à partir de zéro, assurez-vous d'inclure ces fichiers de configuration importants :

1. **Configuration CORS** : Le backend est configuré pour accepter les requêtes de `http://127.0.0.1:5500`. Si vous utilisez un port différent, mettez à jour les paramètres CORS dans `BACKEND/app.js` :

```javascript
app.use(cors({ 
    origin: "http://127.0.0.1:5500",  // Mettez à jour si nécessaire
    credentials: true
}));
```

2. **Connexion à la base de données** : Assurez-vous que vos identifiants MySQL sont correctement définis dans `BACKEND/db.js`.

3. **Secret JWT** : Pour la sécurité dans un environnement de production, mettez à jour le secret JWT dans `BACKEND/controllers/auth.js` :

```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'votre-clé-secrète-personnalisée';
```

## Configuration Supplémentaire

### Images et ressources

L'application s'attend à ce que les images des produits se trouvent dans des répertoires spécifiques. Créez la structure de répertoire suivante dans le dossier `BACKEND/public` :

```
BACKEND/
└── public/
    └── static/
        └── images/
            └── watches/
                ├── daydate.jpg
                ├── daydate2.jpg
                ├── submariner.jpg
                └── ...
```

### Création d'un utilisateur administrateur

Pour créer un utilisateur administrateur pour gérer les produits et les commandes :

1. Inscrivez-vous en tant qu'utilisateur régulier via le frontend

2. Accédez à votre base de données via phpMyAdmin :
   - Ouvrez `http://localhost/phpmyadmin`
   - Cliquez sur la base de données "roberto"
   - Cliquez sur la table "users"
   - Trouvez votre utilisateur dans la liste
   - Cliquez sur "Éditer"
   - Modifiez la colonne "role" pour y mettre la valeur "admin"
   - Cliquez sur "Exécuter"

## Dépannage

Si vous rencontrez des problèmes pendant l'installation :

1. **Erreurs de connexion à la base de données** : 
   - Vérifiez si votre serveur WAMP est bien démarré (l'icône doit être verte dans la barre des tâches)
   - Vérifiez que les services MySQL et Apache sont actifs dans WAMP
   - Vérifiez les identifiants dans `db.js`
   - Assurez-vous que la base de données `roberto` existe dans phpMyAdmin

2. **Problèmes CORS** :
   - Vérifiez que le frontend fonctionne sur l'URL spécifiée dans la configuration CORS
   - Essayez d'utiliser un port différent pour le frontend si nécessaire

3. **Dépendances manquantes** :
   - Exécutez à nouveau `npm install` dans le répertoire backend
   - Vérifiez s'il y a des messages d'erreur pendant l'installation

4. **API ne fonctionne pas** :
   - Assurez-vous que le serveur backend est en cours d'exécution
   - Vérifiez la console pour les messages d'erreur
   - Vérifiez les routes API dans les fichiers backend
   - Vérifiez que le port 3000 n'est pas déjà utilisé par une autre application

5. **Problèmes WAMP spécifiques** :
   - Si vous avez une erreur "SQLSTATE[HY000] [1045]", vérifiez vos identifiants MySQL
   - Si vous avez une erreur "SQLSTATE[HY000] [2002]", vérifiez que le service MySQL est bien démarré
   - Si WAMP affiche une icône orange ou rouge, cliquez dessus pour voir les erreurs

Pour tout autre problème, consultez la console du navigateur et les journaux du serveur pour des messages d'erreur détaillés.
