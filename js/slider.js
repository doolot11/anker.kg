/* ==========================================================================
   ANKER.KG - Hero Slider Engine (slider.js)
   Responsive hero carousel slider with auto-advance (5s), pause on hover,
   pagination indicators, and touch swipe gestures.
   ========================================================================== */

class HeroSlider {
  constructor(options = {}) {
    this.intervalTime = options.interval || 5000;
    this.currentIndex = 0;
    this.timer = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.track = document.getElementById('sliderTrack');
      this.slides = document.querySelectorAll('.slide');
      this.dotsContainer = document.getElementById('sliderDots');
      this.prevBtn = document.getElementById('sliderPrev');
      this.nextBtn = document.getElementById('sliderNext');

      if (!this.track || this.slides.length === 0) return;

      this.createDots();
      this.bindEvents();
      this.startAutoSlide();
    });
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetTimer();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetTimer();
      });
    }

    // Pause on hover
    const wrapper = document.querySelector('.slider-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => this.stopAutoSlide());
      wrapper.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;

    if (this.track) {
      this.track.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;
        if (startX - endX > 50) {
          this.nextSlide();
          this.resetTimer();
        } else if (endX - startX > 50) {
          this.prevSlide();
          this.resetTimer();
        }
      }, { passive: true });
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;

    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    // Update Dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.timer = setInterval(() => this.nextSlide(), this.intervalTime);
  }

  stopAutoSlide() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}

// Instantiate Slider
window.heroSlider = new HeroSlider();
