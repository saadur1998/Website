(function() {
  "use strict";


 document.querySelectorAll('.nav-menu .dropdown .bi-chevron-down, .nav-menu .dropdown .bi-chevron-up').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the dropdown parent
    const dropdownParent = this.closest('.dropdown');
    
    // Toggle the dropdown active class
    dropdownParent.classList.toggle('active');
    
    // Toggle the icon between down and up
    if (dropdownParent.classList.contains('active')) {
      this.classList.remove('bi-chevron-down');
      this.classList.add('bi-chevron-up');
    } else {
      this.classList.remove('bi-chevron-up');
      this.classList.add('bi-chevron-down');
    }
    
    // Toggle the dropdown menu
    const dropdownMenu = dropdownParent.querySelector('ul');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('dropdown-active');
    }
  });
});

// Make the parent links function normally when clicked (except for the icon)
document.querySelectorAll('.nav-menu .dropdown > a').forEach(link => {
  link.addEventListener('click', function(e) {
    // Only handle the click if it's directly on the link (not on the icon)
    if (!e.target.classList.contains('bi-chevron-down') && 
        !e.target.classList.contains('bi-chevron-up')) {
      // Let the link function normally (navigate to the href target)
      // Do not prevent default
    } else {
      // If the click was on the icon, prevent link navigation
      e.preventDefault();
    }
  });
});

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }
  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Portfolio Navigation Hover Preview
   */
  const setupPortfolioPreview = () => {
    // Create preview container and append to body
    const previewContainer = document.createElement('div');
    previewContainer.className = 'portfolio-preview';
    document.body.appendChild(previewContainer);
    
    // Track current hover state
    let isHoveringNav = false;
    let isHoveringPreview = false;
    let hideTimer = null;
    let currentDropdown = null;

    // Create cache for portfolio items data
    const portfolioCache = {
      // Cache structured as: 'id': {img: 'url', title: 'text', description: 'text', links: [{href: 'url', title: 'text', icon: 'html'}]}
    };

    // Initialize portfolio cache from current page if on index.html
    const initializeCache = () => {
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      portfolioItems.forEach(item => {
        const id = item.id;
        if (id) {
          const imgElement = item.querySelector('img');
          const titleElement = item.querySelector('.portfolio-info h4');
          const descriptionElement = item.querySelector('.portfolio-info p');
          const linksElements = item.querySelectorAll('.portfolio-links a');
          
          let links = [];
          linksElements.forEach(link => {
            const icon = link.querySelector('i');
            links.push({
              href: link.getAttribute('href'),
              title: link.getAttribute('title'),
              icon: icon ? icon.outerHTML : '<i class="bx bx-link"></i>'
            });
          });

          portfolioCache[id] = {
            img: imgElement ? imgElement.src : '',
            title: titleElement ? titleElement.textContent : '',
            description: descriptionElement ? descriptionElement.textContent : '',
            links: links
          };
        }
      });
    };

    // Predefined portfolio data for when not on index page
    const predefinedPortfolioData = {
      'webbuilder-item': {
        img: 'assets/img/portfolio/webbuilder.jpg',
        title: 'WebBuilder 1.0',
        description: 'A tool for building websites with AI assistance.',
        links: [
          { href: 'WebBuilder.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'crime-data-item': {
        img: 'assets/img/portfolio/portfolio-1.jpg',
        title: 'Crime Data Analytics',
        description: 'Analysis of crime patterns & trends and crime rate prediction in Montgomery County, Maryland.',
        links: [
          { href: 'CrimeDataAnalysis.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'driveberry-item': {
        img: 'assets/img/portfolio/portfolio-4.jpg',
        title: 'DriveBerry',
        description: 'Miniature autonomous vehicle trained using reinforcement learning, OpenCV, and CNN with 100% accuracy.',
        links: [
          { href: 'DriveBerry.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'covid-item': {
        img: 'assets/img/portfolio/covid.jpg',
        title: 'COVID-19 Radiography',
        description: 'Detection of COVID-19, Viral Pneumonia, Lung Opacity, and Normal X-Rays using PyTorch & RasNet(CNN) with 94% accuracy.',
        links: [
          { href: 'Covid.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'job-application-item': {
        img: 'assets/img/portfolio/job.jpg',
        title: 'Job Application Analysis',
        description: 'Analysis of job application data with visualizations to optimize job search strategies.',
        links: [
          { href: 'JobApplicationAnalysis.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'text2canvas-item': {
        img: 'assets/img/portfolio/text.jpg',
        title: 'Text2Canvas',
        description: 'Prompt-to-image generation model built by implementing a diffusion model(U-Net) & NLP and deployed on HuggingFace Space.',
        links: [
          { href: 'TextToCanvas.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'recommendation-system-item': {
        img: 'assets/img/portfolio/portfolio-2.jpg',
        title: 'Recommendation Systems',
        description: 'Netflix movie recommendation models using NLP and Scikit-Learn.',
        links: [
          { href: 'RecommendationSystem.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'feature-extraction-item': {
        img: 'assets/img/portfolio/portfolio-5.jpg',
        title: 'Feature Extraction & Classification',
        description: 'PyTorch-based image classification on CIFAR-10 dataset with optimized models.',
        links: [
          { href: 'FeatureExtraction.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'databot-item': {
        img: 'assets/img/portfolio/portfolio-8.jpg',
        title: 'OpenAI DataBot',
        description: 'Langchain-based chatbot using Retrieval Augmented Generation for data analysis.',
        links: [
          { href: 'DataBot.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      },
      'mnist-classification-item': {
        img: 'assets/img/portfolio/portfolio-9.jpg',
        title: 'Kuzushiji-MNIST Classification',
        description: 'Classification of ancient Japanese characters using dimensionality reduction techniques and KNN.',
        links: [
          { href: 'MNISTClassification.html', title: 'View Details', icon: '<i class="bx bx-plus"></i>' }
        ]
      }
    };
    
    // Get all portfolio navigation items with data-portfolio-id
    const portfolioNavLinks = document.querySelectorAll('.nav-menu .dropdown ul li a[data-portfolio-id]');
    
    // Helper function to position the preview
    const positionPreview = (el, preview) => {
      const navRect = el.getBoundingClientRect();
      const headerWidth = document.getElementById('header').offsetWidth;
      const isMobile = window.innerWidth < 1200; // Check if mobile view
      
      if (isMobile) {
        // On mobile, position below the link
        preview.style.left = '20px';
        preview.style.top = (navRect.bottom + 10) + 'px';
        preview.style.width = (window.innerWidth - 40) + 'px';
      } else {
        // On desktop, position to the right of the sidebar
        preview.style.left = (headerWidth + 20) + 'px';
        // Calculate the preview height based on its content
        const previewHeight = preview.offsetHeight;
        let topPosition = navRect.top;
        
        // Check if the preview would go off the bottom of the screen
        if (topPosition + previewHeight > window.innerHeight) {
          // If it would go off screen, position it higher
          topPosition = Math.max(10, window.innerHeight - previewHeight - 10);
        }
        
        preview.style.top = topPosition + 'px';
        preview.style.width = '350px';
        
        // Check if preview would go off the right edge of screen
        const rightEdge = parseInt(preview.style.left) + parseInt(preview.style.width);
        if (rightEdge > window.innerWidth) {
          preview.style.left = (window.innerWidth - parseInt(preview.style.width) - 20) + 'px';
        }
      }
    };
    
    const showPreview = (link) => {
      // Keep dropdown menu open
      currentDropdown = link.closest('.dropdown');
      if (currentDropdown) {
        currentDropdown.classList.add('active');
        const dropdownMenu = currentDropdown.querySelector('ul');
        if (dropdownMenu) {
          dropdownMenu.classList.add('dropdown-active');
        }
      }
      
      // Get the portfolio ID
      const portfolioId = link.getAttribute('data-portfolio-id');
      
      // Check if we have the data in cache or predefined data
      let portfolioData = portfolioCache[portfolioId] || predefinedPortfolioData[portfolioId];
      
      // If we have data, show the preview
      if (portfolioData) {
        // Build links HTML
        let linksHTML = '';
        portfolioData.links.forEach(link => {
          linksHTML += `<a href="${link.href}" title="${link.title}">${link.icon}</a>`;
        });
        
        // Fill the preview container
        previewContainer.innerHTML = `
          <img src="${portfolioData.img}" alt="${portfolioData.title}">
          <h4>${portfolioData.title}</h4>
          <p>${portfolioData.description}</p>
          <div class="preview-links">
            ${linksHTML}
          </div>
        `;
        
        // Show and position the preview
        previewContainer.style.display = 'block';
        
        // We need to first show it, then get dimensions for positioning
        setTimeout(() => {
          positionPreview(link, previewContainer);
          // Add active class after positioned for transition
          previewContainer.classList.add('active');
        }, 10);
      } else {
        // Fallback: try to get the data from the DOM
        const portfolioItem = document.getElementById(portfolioId);
        
        if (portfolioItem) {
          // Extract data from the portfolio item
          const img = portfolioItem.querySelector('img').src;
          const title = portfolioItem.querySelector('.portfolio-info h4').textContent;
          const description = portfolioItem.querySelector('.portfolio-info p').textContent;
          
          // Get all links from the original portfolio item
          let linksHTML = '';
          const portfolioLinks = portfolioItem.querySelectorAll('.portfolio-links a');
          portfolioLinks.forEach(link => {
            const icon = link.querySelector('i').cloneNode(true);
            const linkTitle = link.getAttribute('title');
            const linkHref = link.getAttribute('href');
            linksHTML += `<a href="${linkHref}" title="${linkTitle}">${icon.outerHTML}</a>`;
          });
          
          // Fill the preview container
          previewContainer.innerHTML = `
            <img src="${img}" alt="${title}">
            <h4>${title}</h4>
            <p>${description}</p>
            <div class="preview-links">
              ${linksHTML}
            </div>
          `;
          
          // Show and position the preview
          previewContainer.style.display = 'block';
          
          // We need to first show it, then get dimensions for positioning
          setTimeout(() => {
            positionPreview(link, previewContainer);
            // Add active class after positioned for transition
            previewContainer.classList.add('active');
          }, 10);
          
          // Cache the data for future use
          portfolioCache[portfolioId] = {
            img: img,
            title: title,
            description: description,
            links: [...portfolioLinks].map(link => {
              const icon = link.querySelector('i');
              return {
                href: link.getAttribute('href'),
                title: link.getAttribute('title'),
                icon: icon ? icon.outerHTML : ''
              };
            })
          };
        }
      }
    };
    
    const attemptHidePreview = () => {
      // Only hide if neither the nav item nor the preview is being hovered
      if (!isHoveringNav && !isHoveringPreview) {
        previewContainer.classList.remove('active');
        hideTimer = setTimeout(() => {
          previewContainer.style.display = 'none';
          
          // Only reset dropdown if we're actually hiding
          if (!isHoveringNav && !isHoveringPreview && currentDropdown) {
            // Allow dropdown to be closed by navigation system
            currentDropdown = null;
          }
        }, 300); // Match transition time
      }
    };
    
    // Add event listeners to each navigation item
    portfolioNavLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
        isHoveringNav = true;
        // Clear any pending hide timers
        if (hideTimer) {
          clearTimeout(hideTimer);
          hideTimer = null;
        }
        showPreview(this);
      });
      
      link.addEventListener('mouseleave', function() {
        isHoveringNav = false;
        // Give a short delay to check if user moved to preview
        setTimeout(attemptHidePreview, 100);
      });
    });
    
    // Add event listeners to the preview container
    previewContainer.addEventListener('mouseenter', function() {
      isHoveringPreview = true;
      // Clear any pending hide timers
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    });
    
    previewContainer.addEventListener('mouseleave', function() {
      isHoveringPreview = false;
      attemptHidePreview();
    });
    
    // Update position on window resize
    window.addEventListener('resize', () => {
      if (previewContainer.style.display === 'block') {
        const activeLink = document.querySelector('.nav-menu .dropdown ul li a:hover[data-portfolio-id]');
        if (activeLink) {
          positionPreview(activeLink, previewContainer);
        }
      }
    });

    // Initialize cache if we're on the index page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
      initializeCache();
    }
  };
  
  // Initialize portfolio preview on window load
  window.addEventListener('load', setupPortfolioPreview);

  // ... existing code ...

document.getElementById("contact-form").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission
  
  // Hide any previously displayed messages
  document.querySelector(".sent-message").style.display = "none";
  document.querySelector(".error-message").style.display = "none";
  document.querySelector(".loading").style.display = "block";

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  try {
    // Using no-cors mode to bypass CORS restrictions temporarily
    const response = await fetch("https://f06hdmrh0i.execute-api.us-east-1.amazonaws.com/portfolio_email_sender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
      mode: "no-cors" // Use no-cors mode temporarily
    });

    document.querySelector(".loading").style.display = "none";
    
    // In no-cors mode, we can't access response details
    // We'll assume success when the request completes without throwing an error
    document.querySelector(".sent-message").style.display = "block";
    document.getElementById("contact-form").reset();
    console.log("Request sent in no-cors mode");
    
  } catch (error) {
    // Network error or other exception
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".error-message").textContent = "An error occurred: " + error.message;
    document.querySelector(".error-message").style.display = "block";
    console.error("Contact form error:", error);
  }
});

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()