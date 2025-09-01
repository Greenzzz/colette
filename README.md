# Colette - Application d'aide aux médicaments

Une application web simple et intuitive pour aider à la prise de médicaments, conçue pour être utilisée en permanence sur tablette Android.

## 🎯 Fonctionnalités

- **Affichage permanent de la date** : Toujours visible en grands caractères
- **Diaporama de photos** : Vos photos personnelles défilent automatiquement 2 fois par jour
- **Rappel médicaments** : Alerte automatique tous les jours à 19h30
- **Interface tactile simple** : Gros boutons faciles à utiliser
- **Fonctionne hors ligne** : Pas besoin d'internet une fois installée

## 📱 Installation sur tablette Android

### Étape 1 : Préparer l'application
1. Copiez tous les fichiers sur un serveur web ou utilisez un service comme GitHub Pages
2. Ajoutez vos photos dans le dossier `photos/` (formats JPG ou PNG)
3. Nommez vos photos : `photo1.jpg`, `photo2.jpg`, etc.

### Étape 2 : Installer sur la tablette
1. Ouvrez Chrome sur la tablette Android
2. Allez sur l'adresse web de votre application
3. Tapez sur le menu (⋮) puis "Ajouter à l'écran d'accueil"
4. L'application sera installée comme une app native

### Étape 3 : Configuration pour usage permanent
1. Ouvrez l'application depuis l'écran d'accueil
2. Mettez la tablette en mode "Ne pas déranger"
3. Dans les paramètres Android, désactivez la mise en veille automatique
4. L'application fonctionne maintenant en permanence !

## ⚙️ Configuration

### Modifier l'heure du rappel
Dans le fichier `app.js`, ligne 4 :
```javascript
MEDICATION_TIME: '19:30',  // Changez l'heure ici
```

### Modifier la fréquence de rotation des photos
Dans le fichier `app.js`, ligne 7 :
```javascript
PHOTO_ROTATION_INTERVAL: 12 * 60 * 60 * 1000,  // 12 heures
```

## 📁 Ajouter des photos

1. Placez vos photos dans le dossier `photos/`
2. Nommez-les : `photo1.jpg`, `photo2.jpg`, `photo3.png`, etc.
3. L'application les détectera automatiquement
4. Format recommandé : JPG ou PNG, résolution 1920x1080 ou plus

## 🔧 Test et développement

### Tester localement
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .
```

Puis ouvrez http://localhost:8000

### Tester l'alerte médicament
- Double-cliquez n'importe où sur l'écran pour déclencher l'alerte manuellement
- Ou modifiez l'heure dans `MEDICATION_TIME` pour qu'elle corresponde à l'heure actuelle

## 🎨 Personnalisation

### Couleurs
Modifiez les couleurs dans `style.css` :
- `#2c3e50` : Couleur principale (bleu foncé)
- `#e74c3c` : Rouge pour les alertes
- `#27ae60` : Vert pour les confirmations

### Tailles de police
Toutes les tailles sont optimisées pour tablette et lisibilité par personnes âgées.

## ✅ Fonctionnalités incluses

- ✅ Affichage date en temps réel
- ✅ Diaporama de photos personnalisables
- ✅ Alerte médicament programmable
- ✅ Sauvegarde des prises de médicaments
- ✅ Interface plein écran
- ✅ Fonctionne hors ligne (PWA)
- ✅ Installation native sur Android
- ✅ Prévention de la mise en veille

## 🆘 Dépannage

**L'application ne s'installe pas :**
- Vérifiez que vous utilisez Chrome sur Android
- Assurez-vous d'être sur HTTPS ou localhost

**Les photos ne s'affichent pas :**
- Vérifiez que les photos sont dans le dossier `photos/`
- Utilisez des noms de fichiers simples : `photo1.jpg`, `photo2.jpg`

**L'alerte ne se déclenche pas :**
- Vérifiez l'heure dans la configuration
- Testez avec un double-clic sur l'écran

---

💝 **Pour maman** : Cette application t'aidera à ne jamais oublier tes médicaments tout en voyant de belles photos de famille !