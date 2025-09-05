// ===============================
// PANTALLA DE BIENVENIDA CON GSAP
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si existe la pantalla de bienvenida
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('mainContent');
    const startButton = document.getElementById('startButton');
    
    if (!welcomeScreen || !mainContent || !startButton) {
        console.error('Elementos de la pantalla de bienvenida no encontrados');
        return;
    }
    
    // Inicializar animaciones GSAP
    initWelcomeAnimations();
    
    function initWelcomeAnimations() {
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeSubtitle = document.querySelector('.welcome-subtitle');
        const welcomeHearts = document.querySelectorAll('.floating-heart');
        
        // Timeline para animación de entrada
        const welcomeTimeline = gsap.timeline();
        
        // Inicialmente ocultar elementos
        gsap.set([welcomeTitle, welcomeSubtitle, startButton], { 
            opacity: 0, 
            y: 50, 
            scale: 0.8 
        });
        gsap.set(welcomeHearts, { 
            opacity: 0, 
            scale: 0, 
            rotation: -180 
        });
        
        // Animación de entrada secuencial
        welcomeTimeline
            .to(welcomeTitle, { 
                duration: 1.2, 
                opacity: 1, 
                y: 0, 
                scale: 1,
                ease: "back.out(1.7)",
                onComplete: () => {
                    // Animación shimmer continua del título
                    gsap.to(welcomeTitle, {
                        backgroundPosition: "200% center",
                        duration: 3,
                        ease: "none",
                        repeat: -1
                    });
                }
            })
            .to(welcomeSubtitle, { 
                duration: 0.8, 
                opacity: 1, 
                y: 0, 
                scale: 1,
                ease: "power2.out" 
            }, "-=0.6")
            .to(startButton, { 
                duration: 0.8, 
                opacity: 1, 
                y: 0, 
                scale: 1,
                ease: "back.out(1.3)",
                onComplete: () => {
                    // Animación de pulso suave del botón
                    gsap.to(startButton, {
                        scale: 1.05,
                        duration: 2,
                        ease: "power2.inOut",
                        repeat: -1,
                        yoyo: true
                    });
                }
            }, "-=0.4")
            .to(welcomeHearts, {
                duration: 0.6,
                opacity: 0.8,
                scale: 1,
                rotation: 0,
                ease: "back.out(1.2)",
                stagger: {
                    amount: 1.5,
                    from: "random"
                },
                onComplete: () => {
                    // Animación flotante continua de corazones
                    welcomeHearts.forEach((heart, index) => {
                        gsap.to(heart, {
                            y: -15,
                            rotation: 5,
                            duration: 2.5 + (index * 0.3),
                            ease: "power2.inOut",
                            repeat: -1,
                            yoyo: true,
                            delay: index * 0.4
                        });
                    });
                }
            }, "-=0.5");
    }
    
    // Manejar click en el botón con animaciones GSAP
    startButton.addEventListener('click', function() {
        console.log('Botón presionado - iniciando transición...');
        
        // Detener todas las animaciones existentes
        gsap.killTweensOf([
            document.querySelector('.welcome-title'),
            document.querySelector('.welcome-subtitle'),
            startButton,
            ...document.querySelectorAll('.floating-heart')
        ]);
        
        // Timeline para la transición de salida
        const exitTimeline = gsap.timeline({
            onComplete: () => {
                console.log('Transición completada - mostrando contenido principal');
                welcomeScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                
                // Inicializar el contenido principal
                if (typeof initApp === 'function') {
                    initApp();
                } else {
                    console.warn('initApp no está definido');
                }
            }
        });
        
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeSubtitle = document.querySelector('.welcome-subtitle');
        const welcomeHearts = document.querySelectorAll('.floating-heart');
        
        exitTimeline
            // Efecto de click en el botón
            .to(startButton, {
                scale: 0.9,
                duration: 0.15,
                ease: "power2.out"
            })
            .to(startButton, {
                scale: 1.1,
                duration: 0.25,
                ease: "back.out(2)"
            })
            // Fade out del texto principal
            .to([welcomeTitle, welcomeSubtitle], {
                opacity: 0,
                y: -30,
                scale: 0.9,
                duration: 0.6,
                ease: "power2.in",
                stagger: 0.1
            }, "-=0.1")
            // Desvanecimiento de corazones
            .to(welcomeHearts, {
                opacity: 0,
                scale: 0,
                rotation: 360,
                duration: 0.8,
                ease: "back.in(1.7)",
                stagger: {
                    amount: 0.5,
                    from: "random"
                }
            }, "-=0.5")
            // Salida del botón
            .to(startButton, {
                opacity: 0,
                scale: 0.7,
                y: 20,
                duration: 0.4,
                ease: "power2.in"
            }, "-=0.4")
            // Zoom out final de toda la pantalla
            .to(welcomeScreen, {
                opacity: 0,
                scale: 1.2,
                filter: "blur(10px)",
                duration: 1,
                ease: "power2.inOut"
            }, "-=0.3")
            // Fade in suave del contenido principal
            .fromTo(mainContent, 
                { 
                    opacity: 0, 
                    scale: 0.95,
                    filter: "blur(5px)"
                },
                { 
                    opacity: 1, 
                    scale: 1, 
                    filter: "blur(0px)",
                    duration: 1.2, 
                    ease: "power2.out" 
                },
                "-=0.8"
            );
    });
});
