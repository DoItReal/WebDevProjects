var url = "https://freesound.org/data/previews/587/587196_13123807-lq.mp3";
// bigger file to test the progress bar var url = "https://freesound.org/data/previews/627/627272_2061858-lq.mp3";
var webAudioDiv;
var webAudioProgress;
var playButton;
var stopButton;
var audioContext = new window.AudioContext();
var source = null;
var audioBuffer = null;
function initWebAudio() {
    webAudioDiv = document.createElement('div');
    webAudioDiv.style = "border: 1px solid black; display: inline-block;";
    webAudioProgress = document.createElement('progress');

    playButton = document.createElement('button');
    playButton.innerHTML = "Play";
    playButton.disabled = true;
    playButton.onclick = playSound;

    stopButton = document.createElement('button');
    stopButton.innerHTML = "Stop";
    stopButton.disabled = true;
    stopButton.onclick = stopSound;

    webAudioDiv.appendChild(playButton);
    webAudioDiv.appendChild(stopButton);
    webAudioDiv.appendChild(webAudioProgress);
    document.body.appendChild(webAudioDiv);

    downloadAudioFile(url);

}

function stopSound() {
    if (source) source.stop();
}
function playSound() {
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
}
function initSound(audioFile) {
    // The audio file may be an mp3 - we must decode it before playing it from memory
    audioContext.decodeAudioData(audioFile, function (buffer) {
        console.log("Song decoded!");
        // audioBuffer the decoded audio file we're going to work with
        audioBuffer = buffer;
        // Enable all buttons once the audio file is
        // decoded
       playButton.disabled = false; // play
       stopButton.disabled = false; // stop
        console.log("Binary file has been loaded and decoded, use play / stop buttons!");
    }, function (e) {
        console.log('Error decoding file', e);
    });
}

function downloadAudioFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onprogress = function (e) {
        webAudioProgress.value = e.loaded;
        webAudioProgress.max = e.total;
    }
    xhr.responseType = 'arraybuffer'; // THIS IS NEW WITH HTML5!
    xhr.onload = function (e) {
        console.log("Song downloaded, decoding...");
        initSound(this.response); // this.response is an ArrayBuffer.
    };
    xhr.onerror = function (e) {
        console.log("error downloading file");
    }

    xhr.send();
    console.log("Ajax request sent... wait until it downloads completely");
}