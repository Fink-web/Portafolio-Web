// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Scroll spy for active sections
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });
    
    // Highlight active nav link
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about-text, .project-card, .skill-category, .timeline-item, .contact-info, .contact-form');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('active');
        }
    });
};

// Set all sections to active when they come into view
const animateSections = () => {
    sections.forEach(section => {
        const sectionPosition = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            section.classList.add('active');
        }
    });
};

window.addEventListener('scroll', () => {
    animateOnScroll();
    animateSections();
});

// Initialize animations on load
window.addEventListener('load', () => {
    animateOnScroll();
    animateSections();
    
    // Hero animations
    document.querySelector('.hero-content').style.animation = 'fadeInUp 1s ease forwards';
    document.querySelector('.hero-image').style.animation = 'fadeInUp 1s ease 0.3s forwards';
});

// Función para detectar dispositivo móvil
function esMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===== FUNCIONES DE VALIDACIÓN DE EMAIL (NUEVAS) =====

// Función para validar formato de email más estricta
function validarEmailEstructura(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Función para verificar dominios comunes válidos
function esDominioValido(email) {
    const dominiosComunes = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com',
        'aol.com', 'icloud.com', 'protonmail.com', 'tutanota.com',
        'company.com', 'organization.org', 'university.edu',
        // Dominios argentinos
        'fibertel.com.ar', 'arnet.com.ar', 'speedy.com.ar', 'ciudad.com.ar',
        // Dominios corporativos comunes
        'microsoft.com', 'google.com', 'apple.com', 'amazon.com'
    ];
    
    const domain = email.toLowerCase().split('@')[1];
    
    // Verificar si es un dominio común
    if (dominiosComunes.includes(domain)) {
        return true;
    }
    
    // Verificar si parece un dominio real (tiene al menos un punto y extensión válida)
    const domainParts = domain.split('.');
    const validExtensions = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'ar', 'es', 'mx', 'co', 'cl', 'pe'];
    
    return domainParts.length >= 2 && 
           validExtensions.includes(domainParts[domainParts.length - 1]) &&
           domainParts[0].length > 1;
}

// Función para detectar emails obviamente falsos
function esEmailSospechoso(email) {
    const patronesSospechosos = [
        /test@/i,
        /fake@/i,
        /noemail@/i,
        /example@/i,
        /demo@/i,
        /prueba@/i,
        /falso@/i,
        /@test\./i,
        /@fake\./i,
        /@example\./i,
        /123@/i,
        /abc@/i,
        /@123\./i,
        /@abc\./i
    ];
    
    return patronesSospechosos.some(patron => patron.test(email));
}

// Función de validación completa
function validarEmailCompleto(email) {
    if (!email) {
        return { valido: false, mensaje: 'El email es requerido' };
    }
    
    if (!validarEmailEstructura(email)) {
        return { valido: false, mensaje: 'El formato del email no es válido' };
    }
    
    if (esEmailSospechoso(email)) {
        return { valido: false, mensaje: 'Por favor, usa tu email real para poder contactarte' };
    }
    
    if (!esDominioValido(email)) {
        return { valido: false, mensaje: 'El dominio del email parece no ser válido' };
    }
    
    return { valido: true, mensaje: 'Email válido' };
}

// ===== FIN FUNCIONES DE VALIDACIÓN =====

// 🔧 FUNCIÓN CORREGIDA PARA DETECTAR PROVEEDOR DE CORREO
function detectarProveedorCorreo() {
    // 1. Detectar por dominio del email ingresado (SI EL CAMPO EXISTE)
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value && emailInput.value.includes('@')) {
        const emailDomain = emailInput.value.toLowerCase().split('@')[1];
        
        if (emailDomain) {
            if (emailDomain.includes('gmail')) return 'gmail';
            if (emailDomain.includes('outlook') || emailDomain.includes('hotmail') || emailDomain.includes('live')) return 'outlook';
            if (emailDomain.includes('yahoo')) return 'yahoo';
        }
    }
    
    // 2. Preferencia guardada previamente (PERO NO SI ES LA PRIMERA VEZ)
    const savedPreference = localStorage.getItem('preferredEmailProvider');
    const hasUsedBefore = localStorage.getItem('hasUsedEmailSystem');
    
    if (savedPreference && hasUsedBefore) {
        return savedPreference;
    }
    
    // 3. Si es la primera vez, retornar null para forzar selector
    return null;
}

// 🔧 FUNCIÓN MEJORADA PARA ABRIR PROVEEDOR ESPECÍFICO
function abrirProveedorCorreo(proveedor, destinatario, asunto, cuerpo) {
    const urls = {
        gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destinatario)}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`,
        outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(destinatario)}&subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`,
        yahoo: `https://compose.mail.yahoo.com/?to=${encodeURIComponent(destinatario)}&subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    };
    
    const url = urls[proveedor] || urls.gmail;
    
    // Marcar que el usuario ya ha usado el sistema
    localStorage.setItem('hasUsedEmailSystem', 'true');
    
    window.open(url, '_blank');
}

// 🔧 FUNCIÓN MEJORADA PARA MOSTRAR SELECTOR DE PROVEEDOR
function mostrarSelectorProveedor(destinatario, asunto, cuerpo) {
    const providers = [
        { id: 'gmail', name: 'Gmail', icon: '📧' },
        { id: 'outlook', name: 'Outlook', icon: '📮' },
        { id: 'yahoo', name: 'Yahoo Mail', icon: '📪' },
        { id: 'mailto', name: 'Cliente predeterminado', icon: '✉️' }
    ];
    
    let options = providers.map((p, index) => `${index + 1}. ${p.icon} ${p.name}`).join('\n');
    
    const choice = prompt(`🔧 Elige tu proveedor de correo preferido:\n\n${options}\n\n✅ Tu elección se guardará para próximas veces\n\nEscribe el número (1-4):`);
    
    if (!choice) return;
    
    const choiceNum = parseInt(choice);
    
    if (choiceNum === 1) {
        localStorage.setItem('preferredEmailProvider', 'gmail');
        abrirProveedorCorreo('gmail', destinatario, asunto, cuerpo);
    } else if (choiceNum === 2) {
        localStorage.setItem('preferredEmailProvider', 'outlook');
        abrirProveedorCorreo('outlook', destinatario, asunto, cuerpo);
    } else if (choiceNum === 3) {
        localStorage.setItem('preferredEmailProvider', 'yahoo');
        abrirProveedorCorreo('yahoo', destinatario, asunto, cuerpo);
    } else if (choiceNum === 4) {
        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        localStorage.setItem('preferredEmailProvider', 'mailto');
        localStorage.setItem('hasUsedEmailSystem', 'true');
        window.location.href = mailtoUrl;
    } else {
        alert('⚠️ Opción no válida. Usando Gmail por defecto.');
        localStorage.setItem('preferredEmailProvider', 'gmail');
        abrirProveedorCorreo('gmail', destinatario, asunto, cuerpo);
    }
}

// Función para abrir Gmail directamente (mantener compatibilidad)
function abrirGmail(destinatario, asunto, cuerpo) {
    abrirProveedorCorreo('gmail', destinatario, asunto, cuerpo);
}

// 🔧 FUNCIÓN HÍBRIDA MEJORADA PARA ENVÍO DE CORREO
function enviarCorreoInteligente(destinatario, asunto, cuerpo, mostrarSelector = false) {
    if (esMobile()) {
        // En móviles usa mailto (más confiable)
        const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        localStorage.setItem('hasUsedEmailSystem', 'true');
        window.location.href = mailtoUrl;
    } else {
        // En escritorio detectar proveedor preferido
        const proveedorPreferido = detectarProveedorCorreo();
        
        if (mostrarSelector || !proveedorPreferido) {
            // Mostrar selector si se solicita específicamente o si no hay preferencia
            mostrarSelectorProveedor(destinatario, asunto, cuerpo);
        } else {
            // Usar proveedor detectado/guardado
            if (proveedorPreferido === 'mailto') {
                const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
                window.location.href = mailtoUrl;
            } else {
                abrirProveedorCorreo(proveedorPreferido, destinatario, asunto, cuerpo);
            }
        }
    }
}

// 🚀 FUNCIONES DE UTILIDAD PARA DEBUGGING/TESTING
function resetearPreferenciaCorreo() {
    localStorage.removeItem('preferredEmailProvider');
    localStorage.removeItem('hasUsedEmailSystem');
    console.log('✅ Preferencias de correo reseteadas. Próximo envío mostrará el selector.');
}

function forzarGmail(destinatario, asunto, cuerpo) {
    localStorage.setItem('preferredEmailProvider', 'gmail');
    localStorage.setItem('hasUsedEmailSystem', 'true');
    abrirProveedorCorreo('gmail', destinatario, asunto, cuerpo);
    console.log('✅ Gmail forzado y preferencia guardada.');
}

function verificarEstadoCorreo() {
    const proveedor = localStorage.getItem('preferredEmailProvider');
    const haUsado = localStorage.getItem('hasUsedEmailSystem');
    
    console.log('📊 Estado del sistema de correo:');
    console.log('- Proveedor guardado:', proveedor || 'Ninguno');
    console.log('- Ha usado el sistema:', haUsado === 'true' ? 'Sí' : 'No');
    
    return { proveedor, haUsado: haUsado === 'true' };
}

// ===== FUNCIÓN SHOWSUCCESSTOAST =====

function showSuccessToast(message) {
    // Remover toasts existentes
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Crear el toast
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== FIN FUNCIÓN SHOWSUCCESSTOAST =====

// Form submission modificado CON VALIDACIÓN DE EMAIL
const contactForm = document.querySelector('.contact-form form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Deshabilita el botón para evitar múltiples envíos
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Obtiene los datos del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // NUEVA VALIDACIÓN DE EMAIL ANTES DE ENVIAR
    const validacionEmail = validarEmailCompleto(email);
    if (!validacionEmail.valido) {
        showSuccessToast(`Error en el email: ${validacionEmail.mensaje}`);
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
        return;
    }

    // Preparar mensaje para correo directo
    const cuerpoCorreo = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;

    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message
    };

    try {
        const response = await fetch("https://formspree.io/f/mqaljyjl", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showSuccessToast('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.');
            contactForm.reset(); // Limpia el formulario
        } else {
            const data = await response.json();
            showSuccessToast(`Hubo un error: ${data.errors.map(err => err.message).join(', ')}`);
        }
    } catch (error) {
        console.error('Error en el envío:', error);
        
        // Si falla Formspree, ofrecer opciones de correo directo
        const choice = confirm('El envío automático falló.\n\n✅ OK = Detectar tu proveedor automáticamente\n❌ Cancelar = Elegir proveedor manualmente\n\n¿Proceder con detección automática?');
        
        if (choice) {
            // Detección automática
            enviarCorreoInteligente('afink6042@gmail.com', subject, cuerpoCorreo, false);
        } else {
            // Selector manual
            enviarCorreoInteligente('afink6042@gmail.com', subject, cuerpoCorreo, true);
        }
    } finally {
        // Vuelve a habilitar el botón después del envío (éxito o fracaso)
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    }
});

// DETECTAR PROVEEDOR Y VALIDAR CUANDO EL USUARIO ESCRIBE SU EMAIL (MODIFICADO)
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            // Remover indicadores anteriores
            const existingIndicators = emailInput.parentNode.querySelectorAll('.email-provider-indicator, .email-validation-error');
            existingIndicators.forEach(indicator => indicator.remove());
            
            if (this.value && this.value.includes('@')) {
                // Validar email completo
                const validacion = validarEmailCompleto(this.value);
                
                if (!validacion.valido) {
                    // Mostrar error de validación
                    const errorIndicator = document.createElement('small');
                    errorIndicator.style.color = '#dc3545';
                    errorIndicator.style.fontSize = '12px';
                    errorIndicator.style.marginTop = '5px';
                    errorIndicator.style.display = 'block';
                    errorIndicator.textContent = `❌ ${validacion.mensaje}`;
                    errorIndicator.className = 'email-validation-error';
                    emailInput.parentNode.appendChild(errorIndicator);
                    
                    // Marcar el input como inválido visualmente
                    emailInput.style.borderColor = '#dc3545';
                    return;
                }
                
                // Si es válido, mostrar proveedor detectado
                const domain = this.value.toLowerCase().split('@')[1];
                let providerName = 'desconocido';
                
                if (domain) {
                    if (domain.includes('gmail')) providerName = 'Gmail';
                    else if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) providerName = 'Outlook';
                    else if (domain.includes('yahoo')) providerName = 'Yahoo';
                    else providerName = domain;
                }
                
                const successIndicator = document.createElement('small');
                successIndicator.style.color = '#28a745';
                successIndicator.style.fontSize = '12px';
                successIndicator.style.marginTop = '5px';
                successIndicator.style.display = 'block';
                successIndicator.textContent = `✅ Email válido - Proveedor: ${providerName}`;
                successIndicator.className = 'email-provider-indicator';
                emailInput.parentNode.appendChild(successIndicator);
                
                // Restaurar borde normal
                emailInput.style.borderColor = '';
            }
        });
        
        // También validar mientras escribe (opcional)
        emailInput.addEventListener('input', function() {
            // Remover estilos de error mientras escribe
            this.style.borderColor = '';
            const errorIndicators = this.parentNode.querySelectorAll('.email-validation-error');
            errorIndicators.forEach(indicator => indicator.remove());
        });
    }
});

// Efecto flotante para el botón
const hireBtn = document.querySelector('.hire-cta .btn');
if (hireBtn) {
    hireBtn.style.transition = 'transform 0.3s ease';
    hireBtn.addEventListener('mouseenter', () => {
        hireBtn.style.transform = 'translateY(-5px)';
    });
    hireBtn.addEventListener('mouseleave', () => {
        hireBtn.style.transform = 'translateY(0)';
    });
}

// Para revelar elementos al scroll
document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('reveal');
    }
  });
});

// Para menú móvil
document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
  document.querySelector('nav').classList.toggle('active');
});

// === SECCIÓN DE PROYECTOS ===

// Datos de proyectos (puedes mover esto a un archivo JSON si prefieres)
const projects = [
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Plataforma de Automatización Personal",
    date: "2025 — En desarrollo",
    description: "Sistema completo para centralizar y automatizar flujos de información utilizando tecnologías como n8n, Make, IFTTT y RSSHub. Incluye desarrollo de interfaz web responsive y panel de control personalizado.",
    tech: ["HTML5", "CSS3", "JavaScript", "n8n", "Make", "IFTTT"],
    link: "#contact"
  },
  {
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Interface Web Responsiva",
    date: "2025 — Frontend",
    description: "Landing page completamente optimizada para dispositivos móviles con 95% de compatibilidad y tiempo de carga inferior a 2 segundos. Incluye animaciones CSS avanzadas y diseño UX/UI moderno.",
    tech: ["HTML5", "CSS3", "JavaScript", "UX/UI", "Responsive"],
    link: "#contact"
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Automatización de Flujos",
    date: "2025 — Optimización",
    description: "Configuración avanzada de flujos automáticos para más de 15 fuentes de información, logrando una reducción del 70% en tiempo de consumo y 40% de mejora en organización de datos.",
    tech: ["IFTTT", "Make", "Feedly", "RSSHub", "Zapier"],
    link: "#contact"
  }
];

// Variables globales
let currentSlide = 0;
const totalSlides = projects.length;

// Inicializa el slider cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initSliderControls();
  initTouchNavigation();
  updateSlider();
});

// Renderiza todos los proyectos usando el template
function renderProjects() {
  const slidesContainer = document.getElementById('projectsSlides');
  const template = document.getElementById('projectSlideTemplate');

  // Limpia el contenedor (por si acaso)
  slidesContainer.innerHTML = '';

  projects.forEach((project, index) => {
    const slide = template.content.cloneNode(true);
    
    // Llena los datos del slide
    const slideImage = slide.querySelector('.project-slide-image');
    slideImage.style.backgroundImage = `url('${project.image}')`;
    slideImage.setAttribute('alt', `Captura del proyecto: ${project.title}`);
    
    slide.querySelector('.project-slide-title').textContent = project.title;
    slide.querySelector('.project-slide-date').textContent = project.date;
    slide.querySelector('.project-slide-description').textContent = project.description;
    
    // MODIFICACIÓN PRINCIPAL: Configura el enlace para ir a contacto
    const projectLink = slide.querySelector('.project-slide-link');
    projectLink.href = project.link;
    projectLink.setAttribute('aria-label', `Contactar para más detalles sobre ${project.title}`);
    
    // Cambia el texto del enlace
    projectLink.querySelector('span').textContent = '¡Contáctame para saber más detalles!';
    
    // Añade evento click para cerrar modal y navegar a contacto
    projectLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Cierra el modal
      closeProjectsModal();
      
      // Espera a que se cierre el modal y luego navega
      setTimeout(() => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          window.scrollTo({
            top: contactSection.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Añade un efecto visual al formulario de contacto
          const contactForm = document.querySelector('.contact-form');
          if (contactForm) {
            contactForm.style.animation = 'pulse 0.6s ease-in-out';
            contactForm.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.3)';
            
            // Remueve el efecto después de la animación
            setTimeout(() => {
              contactForm.style.animation = '';
              contactForm.style.boxShadow = '';
            }, 600);
          }
        }
      }, 300);
    });
    
    // Añade las tecnologías
    const techContainer = slide.querySelector('.project-slide-tech');
    project.tech.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      techContainer.appendChild(tag);
    });

    // Añade el slide al contenedor
    slidesContainer.appendChild(slide);
  });
}

// Configura los controles del slider
function initSliderControls() {
  // Indicadores (dots)
  const dotsContainer = document.querySelector('.slider-indicators');
  dotsContainer.innerHTML = ''; // Limpia dots existentes
  
  projects.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  // Inicializa navegación por barra de progreso
  initProgressBarNavigation();
  
  // Teclado
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Inicializa navegación por barra de progreso
function initProgressBarNavigation() {
  const progressBar = document.querySelector('.slider-progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      const targetSlide = Math.floor(percentage * totalSlides);
      
      if (targetSlide >= 0 && targetSlide < totalSlides) {
        currentSlide = targetSlide;
        updateSlider();
      }
    });
  }
}

// Inicializa navegación táctil (swipe) para móviles
function initTouchNavigation() {
  const slidesContainer = document.getElementById('projectsSlides');
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  slidesContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  slidesContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });

  slidesContainer.addEventListener('touchend', () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // mínimo de píxeles para considerar swipe
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        nextSlide();
      } else if (diff < 0 && currentSlide > 0) {
        previousSlide();
      } }})}
