// Bootstrap script para inicializar funcionalidades del cliente
import { initApp } from './gsap/main.js';
import { initMusic } from './gsap/musicHandler.js';
import { initWelcome } from './gsap/welcome.js';

console.log('Bootstrap script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, bootstrap initialized');
    
    // Inicializar música en cuanto el DOM esté listo
    initMusic();
    
    // Inicializar la pantalla de bienvenida y pasar callback para cuando esté lista
    initWelcome(() => {
        // Una vez que la pantalla de bienvenida termine, inicializar la app principal
        console.log('Welcome screen completed, initializing main app...');
        initApp();
    });
});
