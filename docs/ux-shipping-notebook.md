# IBESC — carnet d’expédition

## Référence concurrentielle

Observation du 11 octobre 2026 : [AfricaCTN](https://africactn.com/).

Principes retenus : choix de destination rapide, documents accessibles par pays,
étapes explicites, appel à l’action récurrent et support facile à trouver.
Nous ne reprenons ni les textes, ni les promesses de délai, ni les accréditations du concurrent.

Différenciation IBESC : palette marine/terracotta, grille cartographique,
repères de carnet, carte et liste équivalentes, aperçu avant navigation,
checklist personnelle et demande guidée en trois étapes.

## Architecture et accessibilité

- Cartographie calculée côté serveur. Le client reçoit le SVG rendu et les seuls
  renseignements nécessaires à l’aperçu (trois premières lignes de documents).
- Poppins et Inter WOFF2 locales conservées. Aucune bibliothèque d’animation ajoutée.
- Suppression du masquage du contenu par l’observateur d’apparition au défilement.
- Menu mobile avec fermeture interne, focus initial, boucle Tab, Échap,
  arrière-plan inert et rétablissement du focus. Fermeture au passage sur ordinateur.
- Formulaire : groupes nommés, erreurs liées aux champs, focus au premier champ
  invalide, valeurs et fichiers conservés lors des changements d’étape.
- Contrôles fichiers alignés sur l’API existante : 10 Mo par fichier, 35 Mo au total,
  extensions autorisées, BL et facture obligatoires. Les contrôles serveur restent en place.
- La checklist est un aide-mémoire de session, pas une validation réglementaire.
- La date affichée vient de `modified_gmt`, sans prétention de vérification par un expert.

## Vérifications effectuées

- Compilation Next.js de production et vérification TypeScript.
- Navigateur intégré : menu à 320 px, formulaire à 390 px et page à 1280 px.
- Boucle Shift+Tab, fermeture Échap, focus revenu au bouton et retrait de inert.
- Sélection Sénégal sur la carte au clavier ; destination reprise dans la demande.
- Devis : erreur requise sur marchandise, progression et valeur conservée au retour.
- Documents : sélection du mode via URL, date/pays chargeur, pièces et consentement requis.
- Interface française, anglaise et néerlandaise inspectée.
- Aucun dossier réel ni e-mail de test envoyé. La réception métier reste à vérifier
  avec une procédure de recette autorisée.
- Pas de certification WCAG ni de score de performance revendiqué : un audit complet
  et des mesures en production restent nécessaires.

## Point préexistant à traiter séparément : CMS

L’API publique expose les données ACF dans `acf`, tandis que le modèle historique
du frontend lit `meta`. L’exemple Sénégal (`/wp-json/wp/v2/pays?slug=senegal`)
contient des caractères `n` parasites dans le texte importé, un certificat `n`,
et des champs `docs_fr`/`ports_fr` vides. Ne pas copier ces données dégradées vers
les fiches et ne pas les remplacer par les obligations publiées par un concurrent.

La refonte garde un état explicite de contact quand les formalités structurées
manquent. La checklist s’affichera lorsque les documents seront disponibles dans
le contrat CMS attendu. Une reprise de l’import, une validation des contenus et
un raccordement cohérent ACF/REST sont nécessaires avant de présenter ces fiches
comme une référence réglementaire complète. Aucune modification WordPress ou DNS
n’a été effectuée pendant cette refonte.
