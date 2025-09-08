export function initMusic () {
  const music = document.getElementById('backgroundMusic')
  const musicToggle = document.getElementById('musicToggle')
  const playIcon = document.getElementById('playIcon')
  const pauseIcon = document.getElementById('pauseIcon')

  if (!music || !musicToggle || !playIcon || !pauseIcon) return

  let isPlaying = false
  let firstInteractionHandled = false
  let autoplayAttempted = false

  music.volume = 0.3
  
  // Detectar Safari móvil
  const isSafariMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  
  // Variable para rastrear si necesitamos activación manual en Safari
  let needsSafariActivation = isSafariMobile

  function isAudioReady () {
    return music.readyState >= 3
  }

  function playMusic () {
    music.muted = false
    
    // En Safari móvil, manejar de manera especial
    if (isSafariMobile && needsSafariActivation) {
      // Para Safari móvil, asegurar que la reproducción sea explícita
      music.play()
        .then(() => {
          console.log('Música iniciada correctamente en Safari móvil')
          needsSafariActivation = false
          isPlaying = true
          playIcon.classList.add('hidden')
          pauseIcon.classList.remove('hidden')
        })
        .catch(e => {
          console.log('Safari móvil requiere interacción del usuario:', e.message)
          // En Safari móvil, forzar la configuración de listeners
          if (!firstInteractionHandled) {
            setupFirstInteractionTrigger()
          }
        })
    } else {
      music
        .play()
        .then(() => {
          isPlaying = true
          playIcon.classList.add('hidden')
          pauseIcon.classList.remove('hidden')
          // console.log('Música iniciada exitosamente')
        })
        .catch(e => {
          // console.log('Error al reproducir música:', e)
          if (!autoplayAttempted || e.name === 'NotAllowedError') {
            setupFirstInteractionTrigger()
          }
        })
    }
  }

  function startMusic () {
    autoplayAttempted = true
    
    // En Safari móvil, no intentar autoplay automático
    if (isSafariMobile) {
      console.log('Safari móvil detectado - esperando interacción del usuario')
      setupFirstInteractionTrigger()
      return
    }
    
    if (!isAudioReady()) {
      const onCanPlayThrough = () => {
        music.removeEventListener('canplaythrough', onCanPlayThrough)
        playMusic()
      }
      music.addEventListener('canplaythrough', onCanPlayThrough)
      return
    }
    playMusic()
  }

  // En Safari móvil, no intentar autoplay después de 2 segundos
  if (!isSafariMobile) {
    setTimeout(() => startMusic(), 2000)
  } else {
    // En Safari móvil, agregar listener especial al botón de bienvenida si existe
    const welcomeButton = document.getElementById('startButton')
    if (welcomeButton) {
      welcomeButton.addEventListener('click', function() {
        console.log('Botón de bienvenida presionado en Safari móvil - activando música')
        if (needsSafariActivation) {
          needsSafariActivation = false
          firstInteractionHandled = true
          setTimeout(() => playMusic(), 100) // Pequeño delay para asegurar que el contexto esté listo
        }
      }, { once: true }) // Solo una vez para no interferir con otras funciones
    }
  }
  setupFirstInteractionTrigger()

  function setupFirstInteractionTrigger () {
    function handleFirstInteraction () {
      if (firstInteractionHandled) return
      firstInteractionHandled = true

      console.log('Primera interacción detectada - iniciando música')

      // En Safari móvil, asegurar que el contexto esté listo y forzar reproducción inmediatamente
      if (isSafariMobile) {
        console.log('Safari móvil: activando reproducción por interacción del usuario')
        needsSafariActivation = false
        // Forzar reproducción inmediata en Safari móvil
        music.muted = false
        const playPromise = music.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Música iniciada exitosamente en Safari móvil')
            isPlaying = true
            updateUI()
          }).catch(error => {
            console.log('Error reproduciendo música en Safari móvil:', error)
          })
        }
        removeAllInteractionListeners()
        return
      }

      if (!isAudioReady()) {
        const onCanPlayThrough = () => {
          music.removeEventListener('canplaythrough', onCanPlayThrough)
          playMusic()
        }
        music.addEventListener('canplaythrough', onCanPlayThrough)
      } else {
        playMusic()
      }
      removeAllInteractionListeners()
    }

    let scrollTimeout
    function handleScrollInteraction () {
      if (firstInteractionHandled) return
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
        handleFirstInteraction()
      }, 100)
    }

    function removeAllInteractionListeners () {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('scroll', handleScrollInteraction)
      window.removeEventListener('scroll', handleScrollInteraction)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
        scrollTimeout = null
      }
    }

    document.addEventListener('scroll', handleScrollInteraction, { passive: true })
    window.addEventListener('scroll', handleScrollInteraction, { passive: true })
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true })
  }

  // Función para actualizar la UI
  function updateUI() {
    if (isPlaying) {
      playIcon.classList.add('hidden')
      pauseIcon.classList.remove('hidden')
    } else {
      playIcon.classList.remove('hidden')
      pauseIcon.classList.add('hidden')
    }
  }

  musicToggle.addEventListener('click', function () {
    // Marcar que hubo interacción del usuario para Safari móvil
    if (isSafariMobile && needsSafariActivation) {
      needsSafariActivation = false
      firstInteractionHandled = true
    }

    if (isPlaying) {
      music.pause()
      isPlaying = false
      updateUI()
    } else {
      if (!isAudioReady()) {
        const onCanPlayThrough = () => {
          music.removeEventListener('canplaythrough', onCanPlayThrough)
          playMusic()
        }
        music.addEventListener('canplaythrough', onCanPlayThrough)
      } else {
        playMusic()
      }
    }
  })

  music.addEventListener('ended', function () {
    isPlaying = false
    updateUI()
  })

  music.addEventListener('pause', function () {
    isPlaying = false
    updateUI()
  })

  music.addEventListener('play', function () {
    isPlaying = true
    updateUI()
  })

  music.addEventListener('error', function () {
    const musicControl = document.querySelector('.fixed.top-4.right-4')
    if (musicControl) musicControl.style.display = 'none'
  })

  // debug opcional:
  // music.addEventListener('loadstart', () => console.log('Comenzando a cargar música...'))
  // music.addEventListener('canplay', () => console.log('Música lista para reproducir'))
  // music.addEventListener('loadeddata', () => console.log('Datos de música cargados'))
  // music.addEventListener('canplaythrough', () => console.log('Música completamente cargada y lista'))
}
