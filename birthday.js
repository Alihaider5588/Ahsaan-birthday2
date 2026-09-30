// State tracking
let currentSlide = 0;
const totalSlides = 9;

// Floating emojis generator
function initParticles() {
  const container = document.getElementById('particles');
  const emojis = ['🎂', '🎉', '✨', '🎈', '❤️', '🍕', '😂', '🔥', '👑', '🤝'];
  
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${6 + Math.random() * 10}s`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.fontSize = `${14 + Math.random() * 22}px`;
    container.appendChild(particle);
  }
}

// Slide Navigation
function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  
  // Hide current slide
  const slides = document.querySelectorAll('.card-slide');
  slides.forEach(slide => slide.classList.remove('active'));

  // Show new slide
  const target = document.getElementById(`slide-${index}`);
  if (target) {
    target.classList.add('active');
  }

  // Reset any stray runaway buttons back to their parents
  resetRunawayButtons();

  currentSlide = index;
  updateTimelineIndicator();

  // Scroll to top of card smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Birthday slide explosion
  if (index === 8) {
    launchGrandConfetti();
  }
}

function nextSlide(index) {
  goToSlide(index);
}

// Update Timeline Step Badges
function updateTimelineIndicator() {
  const steps = document.querySelectorAll('.indicator-step');
  steps.forEach((step, idx) => {
    step.classList.remove('active', 'passed');
    if (idx === currentSlide) {
      step.classList.add('active');
      step.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else if (idx < currentSlide) {
      step.classList.add('passed');
    }
  });
}

// Allow clicking timeline indicators
document.querySelectorAll('.indicator-step').forEach(step => {
  step.addEventListener('click', () => {
    const target = parseInt(step.getAttribute('data-step'), 10);
    goToSlide(target);
  });
});

/* =========================================================================
   THE NOTORIOUS RUNAWAY "NO" BUTTON (LAPTOP & MOBILE SUPPORT)
   Runs around the entire screen on hover, click attempt, or touch!
   ========================================================================= */

function setupRunawayButtons() {
  const runawayButtons = document.querySelectorAll('.runaway-btn');

  const funnyTaunts = [
    "Pakad ke dikha! 😂",
    "Arre idhar hoon! 😜",
    "Nahi ka option hi nahi! 🚀",
    "Bhai No kyun dabana chahta hai? 🏃‍♂️",
    "Ghalti se bhi No nahi dabega! 😈",
    "Ahsaan bhai treat to deni paray gi! 🍕",
    "Dhoka nahi chalega! 💨",
    "Haath nahi aane wala! ⚡",
    "Yes pe click kar chup chap! 😉",
    "Pachtaoge ustaad! 🤣"
  ];

  runawayButtons.forEach(btn => {
    const dodge = (e) => {
      // Prevent default and stop propagation immediately
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Mark button as escaped to use fixed viewport positioning
      if (!btn.classList.contains('escaped')) {
        btn.classList.add('escaped');
      }

      // Exact viewport dimensions visible to user
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Real dimensions with safe fallback
      const rect = btn.getBoundingClientRect();
      const btnWidth = rect.width || btn.offsetWidth || 130;
      const btnHeight = rect.height || btn.offsetHeight || 44;

      // TIGHT VISIBLE ZONE: Keep button in the middle 50% of screen (25% to 75%)
      // This prevents it from hiding behind headers, going under navbars, or requiring scroll
      const marginX = 20;
      const minY = Math.floor(viewportHeight * 0.2);  // Start at 20% from top
      const maxY = Math.floor(viewportHeight * 0.7);  // End at 70% from top
      
      const minX = marginX;
      const maxX = Math.max(minX, viewportWidth - btnWidth - marginX);

      // Random position strictly inside the tight visible zone
      const targetX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const targetY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      btn.style.left = `${targetX}px`;
      btn.style.top = `${targetY}px`;
      btn.style.bottom = 'auto';
      btn.style.right = 'auto';

      // Random funny taunt
      const randomTaunt = funnyTaunts[Math.floor(Math.random() * funnyTaunts.length)];
      btn.innerText = randomTaunt;

      // Gentle vibration feedback on supported mobile devices
      if (navigator.vibrate) {
        try {
          navigator.vibrate([30, 20, 30]);
        } catch (_) {}
      }
    };

    // Laptop & Desktop triggers
    btn.addEventListener('mouseenter', dodge);
    btn.addEventListener('mousemove', dodge);
    btn.addEventListener('click', dodge);
    btn.addEventListener('focus', dodge);

    // Mobile touch triggers (prevents clicking and prevents page scrolling when touching button)
    btn.addEventListener('touchstart', (e) => {
      dodge(e);
    }, { passive: false });

    btn.addEventListener('touchmove', (e) => {
      dodge(e);
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
      if (e) e.preventDefault();
    }, { passive: false });
  });
}

// Reset runaway buttons back to home when changing slides
function resetRunawayButtons() {
  const runawayButtons = document.querySelectorAll('.runaway-btn');
  runawayButtons.forEach(btn => {
    btn.classList.remove('escaped');
    btn.style.position = '';
    btn.style.left = '';
    btn.style.top = '';
  });
}

/* =========================================================================
   PHOTO UPLOAD & PREVIEW LOGIC
   ========================================================================= */
function triggerFileInput(inputId) {
  const input = document.getElementById(inputId);
  if (input) input.click();
}

function previewImage(event, previewId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById(previewId);
      if (img) {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

/* =========================================================================
   TREAT CELEBRATION, OKARA RESTAURANTS & FUNNY RESERVATION
   ========================================================================= */

let selectedRestaurantData = {
  name: 'BFC (Best Food / Fried Chicken) Okara',
  menu: 'Crispy Burger, Broast & Loaded Fries 🍗🍟'
};

function celebrateTreat() {
  const treatBox = document.getElementById('treatBox');
  const okaraSelectionBox = document.getElementById('okaraSelectionBox');
  
  if (treatBox) treatBox.style.display = 'none';
  if (okaraSelectionBox) {
    okaraSelectionBox.classList.add('active');
    okaraSelectionBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Trigger sound effect if available
  const sound = document.getElementById('confettiSound');
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  launchGrandConfetti();
}

function selectRestaurant(restName, menuInfo) {
  selectedRestaurantData = {
    name: restName,
    menu: menuInfo
  };

  // Highlight selected card
  const cards = document.querySelectorAll('.restaurant-card');
  cards.forEach(card => card.classList.remove('selected'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('selected');
  }

  // Update reservation display
  const display = document.getElementById('selectedRestDisplay');
  if (display) display.innerText = restName;

  // Show reservation form
  const resBox = document.getElementById('reservationBox');
  if (resBox) {
    resBox.classList.add('active');
    resBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function confirmReservation() {
  const timeSelect = document.getElementById('treatTime');
  const guestsSelect = document.getElementById('treatGuests');
  
  const chosenTime = timeSelect ? timeSelect.value : 'Raat 9:30 Baje';
  const chosenGuests = guestsSelect ? guestsSelect.value : 'Ali Haider + Ahsaan';

  // Fill in receipt slip
  const receiptVenue = document.getElementById('receiptVenue');
  const receiptMenu = document.getElementById('receiptMenu');
  const receiptTiming = document.getElementById('receiptTiming');

  if (receiptVenue) receiptVenue.innerText = selectedRestaurantData.name;
  if (receiptMenu) receiptMenu.innerText = selectedRestaurantData.menu;
  if (receiptTiming) receiptTiming.innerText = `${chosenTime} (${chosenGuests})`;

  // Hide earlier stages & show official receipt
  const okaraBox = document.getElementById('okaraSelectionBox');
  const resBox = document.getElementById('reservationBox');
  const officialReceipt = document.getElementById('officialReceipt');

  if (okaraBox) okaraBox.style.display = 'none';
  if (resBox) resBox.style.display = 'none';
  if (officialReceipt) {
    officialReceipt.classList.add('active');
    officialReceipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Generate WhatsApp message URL
  const waText = encodeURIComponent(
    `🎉 *AHSAAN BHAI KI BIRTHDAY TREAT CONFIRM HO GAYI!* 🍔🍕\n\n` +
    `👑 *Host & Sponsor:* Ahsaan Bhai\n` +
    `❤️ *Chief Guest:* Ali Haider\n` +
    `📍 *Venue (Okara):* ${selectedRestaurantData.name}\n` +
    `🍽️ *Menu:* ${selectedRestaurantData.menu}\n` +
    `⏰ *Timing:* ${chosenTime}\n` +
    `👥 *Company:* ${chosenGuests}\n` +
    `💳 *Bill Status:* 100% Ahsaan Bhai Sponsored! 😂💸\n\n` +
    `_Warning: Reservation lock ho chuki hai, ab pichay nahi hat saktay ustaad!_ 🚀🔥`
  );

  const waBtn = document.getElementById('whatsappShareBtn');
  if (waBtn) {
    waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;
  }

  launchGrandConfetti();
}

function fireMoreConfetti() {
  launchGrandConfetti();
}

function launchGrandConfetti() {
  if (typeof confetti === 'function') {
    // Left & Right cannon blasts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }
}

/* =========================================================================
   OPTIONAL BACKGROUND CHILL / PARTY BEAT
   ========================================================================= */
const musicToggle = document.getElementById('musicToggle');
const partyAudio = document.getElementById('partyAudio');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

if (musicToggle && partyAudio) {
  musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
      partyAudio.play().then(() => {
        isPlaying = true;
        musicIcon.className = 'fa-solid fa-volume-high';
        musicToggle.style.background = 'rgba(16, 185, 129, 0.35)';
      }).catch(err => {
        console.log("Audio autoplay prevented", err);
      });
    } else {
      partyAudio.pause();
      isPlaying = false;
      musicIcon.className = 'fa-solid fa-volume-xmark';
      musicToggle.style.background = 'rgba(255, 255, 255, 0.12)';
    }
  });
}

// Photo Lightbox Zoom
function openLightbox(card) {
  const img = card.querySelector('img');
  const caption = card.querySelector('.bday-photo-caption p');
  if (!img) return;
  const modal = document.getElementById('photoLightbox');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  if (modal && modalImg) {
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    if (modalCaption && caption) {
      modalCaption.innerHTML = caption.innerHTML;
    }
    modal.classList.add('active');
  }
}

function closeLightbox(e) {
  if (!e || e.target.id === 'photoLightbox' || e.target.classList.contains('lightbox-close-btn')) {
    const modal = document.getElementById('photoLightbox');
    if (modal) modal.classList.remove('active');
  }
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('photoLightbox');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  initParticles();
  setupRunawayButtons();
  updateTimelineIndicator();
});
