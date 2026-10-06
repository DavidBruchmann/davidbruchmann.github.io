
class AudioPlayerApp extends AudioPlayer {

  constructor() {
    super();
    this.playlist = [];
    this.nextSrc = '';
    this.currentIndex = 0;
    this.activeSlider = null;
    this.playlistUrl = '/en/playlist.json'; // '/en/?type=17128362'
    this.rootElement = document.querySelector('#audio-player');
    this.btnPrev = document.getElementById('btn-prev');
    this.btnPlay = document.getElementById('btn-play');
    this.btnPause = document.getElementById('btn-pause');
    this.btnTogglePlayPause = document.getElementById('btn-toggle-play-pause');
    this.btnNext = document.getElementById('btn-next');
    this.btnStop = document.getElementById('btn-stop');
    this.btnFadeIn = document.getElementById('btn-fadeIn');
    this.btnFadeOut = document.getElementById('btn-fadeOut');
    this.btnCrossFade = document.getElementById('btn-crossFade');
    this.btnMute = document.getElementById('btn-mute');
    this.volumeControl = document.querySelector('.volumeControl');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.volumeTrack = document.getElementById('volumeTrack');
    this.volumeThumb = document.getElementById('volumeThumb');
    this.progressControl = document.querySelector('.progressControl');
    this.progressSlider = document.getElementById('progressSlider');
    this.progressTrack = document.getElementById('progressTrack');
    this.progressThumb = document.getElementById('progressThumb');
    this.progressCurrent = document.querySelector('#progressCurrent time');
    this.progressRemaining = document.querySelector('#progressRemaining time');
    this.progressDuration = document.querySelector('#progressDuration time');
    this.progressElm = document.getElementById('progressElm');
    this.durationElm = document.getElementById('durationElm');
    this.initPlaylist();
    this.initEventListeners();
    this.initKeyboardControls();
  }

  play() {
    this.rootElement.classList.add('active');
    super.play();
  }

  pause() {
    this.rootElement.classList.remove('active');
    super.pause();
  }

  togglePlayPause(e) {
      const displayDuration = this.player.duration; //Math.round(this.player.duration);
      const displayCurrentTime = Math.round(this.player.currentTime);
      if (this.player.paused) {
        if (this.player.currentTime) {
          console.log(`Continuing playback at ${displayCurrentTime} / ${displayDuration}s.`);
        } else {
          console.log(`Starting playback of ${displayDuration}s.`);
        }
        this.rootElement.classList.add('active');
      } else {
        console.log(`Playback paused at ${displayCurrentTime} / ${displayDuration}s.`);
        this.rootElement.classList.remove('active');
      }
      super.togglePlayPause(1000);
  }

  stop() {
    if (super.stop()) {
      console.log('Playback stopped.');
    }
    this.rootElement.classList.remove('active');
  }

  next() {
    if (this.playlist.length === 0) return;
    const doPlay = !this.player.paused;
    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadTrack(nextIndex);
    if (doPlay) this.play();
  }

  prev() {
    if (this.playlist.length === 0) return;
    const doPlay = !this.player.paused;
    const prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(prevIndex);
    if (doPlay) this.play();
  }

  initEventListeners() {
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prev());
    if (this.btnPlay) this.btnPlay.addEventListener('click', () => this.play());
    if (this.btnPause) this.btnPause.addEventListener('click', () => this.pause());
    if (this.btnTogglePlayPause) this.btnTogglePlayPause.addEventListener('click', (e) => this.togglePlayPause(e));
    if (this.btnStop) this.btnStop.addEventListener('click', (e) => this.stop());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.next());
    if (this.btnFadeIn) this.btnFadeIn.addEventListener('click', () => this.fadeIn(5000));
    if (this.btnFadeOut) this.btnFadeOut.addEventListener('click', () => this.fadeOut(5000));
    if (this.btnCrossFade) this.btnCrossFade.addEventListener('click', () => this.crossFade(5000));
    this.player.onended = () => {
      console.log('The song ended.');
      this.rootElement.classList.remove('active');
      this.next();
      // TODO: play only when repeat option is activated?
      this.play();
    }
    this.player.onplay = () => {
      //const displayDuration = Math.round(this.player.duration);
      //const displayCurrentTime = Math.round(this.player.currentTime);
      window.setInterval(() => {
        this.updateProgressSliderFromPlayer();
        this.updateTimeDisplayFromPlayer();
      }, 100);
    }

    if (this.volumeSlider || this.progressSlider) {
      this.activeSlider = null;
      if (this.volumeSlider) {
        this.volumeSlider.addEventListener('mousedown', (e) => {
          this.activeSlider = 'volume';
          this.updateVolumeFromSlider(e);
        });

        this.volumeSlider.addEventListener('keydown', (e) => {
          let currentVol = this.masterVolume;

          switch (e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
              e.preventDefault();
              this.setVolume(currentVol + 5); // Step up
              this.updateVolumeSliderUI(this.masterVolume);
              break;
            case 'ArrowDown':
            case 'ArrowLeft':
              e.preventDefault();
              this.setVolume(currentVol - 5); // Step down
              this.updateVolumeSliderUI(this.masterVolume);
              break;
            case 'Home':
              e.preventDefault();
              this.setVolume(0); // Mute instantly
              this.updateVolumeSliderUI(0);
              break;
            case 'End':
              e.preventDefault();
              this.setVolume(100); // Max volume instantly
              this.updateVolumeSliderUI(100);
              break;
          }
        });
      }
      // 2. Global Hotkeys for Playback Controls (Active while focusing inside the player wrapper)
      const playerWrapper = document.querySelector('.playerWrapper');
      if (playerWrapper) {
        playerWrapper.addEventListener('keydown', (e) => {
          if (e.key === ' ') { // Spacebar toggles play/pause
            e.preventDefault();
            this.togglePlayPause();
          }
        });
      }
      if (this.progressSlider) {
        this.progressSlider.addEventListener('mousedown', (e) => {
          this.activeSlider = 'progress';
          this.updateProgressFromSlider(e);
        });
      }
      document.body.addEventListener('mousemove', (e) => {
        if (this.activeSlider === 'volume') {
          this.updateVolumeFromSlider(e);
        } else if (this.activeSlider === 'progress') {
          this.updateProgressFromSlider(e);
        }
      });
      document.body.addEventListener('mouseup', (e) => {
        this.activeSlider = null;
      });
      this.volumeSlider.addEventListener('touchstart', (e) => {
        this.activeSlider = 'volume';
        this.updateVolumeFromSlider(e.touches[0]); // Pass the first finger touch coordinate
      });
      document.body.addEventListener('touchmove', (e) => {
        if (this.activeSlider === 'volume') {
            this.updateVolumeFromSlider(e.touches[0]);
        } else if (this.activeSlider === 'progress') {
            this.updateProgressFromSlider(e.touches[0]);
        }
      });
      document.body.addEventListener('touchend', () => {
        this.activeSlider = null;
      });
      /*
       * TODO
      this.player.addEventListener('loadedmetadata', () => {
        this.updateProgressSliderUI(0); // Initialize track visual position to 0% smoothly
      });
      this.player.addEventListener('timeupdate', () => {
        this.handleNativeTimeUpdate();
      });
      */
    }
    if (this.btnMute) this.btnMute.addEventListener('click', (e) => {
      this.rootElement.classList.toggle('muted');
      if (this.player.muted) {
        this.player.muted = false;
        this.updateVolumeSliderFromPlayer();
      } else {
        this.player.muted = true;
        this.updateVolumeSliderFromPlayer(0);
      }
    });
  }

  initKeyboardControls() {
    const volumeSlider = document.querySelector('.volumeSlider');

    // 1. Volume Slider Keyboard Listeners (WAI-ARIA Slider Pattern)
    if (volumeSlider) {
      volumeSlider.addEventListener('keydown', (e) => {
        let currentVol = this.masterVolume;

        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowRight':
            e.preventDefault();
            this.setVolume(currentVol + 5); // Step up
            this.updateVolumeSliderUI(this.masterVolume);
            break;
          case 'ArrowDown':
          case 'ArrowLeft':
            e.preventDefault();
            this.setVolume(currentVol - 5); // Step down
            this.updateVolumeSliderUI(this.masterVolume);
            break;
          case 'Home':
            e.preventDefault();
            this.setVolume(0); // Mute instantly
            this.updateVolumeSliderUI(0);
            break;
          case 'End':
            e.preventDefault();
            this.setVolume(100); // Max volume instantly
            this.updateVolumeSliderUI(100);
            break;
        }
      });
    }

    // 2. Global Hotkeys for Playback Controls (Active while focusing inside the player wrapper)
    const playerWrapper = document.querySelector('.playerWrapper');
    if (playerWrapper) {
      playerWrapper.addEventListener('keydown', (e) => {
        if (e.key === ' ') { // Spacebar toggles play/pause
          e.preventDefault();
          this.togglePlayPause();
        }
      });
    }
  }

  // Method to sync your custom CSS sliders with your keyboard updates
  updateVolumeSliderUI(volLevel) {
    const volumeSlider = document.querySelector('.volumeSlider');
    const volumeTrack = document.querySelector('.volumeTrack');
    const volumeThumb = document.querySelector('.volumeThumb');
    if (!volumeSlider) return;

    // Convert volume layout math (100 is bottom coordinate alignment)
    const percentage = 100 - volLevel;

    volumeSlider.setAttribute('aria-valuenow', Math.round(volLevel));
    volumeTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
    volumeThumb.style.top = `${percentage}%`;
  }

  setNextSrc(nextSrc) {
    this.nextSrc = nextSrc; //'fileadmin/MP3/Phish_Funk--Hold_On.mp3';
  }

  crossFade(ms) {
    /*
    const nextPlayer = new AudioPlayer;
    nextPlayer.setSrc(this.nextSrc);
    if (ms && ms > 0) {
      let step;
      if (this.volume > 0) {
        step = ms / this.volume;
        this.targetVolume = this.volume;
      } else if (this.targetVolume > 0) {
        step = ms / this.targetVolume;
      }
      const steps = ms / step;
      let inverseCount = steps;
      nextPlayer.setVolume(0);
      nextPlayer.play();
      for (let i = 1; 1 <= steps; i++) {
        inverseCount = steps - i;
        window.setTimeout(() => {
          this.setVolume(inverseCount);
          nextPlayer.setVolume(i);
        }, step);
      }
    } else {
      //nextPlayer.setVolume(0);
      nextPlayer.play();
    }
    this.stop();
    */
  }

  async initPlaylist() {
    try {
      //const baseUri = document.documentElement.getAttribute('data-audio-base') || '';
      //const endpoint = `${baseUri}/playlist.json`.replace(/\/+/g, '/');
//this.playlistUrl
      const response = await fetch(this.playlistUrl);
      if (!response.ok) throw new Error('Network error loading track data');

      const rawTracks = await response.json();

      // Parse Option B object parameters
      this.playlist = rawTracks.map((item) => ({
        id: parseInt(item.index),
        title: item.file.properties.title || item.file.properties.name,
        src: item.file.publicUrl,
        timeFormated: item.file.properties.duration.formated,
        timeSeconds: item.file.properties.duration.seconds,
      }));

      if (this.playlist.length > 0) {
        // Stage the initial track on page mount
        this.loadTrack(this.currentIndex);
        this.updatePlaylistUI();
      }
    } catch (error) {
      console.error('Failed to parse frontend audio track parameters:', error);
    }
  }

  loadTrack(index) {
    if (index < 0 || index >= this.playlist.length) return;

    this.currentIndex = index;
    const currentTrack = this.playlist[this.currentIndex];

    // 1. Swap the physical audio hardware stream source
    this.player.src = currentTrack.src;
    this.player.load(); // Directs browser to safely stage the new stream buffer

    // 2. FIXED: Update visual tracker display nodes correctly
    const textElm = document.querySelector('.playerWrapper .displayText');
    if (textElm) {
      textElm.textContent = currentTrack.title; // Changed from .text to .textContent
      textElm.setAttribute('aria-label', currentTrack.title); // Fixed hyphenated property naming rule
    }

    // Refresh active classes across the list elements
    this.updatePlaylistUI();
  }

  updatePlaylistUI() {
    const container = document.getElementById('playlist-container');
    if (!container) return;
    container.innerHTML = '';
    this.playlist.forEach((track, index) => {
      const item = document.createElement('div');
      const link = document.createElement('a');
      link.href = track.src;
      item.className = `playlist-item ${index === this.currentIndex ? 'active-track' : ''}`;
      // link.className = `playlist-item ${index === this.currentIndex ? 'active-track' : ''}`;
      link.id = `track-item-${index}`;
      link.target = `_blank`;
      if (index === this.currentIndex) {
        link.setAttribute('aria-current', 'track');
      }
      //console.log(track);
      link.textContent = `${index + 1}. [${track.timeFormated}] ${track.title}`;
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents the browser from navigating away
        if (this.player.paused) {
            this.rootElement.classList.add('active');
        }
        this.loadTrack(index);
        this.play();
      });
      //item.addEventListener('click', () => {
      //  if (this.player.paused) {
      //    this.rootElement.classList.add('active');
      //  }
      //  this.loadTrack(index);
      //  this.play();
      //});
      item.appendChild(link);
      container.appendChild(item);
    });
  }
  /*
  updatePlaylistUI() {
    const container = document.getElementById('playlist-container');
    if (!container) return;

    container.innerHTML = '';

    this.playlist.forEach((track, index) => {
      // 🚀 THE FIX: Use a semantic anchor link tag instead of a <div>
      const link = document.createElement('a');

      // If JS is disabled, the browser opens the file route or a fallback track page directly
      link.href = track.src;

      // Standard accessibility attributes
      link.className = `playlist-item ${index === this.currentIndex ? 'active-track' : ''}`;
      link.id = `track-item-${index}`;

      // Let screen readers know which track is currently playing
      if (index === this.currentIndex) {
        link.setAttribute('aria-current', 'track');
      }

      link.textContent = `${index + 1}. ${track.title}`;

      // INTERACTION: JS active clients intercept the native link relocation action
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents the browser from navigating away
        this.loadTrack(index);
        this.play();
      });

      container.appendChild(link);
    });
  }
  */


  updateVolumeFromSlider(e) {
    let percentage;
    let horizontal = this.volumeControl.classList.contains('horizontal');
    //console.log(e);
    const rect = this.volumeSlider.getBoundingClientRect();
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
    this.setVolume(volumeLevel);
    // Update ARIA accessibility attributes
    this.volumeSlider.setAttribute('aria-valuenow', Math.round(volumeLevel));
    // Update CSS styles dynamically
    // Adjusts the linear gradient transition point and the thumb's top placement
    if (horizontal) {
      this.volumeTrack.style.background = `linear-gradient(to left, rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      this.volumeThumb.style.left = `calc(100% - ${percentage}%)`;
    } else {
      this.volumeTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      this.volumeThumb.style.top = `${percentage}%`;
    }
  }

  updateProgressFromSlider(e) {
    let percentage;
    let horizontal = this.progressControl.classList.contains('horizontal');
    //console.log(e);
    const rect = this.progressSlider.getBoundingClientRect();
    if (horizontal) {
      // Calculate horizontal click position relative to the slider width
      // (0 at left, slider width at right)
      const clickX = rect.right - e.clientX;
      percentage = (clickX / rect.width) * 100;

      // below for update of displayed time
      const clickX2 = e.clientX - rect.left;
      let ratio = clickX2 / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      const duration = isNaN(this.player.duration) || !isFinite(this.player.duration) ? 0 : this.player.duration;
      const targetTime = ratio * duration;
      this.player.currentTime = targetTime;
      this.updateTimeDisplayFromPlayer();
    } else {
      // Calculate vertical click position relative to the slider height
      // (0 at top, slider height at bottom)
      const clickY = e.clientY - rect.top;
      percentage = (clickY / rect.height) * 100;
    }
    // Clamp percentage between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));

    // const duration = this.player.duration || 1;
    // const percentage = (this.player.currentTime / duration) * 100;

    // Because standard volume scales from bottom (100%) to top (0%),
    // we invert the percentage for the actual audio volume level.
    const progress = 100 - percentage;

    // Update the Audio class state
    this.setProgress(progress);
    // Update ARIA accessibility attributes
    this.progressSlider.setAttribute('aria-valuenow', Math.round(progress));
    // Update CSS styles dynamically
    // Adjusts the linear gradient transition point and the thumb's top placement
    if (horizontal) {
      this.progressTrack.style.background = `linear-gradient(to left, rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      this.progressThumb.style.left = `calc(100% - ${percentage}%)`;
    } else {
      this.progressTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      this.progressThumb.style.top = `${percentage}%`;
    }
  }

  updateVolumeSliderFromPlayer(volParam = null) {
    let horizontal = false;
    if (this.volumeControl.classList.contains('horizontal')) {
      horizontal = true;
    }
    const vol = this.player.volume;
    const percentage = (volParam !== null) ? volParam : vol * 100;
    if (horizontal) {
      this.volumeTrack.style.background = `linear-gradient(to right, rgb(30, 144, 255) 0%, rgb(30, 144, 255) ${percentage}%, rgb(102, 102, 102) ${percentage}%, rgb(102, 102, 102) 100%)`;
      this.volumeThumb.style.left = `${percentage}%`;
    } else {
      this.volumeTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      this.volumeThumb.style.top = `${percentage}%`;
    }
  }

  updateProgressSliderFromPlayer() {
      //const displayDuration = Math.round(this.player.duration);
      //const displayCurrentTime = Math.round(this.player.currentTime);
    let horizontal = false;
    if (this.progressControl.classList.contains('horizontal')) {
      horizontal = true;
    }
    // const progress = (progressParam !== null) ? progressParam : this.player.currentTime;
    const duration = this.player.duration || 1;
    const percentage = (this.player.currentTime / duration) * 100;
    // const percentage = progress * 100;
    if (horizontal) {
      this.progressTrack.style.background = `linear-gradient(to right, rgb(30, 144, 255) 0%, rgb(30, 144, 255) ${percentage}%, rgb(102, 102, 102) ${percentage}%, rgb(102, 102, 102) 100%)`;
      this.progressThumb.style.left = `${percentage}%`;
    } else {
      this.progressTrack.style.background = `linear-gradient(rgb(102, 102, 102) 0%, rgb(102, 102, 102) ${percentage}%, rgb(30, 144, 255) ${percentage}%, rgb(30, 144, 255) 100%)`;
      this.progressThumb.style.top = `${percentage}%`;
    }
  }

  updateTimeDisplayFromPlayer() {
    const currentSecs = this.player.currentTime || 0;
    const totalSecs = this.player.duration || 0;
    const remainingSecs = Math.max(0, totalSecs - currentSecs); // Prevents negative numbers while loading
    //if (this.progressElm) {
        this.progressElm.textContent = this.formatTime(currentSecs);
    //}
    if (this.durationElm) {
        this.durationElm.textContent = this.formatTime(totalSecs);
    }
    /*
    if (this.progressCurrent) {
        this.progressCurrent.textContent = this.formatTime(currentSecs);
    }

    if (this.progressRemaining) {
        this.progressRemaining.textContent = `-${this.formatTime(remainingSecs)}`; // Prepends minus sign for countdown look
    }
    if (this.progressDuration) {
        this.progressDuration.textContent = this.formatTime(totalSecs);
    }
    */
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Automatically pads single digits with a leading zero (e.g., 05 instead of 5)
    const paddedSecs = secs < 10 ? `0${secs}` : secs;

    return `${mins}:${paddedSecs}`;
  }

}
