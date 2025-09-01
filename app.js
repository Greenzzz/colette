// Configuration de l'application
const CONFIG = {
    // Heure d'alerte médicament (format HH:MM)
    MEDICATION_TIME: '14:45',
    
    // Durée de rotation des photos (en millisecondes)
    // 1 heure = 1 * 60 * 60 * 1000
    PHOTO_ROTATION_INTERVAL: 1 * 60 * 60 * 1000,
    
    // Photos par défaut - images Pexels en direct
    DEFAULT_PHOTOS: [
        'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',  // Lac de montagne
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',  // Forêt verte
        'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',  // Coucher de soleil océan
        'https://images.pexels.com/photos/269264/pexels-photo-269264.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',  // Champ de lavande
        'https://images.pexels.com/photos/158828/beautiful-beautiful-mountains-breathtaking-calm-158828.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',  // Lac calme
        'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'   // Prairie verte
    ]
};

class ColetteApp {
    constructor() {
        this.currentView = 'normal';
        this.photos = [];
        this.currentPhotoIndex = 0;
        this.medicationCheckInterval = null;
        this.photoRotationTimeout = null;
        this.audioContext = null;
        this.alertSoundTimeout = null;
        this.alertSoundInterval = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initialisation de Colette...');
        
        // Charger les photos
        await this.loadPhotos();
        
        // Initialiser l'affichage de la date
        this.updateDateTime();
        
        // Démarrer le diaporama
        this.startSlideshow();
        
        // Démarrer la vérification des médicaments
        this.startMedicationCheck();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Empêcher la mise en veille
        this.preventSleep();
        
        console.log('✅ Colette initialisée avec succès !');
    }
    
    async loadPhotos() {
        console.log('📸 Chargement des photos Unsplash...');
        this.photos = CONFIG.DEFAULT_PHOTOS;
        console.log(`📷 ${this.photos.length} photos Unsplash chargées`);
    }
    
    updateDateTime() {
        const now = new Date();
        
        // Format français pour les jours et mois
        const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];
        
        const dayName = days[now.getDay()];
        const dateNumber = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        
        // Format de l'heure (HH:MM)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Mettre à jour l'affichage normal
        document.getElementById('dayName').textContent = dayName;
        document.getElementById('dateNumber').textContent = dateNumber;
        document.getElementById('monthYear').textContent = `${monthName} ${year}`;
        document.getElementById('timeDisplay').textContent = timeString;
        
        // Mettre à jour l'affichage d'alerte
        document.getElementById('currentDay').textContent = dayName;
        document.getElementById('currentTime').textContent = timeString;
        
        // Vérifier et afficher le statut des médicaments
        this.updateMedicationStatus();
        
        // Programmer la prochaine mise à jour (toutes les secondes pour l'heure)
        setTimeout(() => this.updateDateTime(), 1000);
    }
    
    updateMedicationStatus() {
        const today = new Date().toDateString();
        const lastTaken = localStorage.getItem('lastMedicationTaken');
        const medicationStatus = document.getElementById('medicationStatus');
        
        if (lastTaken === today) {
            medicationStatus.classList.add('visible');
        } else {
            medicationStatus.classList.remove('visible');
        }
    }
    
    startSlideshow() {
        if (this.photos.length === 0) return;
        
        const slide1 = document.getElementById('slide1');
        const slide2 = document.getElementById('slide2');
        
        // Afficher la première photo
        this.setSlideBackground(slide1, this.photos[0]);
        
        // Si il y a plus d'une photo, démarrer la rotation
        if (this.photos.length > 1) {
            this.scheduleNextPhotoRotation();
        }
    }
    
    scheduleNextPhotoRotation() {
        this.photoRotationTimeout = setTimeout(() => {
            this.rotatePhoto();
            this.scheduleNextPhotoRotation();
        }, CONFIG.PHOTO_ROTATION_INTERVAL);
    }
    
    rotatePhoto() {
        if (this.photos.length <= 1) return;
        
        const slide1 = document.getElementById('slide1');
        const slide2 = document.getElementById('slide2');
        const activeSlide = document.querySelector('.slide.active');
        const inactiveSlide = activeSlide === slide1 ? slide2 : slide1;
        
        // Passer à la photo suivante
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photos.length;
        
        // Charger la nouvelle photo sur le slide inactif
        this.setSlideBackground(inactiveSlide, this.photos[this.currentPhotoIndex]);
        
        // Transition
        activeSlide.classList.remove('active');
        inactiveSlide.classList.add('active');
        
        console.log(`🔄 Rotation vers photo ${this.currentPhotoIndex + 1}/${this.photos.length}`);
    }
    
    setSlideBackground(slideElement, photoUrl) {
        slideElement.style.backgroundImage = `url("${photoUrl}")`;
        slideElement.innerHTML = '';
        console.log(`🖼️ Image appliquée: ${photoUrl}`);
    }
    
    startMedicationCheck() {
        // Vérifier immédiatement
        this.checkMedicationTime();
        
        // Puis vérifier toutes les minutes
        this.medicationCheckInterval = setInterval(() => {
            this.checkMedicationTime();
        }, 60000);
    }
    
    checkMedicationTime() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const today = now.toDateString();
        
        // Vérifier si c'est l'heure du médicament
        if (currentTime === CONFIG.MEDICATION_TIME) {
            // Vérifier si le médicament a déjà été pris aujourd'hui
            const lastTaken = localStorage.getItem('lastMedicationTaken');
            
            if (lastTaken !== today) {
                this.showMedicationAlert();
            }
        }
    }
    
    showMedicationAlert() {
        console.log('💊 Alerte médicament !');
        
        // Jouer un son d'alerte en boucle
        this.startAlertSound();
        
        this.switchView('medication');
    }
    
    startAlertSound() {
        // Arrêter le son précédent s'il y en a un
        this.stopAlertSound();
        
        // Essayer d'abord les sons système Android/navigateur
        this.playSystemSound();
        
        // Puis démarrer une boucle avec des sons système
        this.alertSoundInterval = setInterval(() => {
            if (this.currentView === 'medication') {
                this.playSystemSound();
            } else {
                clearInterval(this.alertSoundInterval);
            }
        }, 3000); // Répéter toutes les 3 secondes
    }
    
    playSystemSound() {
        // Essayer plusieurs méthodes pour jouer un son système
        
        // 1. Son via une notification silencieuse (Android)
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                const notification = new Notification('Médicaments', {
                    body: 'Il est temps !',
                    icon: 'icons/icon-192.svg',
                    silent: false, // Son de notification
                    tag: 'medication-alert'
                });
                
                // Fermer la notification rapidement
                setTimeout(() => notification.close(), 100);
                return;
            } catch (error) {
                console.log('Notification sound failed:', error);
            }
        }
        
        // 2. Son via élément audio avec data URL (son de bip simple)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUcBSuJ0/LNeiURKH7K7+OVOQ0PaLzs3Z1MFAZBnN7tx2EcCCeA0fPTgSAOIXfH8N+TQgkTXrTp75sBEQxBnN7tx2EcCCeA0fPTgSAOIXfH8N+TQgkTXrTp75sBEQxBnN7tx2EcCCeA0fPTgSAOIXfH8N+TQgkTXrTp75sBEQxBnN7tx2EcCCeA0fPTgSAOIXfH8N+TQgkTXrTp75sBEQxBnN7tx2EcCCeA0fPTgSAOIXfH8N+TQgkTXrTp75sBEQxBnN7tx2EcCCeA0fPTgSAOIXfH8N+TQgkT');
            audio.play().then(() => {
                console.log('System beep played');
            }).catch(error => {
                console.log('Audio beep failed:', error);
                // 3. Fallback vers la mélodie synthétique
                this.playMelodyLoop();
            });
        } catch (error) {
            console.log('Audio creation failed:', error);
            // 4. Dernier fallback
            this.playMelodyLoop();
        }
    }
    
    playMelodyLoop() {
        if (!this.audioContext) return;
        
        // Mélodie inspirée de "Joyeux Anniversaire" - universellement positive !
        const melody = [
            { freq: 262, duration: 0.3 },  // Do
            { freq: 262, duration: 0.2 },  // Do
            { freq: 294, duration: 0.5 },  // Ré
            { freq: 262, duration: 0.5 },  // Do
            { freq: 349, duration: 0.5 },  // Fa
            { freq: 330, duration: 0.8 },  // Mi (longue)
            { freq: 0, duration: 0.2 },    // Silence
            { freq: 262, duration: 0.3 },  // Do
            { freq: 262, duration: 0.2 },  // Do
            { freq: 294, duration: 0.5 },  // Ré
            { freq: 262, duration: 0.5 },  // Do
            { freq: 392, duration: 0.5 },  // Sol
            { freq: 349, duration: 0.8 },  // Fa (longue)
        ];
        
        let currentTime = this.audioContext.currentTime;
        
        // Jouer chaque note
        melody.forEach((note) => {
            this.playNote(note.freq, note.duration, currentTime);
            currentTime += note.duration + 0.05; // Petit silence entre les notes
        });
        
        // Programmer la répétition
        const totalDuration = melody.reduce((sum, note) => sum + note.duration + 0.05, 0);
        this.alertSoundTimeout = setTimeout(() => {
            if (this.currentView === 'medication') { // Continuer seulement si encore en mode alerte
                this.playMelodyLoop();
            }
        }, totalDuration * 1000);
    }
    
    playNote(frequency, duration, startTime) {
        if (!this.audioContext) return;
        
        // Ne pas jouer les silences
        if (frequency === 0) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'square'; // Son plus distinctif et joyeux
        
        // Envelope pour un son plus festif
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    stopAlertSound() {
        if (this.alertSoundTimeout) {
            clearTimeout(this.alertSoundTimeout);
            this.alertSoundTimeout = null;
        }
        if (this.alertSoundInterval) {
            clearInterval(this.alertSoundInterval);
            this.alertSoundInterval = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
    
    confirmMedication() {
        const today = new Date().toDateString();
        localStorage.setItem('lastMedicationTaken', today);
        
        console.log('✅ Médicament confirmé pour aujourd\'hui');
        
        // Arrêter le son d'alerte
        this.stopAlertSound();
        
        // Animation du bouton
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.classList.add('animate-success');
        
        // Changer temporairement le texte
        const originalText = confirmButton.textContent;
        confirmButton.textContent = '✅ Parfait !';
        
        // Lancer les confettis !
        this.launchConfetti();
        
        // Retour à l'écran normal après l'animation
        setTimeout(() => {
            confirmButton.classList.remove('animate-success');
            confirmButton.textContent = originalText;
            this.switchView('normal');
        }, 2000);
    }
    
    launchConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        
        const colors = ['#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#f1c40f'];
        
        // Créer 50 confettis
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                // Formes variées
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%'; // Cercle
                } else {
                    confetti.style.transform = 'rotate(45deg)'; // Carré en diamant
                }
                
                container.appendChild(confetti);
            }, i * 20); // Décaler légèrement chaque confetti
        }
        
        // Nettoyer après 4 secondes
        setTimeout(() => {
            document.body.removeChild(container);
        }, 4000);
    }
    
    switchView(viewName) {
        const normalView = document.getElementById('normalView');
        const medicationView = document.getElementById('medicationView');
        
        if (viewName === 'medication') {
            normalView.classList.remove('active');
            medicationView.classList.add('active');
            this.currentView = 'medication';
        } else {
            medicationView.classList.remove('active');
            normalView.classList.add('active');
            this.currentView = 'normal';
        }
    }
    
    setupEventListeners() {
        // Bouton de confirmation des médicaments
        document.getElementById('confirmButton').addEventListener('click', () => {
            this.confirmMedication();
        });
        
        // Bouton refresh discret
        document.getElementById('refreshButton').addEventListener('click', () => {
            window.location.reload();
        });
        
        // Double tap pour forcer l'alerte (utile si elle prend avant l'heure)
        let tapCount = 0;
        document.addEventListener('click', () => {
            tapCount++;
            setTimeout(() => {
                if (tapCount === 2 && this.currentView === 'normal') {
                    this.showMedicationAlert();
                }
                tapCount = 0;
            }, 300);
        });
        
        // Empêcher le menu contextuel
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Empêcher la sélection de texte
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }
    
    preventSleep() {
        // Wake Lock API si disponible
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').then((wakeLock) => {
                console.log('🔋 Wake Lock actif - l\'écran ne se mettra pas en veille');
                
                // Réactiver si la visibilité change
                document.addEventListener('visibilitychange', async () => {
                    if (document.visibilityState === 'visible') {
                        await navigator.wakeLock.request('screen');
                    }
                });
            }).catch((error) => {
                console.warn('⚠️ Wake Lock non disponible:', error);
            });
        }
        
        // Fallback: garder une vidéo invisible en lecture
        const video = document.createElement('video');
        video.style.display = 'none';
        video.muted = true;
        video.loop = true;
        video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAs1tZGF0';
        video.play().catch(() => {
            console.warn('⚠️ Vidéo fallback pour prévention veille non disponible');
        });
        document.body.appendChild(video);
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.coletteApp = new ColetteApp();
});

// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré');
            })
            .catch((error) => {
                console.log('❌ Erreur Service Worker:', error);
            });
    });
}