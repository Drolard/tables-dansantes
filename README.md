# tables-dansantes

Crée en juin 2020 par Rémy Voillet dans le cadre d'un cours sur le Javascript.

## Présentation du projet

Ce petit outil permet de visualiser les tables de multiplications dans un cercle aussi appelé "Tables dansantes".
(Pour plus d'informations faites vous plaisir et recherchez sur internet ou regarder [cette super vidéo](https://www.youtube.com/watch?v=-X49VQgi86E))

## Utilisation du projet

Il suffit de récupérer le repository git et d'ouvrir le fichier index.html via son navigateur favori

## Fonctionnalités

L'outil se divise en trois partie : 

**Le cadre d'affichage**
La plus grosse partie à gauche qui affiche la table dansante. Cette partie n'a aucune interactivité possible.


**Les actions**
À droite du cadre il y a trois blocs qui permettent de modifier la table ainsi que de l'ajouter a la gallerie

Les deux premiers blocs permettent de modifier les deux variables sur le cercle (multiplicateur et nombre de points)
- En changeant directement la valeur dans le champ nombre sous le titre du bloc
- En utilisant les boutons + et - pour changer directement les valeurs (+1, -1, +0.1, -0.1 pour le multiplicateur +10, -10, +1, -1 pour le nombre de points)
- Ou alors en indiquant un pas d'animation dans la case correspondante et en lançant l'animation avec le bouton "Play". Cette animation va ajouter au multiplicateur ou au nombre de points le pas concerné toutes les 2 millisecondes.

Le dernier bloc permet d'ajouter la table dansante dans la gallerie.

**La gallerie**

Cette dernière recense toutes les tables enregistrées par l'utilisateur, avec un petit aperçu ainsi que les valeurs utilisées.
Il est possible d'afficher une table en grand, c'est-à-dire de la mettre dans le cadre principal. (Si une table est mise dans le cadre principal et est changée dedans elle ne sera pas modifier dans la gallerie)
Il est aussi possible de supprimer les tables.

Cette gallerie est stockée dans le localStorage et restent donc enregistrée si l'utilisateur recharge la page.

Pour des buts de démonstration, certaines tables dansantes sont ajoutées de base dans la gallerie.

## Informations sur le code

Le javascript est divisé en 2 parties :

**Les classes**
Il y en à 4 :
- TableClass - qui n'a que deux méthodes statiques de calcul utilisé dans la classe CanvasDansingTable
- Point - permet d'enregitrer les coordonnées d'un point. (Le calcul des coordonnées d'un point sur un cercle étant assez gourmande cette classe permet d'enregistrer ces dernières pour les récupérer plus tard sans refaire le caclul)
- CanvasDansingTable - Classe principale qui dessine les tables dansantes
- TableGallery - Classe qui permet de gérer une gallerie de tables dansantes

**La fonction init**
Permet de tout initialiser, entre autres elle :
- Crée le premier cercle
- Ajoute les fonctionnalités sur les boutons des formulaires
- Crée la première gallerie en récupérant les données du localStorage

**Les variables globales**
Hors du init on crée plusieurs variables et fonctions globales qui sont utilisés à plusieurs endroits.

**Les petits points intéressants de dev**
Pour essayer d'optimiser la création et modification d'un cercle, celui-ci contient une table de clés valeurs correspondantes aux clés nombre entier -> Coordonnées sur le cercle
Cela permet, quand on change le nombre de points, de ne pas recalculer toutes les coordonnées (le calcul des coordonnées d'un point sur un cercle peuvent devenir gourmande).
Si 1*2 = 2, alors on peut directement récupérer les coordonnées du point 1 et du point 2 via ce tableau pour dessiner la ligne entre 1 et 2.
Pour l'instant ce tableau ne contient que les points des nombres entiers.

Le dessin d'un cercle se fait en trois étapes :
- Le cercle 
- Le dessin de tous les points
- Le dessin de toutes les lignes

La gallerie met à jour le localStorage a chaque ajout ou suppression d'un item

#Améliorations prévues

- Permettre de changer la durée de l'animation
- Permettre de faire des animations sur les 2 valeurs en même temps
- Enlever les tables injectées automatiquement dans la gallerie 
- Optimiser le code pour ré-utiliser les points déjà créés pour toutes les tables (faire que le tableau points->valeur soit global à tout les cercles, le principal et ceux dans la gallerie)
- Ajouter la possibilité de créer des galleries perso avec un nom
