/* -------------------------
   Player + clouds behaviour
   ------------------------- */

const playBtn = document.getElementById('playBtn');
const recordImg = document.getElementById('recordImg');
const statusText = document.getElementById('statusText');
const stream = document.getElementById('stream');

/* Asset filenames (edit here if you rename files) */
const ASSETS = {
  playBtn: 'Play.png',
  pauseBtn: 'Pause.png',
  recordPlaying: 'StreamPlay.gif',
  recordPaused: 'StreamPause.png'
};

/* Pick stream URL based on page protocol to avoid mixed-content blocking.
   If your site is served over HTTPS, browsers will block an HTTP stream.
   Files opened as file:// will use the non-SSL stream by default here.
   Adjust logic if you need different behavior. */
(function setStreamURL(){
  const proto = window.location.protocol;
  if(proto === 'https:'){
    stream.src = 'https://wlmc.landmark.edu:8880/stream';
  } else {
    // for file:// and http:
    stream.src = 'http://wlmc.landmark.edu:8000/stream';
  }
  stream.crossOrigin = 'anonymous';
})();

let isPlaying = false;

/* Toggle play/pause (user interaction) */
async function togglePlay(){
  if(!isPlaying){
    try {
      await stream.play();
      isPlaying = true;
      playBtn.src = ASSETS.pauseBtn;
      playBtn.alt = 'Pause';
      recordImg.src = ASSETS.recordPlaying;
      recordImg.alt = 'WLMC record (playing)';
      statusText.textContent = 'Live — connected';
    } catch(err) {
      console.error('Stream play error:', err);
      alert('Could not start stream. Check mixed-content (HTTPS) or CORS on the stream. See troubleshooting notes.');
      statusText.textContent = 'Error connecting';
    }
  } else {
    stream.pause();
    isPlaying = false;
    playBtn.src = ASSETS.playBtn;
    playBtn.alt = 'Play';
    recordImg.src = ASSETS.recordPaused;
    recordImg.alt = 'WLMC record (paused)';
    statusText.textContent = 'Paused';
  }
}


/* Click + keyboard support for play button */
playBtn.addEventListener('click', togglePlay);
playBtn.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    togglePlay();
  }
});

/* Update UI if the stream is ended / error */
stream.addEventListener('ended', () => {
  isPlaying = false;
  playBtn.src = ASSETS.playBtn;
  recordImg.src = ASSETS.recordPaused;
  statusText.textContent = 'Offline';
});
stream.addEventListener('error', (e) => {
  console.warn('Stream error', e);
  statusText.textContent = 'Stream error';
});

/* -------------------------
   Cloud click/keyboard nav
   ------------------------- */
document.querySelectorAll('.cloud').forEach(c => {
  c.addEventListener('click', () => {
    const href = c.dataset.href;
    if(href && href.startsWith('#')) {
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    } else if(href) {
      window.location.href = href;
    }
  });
	
	  // keyboard accessibility
  c.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const href = c.dataset.href || '#';
      if(href !== '#') window.location.href = href;
    }
  });
  // show focus outline when tabbing
  c.addEventListener('focus', () => { c.style.opacity = 0.98; });
  c.addEventListener('blur', () => { c.style.opacity = 1; });
	
});


/* Optional: prevent cloud clicks when user is dragging or selecting text
   (keeps behavior tidy on mobile). */
let touchMoved = false;
document.addEventListener('touchmove', () => touchMoved = true);
document.addEventListener('touchend', () => { touchMoved = false; });