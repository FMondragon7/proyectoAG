import { gsap } from 'gsap'

export function initWelcome (onReady) {
  // Aseguramos que el DOM esté listo (por si lo llamas muy pronto)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }

  function start () {
    // Asegurar que el scroll esté al inicio inmediatamente
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Deshabilitar scroll durante la pantalla de bienvenida
    document.body.style.overflow = 'hidden'

    // Verificar si existe la pantalla de bienvenida
    const welcomeScreen = document.getElementById('welcomeScreen')
    const mainContent = document.getElementById('mainContent')
    const startButton = document.getElementById('startButton')

    if (!welcomeScreen || !mainContent || !startButton) {
      console.error('Elementos de la pantalla de bienvenida no encontrados')
      // En caso de no existir, liberamos el scroll y continuamos
      document.body.style.overflow = ''
      if (typeof onReady === 'function') onReady()
      return
    }

    initWelcomeAnimations()

    function initWelcomeAnimations () {
      const welcomeTitle = document.querySelector('.welcome-title')
      const welcomeSubtitle = document.querySelector('.welcome-subtitle')
      const welcomeHearts = document.querySelectorAll('.floating-heart')

      const welcomeTimeline = gsap.timeline()

      gsap.set([welcomeTitle, welcomeSubtitle, startButton], {
        opacity: 0,
        y: 50,
        scale: 0.8
      })
      gsap.set(welcomeHearts, {
        opacity: 0,
        scale: 0,
        rotation: -180
      })

      welcomeTimeline
        .to(welcomeTitle, {
          duration: 1.2,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'back.out(1.7)',
          onComplete: () => {
            gsap.to(welcomeTitle, {
              backgroundPosition: '200% center',
              duration: 3,
              ease: 'none',
              repeat: -1
            })
          }
        })
        .to(
          welcomeSubtitle,
          {
            duration: 0.8,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power2.out'
          },
          '-=0.6'
        )
        .to(
          startButton,
          {
            duration: 0.8,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'back.out(1.3)',
            onComplete: () => {
              gsap.to(startButton, {
                scale: 1.05,
                duration: 2,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true
              })
            }
          },
          '-=0.4'
        )
        .to(
          welcomeHearts,
          {
            duration: 0.6,
            opacity: 0.8,
            scale: 1,
            rotation: 0,
            ease: 'back.out(1.2)',
            stagger: { amount: 1.5, from: 'random' },
            onComplete: () => {
              welcomeHearts.forEach((heart, index) => {
                gsap.to(heart, {
                  y: -15,
                  rotation: 5,
                  duration: 2.5 + index * 0.3,
                  ease: 'power2.inOut',
                  repeat: -1,
                  yoyo: true,
                  delay: index * 0.4
                })
              })
            }
          },
          '-=0.5'
        )
    }

    // Click en “Empezar”: transición y handoff a onReady()
    startButton.addEventListener('click', function () {
      const welcomeTitle = document.querySelector('.welcome-title')
      const welcomeSubtitle = document.querySelector('.welcome-subtitle')
      const welcomeHearts = document.querySelectorAll('.floating-heart')

      // Detener animaciones existentes
      gsap.killTweensOf([welcomeTitle, welcomeSubtitle, startButton, ...welcomeHearts])

      const exitTimeline = gsap.timeline({
        onComplete: () => {
          // Ocultar bienvenida y mostrar contenido
          welcomeScreen.style.display = 'none'
          mainContent.classList.remove('hidden')

          // Rehabilitar el scroll
          document.body.style.overflow = ''

          // Asegurar scroll al inicio
          window.scrollTo(0, 0)
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0

          // 🔔 Entregamos el control al “bootstrap”
          if (typeof onReady === 'function') onReady()
        }
      })

      exitTimeline
        .to(startButton, { scale: 0.9, duration: 0.15, ease: 'power2.out' })
        .to(startButton, { scale: 1.1, duration: 0.25, ease: 'back.out(2)' })
        .to(
          [welcomeTitle, welcomeSubtitle],
          {
            opacity: 0,
            y: -30,
            scale: 0.9,
            duration: 0.6,
            ease: 'power2.in',
            stagger: 0.1
          },
          '-=0.1'
        )
        .to(
          welcomeHearts,
          {
            opacity: 0,
            scale: 0,
            rotation: 360,
            duration: 0.8,
            ease: 'back.in(1.7)',
            stagger: { amount: 0.5, from: 'random' }
          },
          '-=0.5'
        )
        .to(
          startButton,
          {
            opacity: 0,
            scale: 0.7,
            y: 20,
            duration: 0.4,
            ease: 'power2.in'
          },
          '-=0.4'
        )
        .to(
          welcomeScreen,
          {
            opacity: 0,
            scale: 1.2,
            filter: 'blur(10px)',
            duration: 1,
            ease: 'power2.inOut'
          },
          '-=0.3'
        )
        .fromTo(
          mainContent,
          { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
          '-=0.8'
        )
    })
  }
}
