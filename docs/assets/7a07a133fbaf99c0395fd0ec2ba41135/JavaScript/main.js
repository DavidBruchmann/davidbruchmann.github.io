document.addEventListener('DOMContentLoaded', () => {
  // Read the user's preference on boot
  const savedLanguage = localStorage.getItem('user-language');
  const currentPath = window.location.pathname;
  // Auto-route to language directory if user lands on raw root root index
  if (savedLanguage && (currentPath === '/' || currentPath === '/index.html')) {
      const targetLangFolder = `/${savedLanguage.toLowerCase()}/`;
      if (!currentPath.includes(targetLangFolder)) {
          loadSpaPage(targetLangFolder);
      }
  }

  // CENTRALIZED ROUTER: Event Delegation for all menus and language links
  document.body.addEventListener('click', function(event) {
    const activeLink = event.target.closest('#main-menu a, a.lang-link');
    if (!activeLink ||
      !activeLink.href.startsWith(window.location.origin) ||
      activeLink.getAttribute('target') === '_blank'
    ) {
      return;
    }
    event.preventDefault(); // Protects the active audio stream player container
    // Handle Language-Specific Updates immediately upon clicking a flag
    if (activeLink.classList.contains('lang-link')) {
      // Sync the multiple header icon layers we built earlier
      handleHeaderFlagSync(activeLink);
      // Extract the two-letter ISO structure (e.g., "de", "en") and save it
      const isoCode = activeLink.getAttribute('hreflang') || activeLink.getAttribute('lang') || activeLink.textContent.trim().toLowerCase();
      localStorage.setItem('user-language', isoCode);
      // Collapse the checkbox mobile menu drawer
      const langToggle = document.getElementById('language-toggle');
      if (langToggle) {
        langToggle.checked = false;
      }
    } else {
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) {
        menuToggle.checked = false;
      }
    }
    // Send the correct, fresh URL string directly into the animation matrix
    loadSpaPage(activeLink.href);
  });

  function handleHeaderFlagSync(clickedLinkElement) {
    const clickedImgWrap = clickedLinkElement.querySelector('.t3js-icon');
    // labels for all 3 layers:
    const headerLabels = document.querySelectorAll('label[for="language-toggle"]');
    if (clickedImgWrap) {
      headerLabels.forEach(headerLabel => {
        headerLabel.innerHTML = clickedImgWrap.outerHTML;
      });
    }
    // change 'active' class in menu-items
    const langMenuItems = document.querySelectorAll('nav.language-menu li');
    langMenuItems.forEach((li) => {
      if (clickedLinkElement.hreflang == li.firstElementChild.hreflang) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    })
  }

  // SPA loader
  async function loadSpaPage(url) {
    if (!url) {
      return;
    }
    const metadataSelectors = [
      'link[rel="canonical"]',
      'link[rel="alternate"]',
      'meta[name="description"]',
      'meta[property^="og:"]', // Catches OpenGraph previews if you have them
    ];
    const replacementSelectors = [
        '#main-content',
        '#main-menu',
        'nav.language-menu',
        'footer',
    ];
    replacementSelectors.forEach(selector => {
        document.querySelector(selector).classList.add('is-switching');
    });

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Static file retrieval failed.');
      const rawHtml = await response.text();
      const parser = new DOMParser();
      const virtualDom = parser.parseFromString(rawHtml, 'text/html');
      setTimeout(() => {
        if (virtualDom) {
          if (virtualDom.title) {
            document.title = virtualDom.title;
          }
          metadataSelectors.forEach(selector => {
            const currentMetaElement = document.head.querySelector(selector);
            const incomingMetaElement = virtualDom.head.querySelector(selector);
            if (currentMetaElement && incomingMetaElement) {
              // Overwrite the existing element with the fresh TYPO3 content directly
              currentMetaElement.replaceWith(incomingMetaElement.cloneNode(true));
            } else if (incomingMetaElement) {
              // If it doesn't exist yet in the current head, inject it
              document.head.appendChild(incomingMetaElement.cloneNode(true));
            } else if (currentMetaElement) {
              // If the new page doesn't have it, drop it
              currentMetaElement.remove();
            }
          });
          replacementSelectors.forEach(selector => {
              const currentSection = document.querySelector(selector);
              const nextSection = virtualDom.querySelector(selector);
              if (currentSection && nextSection) {
                // console.log(currentMenu, nextMenu);
                currentSection.innerHTML = nextSection.innerHTML;
                document.querySelector(selector).classList.remove('is-switching');
              }
          });
          // Update the browser bar history stack smoothly
          window.history.pushState({ url }, virtualDom.title, url);

          //window.scrollTo(0, 0);

          //rebindMenuListeners();
          // console.log('switch completed.');
        }
      }, 150);
    } catch (error) {
      console.warn("SPA loading error, falling back to standard link transition:", error);
      window.location.href = url;
    }
  }

  function manageSlideIns() {
    const menuWrap = document.querySelector('.menu-wrap');
    if (!menuWrap) return;
    const toggles = document.querySelectorAll('.menu-wrap input[type="checkbox"]');
    // Handle Accordion Behavior (One open at a time)
    toggles.forEach(toggle => {
      toggle.addEventListener('change', function() {
        if (this.checked) {
          toggles.forEach(otherToggle => {
            if (otherToggle !== this) {
              otherToggle.checked = false;
            }
          });
        }
      });
    });
  }
  manageSlideIns();

  const audioPlayer = new AudioPlayerApp();
  audioPlayer.setVolume(33);
  console.log(audioPlayer);
  audioPlayer.setSrc('/fileadmin/MP3/Phish_Funk--Hold_On.mp3');
  audioPlayer.setNextSrc('/fileadmin/MP3/Phish_Funk--The_Squelch.mp3');

  (function() {
    // 🚀 ENVIRONMENT GUARD: Only activate if running locally
    const isLocalDevelopment =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.ddev.site');

    if (!isLocalDevelopment) return;

    // Create the reload button element dynamically
    const reloadBtn = document.createElement('button');
    reloadBtn.id = 'dev-content-reload';
    reloadBtn.textContent = '🔄 Refresh Content';
    reloadBtn.setAttribute('aria-label', 'Development Content Scoped Reload');

    // Apply quick utility styling to pin it visibly out of the way
    Object.assign(reloadBtn.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: '99999',
      backgroundColor: '#ff9500', // Warning orange to stand out as a dev tool
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      transition: 'background-color 0.2s'
    });

    // Hover effect styling
    reloadBtn.onmouseover = () => reloadBtn.style.backgroundColor = '#e08200';
    reloadBtn.onmouseout = () => reloadBtn.style.backgroundColor = '#ff9500';

    reloadBtn.addEventListener('click', async () => {
      loadSpaPage(window.location.href);
    });

    if (document.body) {
      document.body.appendChild(reloadBtn);
    } else {
      window.addEventListener('DOMContentLoaded', () => document.body.appendChild(reloadBtn));
    }
  })();

});
