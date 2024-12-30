//ordena y optimiza el codigo

const toggleThemeButton = document.getElementById('toggle-theme');

toggleThemeButton.addEventListener('click', () => {
    
    document.body.classList.toggle('dark-mode');


    if (document.body.classList.contains('dark-mode')) {
        toggleThemeButton.textContent = 'COLOR MODE';
    } else {
        toggleThemeButton.textContent = 'COLOR MODE';
    }
});


// quiero añadir aqui la funcionalidad de poner la intensidad
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY; 
    const switchPoint = window.innerHeight / 2; 
    
    if (scrollPosition > switchPoint) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        
        
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        
    }

    
});




//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';



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

// Escuchar el evento de cambio de tamaño
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Actualizar el tamaño del renderizador
  renderer.setSize(width, height);

  // Actualizar la relación de aspecto de la cámara
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);






// Cargar un modelo GLTF
const loader = new GLTFLoader();
loader.load(
  '/public/Abstract4.gltf', // Ruta al archivo GLTF
  (gltf) => {
    const model = gltf.scene;
    model.position.set(17, 0, 0); // Ajustar la posición del modelo
    model.scale.set(9, 9, 9); // Ajustar la escala del modelo
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

    

    

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  const switchPoint = window.innerHeight / 2; // Punto de cambio en la mitad de la pantalla
  
  

  if (scrollPosition > switchPoint) {
    gsap.to(directionalLight, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
    gsap.to(directionalLight2, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
    gsap.to(directionalLight3, { intensity: 12, duration: 0.2, ease: 'power1.inOut' });
    animateModel({
      position: { x: -30, y: 1, z: 0 },
      rotation: { x: Math.PI / 4, y: Math.PI / 4, z: 5 },
      scale: { x: 18, y: 18, z: 18 }
  });
  } else {
    gsap.to(directionalLight, { intensity: .12, duration: 0.2, ease: 'power1.inOut' });
    gsap.to(directionalLight2, { intensity: .12, duration: 0.2, ease: 'power1.inOut' });
    gsap.to(directionalLight3, { intensity: .12, duration: 0.2, ease: 'power1.inOut' });
    animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 9, y: 9, z: 9 }
  });
  }
});



    
   

const directionalLight = new THREE.DirectionalLight(0x6bfc03, .05);
directionalLight.position.set(10, 10, 100);
directionalLight.target = model; // Apunta al modelo
scene.add(directionalLight);
scene.add(directionalLight.target);


const directionalLight2 = new THREE.DirectionalLight(0xc203fc, .05);
directionalLight2.position.set(-10, 5, -10);
directionalLight2.target = model; // Apunta al modelo
scene.add(directionalLight2);
scene.add(directionalLight2.target);


const directionalLight3 = new THREE.DirectionalLight(0xfce303, .05);
directionalLight.position.copy(camera.position); // Poner la luz en 
directionalLight3.target = model; // Apunta al modelo
scene.add(directionalLight3);
scene.add(directionalLight3.target);


//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    
   
// Función para renderizar la escena

   
function animateModel({ position, rotation, scale }) {
  if (model) {
      if (position) {
          gsap.to(model.position, { x: position.x, y: position.y, z: position.z, duration: .4,ease: "power1.inOut" });
      }
      if (rotation) {
          gsap.to(model.rotation, { x: rotation.x, y: rotation.y, z: rotation.z, duration: .4,ease: "power1.inOut" });
      }
      if (scale) {
          gsap.to(model.scale, { x: scale.x, y: scale.y, z: scale.z, duration: .4,ease: "power1.inOut" });
      }
  }
}




const menuLeft = document.getElementById('left');

        window.addEventListener('scroll', () => {
            const triggerPoint = 4500; // Punto en píxeles donde se hace visible
            const scrollTop = window.scrollY;

            if (scrollTop >= triggerPoint) {
                menuLeft.classList.add('visible');
                animateModel({
                  position: { x: 16, y: -5, z: 0 },
                  rotation: { x: 0, y: 0, z: 0 },
                  scale: { x: 7, y: 7, z: 7 }
              });
            } else {
                menuLeft.classList.remove('visible');
            }


            
        });



//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&




const link = document.getElementById('text');
   
link.addEventListener('mouseenter', () => {

  animateModel({
      position: { x: 17, y: 1, z: 0 },
      rotation: { x: Math.PI / 4, y: Math.PI / 4, z: 3 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x00ff00).r, // Verde
    g: new THREE.Color(0x00ff00).g,
    b: new THREE.Color(0x00ff00).b,
    duration: .5,ease: "power1.inOut"
});



gsap.to(directionalLight, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight2, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight3, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });


});

link.addEventListener('mouseleave', () => {
  animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(textElement, {
    duration: 0.3,
    
    color: "#ff6347", // Cambia el color del texto
    ease: "power1.out",
    scale: "1"
  });

  gsap.to(directionalLight, { intensity: .05, duration: 0.5, ease: 'power1.inOut' });
  gsap.to(directionalLight2, { intensity: .05, duration: 0.5, ease: 'power1.inOut' });
  gsap.to(directionalLight3, { intensity: .05, duration: 0.5, ease: 'power1.inOut' });
  
});




const link1 = document.getElementById('text1');
   
link1.addEventListener('mouseenter', () => {

  animateModel({
      position: { x: 17, y: 1, z: 0 },
      rotation: { x: Math.PI / 4, y: Math.PI / 4, z: -12 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x6bfc03).r, // Verde
    g: new THREE.Color(0x403e3e).g,
    b: new THREE.Color(0x26633b).b,
    duration: .5,ease: "power1.inOut"
});
gsap.to(directionalLight, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight2, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight3, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });


});

link1.addEventListener('mouseleave', () => {
  animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x00ff00).r, // Verde
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

  animateModel({
      position: { x: 17, y: 1, z: 0 },
      rotation: { x: Math.PI / 4, y: Math.PI / 5, z: 8 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x429ef5).r, // Verde
    g: new THREE.Color(0x429ef5).g,
    b: new THREE.Color(0x429ef5).b,
    duration: .5,ease: "power1.inOut"
});
gsap.to(directionalLight, { intensity: 8, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight2, { intensity: 8, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight3, { intensity: 5, duration: 0.5, ease: 'power1.inOut' });


});

link2.addEventListener('mouseleave', () => {
  animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x00ff00).r, // Verde
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

  animateModel({
      position: { x: 17, y: 1, z: 0 },
      rotation: { x: Math.PI / 16, y: Math.PI / 6, z: -6 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x02A676).r, // Verde
    g: new THREE.Color(0x02A676).g,
    b: new THREE.Color(0x02A676).b,
    duration: .5,ease: "power1.inOut"
});
gsap.to(directionalLight, { intensity: 12, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight2, { intensity: 2, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight3, { intensity: 2, duration: 0.5, ease: 'power1.inOut' });


});

link3.addEventListener('mouseleave', () => {
  animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x00ff00).r, // Verde
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

  animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: Math.PI / 2, y: Math.PI / 4, z: -10 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0xFF4858).r, // Verde
    g: new THREE.Color(0xFF4858).g,
    b: new THREE.Color(0xFF4858).b,
    duration: .5,ease: "power1.inOut"
});


gsap.to(directionalLight, { intensity: 15, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight2, { intensity: 5, duration: 0.5, ease: 'power1.inOut' });
gsap.to(directionalLight3, { intensity: 5, duration: 0.5, ease: 'power1.inOut' });


});

link4.addEventListener('mouseleave', () => {
  animateModel({
      position: { x: 17, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 9, y: 9, z: 9 }
  });

  gsap.to(directionalLight.color, {
    r: new THREE.Color(0x00ff00).r, // Verde
    g: new THREE.Color(0x00ff00).g,
    b: new THREE.Color(0x00ff00).b,
    duration: .5,ease: "power1.inOut"
});
  gsap.to(directionalLight, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
  gsap.to(directionalLight2, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
  gsap.to(directionalLight3, { intensity: 0.1, duration: 0.5, ease: 'power1.inOut' });
  
});






//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


   
   
   
    // Añade que cuando llegue al 50% de la página cambie el tamaño del modelo
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      gsap.to(model.rotation, {
        y: scrollY * 0.01, // Ajustar la velocidad de rotación
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
                    duration: 0.5,
                    stagger: 0.01, // Retraso entre cada letra
                    ease: "power2.out"
                }
            );

        });

        // Función para regresar a su estado original
        textElement.addEventListener('mouseleave', () => {
            gsap.to(letters, {
                y: 0, // Volver a la posición original
                color: "#000000",
                duration: 0.5,
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
                    duration: 0.5,
                    stagger: 0.01, // Retraso entre cada letra
                    ease: "power2.out"
                }
            );

        });

        // Función para regresar a su estado original
        textElement1.addEventListener('mouseleave', () => {
            gsap.to(letters1, {
                y: 0, // Volver a la posición original
                color: "#000000",
                duration: 0.5,
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
                    duration: 0.5,
                    stagger: 0.01, // Retraso entre cada letra
                    ease: "power2.out"
                }
            );

        });

        // Función para regresar a su estado original
        textElement2.addEventListener('mouseleave', () => {
            gsap.to(letters2, {
                y: 0, // Volver a la posición original
                color: "#000000",
                duration: 0.5,
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
                    duration: 0.5,
                    stagger: 0.01, // Retraso entre cada letra
                    ease: "power2.out"
                }
            );

        });

        // Función para regresar a su estado original
        textElement3.addEventListener('mouseleave', () => {
            gsap.to(letters3, {
                y: 0, // Volver a la posición original
                color: "#000000",
                duration: 0.5,
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
                    duration: 0.5,
                    stagger: 0.01, // Retraso entre cada letra
                    ease: "power2.out"
                }
            );

        });

        // Función para regresar a su estado original
        textElement4.addEventListener('mouseleave', () => {
            gsap.to(letters4, {
                y: 0, // Volver a la posición original
                color: "#000000",
                duration: 0.5,
                stagger: 0.01, // Mantener el retraso
                ease: "power2.inOut"
            });

            
        });




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




