class AudioPlayer {

  constructor() {
    this.player = new Audio();
    this.debug = false;
    this.volume = 33;
    this.targetVolume = this.volume;
    this.player.volume = this.volume / 100;
    this.src = '';
    this.nextSrc = '';
  }

  setSrc(src) {
    this.src = src;
    this.player.src = this.src;
  }

  setNextSrc(nextSrc) {
    this.nextSrc = nextSrc; //'fileadmin/MP3/Phish_Funk--Hold_On.mp3';
  }

  play() {
    this.player.play();
    if (this.debug !== false) console.log('player.paused', this.player.paused);
    console.log('player', this.player);
  }

  pause() {
    this.player.pause();
    if (this.debug !== false) console.log('player.paused', this.player.paused);
  }

  stop() {
    this.player.pause();
    // this.player.fastSeek(0); // fastSeek is not universally supported; currentTime is safer
    this.player.currentTime = 0;

    if (this.debug !== false) {
      console.log({
        'paused': this.player.paused,
        'ended': this.player.ended,
        'played': this.player.played
      });
    }
  }

  togglePlayPause(ms = 0) {
    if (this.player.paused) {
      if (ms) {
          this.fadeIn(ms);
      }
      this.player.play();
    } else {
      //this.player.pause();
      if (ms) {
          this.fadeOut(ms);
      }
      this.player.pause();
    }
    if (this.debug !== false) console.log('player.paused', this.player.paused);
  }

  setVolume(vol) {
    if (this.volume === vol) {
      return;
    }
    if (vol >= -100 && vol <= 100) {
      this.volume = vol;
    } else {
      console.warn('Volume has to be between -100 and 100.');
      return;
    }
    let realVolume = 0;
    if (vol < 0) {
      this.volume = this.volume - vol;
      if (this.volume <= 0) {
        this.volume = 0;
        realVolume = 0;
      } else {
        realVolume = this.volume / 100;
      }
    } else {
      // let realVolume = this.volume > 0 ? (this.volume / 100) : 0;
      realVolume = (this.volume / 100);
    }
    this.player.volume = realVolume;
  }

  /**
   * fadeIn() and fadeOut() currently are very simple, they in-/decrease
   * the volume linear and calculation is done on the volume itself,
   * rather than any array for mapping.
   * A mapping would allow different algotrithms, but also just to push values,
   * i.e. to decrease first before increasing.
   */
  fadeIn(ms) {
    if (ms && ms > 0) {
      if (this.volume > 0) {
        this.targetVolume = this.volume;
      }
      const step = ms / this.targetVolume;
      //const savedVolume = this.volume;

      function increaseVolumeIterator(count, increaseVolumeCallback, parentObj, step, targetVolume) {
        var i = 0;
        var increaseVolumeCallback = function (i, parentObj) {
          if (i <= 100 && i <= targetVolume) {
            parentObj.setVolume(i);
            // if (parentObj.debug !== false)
            //console.log('Sound Volume: ' + parentObj.volume + '% after ' + (i * step) + 'ms.');
          }
        }
        var nextPromise = function () {
          if (i >= targetVolume) {
            // finished: nothing to do
            return;
          }
          var newPromise = new Promise(
            resolve => setTimeout(
              () => resolve(increaseVolumeCallback(i, parentObj)
            ), step)
          );
          i++;
          // Chain to finish processing.
          return newPromise.then(nextPromise);
        }
        return Promise.resolve().then(nextPromise).finally(() => {
          let waitingDuration = (count + 2) * step;
          window.setTimeout(console.log('Maximum sound volume reached (current user setting: ' + targetVolume + '%).'), waitingDuration);
        });
      }
      // increaseVolumeIterator(this.volume, 'increaseVolumeCallback', this, step, this.targetVolume);

        this.play();
        console.log(`Fading in from 0% to ${this.targetVolume}% sound-volume.`);
        increaseVolumeIterator(this.volume, 'increaseVolumeCallback', this, step, this.targetVolume);
      /*
      if (!this.player.paused) {
        // TODO
        var fadeOut = () => {
            new Promise(resolve => {
            // resolve => (this.fadeOut(2800)
              this.fadeOut(3000);
              window.setTimeout(() => {
                this.stop();
                console.log('stopped');
              }, 3500);
              //return true;
          })
          .then(() => {
            // setTimeout(() => {
            //this.stop();
            console.log('and nu?', this.player.volume);
            this.play();
            increaseVolumeIterator(this.volume, 'increaseVolumeCallback', this, step, this.targetVolume);
            // }, 2000);
          });
        }
      } else {
        this.play();
        increaseVolumeIterator(this.volume, 'increaseVolumeCallback', this, step, this.targetVolume);
      }
    */
    } else {
      this.play();
    }
  }

  /**
   * @see fadeIn()
   */
  fadeOut(ms) {
    if (ms && ms > 0) {
      if (this.player.volume > 0) {
        this.volume = this.player.volume * 100;
        this.targetVolume = this.volume;
      } else {
        this.pause();
        return;
      }
      const step = ms / this.volume;
      if (this.debug !== false) console.log('ms', ms, 'this.volume', this.volume, 'step', step);

      function decreaseVolumeIterator(count, decreaseVolumeCallback, parentObj, step) {
        const savedVolume = parentObj.volume;
        var i = count;
        var decreaseVolumeCallback = function (num, i, parentObj) {
          if (parentObj.volume !== 0) {
            parentObj.setVolume(i);
            // if (parentObj.debug !== false)
            //console.log('Sound Volume: ' + parentObj.volume + '% after ' + ((count - i) * step) + 'ms.');
          }
        }
        var nextPromise = function () {
          if (i <= 0) {
            // finished: completely stop and reset volume from 0 to usable value
            parentObj.pause();
            parentObj.setVolume(savedVolume);
            return;
          }
          var newPromise = new Promise(
            resolve => setTimeout(
              () => resolve(decreaseVolumeCallback(count, i, parentObj)
            ), step)
          );
          i--;
          // Chain to finish processing.
          return newPromise.then(nextPromise);
        }
        return Promise.resolve().then(nextPromise).finally(() => {
          let waitingDuration = (count + 1) * step;
          window.setTimeout(console.log('Minimum sound volume reached.'), waitingDuration);
        });
      }
      decreaseVolumeIterator(this.volume, 'decreaseVolumeCallback', this, step);
    } else {
      this.pause();
    }
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
}
