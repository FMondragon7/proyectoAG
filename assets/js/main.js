// ===============================
// BIRTHDAY WEBSITE - MAIN JAVASCRIPT
// ===============================

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ===============================
// CONFIGURACIÓN GLOBAL
// ===============================

let lastScrollY = window.scrollY;
let shootingStarTimeout;
let mouseX = 0, mouseY = 0;

// Detectar dispositivo móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
const isMobileDevice = window.innerWidth <= 768;

// ===============================
// CREACIÓN DEL FONDO ESTRELLADO
// ===============================
function createStarryBackground() {
    const starryBg = document.getElementById('starryBackground');
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starryBg.appendChild(star);
    }
}

// ===============================
// ESTRELLAS FUGACES AL HACER SCROLL
// ===============================
function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = Math.random() * 80 + 10 + '%';
    shootingStar.style.top = Math.random() * 50 + 10 + '%';
    document.body.appendChild(shootingStar);
    
    setTimeout(() => {
        if (shootingStar.parentNode) {
            shootingStar.remove();
        }
    }, 1500);
}

function initShootingStars() {
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        if (scrollDelta > 50) {
            clearTimeout(shootingStarTimeout);
            shootingStarTimeout = setTimeout(() => {
                createShootingStar();
                if (Math.random() > 0.7) {
                    setTimeout(createShootingStar, 300);
                }
            }, 100);
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===============================
// CURSOR PERSONALIZADO Y MOUSE PARALLAX
// ===============================
function initCustomCursor() {
    const cursor = document.querySelector('.love-cursor');
    
    if (!isMobile && cursor) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Usar left y top directamente para mayor precisión
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
    }
}

function initMouseParallax() {
    // Mouse parallax para elementos (solo en desktop)
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const percentX = (clientX - centerX) / centerX;
            const percentY = (clientY - centerY) / centerY;
            
            gsap.to('.parallax-element', {
                duration: 0.5,
                x: percentX * 20,
                y: percentY * 20,
                ease: 'power2.out'
            });
        });
    }
}

// ===============================
// ANIMACIONES DE ENTRADA CINEMATOGRÁFICAS
// ===============================
function initHeroAnimations() {
    // Animaciones inmediatas para prevenir popping
    document.addEventListener('DOMContentLoaded', () => {
        // Cargar elementos hero inmediatamente
        setTimeout(() => {
            document.querySelector('.hero-title')?.classList.add('loaded');
        }, 100);
        
        setTimeout(() => {
            document.querySelector('.hero-sub')?.classList.add('loaded');
        }, 300);
    });
    
    // Animación del título principal optimizada
    gsap.from('.hero-title', { 
        duration: 0.8, 
        y: 30, 
        opacity: 0, 
        scale: 0.95,
        ease: 'power2.out',
        delay: 0.1,
        onComplete: () => {
            document.querySelector('.hero-title')?.classList.add('animate');
        }
    });
    
    // El hero-sub ya se anima con CSS, no necesita GSAP adicional
    // Solo asegurar que se active la clase loaded
    setTimeout(() => {
        const heroSub = document.querySelector('.hero-sub');
        if (heroSub) {
            heroSub.classList.add('loaded');
        }
    }, 800); // Aparece después del título
}

// ===============================
// FOTOS CON EFECTOS OPTIMIZADOS
// ===============================
function quickPhotoAnimation(selector, fromProps) {
    gsap.to(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
                document.querySelector(selector)?.classList.add('element-loaded');
                if (!isMobileDevice) createSparkles(selector);
            }
        },
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'power2.out',
        from: fromProps
    });
}

function initPhotoAnimations() {
    // Array de todas las imágenes con sus tipos de animación específicos
    const photoAnimations = [
        { selector: 'img[alt="Foto 1"]', type: 'left' },
        { selector: 'img[alt="Foto 2"]', type: 'right' },
        { selector: 'img[alt="Foto 3"]', type: 'up' },
        { selector: 'img[alt="Foto 4"]', type: 'left' },
        { selector: 'img[alt="Foto 5"]', type: 'right' },
        { selector: 'img[alt="Foto 6"]', type: 'up' }
    ];

    photoAnimations.forEach((photo, index) => {
        const element = document.querySelector(photo.selector);
        if (!element) return; // Si el elemento no existe, saltar
        
        let fromProps = {};
        
        // Configurar animación según el tipo
        switch(photo.type) {
            case 'left':
                fromProps = {
                    x: isMobileDevice ? -window.innerWidth * 0.8 : -window.innerWidth * 1.2,
                    y: isMobileDevice ? 50 : 100,
                    rotation: isMobileDevice ? -15 : -25,
                    scale: 0.6,
                    opacity: 0,
                    filter: 'blur(8px)'
                };
                break;
            case 'right':
                fromProps = {
                    x: isMobileDevice ? window.innerWidth * 0.8 : window.innerWidth * 1.2,
                    y: isMobileDevice ? 50 : 100,
                    rotation: isMobileDevice ? 15 : 25,
                    scale: 0.6,
                    opacity: 0,
                    filter: 'blur(8px)'
                };
                break;
            case 'up':
                fromProps = {
                    y: isMobileDevice ? window.innerHeight * 0.6 : window.innerHeight * 0.8,
                    x: 0,
                    rotation: isMobileDevice ? 0 : 10,
                    rotationX: isMobileDevice ? 30 : 45,
                    scale: 0.5,
                    opacity: 0,
                    filter: 'blur(10px)'
                };
                break;
        }
        
        // Aplicar la animación específica a cada imagen
        gsap.fromTo(element, fromProps, {
            scrollTrigger: {
                trigger: element,
                start: photo.type === 'up' ? 'top 120%' : 'top 90%',
                end: photo.type === 'up' ? 'top 60%' : 'top 40%',
                scrub: photo.type === 'up' ? 0.3 : 1,
                anticipatePin: 1,
                onEnter: () => {
                    element.classList.add('element-loaded');
                    if (!isMobileDevice) createSparkles(photo.selector);
                }
            },
            x: 0,
            y: 0,
            rotation: 0,
            rotationX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: photo.type === 'up' ? 0.8 : 1.2,
            ease: 'power3.out'
        });

        // Efecto de magnetismo individual
        if (!isMobileDevice) {
            ScrollTrigger.create({
                trigger: element,
                start: 'top 60%',
                onEnter: () => {
                    // Pequeño rebote al llegar a la posición final
                    gsap.to(element, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out',
                        yoyo: true,
                        repeat: 1
                    });
                    
                    // Efecto de brillo
                    gsap.to(element, {
                        boxShadow: '0 0 40px rgba(129, 212, 250, 0.6), 0 0 80px rgba(248, 187, 217, 0.4)',
                        duration: 0.6,
                        ease: 'power2.out',
                        yoyo: true,
                        repeat: 1
                    });
                }
            });
        }
    });
}

// ===============================
// TÍTULOS CON EFECTOS OPTIMIZADOS
// ===============================
function quickRevealText(element) {
    element.classList.add('animate', 'element-loaded');
    gsap.from(element, {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    });
}

function quickTextAnimation(selector, delay = 0) {
    gsap.utils.toArray(selector).forEach((el, idx) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 92%',
                toggleActions: 'play none none reverse',
                onEnter: () => el.classList.add('element-loaded')
            },
            x: idx % 2 === 0 ? -40 : 40,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: delay
        });
    });
}

function initTextAnimations() {
    // Animaciones de texto reveal mejoradas
    gsap.utils.toArray('.text-reveal').forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => quickRevealText(el)
        });
    });
    
    // Animaciones de títulos coordinadas con las fotos
    gsap.fromTo('.section-title-1', {
        x: isMobileDevice ? -100 : -200,
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '.section-title-1',
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1.2,
            onEnter: () => document.querySelector('.section-title-1')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.fromTo('.section-title-2', {
        x: isMobileDevice ? 100 : 200,
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '.section-title-2',
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1.2,
            onEnter: () => document.querySelector('.section-title-2')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.fromTo('.section-title-3', {
        y: isMobileDevice ? 100 : 150,
        opacity: 0,
        scale: 0.7,
        rotationX: 20
    }, {
        scrollTrigger: {
            trigger: '.section-title-3',
            start: 'top 110%',          // Más tarde que la foto (era 95%)
            end: 'top 55%',             // Termina después
            scrub: 0.6,                 // Más rápido pero después de la foto
            onEnter: () => document.querySelector('.section-title-3')?.classList.add('element-loaded')
        },
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 0.8,                  
        ease: 'power3.out'
    });

    // Animaciones de textos de párrafo coordinadas
    gsap.fromTo('.section-text-1', {
        x: isMobileDevice ? -80 : -150,
        opacity: 0
    }, {
        scrollTrigger: {
            trigger: '.section-text-1',
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1.5,
            onEnter: () => document.querySelector('.section-text-1')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.2
    });

    gsap.fromTo('.section-text-2', {
        x: isMobileDevice ? 80 : 150,
        opacity: 0
    }, {
        scrollTrigger: {
            trigger: '.section-text-2',
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1.5,
            onEnter: () => document.querySelector('.section-text-2')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.2
    });

    gsap.fromTo('.section-text-3', {
        y: isMobileDevice ? 80 : 120,
        opacity: 0,
        scale: 0.9
    }, {
        scrollTrigger: {
            trigger: '.section-text-3',
            start: 'top 115%',          // Aún más tarde (era 98%)
            end: 'top 65%',             // Termina después del título
            scrub: 0.8,                 // Rápido pero secuencial
            onEnter: () => document.querySelector('.section-text-3')?.classList.add('element-loaded')
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,                  
        ease: 'power2.out',
        delay: 0.15                     // Pequeño delay después del título
    });

    // NUEVAS ANIMACIONES PARA LAS SECCIONES ADICIONALES
    // Sección 4
    gsap.fromTo('.section-title-4', {
        x: isMobileDevice ? -120 : -180,
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '.section-title-4',
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.6,
            onEnter: () => document.querySelector('.section-title-4')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.fromTo('.section-text-4', {
        x: isMobileDevice ? -100 : -150,
        opacity: 0,
        scale: 0.9
    }, {
        scrollTrigger: {
            trigger: '.section-text-4',
            start: 'top 95%',
            end: 'top 55%',
            scrub: 0.8,
            onEnter: () => document.querySelector('.section-text-4')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.1
    });

    // Sección 5
    gsap.fromTo('.section-title-5', {
        x: isMobileDevice ? 120 : 180,
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '.section-title-5',
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.6,
            onEnter: () => document.querySelector('.section-title-5')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.fromTo('.section-text-5', {
        x: isMobileDevice ? 100 : 150,
        opacity: 0,
        scale: 0.9
    }, {
        scrollTrigger: {
            trigger: '.section-text-5',
            start: 'top 95%',
            end: 'top 55%',
            scrub: 0.8,
            onEnter: () => document.querySelector('.section-text-5')?.classList.add('element-loaded')
        },
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.1
    });

    // Sección 6
    gsap.fromTo('.section-title-6', {
        y: isMobileDevice ? 100 : 150,
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '.section-title-6',
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.6,
            onEnter: () => document.querySelector('.section-title-6')?.classList.add('element-loaded')
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.fromTo('.section-text-6', {
        y: isMobileDevice ? 80 : 120,
        opacity: 0,
        scale: 0.9
    }, {
        scrollTrigger: {
            trigger: '.section-text-6',
            start: 'top 95%',
            end: 'top 55%',
            scrub: 0.8,
            onEnter: () => document.querySelector('.section-text-6')?.classList.add('element-loaded')
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.1
    });

    // Animaciones para la sección parallax (sección 7)
    gsap.fromTo('.section-title-7', {
        y: isMobileDevice ? -120 : -180,
        opacity: 0,
        scale: 0.7,
        rotation: isMobileDevice ? -10 : -15
    }, {
        scrollTrigger: {
            trigger: '.section-title-7',
            start: 'top 70%',             // Coordinado con la foto parallax
            end: 'top 35%',              
            scrub: 1,                    
            onEnter: () => document.querySelector('.section-title-7')?.classList.add('element-loaded')
        },
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.5,                   
        ease: 'power2.out'               
    });

    gsap.fromTo('.section-text-7', {
        y: isMobileDevice ? -100 : -150,
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '.section-text-7',
            start: 'top 75%',             
            end: 'top 40%',              
            scrub: 1.2,                  
            onEnter: () => document.querySelector('.section-text-7')?.classList.add('element-loaded')
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.2
    });
}

// ===============================
// EFECTO DE ESCRITURA OPTIMIZADO
// ===============================
function quickTypeWriter(selector, speed = 30) {
    const el = document.querySelector(selector);
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid #81d4fa';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => {
                el.style.borderRight = 'none';
            }, 500);
        }
    }
    type();
}

function initTypeWriterEffect() {
    ScrollTrigger.create({
        trigger: '.section-quote',
        start: 'top 85%',
        once: true,
        onEnter: () => {
            document.querySelector('.section-quote')?.classList.add('element-loaded');
            quickTypeWriter('.section-quote', 25);
        }
    });
}

// ===============================
// EFECTOS PARALLAX
// ===============================
function initParallaxEffects() {
    // Parallax avanzado (original) - Solo en desktop
    if (!isMobileDevice) {
        gsap.to('.parallax-img', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.parallax-img',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // Nueva animación para la foto parallax - Aparece desde arriba con efectos
    gsap.fromTo('#zoom-image', {
        y: isMobileDevice ? -window.innerHeight * 0.8 : -window.innerHeight * 1.2, // Desde arriba fuera del viewport
        x: isMobileDevice ? -50 : -100,
        rotation: isMobileDevice ? -20 : -30,
        rotationY: isMobileDevice ? 15 : 25,
        scale: 0.4,
        opacity: 0,
        filter: 'blur(12px)'
    }, {
        scrollTrigger: {
            trigger: '#parallax-section',
            start: 'top 60%',            // Más retrasado (era 70%)
            end: 'top 10%',              // Termina más tarde para efecto más suave
            scrub: 1.2,                  // Más suave (era 0.6)
            anticipatePin: 1,
            onEnter: () => {
                if (!isMobileDevice) createSparkles('#zoom-image');
            },
            onUpdate: (self) => {
                // Cuando la animación está casi completa, agregar efectos especiales
                if (self.progress > 0.8) {
                    document.querySelector('#zoom-image')?.classList.add('element-loaded');
                }
            }
        },
        y: 0,
        x: 0,
        rotation: 0,
        rotationY: 0,
        scale: 1,
        opacity: 0.9,
        filter: 'blur(0px)',
        duration: 2,                     // Más lento (era 1.5)
        ease: 'power2.out'               // Easing más suave (era power3.out)
    });

    // Efecto adicional de "magnetismo" para la foto parallax
    if (!isMobileDevice) {
        ScrollTrigger.create({
            trigger: '#zoom-image',
            start: 'top 50%',              // Cuando esté bien centrado
            onEnter: () => {
                // Pequeño rebote al llegar a la posición final
                gsap.to('#zoom-image', {
                    scale: 1.08,
                    duration: 0.4,
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                });
                
                // Efecto de brillo
                gsap.to('#zoom-image', {
                    boxShadow: '0 0 50px rgba(129, 212, 250, 0.7), 0 0 100px rgba(248, 187, 217, 0.5)',
                    duration: 0.8,
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }

    // Timeline adicional para garantizar la fluidez - Solo en desktop
    if (!isMobileDevice) {
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    ScrollTrigger.refresh();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }
}

// ===============================
// ANIMACIONES FINALES
// ===============================
function initFinalAnimations() {
    gsap.from('.section-final', {
        scrollTrigger: {
            trigger: '.section-final',
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
                document.querySelector('.section-final')?.classList.add('element-loaded');
                createHeartExplosion();
            }
        },
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    gsap.from('.section-final-sub', {
        scrollTrigger: {
            trigger: '.section-final-sub',
            start: 'top 94%',
            toggleActions: 'play none none reverse',
            onEnter: () => document.querySelector('.section-final-sub')?.classList.add('element-loaded')
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
    });
}

// ===============================
// EFECTOS ESPECIALES
// ===============================
function createSparkles(selector) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    // Crear más partículas para un efecto más dramático
    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        
        // Añadir variedad en tamaños
        const size = Math.random() * 6 + 2;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        
        element.parentNode.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 4000);
    }
    
    // Efecto de onda expansiva cuando aparece la foto
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.background = 'radial-gradient(circle, rgba(129, 212, 250, 0.3), transparent)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '0';
    element.parentNode.appendChild(ripple);
    
    gsap.to(ripple, {
        width: '300px',
        height: '300px',
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
    });
}

function createHeartExplosion() {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '💟'];
    const container = document.body;
    
    // Limpiar corazones existentes primero
    const existingHearts = document.querySelectorAll('[data-explosion-heart]');
    existingHearts.forEach(heart => heart.remove());
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.setAttribute('data-explosion-heart', 'true');
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transform = 'translate(-50%, -50%)';
        container.appendChild(heart);
        
        // Usar CSS animations como fallback si GSAP falla
        const finalX = (Math.random() - 0.5) * 800;
        const finalY = (Math.random() - 0.5) * 600;
        const rotation = Math.random() * 360;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(heart, {
                x: finalX,
                y: finalY,
                rotation: rotation,
                opacity: 0,
                duration: 3,
                ease: 'power2.out',
                onComplete: () => {
                    if (heart.parentNode) heart.remove();
                }
            });
        } else {
            // Fallback CSS animation
            heart.style.transition = 'all 3s ease-out';
            heart.style.transform = `translate(${finalX - 50}%, ${finalY - 50}%) rotate(${rotation}deg)`;
            heart.style.opacity = '0';
            setTimeout(() => {
                if (heart.parentNode) heart.remove();
            }, 3000);
        }
    }
}

function initFloatingHearts() {
    gsap.utils.toArray('.heart').forEach((heart, i) => {
        gsap.to(heart, {
            y: -30,
            rotation: 360,
            duration: 4 + Math.random() * 2,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5
        });
    });
}

// ===============================
// INTERACCIONES ESPECIALES
// ===============================
function initPhotoInteractions() {
    document.querySelectorAll('.photo-glow').forEach(photo => {
        photo.addEventListener('mouseenter', () => {
            gsap.to(photo, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
            createSparkles(photo);
        });
        
        photo.addEventListener('mouseleave', () => {
            gsap.to(photo, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ===============================
// SISTEMA DE LIMPIEZA
// ===============================
function cleanupStuckHearts() {
    // Solo remover corazones que tengan el atributo data-explosion-heart
    const explosionHearts = document.querySelectorAll('[data-explosion-heart]');
    explosionHearts.forEach(heart => heart.remove());
    
    // Remover elementos que estén en posición fixed en el centro exacto (50%, 50%)
    const suspiciousElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = getComputedStyle(el);
        return style.position === 'fixed' && 
               style.left === '50%' && 
               style.top === '50%' &&
               el.textContent.match(/[💕💖💗💝💘💞💓💟]/) &&
               !el.classList.contains('love-cursor') &&
               !el.closest('.floating-hearts');
    });
    
    suspiciousElements.forEach(el => el.remove());
    
    console.log('Cleanup completed:', {
        explosionHearts: explosionHearts.length,
        suspiciousElements: suspiciousElements.length
    });
}

// ===============================
// INICIALIZACIÓN PRINCIPAL
// ===============================
function initApp() {
    createStarryBackground();
    cleanupStuckHearts();
    
    initShootingStars();
    initCustomCursor();
    initMouseParallax();
    initHeroAnimations();
    initPhotoAnimations();
    initTextAnimations();
    initTypeWriterEffect();
    initParallaxEffects();
    initFinalAnimations();
    initFloatingHearts();
    initPhotoInteractions();
}

// Inicializar cuando el DOM esté listo (solo si no hay pantalla de bienvenida)
if (!document.getElementById('welcomeScreen')) {
    document.addEventListener('DOMContentLoaded', initApp);
}
