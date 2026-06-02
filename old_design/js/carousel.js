class Carousel {
  constructor(containerId) {
    this.container  = document.getElementById(containerId);
    this.track      = document.getElementById('carouselTrack');
    this.slides     = this.track.querySelectorAll('.carousel__slide');
    this.totalSlides = this.slides.length;
    this.current    = 0;
    this.autoplayTimer = null;

    this._buildDots();
    this._bindEvents();
    this._startAutoplay();
  }

  /** Called by translationService.onChange to re-render quotes */
  updateSlideQuotes() {
    const slides = translationService.tArray('avantApres.slides');
    this.slides.forEach((slide, i) => {
      if (!slides[i]) return;
      const q = slide.querySelector('.carousel__quote p');
      const c = slide.querySelector('.carousel__quote cite');
      if (q) q.textContent = slides[i].quote;
      if (c) c.textContent = slides[i].name;
    });

    // Also update before/after labels
    document.querySelectorAll('.carousel__img-placeholder span').forEach((el, i) => {
      el.textContent = translationService.t(i % 2 === 0 ? 'avantApres.before' : 'avantApres.after');
    });
  }

  goTo(index) {
    this.current = (index + this.totalSlides) % this.totalSlides;
    this.track.style.transform = `translateX(-${this.current * 100}%)`;
    this._updateDots();
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  _buildDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  _updateDots() {
    document.querySelectorAll('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
  }

  _bindEvents() {
    document.getElementById('carouselNext')?.addEventListener('click', () => this.next());
    document.getElementById('carouselPrev')?.addEventListener('click', () => this.prev());

    // Touch/swipe
    let startX = 0;
    this.track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    this.track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
    });
  }

  _startAutoplay(interval = 5000) {
    this.autoplayTimer = setInterval(() => this.next(), interval);
    this.container?.addEventListener('mouseenter', () => clearInterval(this.autoplayTimer));
    this.container?.addEventListener('mouseleave', () => this._startAutoplay(interval));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.carouselInstance = new Carousel('carousel');
});

