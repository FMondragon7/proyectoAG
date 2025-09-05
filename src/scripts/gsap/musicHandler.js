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

  function isAudioReady () {
    return music.readyState >= 3
  }

  function playMusic () {
    music.muted = false
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

  function startMusic () {
    autoplayAttempted = true
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

  setTimeout(() => startMusic(), 2000)
  setupFirstInteractionTrigger()

  function setupFirstInteractionTrigger () {
    function handleFirstInteraction () {
      if (firstInteractionHandled) return
      firstInteractionHandled = true

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

  musicToggle.addEventListener('click', function () {
    if (isPlaying) {
      music.pause()
      isPlaying = false
      playIcon.classList.remove('hidden')
      pauseIcon.classList.add('hidden')
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
    playIcon.classList.remove('hidden')
    pauseIcon.classList.add('hidden')
  })

  music.addEventListener('pause', function () {
    isPlaying = false
    playIcon.classList.remove('hidden')
    pauseIcon.classList.add('hidden')
  })

  music.addEventListener('play', function () {
    isPlaying = true
    playIcon.classList.add('hidden')
    pauseIcon.classList.remove('hidden')
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
