# Headless Paystack

## English

### Introduction
Headless Paystack is an open-source project designed to provide a seamless integration with the Paystack payment gateway. This project allows developers to easily integrate Paystack's payment processing capabilities into their applications without relying on a specific frontend framework.

### Features
- Customizable payment page
- Easy integration with Paystack API [coming soon]
- Easier, Secure and reliable payment processing
- Detailed documentation and examples

### Installation
To install Headless Paystack, follow these steps:
1. Clone the repository: `git clone https://github.com/yourusername/headless-paystack.git`
2. Navigate to the project directory: `cd headless-paystack`
3. Install dependencies: `npm install`

### Docker Deployment
To deploy Headless Paystack using Docker, follow these steps:
1. Rename the `.env.example` file to `.env`
2. Replace the default values with the appropriate values
3. Build the Docker image: `docker build -t headless-paystack .`
4. Run the Docker container: `docker run -p 3006:3006 --env-file .env headless-paystack`
5. Connect to your domain

Make sure to create a `.env` file based on the `env.example` file provided in the repository. This file should contain all the necessary environment variables required for the application to run.

Make sure to replace `3006` with the appropriate port number if necessary. The application should now be accessible at `http://localhost:3006`.

### Usage
To use Headless Paystack in your project : 
1. Create your paystack account
2. Generate payment link by API or by payment page
3. Include the payment page url in query parameters, you can include default phone number and callback url like the example below.
4. Give this link to your customer, you can use url shortener like bit.ly

### Example
Here is an example link to a custom payment page: [Payment Page](https://127.0.0.1:3006/payment?paymentLink=https://checkout.paystack.com/cjtaxuro8dvb7ue&phoneNumber=0700000000)

### Contributing
We welcome contributions from the community! If you would like to contribute, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

### License
This project is licensed under the MIT License. See the LICENSE file for more details.

### Note
This project includes a scraper to bypass the default Paystack payment page, allowing for a more customized payment experience. Use this feature responsibly and ensure compliance with Paystack's terms of service.

## Français

### Introduction
Headless Paystack est un projet open-source conçu pour fournir une intégration transparente avec la passerelle de paiement Paystack. Ce projet permet aux développeurs d'intégrer facilement les capacités de traitement des paiements de Paystack dans leurs applications sans dépendre d'un framework frontend spécifique.

### Fonctionnalités
- Page de paiement personnalisable
- Intégration facile avec l'API Paystack [bientôt disponible]
- Traitement des paiements plus facile, sécurisé et fiable
- Documentation détaillée et exemples

### Installation
Pour installer Headless Paystack, suivez ces étapes :
1. Clonez le dépôt : `git clone https://github.com/yourusername/headless-paystack.git`
2. Accédez au répertoire du projet : `cd headless-paystack`
3. Installez les dépendances : `npm install`

### Déploiement Docker
Pour déployer Headless Paystack en utilisant Docker, suivez ces étapes :
1. Renommer le fichier `.env.example` en `.env`
2. Remplacez les valeurs par défaut par les valeurs appropriées
3. Construisez l'image Docker : `docker build -t headless-paystack .`
4. Exécutez le conteneur Docker : `docker run -p 3006:3006 --env-file .env headless-paystack`
5. Connectez à votre domaine

Assurez-vous de créer un fichier `.env` basé sur le fichier `env.example` fourni dans le dépôt. Ce fichier doit contenir toutes les variables d'environnement nécessaires au fonctionnement de l'application.

Assurez-vous de remplacer `3006` par le numéro de port approprié si nécessaire. L'application devrait maintenant être accessible à `http://localhost:3006`.

### Utilisation
Pour utiliser Headless Paystack dans votre projet:
1. Créez votre compte paystack
2. Générez le lien de paiement en utilisant l'API ou une page de paiement depuis le tableau de bord
3. Incluez l'URL de la page de paiement Paystack dans les paramètres de requête, vous pouvez inclure le numéro de téléphone par défaut comme l'exemple ci-dessous.
4. Donnez ce lien à votre client, vous pouvez utiliser un raccourci d'URL comme bit.ly

### Exemple
Voici un exemple de lien vers une page de paiement personnalisée : [Page de Paiement](https://127.0.0.1:3006/payment?paymentLink=https://checkout.paystack.com/cjtaxuro8dvb7ue&phoneNumber=0700000000)

### Contribuer
Nous accueillons les contributions de la communauté ! Si vous souhaitez contribuer, veuillez forker le dépôt et soumettre une pull request. Pour les changements majeurs, veuillez ouvrir d'abord une issue pour discuter de ce que vous souhaitez changer.

### Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

### Remarque
Ce projet inclut un scraper pour contourner la page de paiement par défaut de Paystack, permettant une expérience de paiement plus personnalisée. Utilisez cette fonctionnalité de manière responsable et assurez-vous de respecter les conditions d'utilisation de Paystack.