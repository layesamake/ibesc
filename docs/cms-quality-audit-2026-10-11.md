# Audit qualité CMS — 11 octobre 2026

## État vérifié

- 30 fiches pays présentes dans `deploy/pays.json`.
- Synchronisation WordPress effectuée sans suppression de fiche.
- Les champs ACF publics sont lisibles par l’application Next.js.
- Les fiches publiques affichent maintenant des textes propres et les 30 destinations.

## Écarts éditoriaux à corriger

| Pays | Langue | Écart |
| --- | --- | --- |
| Côte d’Ivoire | NL | Liste `docs` absente |
| Gabon | NL | Liste `docs` absente |
| Sénégal | NL | Liste `docs` absente |
| Égypte | FR/NL | Liste `docs` absente |
| Gambie | NL | Liste `docs` absente |
| Yémen | NL | Liste `docs` absente |
| Djibouti | FR/EN/NL | Liste `docs` absente |
| Yémen | FR | Le texte d’introduction mentionne le Gabon ; à confirmer avant correction |

## Prochaine étape recommandée

Compléter ces sections à partir des pages sources correspondantes, puis synchroniser uniquement les champs concernés. Ne pas inventer de documents réglementaires ; afficher explicitement « informations à confirmer » lorsqu’une source ne fournit pas de liste fiable.

## Garde-fous

- Aucun pays ne doit être supprimé.
- Les contenus existants doivent être conservés avant remplacement.
- Les corrections doivent être validées en FR, EN et NL sur les fiches publiques.
