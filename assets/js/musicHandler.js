// ===============================
// CONTROLADOR DE MÚSICA DE FONDO
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    let isPlaying = false;
    
    // Configurar volumen inicial
    music.volume = 0.3; // Volumen al 30% para que no sea muy fuerte
    
    // Función para intentar reproducir música inmediatamente
    function startMusic() {
        music.muted = false; // Asegurar que no esté muteado
        music.play().then(() => {
            isPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            console.log('Música iniciada exitosamente');
        }).catch(e => {
            console.log('Autoplay bloqueado por el navegador. La música se iniciará con la primera interacción.');
            // Si falla el autoplay, intentar con la primera interacción
            setupFirstInteractionTrigger();
        });
    }
    
    // Configurar trigger para primera interacción si el autoplay falla
    function setupFirstInteractionTrigger() {
        function handleFirstInteraction() {
            music.muted = false;
            music.play().then(() => {
                isPlaying = true;
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            }).catch(e => {
                console.log('Error al reproducir música:', e);
            });
            
            // Remover listeners después de la primera interacción
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        }
        
        // Agregar listeners para detectar primera interacción
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction); // Para móviles
    }
    
    // Intentar iniciar música inmediatamente al cargar
    setTimeout(() => {
        startMusic();
    }, 500); // Pequeño delay para asegurar que todo esté cargado
    
    // Control manual de música con botón
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            music.muted = false;
            music.play().then(() => {
                isPlaying = true;
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            }).catch(e => {
                console.log('Error al reproducir música:', e);
            });
        }
    });
    
    // Manejar eventos de audio para mantener sincronizado el estado
    music.addEventListener('ended', function() {
        // Como tiene loop, esto no debería ejecutarse nunca
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });
    
    music.addEventListener('pause', function() {
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });
    
    music.addEventListener('play', function() {
        isPlaying = true;
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    });
    
    // Manejar errores de carga
    music.addEventListener('error', function(e) {
        console.error('Error al cargar el archivo de audio:', e);
        // Ocultar el control si hay error
        const musicControl = document.querySelector('.fixed.top-4.right-4');
        if (musicControl) {
            musicControl.style.display = 'none';
        }
    });
    
    // Mostrar información de debug en consola
    music.addEventListener('loadstart', () => console.log('Comenzando a cargar música...'));
    music.addEventListener('canplay', () => console.log('Música lista para reproducir'));
    music.addEventListener('loadeddata', () => console.log('Datos de música cargados'));
});
