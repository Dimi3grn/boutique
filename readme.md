# Tempora - Boutique de Montres en Ligne

Tempora est une boutique en ligne de montres de luxe, avec une interface utilisateur moderne et un backend robuste pour gérer les produits, les utilisateurs, les favoris et le panier d'achat.

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation et démarrage](#installation-et-démarrage)
- [Fonctionnalités](#fonctionnalités)
- [Captures d'écran](#captures-décran)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🔍 Aperçu du projet

Tempora est une application e-commerce full-stack qui permet aux utilisateurs de parcourir une collection de montres de luxe, de créer un compte, d'ajouter des produits à leurs favoris et à leur panier, et de passer des commandes. L'application dispose d'un système de gestion des stocks en temps réel, d'un système d'authentification sécurisé, et d'une interface utilisateur responsive.

## 💻 Technologies utilisées

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design
- Gestion des états client avec localStorage

### Backend
- Node.js
- Express.js
- MySQL (via mysql2)
- JWT pour l'authentification
- Bcrypt pour le hachage des mots de passe
- CORS pour la sécurité des requêtes cross-origin

## 📂 Structure du projet

Le projet est divisé en deux dossiers principaux :

- **FRONTEND** : Contient tous les fichiers client (HTML, CSS, JS, assets)
- **BACKEND** : Contient le serveur Node.js, les API routes, les controllers et la base de données

## 🚀 Installation et démarrage

Suivez ces étapes pour installer et lancer le projet sur un nouveau PC après avoir cloné le repo.

### Prérequis

- Node.js (v14+ recommandé)
- MySQL Server
- Git

### Étape 1 : Cloner le dépôt

```bash
git clone https://github.com/votre-username/tempora.git
cd tempora
```

### Étape 2 : Configurer la base de données MySQL

1. Créez une nouvelle base de données MySQL nommée `roberto` :

```sql
CREATE DATABASE roberto;
```

2. Importez la structure de la base de données à partir du fichier SQL fourni :

```bash
mysql -u root -p roberto < roberto.sql
```

Si vous rencontrez des problèmes avec l'importation, vous pouvez ouvrir le fichier SQL dans un client MySQL comme phpMyAdmin et exécuter les requêtes.

### Étape 3 : Configurer le backend

1. Naviguez vers le dossier backend :

```bash
cd BACKEND
```

2. Installez les dépendances :

```bash
npm install
```

3. Si nécessaire, modifiez les informations de connexion à la base de données dans le fichier `db.js` pour correspondre à votre configuration locale :

```javascript
// BACKEND/db.js
const mysql = require('mysql2/promise');

// Modifiez ces informations selon votre configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // Remplacez par votre nom d'utilisateur MySQL si différent
  password: '',  // Remplacez par votre mot de passe MySQL
  database: 'roberto'
});

module.exports = pool;
```

4. Configurez les tables d'authentification et de panier :

```bash
npm run setup-auth
```

5. Démarrez le serveur backend :

```bash
npm start
```

Le serveur backend devrait maintenant être en cours d'exécution sur http://localhost:3000.

### Étape 4 : Servir le frontend

Pour servir le frontend, vous pouvez utiliser n'importe quel serveur HTTP statique. Voici quelques options :

#### Option 1 : Utiliser Live Server dans VS Code

1. Installez l'extension Live Server dans VS Code.
2. Ouvrez le dossier `FRONTEND` dans VS Code.
3. Cliquez avec le bouton droit sur le fichier `pages/landing_page.html` et sélectionnez "Open with Live Server".

#### Option 2 : Utiliser un serveur HTTP simple

1. Installez http-server globalement :

```bash
npm install -g http-server
```

2. Naviguez vers le dossier FRONTEND :

```bash
cd FRONTEND
```

3. Démarrez le serveur :

```bash
http-server -p 5500
```

4. Accédez à http://localhost:5500/pages/landing_page.html dans votre navigateur.

### Étape 5 : Tester l'application

Votre application devrait maintenant être accessible sur :
- Frontend : http://localhost:5500/pages/landing_page.html (ou l'URL fournie par Live Server)
- Backend API : http://localhost:3000

Assurez-vous que les deux serveurs (backend et frontend) fonctionnent en même temps pour que l'application fonctionne correctement.

## Création d'un compte utilisateur

1. Accédez à la page d'inscription : http://localhost:5500/pages/register.html
2. Créez un compte avec un nom d'utilisateur, un email et un mot de passe
3. Connectez-vous avec vos identifiants

## Résolution des problèmes courants

### Problème de connexion à la base de données

Si vous rencontrez des erreurs liées à la connexion à la base de données :

1. Vérifiez que votre serveur MySQL est en cours d'exécution
2. Vérifiez les informations de connexion dans `BACKEND/db.js`
3. Assurez-vous que la base de données `roberto` a été créée

### Erreurs CORS

Si vous rencontrez des erreurs CORS :

1. Vérifiez que le backend est bien configuré pour accepter les requêtes de votre frontend :

```javascript
// Dans BACKEND/app.js
app.use(cors({ 
    origin: "http://127.0.0.1:5500",  // Assurez-vous que cette URL correspond à celle de votre frontend
    credentials: true
}));
```

2. Ajustez l'URL pour qu'elle corresponde à l'adresse exacte de votre frontend.

### Problèmes d'authentification

Si vous rencontrez des problèmes avec l'authentification :

1. Vérifiez que les tables d'utilisateurs sont correctement créées
2. Vérifiez que le secret JWT est correctement configuré

## 🌟 Fonctionnalités

- Navigation par catégories de montres
- Filtrage et tri des produits
- Gestion utilisateur (inscription, connexion, profil)
- Liste de favoris
- Panier d'achat avec gestion des stocks
- Interface responsive adaptée à tous les appareils

## 🖼️ Captures d'écran

*Insérez ici des captures d'écran de votre application*

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment vous pouvez contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Pushez sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Distribuez sous licence MIT. Voir `LICENSE` pour plus d'informations.
