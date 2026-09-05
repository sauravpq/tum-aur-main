const audioPlayer = document.querySelector("#audioPlayer");
const playButton = document.querySelector(".play-button");
const albumCover = document.querySelector(".album-cover");
const nextButton = document.querySelector(".next-button");
const prevButton = document.querySelector(".prev-button");
const progressBar = document.querySelector(".progress-bar");
const songTitleDisplay = document.querySelector(".song-title");
const artistNameDisplay = document.querySelector(".artist-name");
const volumeSlider = document.querySelector(".volume-slider");
function updateVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
    volumeSlider.style.setProperty("--volume", `${volumeSlider.value}%`);
}
volumeSlider.addEventListener("input", updateVolume);
updateVolume();
function updateArtistName() {
    const currentSong = songs[currentSongIndex];
    artistNameDisplay.textContent = currentSong.artist;
}
function updateSongTitle() {
    const currentSong = songs[currentSongIndex];
    songTitleDisplay.textContent = currentSong.title;
}   
audioPlayer.addEventListener("loadedmetadata", updateSongTitle);    
const currentTimeDisplay = document.querySelector(".current-time");
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

audioPlayer.addEventListener("timeupdate", function () {
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    if (Number.isFinite(audioPlayer.duration)) {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    }
});
const totalTimeDisplay = document.querySelector(".total-time");
function updateTotalTime() {
    if (Number.isFinite(audioPlayer.duration)) {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    }
}
audioPlayer.addEventListener("loadedmetadata", updateTotalTime);

audioPlayer.addEventListener("error", function () {
    progressBar.value = 0;
    progressBar.style.setProperty("--progress", "0%");
    currentTimeDisplay.textContent = "0:00";
    totalTimeDisplay.textContent = "0:00";
});


function updateProgressBar() {
    const hasDuration = Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0;
    const progress = hasDuration
        ? Math.min((audioPlayer.currentTime / audioPlayer.duration) * 100, 100)
        : 0;

    progressBar.value = progress;
    progressBar.style.setProperty("--progress", `${progress}%`);
}

audioPlayer.addEventListener("timeupdate", updateProgressBar);

function seekFromPosition(clientX) {
    if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) {
        return;
    }

    const trackBounds = progressBar.getBoundingClientRect();
    const clickPosition = Math.min(
        Math.max(clientX - trackBounds.left, 0),
        trackBounds.width
    );
    const progress = (clickPosition / trackBounds.width) * 100;

    progressBar.value = progress;
    progressBar.style.setProperty("--progress", `${progress}%`);
    audioPlayer.currentTime = (progress / 100) * audioPlayer.duration;
}

let pointerSeeking = false;

progressBar.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    pointerSeeking = true;
    seekFromPosition(event.clientX);
});

progressBar.addEventListener("pointerup", function () {
    pointerSeeking = false;
});

progressBar.addEventListener("pointercancel", function () {
    pointerSeeking = false;
});

progressBar.addEventListener("input", function () {
    if (!pointerSeeking && Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
        progressBar.style.setProperty("--progress", `${progressBar.value}%`);
    }
});

function changeSong(direction) {
    const wasPlaying = !audioPlayer.paused;
    currentSongIndex += direction;

    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }

    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);

    if (wasPlaying) {
        audioPlayer.play();
        albumCover.classList.add("playing");
        playButton.textContent = "Ⅱ";
    } else {
        audioPlayer.pause();
        albumCover.classList.remove("playing");
        playButton.textContent = "▶";
    }
}

prevButton.addEventListener("click", function () {
    changeSong(-1);
});

nextButton.addEventListener("click", function () {
    changeSong(1);
});
const songs = [
    {
        title: "Be Intehaan full song | Tips Official",
        artist: "Credit:Tips Official",
        audio: "assets/song1.m4a",
        cover: "assets/album-art.png"
    },
    {
        title: "Inaam Full Song | Jasleen Royal",
        artist: "Credit:Jasleen Royal",
        audio: "assets/song2.mp3",
        cover: "assets/album-art2.png"
    },
    {
        title: "DARKHAAST | Shivaay",
        artist: "Credit:Tseries",
        audio: "assets/song3.m4a",
        cover: "assets/album-art3.png"
    },
    {
        title: "Samjawaan | Arjit Singh",
        artist: "Credit:Sony Music India",
        audio: "assets/song4.mp3",
        cover: "assets/album-art4.png"
    },
    {
        title: "Bairan| Banjaare",
        artist: "Credit:Banjaare",
        audio: "assets/song5.mp3",
        cover: "assets/album-art5.png"
    },
    {
        title: "Hona Tha Pyar | Atif Aslam",
        artist: "Credit:Tips Official",
        audio: "assets/song6.mp3",
        cover: "assets/album-art6.png"
    },
    {
        title: "Main Kabhi Bhoolunga Tujhe",
        artist: "Credit:Tseries",
        audio: "assets/song7.mp3",
        cover: "assets/album-art7.png"
    },  
    {
        title: "Tu jaane Na | Atif Aslam",
        artist: "Credit:Tips Official",
        audio: "assets/song8.mp3",
        cover: "assets/album-art8.png"
    },
    {
        title: "Tum Se hi | Jab We Met",
        artist: "Credit:Tseries",
        audio: "assets/song9.mp3",
        cover: "assets/album-art9.png"
    }
]; 

let currentSongIndex = 0;
function loadSong(songIndex) {
    const song = songs[songIndex];
    audioPlayer.src = song.audio;
    audioPlayer.currentTime = 0;
    audioPlayer.load();
    albumCover.src = song.cover;
    progressBar.value = 0;
    progressBar.style.setProperty("--progress", "0%");
    currentTimeDisplay.textContent = "0:00";
    totalTimeDisplay.textContent = "0:00";
    updateSongTitle();
    updateArtistName();
}
loadSong(currentSongIndex);


playButton.addEventListener("click", function () {
    if (audioPlayer.paused) {
        audioPlayer.play();
        albumCover.classList.add("playing");
        playButton.textContent = "Ⅱ";
    } else {
        audioPlayer.pause();
        albumCover.classList.remove("playing"); 
        playButton.textContent = "▶";
    }
});
let rotation = 0;
function rotateAlbumCover() {
    if (!audioPlayer.paused) {
        rotation += 1; // Adjust the rotation speed as needed
        albumCover.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
    }
    requestAnimationFrame(rotateAlbumCover);
}

rotateAlbumCover(); 
