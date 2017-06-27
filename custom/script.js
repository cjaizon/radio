var mode = true;
var x = document.getElementById("player");
var myAudio = document.getElementById("player");
var vol = 0.50000000000000000;
var volInt;
var data;
modeSel();
$('#player').prop('volume', vol);
getVol();
$('#play').on('click', function() {
    var $this = $(this);
    $this.toggleClass('active');
    if ($this.hasClass('active')) {
        x.play();
        $this.html('<i class="fa fa-pause"></i>');
    } else {
        x.pause()
        $this.html('<i class="fa fa-play"></i>');
    }
});
$('#vol').on('click', function() {
    if ($('#player').prop('volume') <= 0.950000000000000) {
        vol += 0.05000000000000000;
        $('#player').prop('volume', vol);
    } else {
        $('#player').prop('volume', 1);
    }
    getVol();
    if ($('#player').prop('volume') === 1) {
        $(this).addClass('maxed');
    }
    if ($('#vol-').hasClass('maxed')) {
        $('#vol-').removeClass('maxed');
    }
    if ($('#player').prop('muted')) {
        $('#player').prop('muted', false);
        $('#mute').removeClass('toggled');
    }
});
$('#vol-').on('click', function() {
    if ($('#player').prop('volume') >= 0.06000000000000000) {
        vol -= 0.05000000000000000;
        $('#player').prop('volume', vol);
    } else {
        $('#player').prop('volume', 0);
    }
    getVol();
    if ($('#player').prop('volume') === 0) {
        $(this).addClass('maxed');
    }
    if ($('#vol').hasClass('maxed')) {
        $('#vol').removeClass('maxed');
    }
    if ($('#player').prop('muted')) {
        $('#player').prop('muted', false);
        $('#mute').removeClass('toggled');
    }
});
$('#next').on('click', function() {
    next();
});
$('#prev').on('click', function() {
    prev();
})
$('audio').on('ended', function() {
    next();
});
$('#random').on('click', function() {
    $(this).toggleClass('toggled');
});
$('#mute').on('click', function() {
    $(this).toggleClass('toggled');
    if ($(this).hasClass('toggled')) {
        $('#player').prop('muted', true);
    } else {
        $('#player').prop('muted', false);
    }
});
$('#mode').on('click', function() {
    modeSel();
});
function timer() {
    $("#player").bind('timeupdate', function(){
        var track_length = x.duration;
        var secs = x.currentTime;
        var progress = (secs/track_length) * 100;
        $('#progress').css({'width' : progress + "%"});
        var tcMins = parseInt(secs/60);
        var tcSecs = parseInt(secs - (tcMins * 60));

        if (tcSecs < 10) { tcSecs = '0' + tcSecs; }

        // Display the time
        $('#timecode').html(tcMins + ':' + tcSecs);
    });
}
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
function initRnd() {
    current = Math.floor(Math.random() * data.length)
    x.pause();
    $("#player").attr("src", data[current].file);
    x.load();
    $('#track').html("<span class='fixed'>Tite: </span>" + "<span class='track-color'>" + data[current].title + "</span>");
    $('#artist').html("<span class='fixed'>Artist: </span>" + "<span class='artist-color'>" + data[current].artist + "</span>");
    x.play();
    $('#play').addClass('active')
    $('#play').html('<i class="fa fa-pause"></i>')
}
function loadJson() {
    if(mode) {
        readTextFile("https://raw.githubusercontent.com/jaizon/json/master/musics.json", function(text) {
            return data = JSON.parse(text);
        });
    } else {
        readTextFile("https://raw.githubusercontent.com/jaizon/json/master/radios.json", function(text) {
            return data = JSON.parse(text);
        });
    }
}
function next() {
    if (current >= data.length - 1) {
        current = 0;
        init();
    } else if ($('#random').hasClass('toggled')) {
        initRnd();
    } else {
        current++;
        init();
    }
}
function prev() {
    if (current <= 0) {
        current = data.length - 1;
        init();
    } else if ($('#random').hasClass('toggled')) {
        initRnd();
    } else {
        current--;
        init();
    }
}
function init() {
    x.pause();
    $("#player").attr("src", data[current].file);
    x.load();
    x.play();
    timer();
    $('#track').html("<span class='fixed'>Tite: </span>" + "<span class='track-color'>" + data[current].title + "</span>");
    $('#artist').html("<span class='fixed'>Artist: </span>" + "<span class='artist-color'>" + data[current].artist + "</span>");
    $('#play').addClass('active');
    $('#play').html('<i class="fa fa-pause"></i>');
}
function modeSel() {
    current = 0;
    if(mode) {
        mode = false;
        $('#progress').prop('hidden', 'true');
        loadJson();
        $('#mode').html('<i class="fa fa-podcast"></i>');
    } else {
        mode = true;
        $('#progress').prop('hidden', 'false');
        loadJson();
        $('#mode').html('<i class="fa fa-music"></i>');
    }
    setTimeout(init, 500);
}
function getVol() {
    var vl = Math.floor(x.volume * 100);
    $('#volume').css({'width' : vl + "%"});
}
$('document').ready(function(){
    $('html').prop('hidden', false);
    init();
});
