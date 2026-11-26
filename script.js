document.addEventListener('DOMContentLoaded', () => {
  if (window.__catfishTimInit) return;
  window.__catfishTimInit = true;

  /* ========================================================================
     1. LOAD SHARED COMPONENTS (NAVBAR & FOOTER) + MOBILE MENU
     ======================================================================== */
  const loadComponent = async (placeholderId, filePath) => {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return false;

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load ${filePath} (${response.status})`);
      const html = await response.text();
      placeholder.outerHTML = html;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const highlightActiveNav = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'bio.html' || currentPage === 'bio') {
      document.querySelectorAll('header a[href="bio.html"]').forEach(link => {
        link.setAttribute('aria-current', 'page');
        if (!link.closest('#mobile-menu')) {
          link.classList.add('underline', 'underline-offset-4', 'decoration-2');
        }
      });
    } else if (currentPage === 'booknow.html' || currentPage === 'booknow') {
      document.querySelectorAll('header a[href="booknow.html"]').forEach(link => {
        link.setAttribute('aria-current', 'page');
      });
    }
  };

  loadComponent('navbar-placeholder', 'components/navbar.html').then(() => {
    highlightActiveNav();
  });
  loadComponent('footer-placeholder', 'components/footer.html');

  // Event delegation for mobile hamburger menu
  document.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('#mobile-menu-btn');
    if (menuBtn) {
      const header = menuBtn.closest('header') || document;
      const mobileMenu = header.querySelector('#mobile-menu');
      const menuIconOpen = header.querySelector('#menu-icon-open');
      const menuIconClose = header.querySelector('#menu-icon-close');

      if (!mobileMenu) return;

      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
      if (menuIconOpen) menuIconOpen.classList.toggle('hidden');
      if (menuIconClose) menuIconClose.classList.toggle('hidden');
      return;
    }

    const mobileLink = e.target.closest('#mobile-menu a');
    if (mobileLink) {
      const header = mobileLink.closest('header') || document;
      const btn = header.querySelector('#mobile-menu-btn');
      const mobileMenu = header.querySelector('#mobile-menu');
      const menuIconOpen = header.querySelector('#menu-icon-open');
      const menuIconClose = header.querySelector('#menu-icon-close');

      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (mobileMenu) mobileMenu.classList.add('hidden');
      if (menuIconOpen) menuIconOpen.classList.remove('hidden');
      if (menuIconClose) menuIconClose.classList.add('hidden');
    }
  });

  /* ========================================================================
     2. GALLERY VIEW TOGGLE (GRID VS. CAROUSEL)
     ======================================================================== */
  const galleryTrack = document.getElementById('gallery-track');
  const btnGridView = document.getElementById('btn-grid-view');
  const btnCarouselView = document.getElementById('btn-carousel-view');
  const carouselControls = document.getElementById('carousel-controls');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');

  if (galleryTrack && btnGridView && btnCarouselView) {
    const setView = (mode) => {
      if (mode === 'carousel') {
        galleryTrack.classList.remove('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6', 'md:gap-8');
        galleryTrack.classList.add('gallery-carousel-mode');
        btnCarouselView.classList.add('active');
        btnGridView.classList.remove('active');
        if (carouselControls) carouselControls.classList.remove('hidden');
      } else {
        galleryTrack.classList.remove('gallery-carousel-mode');
        galleryTrack.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6', 'md:gap-8');
        btnGridView.classList.add('active');
        btnCarouselView.classList.remove('active');
        if (carouselControls) carouselControls.classList.add('hidden');
      }
    };

    btnGridView.addEventListener('click', () => setView('grid'));
    btnCarouselView.addEventListener('click', () => setView('carousel'));

    if (carouselPrev && carouselNext) {
      carouselPrev.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: -380, behavior: 'smooth' });
      });
      carouselNext.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }
  }

  /* ========================================================================
     3. LIGHTBOX MODAL
     ======================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const tattooCards = Array.from(document.querySelectorAll('.tattoo-card'));
  let currentIndex = 0;

  if (lightbox && tattooCards.length > 0) {
    const formatTitle = (rawAlt) => {
      return rawAlt
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .toUpperCase();
    };

    const showSlide = (index) => {
      if (index < 0) index = tattooCards.length - 1;
      if (index >= tattooCards.length) index = 0;
      currentIndex = index;

      const img = tattooCards[currentIndex].querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = formatTitle(img.alt);
        lightboxCounter.textContent = `${currentIndex + 1} / ${tattooCards.length}`;
      }
    };

    const openLightbox = (index) => {
      showSlide(index);
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.style.overflow = '';
    };

    tattooCards.forEach((card, index) => {
      card.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showSlide(currentIndex - 1));
    lightboxNext.addEventListener('click', () => showSlide(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });
  }

  /* ========================================================================
     4. WEB3FORMS INLINE SUBMISSION & CONFIRMATION POPUP
     ======================================================================== */
  const bookingForm = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');
  const formError = document.getElementById('form-error');
  const confirmationModal = document.getElementById('confirmation-modal');
  const closeConfirmationBtn = document.getElementById('close-confirmation-btn');

  if (bookingForm && confirmationModal) {
    const openConfirmation = () => {
      confirmationModal.classList.remove('hidden');
      confirmationModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    };

    const closeConfirmation = () => {
      confirmationModal.classList.add('hidden');
      confirmationModal.classList.remove('flex');
      document.body.style.overflow = '';
    };

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (formError) formError.classList.add('hidden');

      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(bookingForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status === 200) {
          bookingForm.reset();
          openConfirmation();
        } else {
          if (formError) {
            formError.textContent = result.message || 'Something went wrong. Please try again or email Tim directly.';
            formError.classList.remove('hidden');
          }
        }
      } catch (error) {
        if (formError) {
          formError.textContent = 'Network error. Please check your connection and try again.';
          formError.classList.remove('hidden');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });

    if (closeConfirmationBtn) {
      closeConfirmationBtn.addEventListener('click', closeConfirmation);
    }

    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) {
        closeConfirmation();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!confirmationModal.classList.contains('hidden') && e.key === 'Escape') {
        closeConfirmation();
      }
    });
  }
});
