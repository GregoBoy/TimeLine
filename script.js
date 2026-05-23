/* ==========================================================================
   JAVASCRIPT LOGIC - 5 MONTHS ANNIVERSARY (WARM ROSE GOLD & POLAROID THEME)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize functions
    initTimer();
    initScrollAnimations();
    initParticles();
    initBisGenerator();
    initPolaroidRotations();
    initLightboxEscKey();
    initCoupons();
    initTouchParticles();
    initPhotoUpload();
    initPuzzleGame();
});

// Helper: Scroll to timeline
function scrollToTimeline() {
    document.getElementById("timeline-section").scrollIntoView({ behavior: "smooth" });
}

/* ==========================================================================
   1. REAL-TIME COUNTUP TIMER (EXACT CALENDAR CALCULATIONS)
   ========================================================================== */
function initTimer() {
    // Official dating request date: Dec 23, 2025 at 00:00:00
    const startDate = new Date("2025-12-23T00:00:00");
    
    const monthsEl = document.getElementById("months");
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCounter() {
        const now = new Date();
        
        // Calculate total calendar months difference
        let yearsDiff = now.getFullYear() - startDate.getFullYear();
        let monthsDiff = now.getMonth() - startDate.getMonth();
        let totalMonths = yearsDiff * 12 + monthsDiff;
        
        // Create a temporary date to check if we've reached the same day in the target month
        let tempDate = new Date(startDate);
        tempDate.setMonth(tempDate.getMonth() + totalMonths);
        
        // If the current date time is before the milestone day, subtract one month
        if (tempDate > now) {
            totalMonths--;
            tempDate = new Date(startDate);
            tempDate.setMonth(tempDate.getMonth() + totalMonths);
        }
        
        // Calculate remaining time after calendar months
        const diffMs = now - tempDate;
        
        const msInDay = 24 * 60 * 60 * 1000;
        const msInHour = 60 * 60 * 1000;
        const msInMinute = 60 * 1000;
        
        const days = Math.floor(diffMs / msInDay);
        const hours = Math.floor((diffMs % msInDay) / msInHour);
        const minutes = Math.floor((diffMs % msInHour) / msInMinute);
        const seconds = Math.floor((diffMs % msInMinute) / 1000);
        
        // Update DOM
        monthsEl.textContent = String(totalMonths).padStart(2, '0');
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediately and then every second
    updateCounter();
    setInterval(updateCounter, 1000);
}

/* ==========================================================================
   2. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/* ==========================================================================
   3. DYNAMIC RANDOM ROTATIONS FOR POLAROIDS
   ========================================================================== */
function initPolaroidRotations() {
    // Add custom tilt variables to timeline cards dynamically for natural look
    const cards = document.querySelectorAll(".timeline-card");
    cards.forEach(card => {
        const randRotation = (Math.random() * 4 - 2).toFixed(1); // Between -2deg and +2deg
        const hoverRotation = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1).toFixed(1); // Between 1 and 3deg
        card.style.setProperty('--rotation', `${randRotation}deg`);
        card.style.setProperty('--hover-rotation', `${hoverRotation}deg`);
    });
}

/* ==========================================================================
   4. LIGHTBOX VISUALIZER LOGIC
   ========================================================================== */
window.openLightbox = function(imgElement) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    
    // Disable main body scroll
    document.body.style.overflow = "hidden";
    
    // Set image source
    lightboxImg.src = imgElement.src;
    
    // Extract caption text based on element hierarchy
    let captionText = imgElement.alt;
    
    // Look for siblings
    const polaroidContainer = imgElement.closest('.polaroid') || imgElement.closest('.polaroid-gallery-item');
    if (polaroidContainer) {
        const captionEl = polaroidContainer.querySelector('.polaroid-caption') || polaroidContainer.querySelector('.polaroid-gallery-caption');
        if (captionEl) {
            captionText = captionEl.textContent;
        }
    }
    
    lightboxCaption.textContent = captionText;
    
    // Activate modal
    lightbox.classList.add("active");
};

window.closeLightbox = function() {
    const lightbox = document.getElementById("lightbox");
    
    // Restore scroll
    document.body.style.overflow = "";
    
    // Deactivate modal
    lightbox.classList.remove("active");
};

// Close on ESC key press
function initLightboxEscKey() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });
}

/* ==========================================================================
   5. CANVAS PARTICLES - LIGHT THEME FLOATING ELEMENTS
   ========================================================================== */
let triggerExplosion = null; // Exposed function for clicks

function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    const activeExplosions = [];
    
    // Configuration
    const maxBackgroundParticles = 30;
    
    class FloatingParticle {
        constructor(x, y, isExplosion = false) {
            this.x = x;
            this.y = y;
            this.type = Math.random() > 0.4 ? 'heart' : 'star'; // Mix of hearts and stars
            this.size = isExplosion ? Math.random() * 8 + 4 : Math.random() * 5 + 3;
            this.speedX = isExplosion ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 0.5;
            this.speedY = isExplosion ? (Math.random() - 0.7) * 8 - 2 : -Math.random() * 0.6 - 0.2;
            
            // Warm light theme colors
            const colors = ['#d98292', '#e8a8b3', '#cfa444', '#aa78c0', '#fce2e6'];
            this.color = isExplosion 
                ? colors[Math.floor(Math.random() * colors.length)]
                : (this.type === 'heart' ? '#d98292' : '#cfa444');
                
            this.opacity = isExplosion ? 1 : Math.random() * 0.35 + 0.1;
            this.decay = isExplosion ? Math.random() * 0.015 + 0.008 : 0;
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = isExplosion ? (Math.random() - 0.5) * 0.08 : 0;
            this.isExplosion = isExplosion;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            if (this.type === 'heart') {
                // Heart shape drawing
                ctx.beginPath();
                const d = this.size;
                ctx.moveTo(0, d / 4);
                ctx.quadraticCurveTo(0, 0, d / 2, 0);
                ctx.quadraticCurveTo(d, 0, d, d / 2);
                ctx.quadraticCurveTo(d, d * 0.75, d / 2, d);
                ctx.lineTo(0, d * 1.2);
                ctx.lineTo(-d / 2, d);
                ctx.quadraticCurveTo(-d, d * 0.75, -d, d / 2);
                ctx.quadraticCurveTo(-d, 0, -d / 2, 0);
                ctx.quadraticCurveTo(0, 0, 0, d / 4);
                ctx.fill();
            } else {
                // Star shape drawing
                ctx.beginPath();
                const spikes = 5;
                const outerRadius = this.size;
                const innerRadius = this.size / 2.2;
                let rot = Math.PI / 2 * 3;
                let cx = 0;
                let cy = 0;
                let step = Math.PI / spikes;

                ctx.moveTo(0, -outerRadius);
                for (let i = 0; i < spikes; i++) {
                    cx = Math.cos(rot) * outerRadius;
                    cy = Math.sin(rot) * outerRadius;
                    ctx.lineTo(cx, cy);
                    rot += step;

                    cx = Math.cos(rot) * innerRadius;
                    cy = Math.sin(rot) * innerRadius;
                    ctx.lineTo(cx, cy);
                    rot += step;
                }
                ctx.lineTo(0, -outerRadius);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            
            if (this.isExplosion) {
                this.opacity -= this.decay;
                this.speedY += 0.12; // Gravity
            } else {
                // Wrap around
                if (this.y < -20) {
                    this.y = height + 20;
                    this.x = Math.random() * width;
                }
                if (this.x < -20) this.x = width + 20;
                if (this.x > width + 20) this.x = -20;
            }
        }
    }
    
    class ConfettiParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = Math.random() * 8 + 4;
            this.height = Math.random() * 12 + 6;
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = (Math.random() - 0.8) * 10 - 2;
            const colors = ['#d98292', '#aa78c0', '#cfa444', '#fce2e6', '#a3c2e0'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.14; // Gravity
            this.rotation += this.rotationSpeed;
            this.opacity -= this.decay;
        }
    }
    
    // Create passive background elements
    for (let i = 0; i < maxBackgroundParticles; i++) {
        particles.push(new FloatingParticle(Math.random() * width, Math.random() * height, false));
    }
    
    // Set explosion callback
    triggerExplosion = function(originX, originY) {
        // Confetti burst
        for (let i = 0; i < 40; i++) {
            activeExplosions.push(new ConfettiParticle(originX, originY));
        }
        // Shape burst
        for (let i = 0; i < 25; i++) {
            activeExplosions.push(new FloatingParticle(originX, originY, true));
        }
    };

    window.triggerMiniExplosion = function(originX, originY) {
        // Mini touch explosion
        for (let i = 0; i < 8; i++) {
            activeExplosions.push(new ConfettiParticle(originX, originY));
        }
        for (let i = 0; i < 6; i++) {
            activeExplosions.push(new FloatingParticle(originX, originY, true));
        }
    };
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        for (let i = activeExplosions.length - 1; i >= 0; i--) {
            const p = activeExplosions[i];
            p.update();
            p.draw();
            
            if (p.opacity <= 0) {
                activeExplosions.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   6. BIS GENERATOR - REASONS OF LOVE
   ========================================================================== */
const reasons = [
      "Pelas seus bom dias iniciam o meu dia com o melhor dos motivos para sorrir.",
   "Pela sua generosidade e pelo seu coração gigante que transborda empatia por onde passa.",
   "Pela sua risada linda que é, sem dúvidas, a minha vista favorita no universo inteiro.",
   "Pela sua voz suave que me traz paz, tranquilidade e aconchego.",
   "Pela forma delicada como você me entende e faz parecer que tudo no mundo vai dar certo.",
   "Porque você me incentiva a ser uma pessoa melhor a cada dia que passa.",
    "Por você me fazer rir mesmo nos dias em que eu achava que não conseguiria.",
    "Pelo seu abraço ser o lugar mais aconchegante e seguro do mundo para mim.",
    "Por causa do seu olhar carinhoso que parece ler minha alma e acalmar todas as minhas tempestades.",
    "Pelo seu sorriso lindo que ilumina qualquer dia cinzento e me enche de alegria.",
    "Por você ter escolhido continuar me conhecendo e construindo o nosso amor, mesmo nos momentos delicados.",
    "Pelo cuidado e amor generoso que você demonstra por mim em cada pequeno gesto diário.",
    "Por cada conversa na madrugada que nos aproximou e revelou a nossa incrível cumplicidade.",
    "Pela lembrança maravilhosa de acordar e dormir ao seu lado em Bitupitá, mostrando que viver com você é meu sonho.",
    "Por causa de você ser a peça que faltava na minha vida e ter me mostrado o verdadeiro significado do amor.",
    "Pelo seu beijo especial que, desde aquele primeiro dia dentro do carro, tem o poder de congelar o tempo.",
    "Por você amar meus pequenos detalhes e aceitar minhas imperfeições com tanto cuidado.",
    "Porque a nossa conexão é tão grande que parece que nos conhecemos há muito mais tempo.",
    "Por você me fazer sentir intensamente amado e valorizado como ninguém nunca fez.",
    "Por você ter a paciência de me ouvir falar sobre qualquer assunto com toda a atenção e carinho.",
    "Porque ao seu lado as coisas mais simples da rotina viram memórias extraordinárias.",
    "Pelo respeito e carinho que você tem com a minha história e com a minha vida.",
    "Por você ser minha melhor amiga, minha maior cúmplice e o grande amor da minha vida.",
    "Por me mostrar que amar pode ser leve, bonito, tranquilo e cheio de paz.",
    "Porque até o silêncio ao seu lado é um momento precioso e único.",
    "Pela coragem de nos entregarmos a esse sentimento lindo e fazê-lo crescer tão forte.",
    "Porque você transforma qualquer lugar comum na viagem dos meus sonhos, assim como foi em Bitupitá.",
    "Pelo seu cafuné que tem o superpoder de curar qualquer cansaço ou preocupação.",
    "Por você acreditar em nós, no nosso amadurecimento e no nosso futuro juntos.",
    "Simplesmente por ser você: a pessoa mais incrível, doce e perfeita que eu poderia ter em minha vida!"
];

function initBisGenerator() {
    const box3D = document.getElementById("bis-box-3d");
    const getReasonBtn = document.getElementById("get-reason-btn");
    const reasonText = document.getElementById("reason-text");
    const bisCountEl = document.getElementById("bis-count");
    const resetBtn = document.getElementById("reset-bis-btn");
    
    let openedReasons = JSON.parse(localStorage.getItem("openedReasons")) || [];
    let clickCount = openedReasons.length;
    
    bisCountEl.textContent = clickCount;
    
    let isCooldown = false;

    getReasonBtn.addEventListener("click", (e) => {
        if (isCooldown) return;
        isCooldown = true;
        
        box3D.classList.add("open");
        getReasonBtn.disabled = true;
        getReasonBtn.classList.remove("btn-pulse");

        setTimeout(() => {
            const rect = box3D.getBoundingClientRect();
            const originX = rect.left + rect.width / 2;
            const originY = rect.top + rect.height / 2;
            
            if (triggerExplosion) {
                triggerExplosion(originX, originY);
            }
            
            let selectedIndex;
            if (openedReasons.length >= reasons.length) {
                selectedIndex = Math.floor(Math.random() * reasons.length);
            } else {
                const availableIndices = [];
                for (let i = 0; i < reasons.length; i++) {
                    if (!openedReasons.includes(i)) {
                        availableIndices.push(i);
                    }
                }
                
                const randomChoice = Math.floor(Math.random() * availableIndices.length);
                selectedIndex = availableIndices[randomChoice];
                
                openedReasons.push(selectedIndex);
                localStorage.setItem("openedReasons", JSON.stringify(openedReasons));
                
                clickCount = openedReasons.length;
                bisCountEl.textContent = clickCount;
            }
            
            reasonText.classList.remove("reason-text-active");
            reasonText.classList.remove("reason-text-inactive");
            
            void reasonText.offsetWidth; // Reflow reset
            
            reasonText.textContent = `"${reasons[selectedIndex]}"`;
            reasonText.classList.add("reason-text-active");
            
            // Spawn draggable post-it with the reason
            createPostIt(reasons[selectedIndex]);
            
        }, 300);

        setTimeout(() => {
            box3D.classList.remove("open");
            getReasonBtn.disabled = false;
            getReasonBtn.classList.add("btn-pulse");
            isCooldown = false;
        }, 1200);
    });

    resetBtn.addEventListener("click", () => {
        if (confirm("Quer recomeçar a caixa de Bis e ler todos os motivos do início?")) {
            openedReasons = [];
            localStorage.removeItem("openedReasons");
            clickCount = 0;
            bisCountEl.textContent = clickCount;
            
            // Clean up any active post-it notes on screen
            const existingPostIts = document.querySelectorAll(".post-it");
            existingPostIts.forEach(p => {
                p.style.transform = "scale(0.8) rotate(0deg)";
                p.style.opacity = "0";
                setTimeout(() => p.remove(), 200);
            });
            
            reasonText.classList.remove("reason-text-active");
            reasonText.classList.add("reason-text-inactive");
            reasonText.textContent = "Caixa reiniciada. Retire um Lembrete virtual para ler um motivo...";
            
            bisCountEl.style.color = 'var(--text-primary)';
            setTimeout(() => {
                bisCountEl.style.color = 'var(--accent-pink)';
            }, 500);
        }
    });

    box3D.addEventListener("click", () => {
        if (!getReasonBtn.disabled) {
            getReasonBtn.click();
        }
    });
}

/* ==========================================================================
   7. VALES DO AMOR (LOVE COUPONS) LOGIC
   ========================================================================== */
function initCoupons() {
    let redeemedCoupons = JSON.parse(localStorage.getItem("redeemedCoupons")) || [];
    redeemedCoupons.forEach(couponId => {
        const card = document.getElementById(`coupon-${couponId}`);
        if (card) {
            card.classList.add("redeemed", "flipped");
            const btn = card.querySelector(".claim-btn");
            if (btn) {
                btn.textContent = "Resgatado! 💖";
                btn.disabled = true;
            }
        }
    });
}

window.toggleCoupon = function(card) {
    // Only toggle if not already redeemed to keep redeemed clean
    if (card.classList.contains("redeemed")) return;
    card.classList.toggle("flipped");
};

window.redeemCoupon = function(btn, event, couponId) {
    event.stopPropagation(); // Avoid flipping the card back to front
    
    const card = btn.closest(".coupon-card");
    if (card.classList.contains("redeemed")) return;
    
    // Play explosion effect at button location
    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    if (triggerExplosion) {
        triggerExplosion(originX, originY);
    }
    
    // Mark as redeemed
    card.classList.add("redeemed");
    btn.textContent = "Resgatado! 💖";
    btn.disabled = true;
    
    // Save to localStorage
    let redeemedCoupons = JSON.parse(localStorage.getItem("redeemedCoupons")) || [];
    if (!redeemedCoupons.includes(couponId)) {
        redeemedCoupons.push(couponId);
        localStorage.setItem("redeemedCoupons", JSON.stringify(redeemedCoupons));
    }
};

/* ==========================================================================
   8. INTERACTIVE TOUCH PARTICLES
   ========================================================================== */
function initTouchParticles() {
    document.addEventListener("click", (e) => {
        // Ignore if clicking on interactive components to avoid cluttering normal buttons click states
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.polaroid') || e.target.closest('.polaroid-gallery-item') || e.target.closest('.bis-box-visual') || e.target.closest('.coupon-card')) {
            return;
        }
        if (window.triggerMiniExplosion) {
            window.triggerMiniExplosion(e.clientX, e.clientY);
        }
    });

    document.addEventListener("touchstart", (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.polaroid') || e.target.closest('.polaroid-gallery-item') || e.target.closest('.bis-box-visual') || e.target.closest('.coupon-card')) {
            return;
        }
        const touch = e.touches[0];
        if (window.triggerMiniExplosion) {
            window.triggerMiniExplosion(touch.clientX, touch.clientY);
        }
    }, { passive: true });
}

/* ==========================================================================
   9. DRAGGABLE POST-IT NOTES FOR LEMBRETES (MOTIVES)
   ========================================================================== */
let maxZIndex = 1000;

function bringToFront(elmnt) {
    maxZIndex++;
    elmnt.style.zIndex = maxZIndex;
}

function makeElementDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    elmnt.onpointerdown = dragPointerDown;

    function dragPointerDown(e) {
        if (e.target.classList.contains("post-it-close")) return;
        
        bringToFront(elmnt);
        
        // Prevent default mobile drag scrolling behaviors
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onpointermove = elementDrag;
        document.onpointerup = closeDragElement;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        let newTop = elmnt.offsetTop - pos2;
        let newLeft = elmnt.offsetLeft - pos1;
        
        // Constraints to keep Post-it inside viewport bounds
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const width = elmnt.offsetWidth;
        const height = elmnt.offsetHeight;
        
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft > vw - width) newLeft = vw - width;
        if (newTop > vh - height) newTop = vh - height;
        
        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onpointermove = null;
        document.onpointerup = null;
    }
}

function createPostIt(text) {
    const postIt = document.createElement("div");
    
    // Color variants mapping
    const colors = ["yellow", "pink", "blue", "green", "purple"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    postIt.className = `post-it post-it-${randomColor}`;
    
    // Random rotation
    const rotation = (Math.random() * 14 - 7).toFixed(1); // between -7deg and 7deg
    postIt.style.transform = `rotate(${rotation}deg)`;
    
    // Random position within safe bounds of viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Choose random layout coordinates
    const left = Math.floor(Math.random() * (vw - 280)) + 20; 
    const top = Math.floor(Math.random() * (vh - 260)) + 80;  
    
    postIt.style.left = `${left}px`;
    postIt.style.top = `${top}px`;
    
    postIt.innerHTML = `
        <span class="post-it-close" title="Fechar Lembrete">&times;</span>
        <div class="post-it-content">${text}</div>
    `;
    
    document.body.appendChild(postIt);
    
    // Handle close button
    const closeBtn = postIt.querySelector(".post-it-close");
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        postIt.style.transform = "scale(0.8) rotate(0deg)";
        postIt.style.opacity = "0";
        setTimeout(() => postIt.remove(), 200);
    });
    
    // Initialize draggable handlers
    makeElementDraggable(postIt);
    bringToFront(postIt);
}

/* ==========================================================================
   10. LIVE PHOTO UPLOAD WITH STORAGE & CANVAS COMPRESSION
   ========================================================================== */
function initPhotoUpload() {
    const imgEl = document.getElementById("img-momento10");
    if (!imgEl) return;
    
    const overlayEl = document.getElementById("upload-overlay-momento10");
    const changeBtn = document.getElementById("change-photo-btn-momento10");
    
    const savedPhoto = localStorage.getItem("datingPhotoMomento10");
    if (savedPhoto) {
        imgEl.src = savedPhoto;
        imgEl.style.opacity = "1";
        overlayEl.style.display = "none";
        changeBtn.style.display = "flex";
    } else {
        imgEl.style.opacity = "0";
        overlayEl.style.display = "flex";
        changeBtn.style.display = "none";
    }
}

window.triggerPhotoUpload = function(event) {
    if (event) event.stopPropagation();
    const fileInput = document.getElementById("file-upload-momento10");
    if (fileInput) fileInput.click();
};

window.handlePhotoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Compress image to 800px max dimensions for fast performance and storage quota safety
            const maxDim = 800;
            let width = img.width;
            let height = img.height;
            
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            
            // Format to JPEG at 0.70 compression quality (fits ~40-80KB)
            const compressedData = canvas.toDataURL("image/jpeg", 0.7);
            
            try {
                localStorage.setItem("datingPhotoMomento10", compressedData);
                
                const imgEl = document.getElementById("img-momento10");
                imgEl.src = compressedData;
                imgEl.style.opacity = "1";
                
                document.getElementById("upload-overlay-momento10").style.display = "none";
                document.getElementById("change-photo-btn-momento10").style.display = "flex";
                
                // Animate celebration
                const rect = imgEl.getBoundingClientRect();
                if (triggerExplosion) {
                    triggerExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
            } catch (err) {
                console.error("Storage error:", err);
                alert("Erro ao salvar a foto na galeria local. Tente tirar ou enviar uma foto menor.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

/* ==========================================================================
   11. TAP-TO-SWAP PHOTO PUZZLE & REWARD TIMER
   ========================================================================== */
let rewardTimerInterval = null;
let rewardCountdown = 10;
let confettiInterval = null;

function initPuzzleGame() {
    const grid = document.getElementById("puzzle-grid");
    if (!grid) return;
    
    const items = Array.from(grid.querySelectorAll(".polaroid-gallery-item"));
    let isCorrect = false;
    
    // Keep shuffling Fisher-Yates until they are in an incorrect order on startup
    do {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = items[i];
            items[i] = items[j];
            items[j] = temp;
        }
        
        isCorrect = true;
        for (let i = 0; i < items.length; i++) {
            if (parseInt(items[i].getAttribute("data-index")) !== i + 1) {
                isCorrect = false;
                break;
            }
        }
    } while (isCorrect);
    
    // Clear and append shuffled
    grid.innerHTML = "";
    items.forEach(item => {
        item.classList.remove("selected");
        const randRotation = (Math.random() * 10 - 5).toFixed(1);
        item.style.setProperty('--rotation', `${randRotation}deg`);
        grid.appendChild(item);
    });
    
    let selectedItem = null;
    
    // Clone nodes to purge old listeners and bind cleanly
    const newGrid = grid.cloneNode(true);
    grid.parentNode.replaceChild(newGrid, grid);
    
    newGrid.addEventListener("click", (e) => {
        const item = e.target.closest(".polaroid-gallery-item");
        if (!item) return;
        
        e.preventDefault();
        
        if (selectedItem === null) {
            selectedItem = item;
            item.classList.add("selected");
        } else if (selectedItem === item) {
            item.classList.remove("selected");
            selectedItem = null;
        } else {
            swapGalleryItems(selectedItem, item);
            selectedItem.classList.remove("selected");
            selectedItem = null;
            checkPuzzleWinCondition(newGrid);
        }
    });
}

function swapGalleryItems(item1, item2) {
    const index1 = item1.getAttribute("data-index");
    const index2 = item2.getAttribute("data-index");
    
    const html1 = item1.innerHTML;
    const html2 = item2.innerHTML;
    
    item1.setAttribute("data-index", index2);
    item2.setAttribute("data-index", index1);
    
    item1.innerHTML = html2;
    item2.innerHTML = html1;
    
    const rot1 = (Math.random() * 10 - 5).toFixed(1);
    const rot2 = (Math.random() * 10 - 5).toFixed(1);
    item1.style.setProperty('--rotation', `${rot1}deg`);
    item2.style.setProperty('--rotation', `${rot2}deg`);
    
    const rect1 = item1.getBoundingClientRect();
    const rect2 = item2.getBoundingClientRect();
    if (window.triggerMiniExplosion) {
        window.triggerMiniExplosion(rect1.left + rect1.width/2, rect1.top + rect1.height/2);
        window.triggerMiniExplosion(rect2.left + rect2.width/2, rect2.top + rect2.height/2);
    }
}

function checkPuzzleWinCondition(grid) {
    const items = grid.querySelectorAll(".polaroid-gallery-item");
    
    let isCorrect = true;
    for (let i = 0; i < items.length; i++) {
        if (parseInt(items[i].getAttribute("data-index")) !== i + 1) {
            isCorrect = false;
            break;
        }
    }
    
    if (isCorrect) {
        triggerRewardModal();
    }
}

function triggerRewardModal() {
    const modal = document.getElementById("reward-modal");
    const clock = document.getElementById("reward-timer-clock");
    const claimBtn = document.getElementById("claim-kiss-btn");
    const statusMsg = document.getElementById("reward-status-msg");
    
    modal.classList.add("active");
    
    rewardCountdown = 10;
    clock.textContent = rewardCountdown;
    claimBtn.disabled = false;
    claimBtn.style.opacity = "1";
    claimBtn.style.cursor = "pointer";
    statusMsg.textContent = "";
    
    if (rewardTimerInterval) clearInterval(rewardTimerInterval);
    if (confettiInterval) clearInterval(confettiInterval);
    
    rewardTimerInterval = setInterval(() => {
        rewardCountdown--;
        clock.textContent = rewardCountdown;
        
        if (rewardCountdown <= 0) {
            clearInterval(rewardTimerInterval);
            claimBtn.disabled = true;
            claimBtn.style.opacity = "0.5";
            claimBtn.style.cursor = "not-allowed";
            statusMsg.textContent = "O tempo acabou! Monte o puzzle novamente para tentar de novo 😢";
            statusMsg.style.color = "#e03a3a";
        }
    }, 1000);
    
    let burstCount = 0;
    confettiInterval = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.5;
        if (triggerExplosion) {
            triggerExplosion(x, y);
        }
        burstCount++;
        if (burstCount > 15) clearInterval(confettiInterval);
    }, 800);
}

window.closeRewardModal = function() {
    const modal = document.getElementById("reward-modal");
    modal.classList.remove("active");
    
    if (rewardTimerInterval) clearInterval(rewardTimerInterval);
    if (confettiInterval) clearInterval(confettiInterval);
    
    if (rewardCountdown <= 0) {
        initPuzzleGame();
    }
};

window.claimKissReward = function() {
    if (rewardCountdown <= 0) return;
    
    const claimBtn = document.getElementById("claim-kiss-btn");
    const statusMsg = document.getElementById("reward-status-msg");
    
    if (rewardTimerInterval) clearInterval(rewardTimerInterval);
    
    claimBtn.disabled = true;
    claimBtn.style.opacity = "0.5";
    claimBtn.style.cursor = "not-allowed";
    
    statusMsg.textContent = "Resgatado! Corre para ganhar o seu beijinho! 😘💋❤️";
    statusMsg.style.color = "var(--accent-gold)";
    
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            if (triggerExplosion) triggerExplosion(x, y);
        }, i * 300);
    }
};

