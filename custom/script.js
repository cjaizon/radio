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




// Starters
let current = 0;
player.volume = volume.value;
loadData();
init();




//Add event listener on player and play button for controlling play button and other things
player.addEventListener('playing', function() {
    btPlay.innerHTML = '<i class="fa fa-pause"></i>';
});

player.addEventListener('pause', function() {
    btPlay.innerHTML = '<i class="fa fa-play"></i>';
});

player.addEventListener('ended', function() {
    btPlay.innerHTML = '<i class="fa fa-spinner circle"></i>';
    next();
});

btPlay.addEventListener('click', function() {
    this.innerHTML == '<i class="fa fa-play"></i>'
        ? player.play() : player.pause()
});



//Buttons event listeners
//--Volume
volume.addEventListener('change', function(){
    player.volume = volume.value;
});

btMute.addEventListener('click', function() {
    btI.classList.contains('fa-volume-off')
        ? btI.className = 'fa fa-volume-slash' : btI.className = 'fa fa-volume-off'

    !btI.classList.contains('fa-volume-off')
        ? player.muted = true : player.muted = false
}); 

//--Next and prev
btNext.addEventListener('click', function() {
    next();
});

btPrev.addEventListener('click', function() {
    prev();
})

//--Modes
btRand.addEventListener('click', function() {
    this.classList.toggle('toggled');
});

btMode.addEventListener('change', function() {
    current = 0
    loadData();
    init();
    btMode.value === "radios"
        ? btM.innerHTML = "<i class=\"fa fa-podcast\"></i>"
        : btM.innerHTML = "<i class=\"fa fa-music\"></i>"
});



//Functions
//--Functionalities
function loadData() {
    data = []
    btMode.value === "radios"
        ? data = radios
        : fetch(`https://archive.org/metadata/${btMode.value}`)
            .then(response => response.json())
                .then(json => {
                    for(let item in json.files){
                        json.files[item].source == "original"
                            ? data.push(json.files[item])
                            : void 0
                    } 
                    return data
                })    
}

function init() {
    btRand.classList.contains('toggled')
        ? current = Math.floor(Math.random() * data.length)
        : void 0

    data[current]
        ?(
            player.pause(),
            player.setAttribute('src', `${
                btMode.value == "radios" 
                    ? data[current].file 
                    : `https://archive.org/download/${btMode.value}/${data[current].name}`
            }`),
            player.load(),
            player.play(),
            timer(),
            sourceInfo.innerHTML = `<span id="fyp-source-title">${data[current].title}</span>
            <span id="fyp-source-artist">${data[current].artist == undefined ? "Radio" : data[current].artist }</span>`
        ):
           setTimeout(init, 500)
}

function timer() {
    player.addEventListener('timeupdate', function(){
        progressBar.style.width = ((player.currentTime / player.duration) * 100) + "%"
    })
}

//--Controls
function next() {
    current >= data.length - 1
        ?( current = 0, init()):(current++,  init())
}

function prev() {
    current <= 0 ? (current = data.length - 1, init()):(current--, init())
}