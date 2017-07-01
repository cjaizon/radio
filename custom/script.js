var mode = true;
var x = document.getElementById("player");
var myAudio = document.getElementById("player");
var vol = 0.50000000000000000;
var volInt;
var data;
modeSel();
$('#player').prop('volume', vol);
getVol();
$('#player').on('playing', function() {
    $('#play').html('<i class="fa fa-pause"></i>');
    $('#play').addClass('active');
});
$(document).keypress(function(e) {
    if(e.which == 70 || e.which == 102) {
        $('#mode').click();
    }else if(e.which == 69 || e.which == 101) {
        $('#play').click();
    }else if(e.which == 82 || e.which == 114) {
        $('#random').click();
    }else if(e.which == 68 || e.which == 100) {
        $('#next').click();
    }else if(e.which == 65 || e.which == 97) {
        $('#prev').click();
    }else if(e.which == 87 || e.which == 119) {
        $('#vol').click();
    }else if(e.which == 83 || e.which == 115) {
        $('#vol-').click();
    }else if(e.which == 81 || e.which == 113) {
        $('#mute').click();
    }else if(e.which == 82 || e.which == 114) {
        $('#random').click();
    }
});
$('#player').on('pause', function() {
    $('#play').html('<i class="fa fa-play"></i>');
    $('#play').removeClass('active');
});
$('#play').on('click', function() {
    var $this = $(this);
    if (!$this.hasClass('active')) {
        x.play();
    } else {
        x.pause()
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
        data = $.ajax({
            url: 'https://raw.githubusercontent.com/jaizon/json/master/musics.json',
            type: 'GET',
            dataType: 'json',
            success: function(text) {
                return data = text;
            }
        });
    } else {
        data = $.ajax({
            url: 'https://raw.githubusercontent.com/jaizon/json/master/radios.json',
            type: 'GET',
            dataType: 'json',
            success: function(text) {
                return data = text;
            }
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
    if(data[current]) {
        x.pause();
        $("#player").attr("src", data[current].file);
        x.load();
        x.play();
        timer();
        $('#track').html("<span class='fixed'>Tite: </span>" + "<span class='track-color'>" + data[current].title + "</span>");
        $('#artist').html("<span class='fixed'>Artist: </span>" + "<span class='artist-color'>" + data[current].artist + "</span>");
        $('#play').addClass('active');
        $('#play').html('<i class="fa fa-pause"></i>');
    } else {
        setTimeout(init, 500);
    }
}
function modeSel() {
    current = 0;
    if(mode) {
        mode = false;
        $('#progress').css('hidden', 'true');
        loadJson();
        $('#mode').html('<i class="fa fa-podcast"></i>');
    } else {
        mode = true;
        $('#progress').css('hidden', 'false');
        loadJson();
        $('#mode').html('<i class="fa fa-music"></i>');
    }
    init();
}
function getVol() {
    var vl = Math.floor(x.volume * 100);
    $('#volume').css({'width' : vl + "%"});
}
$('document').ready(function(){
    $('html').prop('hidden', false);
    init();
});
