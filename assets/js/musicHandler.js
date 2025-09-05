// ===============================
// CONTROLADOR DE MÚSICA DE FONDO
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    let isPlaying = false;
    let firstInteractionHandled = false;
    let autoplayAttempted = false; // Nueva bandera para tracking de autoplay
    
    // Configurar volumen inicial
    music.volume = 0.3; // Volumen al 30% para que no sea muy fuerte
    
    // Función para verificar si el audio está listo para reproducir
    function isAudioReady() {
        // Verificar que el audio tenga suficientes datos para reproducir
        return music.readyState >= 3; // HAVE_FUTURE_DATA o HAVE_ENOUGH_DATA
    }
    
    // Función para iniciar música
    function startMusic() {
        console.log('Intentando iniciar música...');
        
        // Marcar que ya intentamos el autoplay
        autoplayAttempted = true;
        
        // Verificar si el audio está listo
        if (!isAudioReady()) {
            console.log('Audio aún no está completamente cargado. Esperando...');
            // Esperar a que el audio esté listo
            music.addEventListener('canplaythrough', function onCanPlayThrough() {
                music.removeEventListener('canplaythrough', onCanPlayThrough);
                console.log('Audio completamente cargado. Iniciando reproducción...');
                playMusic();
            });
            return;
        }
        
        playMusic();
    }
    
    // Función para reproducir música (separada de la verificación)
    function playMusic() {
        music.muted = false; // Asegurar que no esté muteado
        music.play().then(() => {
            isPlaying = true;
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            console.log('Música iniciada exitosamente');
        }).catch(e => {
            console.log('Error al reproducir música:', e);
            // Si falla, configurar listeners de respaldo solo si no se han configurado antes
            if (!autoplayAttempted || e.name === 'NotAllowedError') {
                console.log('Configurando listeners de respaldo...');
                setupFirstInteractionTrigger();
            }
        });
    }
    
    // Iniciar música después de 2 segundos
    setTimeout(() => {
        console.log('Iniciando música automáticamente después de 2 segundos...');
        startMusic();
    }, 2000);
    
    // También configurar listeners inmediatamente como respaldo
    setupFirstInteractionTrigger();
    
    // Configurar trigger para primera interacción si el autoplay falla
    function setupFirstInteractionTrigger() {
        function handleFirstInteraction(event) {
            // Evitar múltiples ejecuciones
            if (firstInteractionHandled) return;
            firstInteractionHandled = true;
            
            console.log('Primera interacción detectada:', event.type);
            
            // Usar la misma función de verificación y reproducción
            if (!isAudioReady()) {
                console.log('Audio aún no está listo para interacción. Esperando...');
                music.addEventListener('canplaythrough', function onCanPlayThrough() {
                    music.removeEventListener('canplaythrough', onCanPlayThrough);
                    console.log('Audio listo. Iniciando por interacción...');
                    playMusic();
                });
            } else {
                playMusic();
            }
            
            // Remover todos los listeners después de la primera interacción
            removeAllInteractionListeners();
        }
        
        // Función específica para manejar el scroll con throttling
        let scrollTimeout;
        function handleScrollInteraction(event) {
            if (firstInteractionHandled) return;
            
            // Throttle scroll events para evitar demasiadas ejecuciones
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                console.log('Scroll detectado - iniciando música');
                handleFirstInteraction({ type: 'scroll' });
            }, 100);
        }
        
        // Función para remover todos los listeners
        function removeAllInteractionListeners() {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('scroll', handleScrollInteraction);
            window.removeEventListener('scroll', handleScrollInteraction);
            // Limpiar timeout si existe
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }
        }
        
        // Agregar listeners para detectar primera interacción
        document.addEventListener('scroll', handleScrollInteraction, { passive: true });
        window.addEventListener('scroll', handleScrollInteraction, { passive: true });
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction, { passive: true }); // Para móviles
        
        console.log('Listeners de interacción configurados. Esperando primera interacción...');
    }
    
    // Control manual de música con botón
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            // Usar la misma función de verificación y reproducción
            if (!isAudioReady()) {
                console.log('Audio aún no está listo para control manual. Esperando...');
                music.addEventListener('canplaythrough', function onCanPlayThrough() {
                    music.removeEventListener('canplaythrough', onCanPlayThrough);
                    console.log('Audio listo. Iniciando por control manual...');
                    playMusic();
                });
            } else {
                playMusic();
            }
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
        console.error('Código de error:', music.error?.code);
        console.error('Mensaje de error:', music.error?.message);
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
    music.addEventListener('canplaythrough', () => console.log('Música completamente cargada y lista'));
});