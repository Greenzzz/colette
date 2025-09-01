# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colette is a webapp dédiée à l'aide à la prise de médicaments pour personnes âgées ayant des troubles de la mémoire. L'application fonctionne en permanence sur tablette Android en plein écran.

## Fonctionnalités principales

- Affichage permanent de la date du jour
- Diaporama de photos en arrière-plan (rotation 2x/jour)
- Alerte automatique à 19h30 pour rappel médicament
- Interface de confirmation avec gros bouton tactile
- PWA installable sur tablette Android

## Architecture technique

- HTML/CSS/JavaScript vanilla (simplicité et fiabilité)
- PWA (Progressive Web App) pour installation native
- LocalStorage pour sauvegarde états
- Service Worker pour fonctionnement hors ligne
- Interface optimisée tablette plein écran

## Structure projet

```
/
├── index.html          # Page principale
├── style.css          # Styles pour tablette
├── app.js             # Logique JavaScript
├── manifest.json      # Configuration PWA
├── service-worker.js  # Cache et hors ligne
├── photos/           # Images pour diaporama
└── icons/            # Icônes PWA
```

## Development Commands

```bash
# Servir localement pour test (Python)
python -m http.server 8000

# Servir localement pour test (Node.js)
npx serve .
```

## Déploiement

La webapp peut être servie depuis n'importe quel serveur web statique et installée sur tablette Android via Chrome.