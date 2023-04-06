<!-- prettier-ignore-start -->
<!-- omit in toc -->
# Power BI Search Engine - Core
<!-- prettier-ignore-end -->

EN - [Disponible en anglais](/README.md)

`Power BI Search Engine - Core` est un outil qui permet de parcourir et d'extraire des données des rapports et tableaux de bord Microsoft Power BI.  
Son objectif est de fournir des données pour construire une application de recherche qui remplace le moteur de recherche par défaut de Power BI, qui est basé uniquement sur le nom du rapport, et non sur son contenu.

Il a plusieurs fonctionnalités:

-   **Workspace Crawling**: lister tous les rapports et tableaux de bord d'un espace de travail
-   **Content Crawling**: lister toutes les pages d'un rapport
-   **Content Scraping**: extraire des données d'une page et déterminer les tags
-   **Content Screenshot**: prendre une capture d'écran d'une page
-   **Data Exporter**: exporter toutes les données collectées sous forme de fichier JSON (peut être utilisé avec Microsoft Power Automate et Microsoft Power Apps pour construire une application de recherche)

# Sommaire

-   [Sommaire](#sommaire)
-   [Installation](#installation)
    -   [Prérequis](#prérequis)
    -   [Depuis la source](#depuis-la-source)
-   [Utilisation](#utilisation)
    -   [Configuration](#configuration)
    -   [Lancement](#lancement)
    -   [Conseils](#conseils)
-   [Crédits](#crédits)

# Installation

## Prérequis

-   [Node.js](https://nodejs.org/en/download/)
-   Compte Power BI
-   Windows 10
-   Compte Microsoft unique pour Power BI et Windows 10

## Depuis la source

1. Clonez ou téléchargez ce dépôt
2. Faites `npm i` ou `npm ci` (ou équivalent) pour installer les dépendances
3. Faites `npm run test-login` pour tester vos identifiants de connexion
4. Faites `npm run start` pour lancer le programme

# Utilisation

## Configuration

Here is an example of the `config.js` file:

```js
const config = {
    language: "french",
    /*
    pbiLogin est le nom d'utilisateur qui sera utilisé pour se connecter à Power BI
    Il doit être valide pour le domaine
    La valeur par défaut est l'utilisateur actuel sur la machine locale
    ⚠️ - Vous devez définir le nom de domaine
    📝 - Vous pouvez tester si la connexion est valide en exécutant `npm run test-login` dans un terminal
    */
    pbiLogin: `${require("os").userInfo().username}@domaine.com`,
    /*
    uploadLocation est un chemin vers un dossier où les exports seront enregistrés
    Il doit avoir deux sous-dossiers: "Exports" et "Anomalies"
    */
    uploadLocation: "C:\\Chemin\\D\\Acces\\Pour\\Les\\Exports",
    processes: [
        ["id-espace-pour-process-1", "id-espace-pour-process-1", "id-espace-pour-process-1"],
        ["id-espace-pour-process-2"],
    ],
    /*
    lookFor est un tableau de sélecteurs CSS qui seront utilisés pour trouver les éléments qui seront lus
    Le contenu textuel des éléments résultants sera ensuite converti en mots-clés
    */
    lookFor: [
        ".textbox p span.textRun",
        ".slicer-header-text",
        ".preTextWithEllipsis",
        ".columnHeaders div div .pivotTableCellWrap.cell-interactive.tablixAlignCenter",
        "[role=columnheader].pivotTableCellWrap",
        ".xAxisLabel",
        ".yAxisLabel",
        ".headerText .headerTitleWrapper .displayText",
    ],
};

module.exports = config;
```

📝 - Pas besoin de copier-coller l'exemple ci-dessus ! Dupliquez le fichier `config.example.js` et renommez-le en `config.js`.

🔐 - Le fichier `config.js` est ignoré par Git, vous pouvez donc le modifier sans vous soucier de partager quoi que ce soit de sensible.

⚠️ - Il est recommandé d'utiliser la commande `npm run test-login` pour vérifier si vos identifiants de connexion sont valides avant de démarrer le programme.

## Lancement

1. Configurez le fichier `config.js` comme décrit ci-dessus
2. Faite `npm run start` pour démarrer le programme
3. Le programme continuera à logger pour vous informer de son avancement  
   ⚠️ - **_Certains rapports et tableaux de bord peuvent prendre beaucoup de temps à être traités, mais le programme n'est pas bloqué pour autant._**
4. Lorsque le programme est terminé, il vous indiquera le temps qu'il a fallu pour traiter tous les rapports et tableaux de bord

## Conseils

J'utilise cet outil depuis un moment maintenant, et j'ai trouvé que les conseils suivants peuvent vous aider à obtenir les meilleurs résultats:

1. Vous pouvez vérifier régulièrement les rapports et tableaux de bord obsolètes qui ne sont plus utilisés, et les supprimer, pour éviter de perdre du temps à les traiter.
2. Faites de même avec les données collectées. Avec le temps, vous pouvez avoir beaucoup de données qui ne sont plus pertinentes, par exemple des rapports et tableaux de bord supprimés qui sont toujours dans la base de données. Les supprimer vous aidera à garder votre application de recherche performante.
3. Après les premiers lancements, essayez d'optimiser vos processus en ayant un nombre similaire de pages à explorer dans chacun d'entre eux. J'ai fait cela en utilisant une feuille Excel pour garder une trace du nombre de pages dans chaque rapport et tableau de bord, puis en les triant par nombre de pages, puis en les distribuant dans des processus d'environ le même nombre de pages.
4. N'ignorez pas les erreurs et les anomalies. Elles peuvent vous aider à améliorer la disponibilité et la qualité de vos données. Si vous ignorez les erreurs et les anomalies, vous risquez de vous retrouver avec beaucoup de données manquantes, ce qui rendra votre application de recherche moins utile.

# Crédits

Projet dévelopé par :

-   <img width="25px" src="img/onix.png"> [@NeoOniX](https://github.com/NeoOniX)

Fonctionne grâce à :

-   <img width="25px" src="img/node.png"> [Node.js](https://nodejs.org/)

Fait spécialement pour :

-   <img width="25px" src="img/sncf.png"> [SNCF](https://sncf.com/)
-   <img width="25px" src="img/pbi.png"> [Power BI](https://powerbi.microsoft.com/)
