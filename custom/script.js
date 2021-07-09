//Components
//--Player Components
const player = document.getElementById("fyp-player");
const volume = document.getElementById("fyp-button-volume");
const sourceInfo = document.getElementById("fyp-source-info");
const musicImage = document.getElementById("fyp-music-image");
const progressBar = document.getElementById("fyp-progress-bar");

//--Button Components
const btPlay = document.getElementById("fyp-button-play");
const btPrev = document.getElementById("fyp-button-prev");
const btNext = document.getElementById("fyp-button-next");
const btRand = document.getElementById("fyp-button-random");
const btMute = document.getElementById("fyp-button-mute");
const btI = document.getElementById("fyp-button-mute-i");
const btMode = document.getElementById("fyp-sources");
const btM = document.getElementById("fyp-button-mode");

//--Albuns
let albuns = []

// Starters
let current = 0;
player.volume = volume.value;
getAlbuns()
loadData();
init();

//Add event listener on player and play button for controlling play button and other things
player.addEventListener("playing", function () {
    btPlay.innerHTML = '<i class="fa fa-pause"></i>';
});

player.addEventListener("pause", function () {
    btPlay.innerHTML = '<i class="fa fa-play"></i>';
});

player.addEventListener("ended", function () {
    btPlay.innerHTML = '<i class="fa fa-spinner circle"></i>';
    next();
});

btPlay.addEventListener("click", function () {
    this.innerHTML == '<i class="fa fa-play"></i>'
        ? player.play()
        : player.pause();
});

//Buttons event listeners
//--Volume
volume.addEventListener("change", function () {
    player.volume = volume.value;
});

btMute.addEventListener("click", function () {
    btI.classList.contains("fa-volume-off")
        ? (btI.className = "fa fa-volume-slash")
        : (btI.className = "fa fa-volume-off");

    !btI.classList.contains("fa-volume-off")
        ? (player.muted = true)
        : (player.muted = false);
});

//--Next and prev
btNext.addEventListener("click", function () {
    next();
});

btPrev.addEventListener("click", function () {
    prev();
});

//--Modes
btRand.addEventListener("click", function () {
    this.classList.toggle("toggled");
});

btMode.addEventListener("change", function () {
    current = 0;
    loadData();
    init();
    btMode.value === "radios"
        ? (btM.innerHTML = '<i class="fa fa-podcast"></i>')
        : (btM.innerHTML = '<i class="fa fa-music"></i>');
});

//Functions
//--Functionalities
function loadData() {
    data = [];

    btMode.value === "radios"
        ? (data = radios)
        : fetch(`https://archive.org/metadata/${btMode.value}`)
              .then((response) => response.json())
              .then((json) => {
                  for (let item in json.files) {
                      json.files[item].source === "original" &&
                          (json.files[item].name.slice(-3) === "mp3" ||
                              json.files[item].name.slice(-3) === "ogg" ||
                              json.files[item].name.slice(-3) === "m4a") &&
                          data.push(json.files[item]);
                  }
                  return data;
              });
}

function init() {
    btRand.classList.contains('toggled')
        ? (current = Math.floor(Math.random() * data.length))
        : void 0

    data[current]
        ? (player.pause(),
          player.setAttribute(
              'src',
              `${
                  btMode.value === 'radios'
                      ? data[current].file
                      : `https://archive.org/download/${btMode.value}/${data[current].name}`
              }`
          ),
          player.load(),
          player.play(),
          timer(),
          (sourceInfo.innerHTML = `<span id="fyp-source-title">${
              btMode.value === 'radios'
                  ? data[current].name
                  : data[current].name.slice(0, -4)
          }</span>
            <span id="fyp-source-artist">${
                data[current].artist == undefined
                    ? 'Radio'
                    : data[current].artist
            }</span>`))
        : setTimeout(init, 1000)
}

// -- Get album list from Archive
async function getAlbuns() {
    const response = await fetch(
        `https://archive.org/details/@jaizon?sort=titleSorter`
    )
    const text = await response.text()
    const parser = new DOMParser()
    const doc = await parser.parseFromString(text, 'text/html')
    const items = await doc.querySelectorAll('.item-ia')
    for (item in items) {
        if (items[item].getAttribute('data-id') !== '__mobile_header__') {
            let img = items[item].querySelector('.item-img').getAttribute('source')
            let id = items[item].getAttribute('data-id')
            let option = document.createElement('option')
            option.value = id
            option.textContent = `${
                items[item].querySelector('.ttl').innerText
            }`
            btMode.appendChild(option)
        }
    }
}

function timer() {
    player.addEventListener(
        'timeupdate',
        () =>
            (progressBar.style.width =
                (player.currentTime / player.duration) * 100 + '%')
    )
}

//--Controls
function next() {
    current >= data.length - 1 ? ((current = 0), init()) : (current++, init());
}

function prev() {
    current <= 0 ? ((current = data.length - 1), init()) : (current--, init())
} 