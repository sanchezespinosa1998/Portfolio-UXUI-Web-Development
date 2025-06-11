document.getElementById("toggle-theme").addEventListener("click", function() {
    document.getElementById("section1").scrollIntoView({ behavior: "smooth" });
});

// FUNCIÓN PARA OBTENER EL COLOR CORRECTO SEGÚN EL MODO
function getCurrentTextColor() {
    return document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
}

// FUNCIÓN PARA ACTUALIZAR TODOS LOS COLORES DE TEXTO
function updateTextColorsForMode(color) {
    const textElements = ['text', 'text1', 'text2', 'text3', 'text4'];
    
    textElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element && !element.matches(':hover')) {
            const letters = element.querySelectorAll('span');
            if (letters.length > 0) {
                gsap.set(letters, { color: color });
            }
        }
    });
}

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY; 
    const switchPoint = window.innerHeight / 2; 
    
    if (scrollPosition > switchPoint) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        
        // ACTUALIZAR COLORES DE TEXTO INMEDIATAMENTE
        updateTextColorsForMode('#ffffff');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        
        // ACTUALIZAR COLORES DE TEXTO INMEDIATAMENTE
        updateTextColorsForMode('#000000');
    }
});

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

// FUNCIONES RESPONSIVAS
function getResponsiveValues() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    // Definir escalas y posiciones responsivas
    let scale, positionX, positionY, positionZ;

    if (isMobile) {
        scale = { x: 4, y: 4, z: 4 };
        positionX = 0; // Centrado en móviles
        positionY = 0;
        positionZ = 0;
    } else if (isTablet) {
        scale = { x: 6, y: 6, z: 6 };
        positionX = 8;
        positionY = 0;
        positionZ = 0;
    } else {
        scale = { x: 9, y: 9, z: 9 };
        positionX = 17;
        positionY = 0;
        positionZ = 0;
    }

    return {
        scale,
        position: { x: positionX, y: positionY, z: positionZ },
        isMobile,
        isTablet,
        isDesktop
    };
}

function getResponsiveScrollPositions() {
    const responsive = getResponsiveValues();
    
    if (responsive.isMobile) {
        return {
            default: { x: 0, y: -2, z: 0 },
            scroll1: { x: 0, y: -1, z: 0 },
            scroll2: { x: 0, y: -3, z: 0 }
        };
    } else if (responsive.isTablet) {
        return {
            default: { x: 8, y: 0, z: 0 },
            scroll1: { x: -15, y: 1, z: 0 },
            scroll2: { x: 8, y: -2, z: 0 }
        };
    } else {
        return {
            default: { x: 17, y: 0, z: 0 },
            scroll1: { x: -30, y: 1, z: 0 },
            scroll2: { x: 16, y: -5, z: 0 }
        };
    }
}

function animateModelResponsive({ position, rotation, scale }) {
    if (model) {
        const responsive = getResponsiveValues();
        
        // Si no se proporciona escala, usar la escala responsiva por defecto
        const finalScale = scale || responsive.scale;
        
        // Si no se proporciona posición, usar la posición responsiva por defecto
        const finalPosition = position || responsive.position;

        if (finalPosition) {
            gsap.to(model.position, { 
                x: finalPosition.x, 
                y: finalPosition.y, 
                z: finalPosition.z, 
                duration: .4,
                ease: "power1.inOut" 
            });
        }
        if (rotation) {
            gsap.to(model.rotation, { 
                x: rotation.x, 
                y: rotation.y, 
                z: rotation.z, 
                duration: .4,
                ease: "power1.inOut" 
            });
        }
        if (finalScale) {
            gsap.to(model.scale, { 
                x: finalScale.x, 
                y: finalScale.y, 
                z: finalScale.z, 
                duration: .4,
                ease: "power1.inOut" 
            });
        }
    }
}

function setInitialModelPosition() {
    if (model) {
        const responsive = getResponsiveValues();
        const positions = getResponsiveScrollPositions();
        
        model.position.set(positions.default.x, positions.default.y, positions.default.z);
        model.scale.set(responsive.scale.x, responsive.scale.y, responsive.scale.z);
    }
}

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50, // Un FOV estándar
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true // Habilitar fondo transparente
});

// Función para manejar el resize de la ventana
function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Actualizar el tamaño del renderizador
    renderer.setSize(width, height);

    // Actualizar la relación de aspecto de la cámara
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Reposicionar el modelo según el nuevo tamaño
    if (model) {
        const responsive = getResponsiveValues();
        const positions = getResponsiveScrollPositions();
        
        // Aplicar la posición por defecto responsiva
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });
    }
}

// Event listener para resize con debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Variables globales para el modelo y luces
let model;
let directionalLight, directionalLight2, directionalLight3;

// Cargar un modelo GLTF
const loader = new GLTFLoader();
loader.load(
  './Abstract4.gltf', // Ruta al archivo GLTF
  (gltf) => {
    model = gltf.scene;
    
    // Configurar posición inicial responsiva
    const responsive = getResponsiveValues();
    const positions = getResponsiveScrollPositions();
    model.position.set(positions.default.x, positions.default.y, positions.default.z);
    model.scale.set(responsive.scale.x, responsive.scale.y, responsive.scale.z);
    
    scene.add(model);

    // Configurar material realista
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3d03fc,           // Color base
      roughness: 0.5,            // Rugosidad de la superficie (0 = liso, 1 = rugoso)
      metalness: .8,            // Nivel de metalidad (0 = no metálico, 1 = metálico)
      clearcoat: 1,              // Agrega una capa de recubrimiento transparente
      clearcoatRoughness: 0,   // Rugosidad del recubrimiento
      transmission: 0,         // Efecto de transparencia (se requiere `transparent: true`)
      ior: 5.5,                  // Índice de refracción (para simular vidrio o líquidos)
      reflectivity: 0,         // Reflectividad para materiales no metálicos
      thickness: 0.5,            // Grosor del material (para simular efectos volumétricos)
      sheen: 1,                // Agrega un brillo sutil para materiales como telas
      sheenColor: new THREE.Color(0xffffff), // Color del brillo (si `sheen` > 0)
      sheenRoughness: 0.2,       // Rugosidad del brillo
      attenuationDistance: 10,   // Distancia de atenuación de la luz en materiales volumétricos
      
      side: THREE.DoubleSide,    // Renderiza ambas caras del material
      transparent: true,         // Permitir transparencia
      opacity: 1,
    });

    // Aplicar el material a todas las partes del modelo
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Configurar luces
    directionalLight = new THREE.DirectionalLight(0x6bfc03, .05);
    directionalLight.position.set(10, 10, 100);
    directionalLight.target = model; // Apunta al modelo
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    directionalLight2 = new THREE.DirectionalLight(0xc203fc, .05);
    directionalLight2.position.set(-10, 5, -10);
    directionalLight2.target = model; // Apunta al modelo
    scene.add(directionalLight2);
    scene.add(directionalLight2.target);

    directionalLight3 = new THREE.DirectionalLight(0xfce303, .05);
    directionalLight3.position.copy(camera.position); // Poner la luz en 
    directionalLight3.target = model; // Apunta al modelo
    scene.add(directionalLight3);
    scene.add(directionalLight3.target);

    // EVENT LISTENER DE SCROLL RESPONSIVO
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      const switchPoint = window.innerHeight * 0.5;
      const seccion1 = document.getElementById('section1');
      const switchPoint2 = seccion1.offsetTop - window.innerHeight * 0.25;
      const menuLeft = document.getElementById('left');
      const positions = getResponsiveScrollPositions();
      const responsive = getResponsiveValues();

      if (scrollPosition > switchPoint2) {
        // Acciones para switchPoint2
        gsap.to(directionalLight, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
        animateModelResponsive({
            position: positions.scroll2,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });
        menuLeft.classList.add('visible');
      } else if (scrollPosition > switchPoint) {
        // Acciones para switchPoint
        gsap.to(directionalLight, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
        
        const scrollScale = responsive.isMobile ? 
            { x: 8, y: 8, z: 8 } : 
            responsive.isTablet ? 
            { x: 12, y: 12, z: 12 } : 
            { x: 18, y: 18, z: 18 };
            
        animateModelResponsive({
            position: positions.scroll1,
            rotation: { x: Math.PI / 4, y: Math.PI / 4, z: 5 },
            scale: scrollScale
        });
        menuLeft.classList.remove('visible');
      } else {
        // Acciones para cuando no se superan los puntos
        gsap.to(directionalLight, { intensity: 0.12, duration: 0.2, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 0.12, duration: 0.2, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 0.12, duration: 0.2, ease: 'power1.inOut' });
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });
        menuLeft.classList.remove('visible');
      }
    });

    // EVENT LISTENERS DE HOVER RESPONSIVOS
    const link = document.getElementById('text');
    link.addEventListener('mouseenter', () => {
        const responsive = getResponsiveValues();
        
        // Calcular posición de hover basada en la posición actual
        const hoverPosition = responsive.isMobile ? 
            { x: 0, y: 1, z: 0 } : 
            responsive.isTablet ? 
            { x: 8, y: 1, z: 0 } : 
            { x: 17, y: 1, z: 0 };

        animateModelResponsive({
            position: hoverPosition,
            rotation: { x: Math.PI / 4, y: Math.PI / 4, z: 3 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x00ff00).r,
            g: new THREE.Color(0x00ff00).g,
            b: new THREE.Color(0x00ff00).b,
            duration: .5,
            ease: "power1.inOut"
        });

        gsap.to(directionalLight, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
    });

    link.addEventListener('mouseleave', () => {
        const positions = getResponsiveScrollPositions();
        const responsive = getResponsiveValues();
        
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });

        gsap.to(directionalLight, { intensity: .05, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: .05, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: .05, duration: 0.5, ease: 'power1.inOut' });
    });

    const link1 = document.getElementById('text1');
    link1.addEventListener('mouseenter', () => {
        const responsive = getResponsiveValues();
        const hoverPosition = responsive.isMobile ? 
            { x: 0, y: 1, z: 0 } : 
            { x: 17, y: 1, z: 0 };

        animateModelResponsive({
            position: hoverPosition,
            rotation: { x: Math.PI / 4, y: Math.PI / 4, z: -12 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x6bfc03).r,
            g: new THREE.Color(0x403e3e).g,
            b: new THREE.Color(0x26633b).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
    });

    link1.addEventListener('mouseleave', () => {
        const positions = getResponsiveScrollPositions();
        const responsive = getResponsiveValues();
        
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x00ff00).r,
            g: new THREE.Color(0x00ff00).g,
            b: new THREE.Color(0x00ff00).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
    });

    const link2 = document.getElementById('text2');
    link2.addEventListener('mouseenter', () => {
        const responsive = getResponsiveValues();
        const hoverPosition = responsive.isMobile ? 
            { x: 0, y: 1, z: 0 } : 
            { x: 17, y: 1, z: 0 };

        animateModelResponsive({
            position: hoverPosition,
            rotation: { x: Math.PI / 4, y: Math.PI / 5, z: 8 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x429ef5).r,
            g: new THREE.Color(0x429ef5).g,
            b: new THREE.Color(0x429ef5).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 8, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 8, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 5, duration: 0.5, ease: 'power1.inOut' });
    });

    link2.addEventListener('mouseleave', () => {
        const positions = getResponsiveScrollPositions();
        const responsive = getResponsiveValues();
        
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x00ff00).r,
            g: new THREE.Color(0x00ff00).g,
            b: new THREE.Color(0x00ff00).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
    });

    const link3 = document.getElementById('text3');
    link3.addEventListener('mouseenter', () => {
        const responsive = getResponsiveValues();
        const hoverPosition = responsive.isMobile ? 
            { x: 0, y: 1, z: 0 } : 
            { x: 17, y: 1, z: 0 };

        animateModelResponsive({
            position: hoverPosition,
            rotation: { x: Math.PI / 16, y: Math.PI / 6, z: -6 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x02A676).r,
            g: new THREE.Color(0x02A676).g,
            b: new THREE.Color(0x02A676).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 2, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 2, duration: 0.5, ease: 'power1.inOut' });
    });

    link3.addEventListener('mouseleave', () => {
        const positions = getResponsiveScrollPositions();
        const responsive = getResponsiveValues();
        
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x00ff00).r,
            g: new THREE.Color(0x00ff00).g,
            b: new THREE.Color(0x00ff00).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
    });

    const link4 = document.getElementById('text4');
    link4.addEventListener('mouseenter', () => {
        const responsive = getResponsiveValues();
        const hoverPosition = responsive.isMobile ? 
            { x: 0, y: 0, z: 0 } : 
            { x: 17, y: 0, z: 0 };

        animateModelResponsive({
            position: hoverPosition,
            rotation: { x: Math.PI / 2, y: Math.PI / 4, z: -10 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0xFF4858).r,
            g: new THREE.Color(0xFF4858).g,
            b: new THREE.Color(0xFF4858).b,
            duration: .5,ease: "power1.inOut"
        });

        gsap.to(directionalLight, { intensity: 15, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 5, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 5, duration: 0.5, ease: 'power1.inOut' });
    });

    link4.addEventListener('mouseleave', () => {
        const positions = getResponsiveScrollPositions();
        const responsive = getResponsiveValues();
        
        animateModelResponsive({
            position: positions.default,
            rotation: { x: 0, y: 0, z: 0 },
            scale: responsive.scale
        });

        gsap.to(directionalLight.color, {
            r: new THREE.Color(0x00ff00).r,
            g: new THREE.Color(0x00ff00).g,
            b: new THREE.Color(0x00ff00).b,
            duration: .5,ease: "power1.inOut"
        });
        gsap.to(directionalLight, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight2, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
        gsap.to(directionalLight3, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
    });

    // Rotación del modelo con scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      gsap.to(model.rotation, {
        y: scrollY * 0.01,
        duration: 1,
        ease: 'power2.out'
      });
    });
    
  },
  (xhr) => {
    console.log(`Modelo cargado: ${(xhr.loaded / xhr.total) * 100}% completado`);
  },
  (error) => {
    console.error('Error al cargar el modelo:', error);
  }
);

// ANIMACIONES DE TEXTO CON FIX DE MODO OSCURO
const textElement = document.getElementById('text');
const text = textElement.textContent;

// Dividir el texto en letras
textElement.innerHTML = text.split('').map(letter => `<span>${letter}</span>`).join('');

// Seleccionar todas las letras
const letters = textElement.querySelectorAll('span');

// Función para animar en hover
textElement.addEventListener('mouseover', () => {
    gsap.fromTo(
        letters,
        { y: 0, opacity: 1 }, // Estado inicial
        {
            y: -20, // Animación hacia arriba
            color: "#E7BDF2",
            duration: 0.1,
            stagger: 0.01, // Retraso entre cada letra
            ease: "power2.out"
        }
    );
});

// Función para regresar a su estado original RESPETANDO EL MODO ACTUAL
textElement.addEventListener('mouseleave', () => {
    const currentColor = getCurrentTextColor(); // ← USAR COLOR DINÁMICO
    
    gsap.to(letters, {
        y: 0, // Volver a la posición original
        color: currentColor, // ← RESPETAR MODO OSCURO
        duration: 0.1,
        stagger: 0.01, // Mantener el retraso
        ease: "power2.inOut"
    });
});

const textElement1 = document.getElementById('text1');
const text1 = textElement1.textContent;

// Dividir el texto en letras
textElement1.innerHTML = text1.split('').map(letter1 => `<span>${letter1}</span>`).join('');

// Seleccionar todas las letras
const letters1 = textElement1.querySelectorAll('span');

// Función para animar en hover
textElement1.addEventListener('mouseover', () => {
    gsap.fromTo(
        letters1,
        { y: 0, opacity: 1 }, // Estado inicial
        {
            y: -20, // Animación hacia arriba
            color: "#056CF2",
            duration: 0.1,
            stagger: 0.01, // Retraso entre cada letra
            ease: "power2.out"
        }
    );
});

// Función para regresar a su estado original RESPETANDO EL MODO ACTUAL
textElement1.addEventListener('mouseleave', () => {
    const currentColor = getCurrentTextColor(); // ← USAR COLOR DINÁMICO
    
    gsap.to(letters1, {
        y: 0, // Volver a la posición original
        color: currentColor, // ← RESPETAR MODO OSCURO
        duration: 0.1,
        stagger: 0.01, // Mantener el retraso
        ease: "power2.inOut"
    });
});

const textElement2 = document.getElementById('text2');
const text2 = textElement2.textContent;

// Dividir el texto en letras
textElement2.innerHTML = text2.split('').map(letter2 => `<span>${letter2}</span>`).join('');

// Seleccionar todas las letras
const letters2 = textElement2.querySelectorAll('span');

// Función para animar en hover
textElement2.addEventListener('mouseover', () => {
    gsap.fromTo(
        letters2,
        { y: 0, opacity: 1 }, // Estado inicial
        {
            y: -20, // Animación hacia arriba
            color: "#429ef5",
            duration: 0.1,
            stagger: 0.01, // Retraso entre cada letra
            ease: "power2.out"
        }
    );
});

// Función para regresar a su estado original RESPETANDO EL MODO ACTUAL
textElement2.addEventListener('mouseleave', () => {
    const currentColor = getCurrentTextColor(); // ← USAR COLOR DINÁMICO
    
    gsap.to(letters2, {
        y: 0, // Volver a la posición original
        color: currentColor, // ← RESPETAR MODO OSCURO
        duration: 0.1,
        stagger: 0.01, // Mantener el retraso
        ease: "power2.inOut"
    });
});

const textElement3 = document.getElementById('text3');
const text3 = textElement3.textContent;

// Dividir el texto en letras
textElement3.innerHTML = text3.split('').map(letter3 => `<span>${letter3}</span>`).join('');

// Seleccionar todas las letras
const letters3 = textElement3.querySelectorAll('span');

// Función para animar en hover
textElement3.addEventListener('mouseover', () => {
    gsap.fromTo(
        letters3,
        { y: 0, opacity: 1 }, // Estado inicial
        {
            y: -20, // Animación hacia arriba
            color: "#02A676",
            duration: 0.1,
            stagger: 0.01, // Retraso entre cada letra
            ease: "power2.out"
        }
    );
});

// Función para regresar a su estado original RESPETANDO EL MODO ACTUAL
textElement3.addEventListener('mouseleave', () => {
    const currentColor = getCurrentTextColor(); // ← USAR COLOR DINÁMICO
    
    gsap.to(letters3, {
        y: 0, // Volver a la posición original
        color: currentColor, // ← RESPETAR MODO OSCURO
        duration: 0.1,
        stagger: 0.01, // Mantener el retraso
        ease: "power2.inOut"
    });
});

const textElement4 = document.getElementById('text4');
const text4 = textElement4.textContent;

// Dividir el texto en letras
textElement4.innerHTML = text4.split('').map(letter4 => `<span>${letter4}</span>`).join('');

// Seleccionar todas las letras
const letters4 = textElement4.querySelectorAll('span');

// Función para animar en hover
textElement4.addEventListener('mouseover', () => {
    gsap.fromTo(
        letters4,
        { y: 0, opacity: 1 }, // Estado inicial
        {
            y: -20, // Animación hacia arriba
            color: "#FF4858",
            duration: 0.1,
            stagger: 0.01, // Retraso entre cada letra
            ease: "power2.out"
        }
    );
});

// Función para regresar a su estado original RESPETANDO EL MODO ACTUAL
textElement4.addEventListener('mouseleave', () => {
    const currentColor = getCurrentTextColor(); // ← USAR COLOR DINÁMICO
    
    gsap.to(letters4, {
        y: 0, // Volver a la posición original
        color: currentColor, // ← RESPETAR MODO OSCURO
        duration: 0.5,
        stagger: 0.01, // Mantener el retraso
        ease: "power2.inOut"
    });
});

// Controles de cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Añade suavidad al movimiento
controls.dampingFactor = 0.05;
controls.enableZoom = false; // Permite zoom
controls.enablePan = false; // Permite paneo
controls.enableRotate = false; // Permite rotación

// Animar la escena
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Actualiza los controles
  renderer.render(scene, camera);
}

animate();

// CSS adicional para mejorar la compatibilidad del modo oscuro
const additionalCSS = `
@media (max-width: 480px) {
    #bg {
        opacity: 0.7; /* Reducir opacidad en móviles pequeños */
    }
}

@media (max-width: 320px) {
    #bg {
        display: none; /* Ocultar completamente en pantallas muy pequeñas */
    }
}

/* Mejorar compatibilidad del modo oscuro con animaciones */
.profesiones a.link span {
    transition: color 0.3s ease;
}

body.dark-mode .profesiones a.link span {
    color: #ffffff;
}

body.light-mode .profesiones a.link span {
    color: #000000;
}

/* Solo permitir que GSAP override durante animaciones */
.profesiones a.link:hover span {
    color: inherit;
}
`;

// Añadir el CSS adicional
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);