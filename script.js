document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Intersection Observer for Reveal Animations
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    revealElements.forEach(el => revealObserver.observe(el));

    // Form Submissions
    const handleFormSubmit = (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const originalContent = btn.innerHTML;

                btn.innerHTML = 'SENDING...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = 'RECEIVED! <i data-lucide="check"></i>';
                    lucide.createIcons();
                    btn.style.background = '#059669'; // Success green
                    form.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                        btn.style.background = '';
                        btn.disabled = false;
                        lucide.createIcons();
                    }, 3000);
                }, 1500);
            });
        }
    };

    handleFormSubmit('hero-form');
    handleFormSubmit('footer-form');

    // Creative hero spotlight + gentle parallax (disabled for reduced motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('.hero');
    const orbs = document.querySelector('.hero-orbs');

    if (!prefersReducedMotion && hero) {
        let targetX = 0.5;
        let targetY = 0.4;
        let currentX = targetX;
        let currentY = targetY;
        let rafId = null;

        const onMove = (clientX, clientY) => {
            const rect = hero.getBoundingClientRect();
            const x = (clientX - rect.left) / rect.width;
            const y = (clientY - rect.top) / rect.height;
            targetX = Math.min(1, Math.max(0, x));
            targetY = Math.min(1, Math.max(0, y));
            if (!rafId) rafId = requestAnimationFrame(tick);
        };

        const tick = () => {
            rafId = null;
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;

            hero.style.setProperty('--mx', `${(currentX * 100).toFixed(2)}%`);
            hero.style.setProperty('--my', `${(currentY * 100).toFixed(2)}%`);

            if (orbs) {
                const dx = (currentX - 0.5) * 18;
                const dy = (currentY - 0.5) * 18;
                orbs.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
            }

            if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
                rafId = requestAnimationFrame(tick);
            }
        };

        hero.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        hero.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Gallery Scroll
    const galleryContainer = document.querySelector('.gallery-cards');
    const galleryNext = document.querySelector('.nav-btn-circle.next');
    const galleryPrev = document.querySelector('.nav-btn-circle.prev');

    if (galleryContainer && galleryNext && galleryPrev) {
        galleryNext.addEventListener('click', () => {
            galleryContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });
        galleryPrev.addEventListener('click', () => {
            galleryContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    // Amenities Scroll
    const amenitiesContainer = document.querySelector('.amenities-grid');
    const amenitiesNext = document.querySelector('.nav-btn.next');
    const amenitiesPrev = document.querySelector('.nav-btn.prev');

    if (amenitiesContainer && amenitiesNext && amenitiesPrev) {
        amenitiesNext.addEventListener('click', () => {
            amenitiesContainer.scrollBy({ left: 200, behavior: 'smooth' });
        });
        amenitiesPrev.addEventListener('click', () => {
            amenitiesContainer.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }

    // Traveling Map Interactions
    const mapNodes = document.querySelectorAll('.map-node');
    const navButtons = document.querySelectorAll('.map-nav-btn');
    const routePaths = document.querySelectorAll('.route-path');

    const updateMapState = (targetId) => {
        // Update Nodes
        mapNodes.forEach(node => {
            if (node.dataset.target === targetId) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        // Update Buttons
        navButtons.forEach(btn => {
            if (btn.dataset.node === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Trigger Path Drawing (Example logic)
        routePaths.forEach(path => {
            path.classList.remove('active');
            // Force reflow
            void path.offsetWidth;
            path.classList.add('active');
        });
    };

    mapNodes.forEach(node => {
        node.addEventListener('click', () => {
            updateMapState(node.dataset.target);
        });
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateMapState(btn.dataset.node);
        });
    });

    // Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allPaths = document.querySelectorAll('.route-path, .route-marking');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update Filter Buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter Map Nodes
            mapNodes.forEach(node => {
                if (filter === 'all' || node.dataset.category === filter || node.dataset.target === 'project') {
                    node.style.display = 'block';
                } else {
                    node.style.display = 'none';
                }
            });

            // Filter Road Paths
            allPaths.forEach(path => {
                if (filter === 'all' || path.dataset.category === filter) {
                    path.style.display = 'block';
                } else {
                    path.style.display = 'none';
                }
            });
        });
    });

    // Auto-trigger on reveal
    const travelSection = document.querySelector('.travel-map');
    if (travelSection) {
        const travelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    travelSection.classList.add('revealed');
                    routePaths.forEach(path => path.classList.add('active'));
                    if (window.lucide) window.lucide.createIcons();
                    travelObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        travelObserver.observe(travelSection);
    }

    if (window.lucide) window.lucide.createIcons();

    // Traveling Map Reveal and Filtering
    const travelSectionNew = document.querySelector('.travel-map');
    const travelNodes = document.querySelectorAll('.travel-map .map-node');
    const travelPaths = document.querySelectorAll('.travel-map .route-path');
    const travelFilters = document.querySelectorAll('.travel-map .filter-btn');

    if (travelSectionNew) {
        const travelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    travelSectionNew.classList.add('revealed');
                    travelObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        travelObserver.observe(travelSectionNew);
    }

    if (travelFilters.length > 0) {
        travelFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                travelFilters.forEach(f => f.classList.remove('active'));
                btn.classList.add('active');

                travelNodes.forEach(node => {
                    if (filter === 'all' || node.dataset.category === filter || node.dataset.target === 'project') {
                        node.style.opacity = '1';
                        node.style.visibility = 'visible';
                    } else {
                        node.style.opacity = '0.2';
                        node.style.visibility = 'visible';
                    }
                });
            });
        });
    }

    // Creative gallery reveal on scroll
    const creativeGallery = document.querySelector('.gallery-creative');
    if (creativeGallery) {
        if (prefersReducedMotion) {
            creativeGallery.classList.add('is-revealed');
        } else {
            const creativeGalleryObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            creativeGallery.classList.add('is-revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
            );
            creativeGalleryObserver.observe(creativeGallery);
        }
    }

    // Enquiry Popup Modal Interactions
    const enquiryModal = document.getElementById('enquiryModal');
    const modalCloseBtn = document.querySelector('.enquiry-modal__close');
    const modalOverlay = document.querySelector('.enquiry-modal__overlay');
    
    const openModal = () => {
        if (enquiryModal) {
            enquiryModal.classList.add('is-active');
            enquiryModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        }
    };
    
    const closeModal = () => {
        if (enquiryModal) {
            enquiryModal.classList.remove('is-active');
            enquiryModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Unlock scroll
        }
    };
    
    // Attach event to the new footer Enquire Button
    const footerEnquireBtn = document.getElementById('footerEnquireBtn');
    if (footerEnquireBtn) {
        footerEnquireBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    // Attach event to the EXPLORE RESIDENCES Button
    const exploreResidencesBtn = document.getElementById('exploreResidencesBtn');
    if (exploreResidencesBtn) {
        exploreResidencesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    // Attach event to old button if it still exists
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }
    
    // Attach event to Header CTA
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        navCta.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    // Attach to Close triggers
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Ensure Lucide icons are initialized
    if (window.lucide) {
        window.lucide.createIcons();
    }
});