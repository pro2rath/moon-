(function () {
  const AUDIO_ID = "bg-music-global";
  const STORAGE_KEY = "bgMusicTime";
  const SOURCE = "songs/perfect.mp3"; // ✅ Your local path

  // 1. Create audio element only once
  let audio = document.getElementById(AUDIO_ID);
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = AUDIO_ID;
    audio.loop = false; // single song, no loop restart
    audio.preload = "auto";
    audio.playsInline = true;
    audio.autoplay = true;
    audio.style.display = "none";

    const sourceTag = document.createElement("source");
    sourceTag.src = SOURCE;
    sourceTag.type = "audio/mpeg";
    audio.appendChild(sourceTag);

    document.body.appendChild(audio);
  }

  // 2. Restore last played time
  try {
    const savedTime = localStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime) || 0;
    }
  } catch (e) {}

  audio.volume = 0.8;

  // 3. Save play time every second
  setInterval(() => {
    try {
      if (!audio.paused) {
        localStorage.setItem(STORAGE_KEY, String(audio.currentTime));
      }
    } catch (e) {}
  }, 1000);

  // 4. Force play on first user interaction (mobile + desktop)
  const playHandler = () => {
    audio.muted = false;
    audio.play().catch(() => {});
    document.removeEventListener("click", playHandler);
    document.removeEventListener("touchstart", playHandler);
  };

  document.addEventListener("click", playHandler);
  document.addEventListener("touchstart", playHandler);

  // 5. Expose global function for manual forcing
  window.forceStartMusic = function () {
    audio.muted = false;
    audio.play().catch(() => {});
  };

  // 6. Resume when tab becomes visible again
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      audio.play().catch(() => {});
    }
  });

  window.addEventListener("beforeunload", () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(audio.currentTime));
    } catch (e) {}
  });
})();
