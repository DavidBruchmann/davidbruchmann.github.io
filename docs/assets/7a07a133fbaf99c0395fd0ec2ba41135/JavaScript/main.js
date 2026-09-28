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
    const mainContent = document.querySelector('#main-content');
    mainContent.classList.add('is-switching');
    try {
      const response = await fetch(url);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const nextDoc = parser.parseFromString(htmlText, 'text/html');
      if (nextDoc && nextDoc.querySelector('#main-content')?.innerHTML) {
        setTimeout(() => {
          // Swap payload containers
          document.querySelector('#main-content').innerHTML = nextDoc.querySelector('#main-content').innerHTML;
          document.title = nextDoc.title;
          const currentMenu = document.querySelector('#main-menu');
          const nextMenu = nextDoc.querySelector('#main-menu');
          if (currentMenu && nextMenu) {
            // console.log(currentMenu, nextMenu);
            currentMenu.innerHTML = nextMenu.innerHTML;
          }
          // Update the browser bar history stack smoothly
          window.history.pushState({ url }, nextDoc.title, url);
          //window.scrollTo(0, 0);
          mainContent.classList.remove('is-switching');
          //rebindMenuListeners();
          // console.log('switch completed.');
        }, 150);
      }
    } catch (error) {
      console.warn("SPA loading error, falling back to standard link transition:", error);
      window.location.href = url;
    }
  }

  function manageSiledIns() {
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
  manageSiledIns();

  const audioPlayer = new AudioPlayer();
  audioPlayer.setVolume(33);
  const togglePlayPauseBtn = function () {
    document.querySelector('#audio-player').classList.toggle('active');
    if (!audioPlayer.player.paused) {
      document.querySelector('.btn-toggle-play-pause').title = "Pause";
    } else {
      document.querySelector('.btn-toggle-play-pause').title = "Play";
    }
  }
  // console.log(audioPlayer);
  audioPlayer.setSrc('/fileadmin/MP3/Phish_Funk--Hold_On.mp3');
  audioPlayer.setNextSrc('/fileadmin/MP3/Phish_Funk--The_Squelch.mp3');
  document.getElementById('btn-play')?.addEventListener('click', () => audioPlayer.play());
  document.getElementById('btn-pause')?.addEventListener('click', () => audioPlayer.pause());
  document.getElementById('btn-toggle-play-pause')?.addEventListener('click', (e) => {
    if (audioPlayer.player.paused) {
      if (audioPlayer.player.currentTime) {
        console.log(`Continuing playback at ${audioPlayer.player.currentTime} / ${audioPlayer.player.duration}s.`);
      } else {
        console.log(`Starting playback of ${audioPlayer.player.duration}s.`);
      }
    } else {
      console.log(`Playback paused at ${audioPlayer.player.currentTime} / ${audioPlayer.player.duration}s.`);
    }
    audioPlayer.togglePlayPause(1000);
    togglePlayPauseBtn();
  });

  document.getElementById('btn-stop')?.addEventListener('click', (e) => {
    audioPlayer.stop();
    togglePlayPauseBtn();
    console.log('Playback stopped.');
  });
  document.getElementById('btn-fadeIn')?.addEventListener('click', () => audioPlayer.fadeIn(5000));
  document.getElementById('btn-fadeOut')?.addEventListener('click', () => audioPlayer.fadeOut(5000));
  document.getElementById('btn-crossFade')?.addEventListener('click', () => audioPlayer.crossFade(5000));
  audioPlayer.player.onended = () => {
    console.log('The song ended.');
    togglePlayPauseBtn();
  }

  const volumeControl = document.querySelector('.volumeControl');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeTrack = document.getElementById('volumeTrack');
  const volumeThumb = document.getElementById('volumeThumb');

  function updateVolumeFromSlider(e) {
    let horizontal = false;
    let percentage;
    if (volumeControl.classList.contains('horizontal')) {
      horizontal = true;
    }
    //console.log(e);
    const rect = volumeSlider.getBoundingClientRect();
    if (horizontal) {
      // Calculate horizontal click position relative to the slider width
      // (0 at left, slider width at right)
      const clickX = rect.right - e.clientX;
      percentage = (clickX / rect.width) * 100;
    } else {
      // Calculate vertical click position relative to the slider height
      // (0 at top, slider height at bottom)
      const clickY = e.clientY - rect.top;
      percentage = (clickY / rect.height) * 100;
    }
    // Clamp percentage between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));
    // Because standard volume scales from bottom (100%) to top (0%),
    // we invert the percentage for the actual audio volume level.
    const volumeLevel = 100 - percentage;
    // Update the Audio class state
    audioPlayer.setVolume(volumeLevel);
    // Update ARIA accessibility attributes
    volumeSlider.setAttribute('aria-valuenow', Math.round(volumeLevel));
    // Update CSS styles dynamically
    // Adjusts the linear gradient transition point and the thumb's top placement
    if (horizontal) {
      volumeTrack.style.background = `linear-gradient(to left, rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      volumeThumb.style.left = `calc(100% - ${percentage}%)`;
    } else {
      volumeTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      volumeThumb.style.top = `${percentage}%`;
    }
  }

  function updateVolumeSliderFromPlayer(volParam = null) {
    let horizontal = false;
    if (volumeControl.classList.contains('horizontal')) {
      horizontal = true;
    }
    const vol = audioPlayer.player.volume;
    const percentage = (volParam !== null) ? volParam : vol * 100;
    console.log(volParam, percentage);
    if (horizontal) {
      volumeTrack.style.background = `linear-gradient(to right, rgb(30, 144, 255) 0%, rgb(30, 144, 255) ${percentage}%, rgb(102, 102, 102) ${percentage}%, rgb(102, 102, 102) 100%)`;
      volumeThumb.style.left = `${percentage}%`;
    } else {
      volumeTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      volumeThumb.style.top = `${percentage}%`;
    }
  }

  // Handle drag behavior
  let isDragging = false;
  volumeSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateVolumeFromSlider(e);
  });
  document.body.addEventListener('mousemove', (e) => {
    if (isDragging) {
      updateVolumeFromSlider(e);
    }
  });
  document.body.addEventListener('mouseup', (e) => {
    isDragging = false;
  });
  document.getElementById('btn-mute').addEventListener('click', (e) => {
    document.querySelector('#audio-player').classList.toggle('muted');
    if (audioPlayer.player.muted) {
      audioPlayer.player.muted = false;
      updateVolumeSliderFromPlayer();
    } else {
      audioPlayer.player.muted = true;
      updateVolumeSliderFromPlayer(0);
    }
  });
});
