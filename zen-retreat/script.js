document.addEventListener('DOMContentLoaded', () => {
  // --- GSAP Animations ---
  gsap.registerPlugin(ScrollTrigger);

  // Hero Pin & Scale Effect
  gsap.to('.js-scale-hero', {
    scale: 1.15,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    pin: ".js-pin-hero",
    pinSpacing: false // Concept section will slide over it
  });

  // Parallax Images
  const parallaxImages = document.querySelectorAll('.js-parallax');
  parallaxImages.forEach(img => {
    gsap.to(img, {
      yPercent: 15, // Move image down 15% relative to its container as we scroll
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom", 
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Internal Image Parallax (Elegant motion)
  const internalParallax = document.querySelectorAll('.js-internal-parallax');
  internalParallax.forEach(img => {
    gsap.to(img, {
      yPercent: -15, // Move image slightly upwards inside its container
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Fade Up Elements
  const fadeElements = document.querySelectorAll('.js-fade');
  fadeElements.forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // --- Reservation Modal Logic ---
  const openBtn = document.getElementById('open-reserve');
  const closeBtn = document.getElementById('close-reserve');
  const modal = document.getElementById('reserve-modal');

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // --- Flatpickr (Date Selection) ---
  const dateInput = document.getElementById('date-picker');
  const priceDisplay = document.getElementById('total-price');
  const guestSelect = document.getElementById('guest-count');

  const basePricePerPersonPerNight = 11000;

  const calculatePrice = (dates, guests) => {
    if (dates.length < 2) {
      priceDisplay.textContent = '¥0';
      return;
    }
    // Calculate nights
    const start = dates[0];
    const end = dates[1];
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // 11000 JPY * guests * nights
    const total = nights * parseInt(guests) * basePricePerPersonPerNight;
    
    priceDisplay.textContent = `¥${total.toLocaleString()}`;
  };

  let selectedDates = [];

  flatpickr(dateInput, {
    mode: "range",
    minDate: "today",
    dateFormat: "Y/m/d",
    showMonths: 1,
    onChange: function(selectedDatesArr) {
      selectedDates = selectedDatesArr;
      calculatePrice(selectedDates, guestSelect.value);
    }
  });

  guestSelect.addEventListener('change', (e) => {
    calculatePrice(selectedDates, e.target.value);
  });

});
