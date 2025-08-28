const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const equalizer = document.getElementById("equalizer");
let audioContext;
let source;
let bassFilter, midFilter, trebleFilter;
let loadedBuffer;

const bass = document.getElementById('bass');
const mid = document.getElementById('mid');
const treble = document.getElementById('treble');
const bassValue = document.getElementById('bassValue');
const midValue = document.getElementById('midValue');
const trebleValue = document.getElementById('trebleValue');
const presetsDropdown = document.getElementById("presets");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");

function setupEqualizer(file) {
  if (!file.name.toLowerCase().endsWith(".wav")) {
    alert("upload wav file only.");
    return;
  }

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    audioContext.decodeAudioData(e.target.result, (buffer) => {
      loadedBuffer = buffer;

      if (source) source.disconnect();
      source = audioContext.createBufferSource();
      source.buffer = buffer;

      bassFilter = audioContext.createBiquadFilter();
      bassFilter.type = "lowshelf";
      bassFilter.frequency.value = 200;

      midFilter = audioContext.createBiquadFilter();
      midFilter.type = "peaking";
      midFilter.frequency.value = 1000;
      midFilter.Q.value = 1;

      trebleFilter = audioContext.createBiquadFilter();
      trebleFilter.type = "highshelf";
      trebleFilter.frequency.value = 3000;

      gainNode = audioContext.createGain();

      source.connect(bassFilter);
      bassFilter.connect(midFilter);
      midFilter.connect(trebleFilter);
      trebleFilter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      equalizer.style.display = "block";

      document.getElementById("playBtn").onclick = () => {
        source = audioContext.createBufferSource();
        source.buffer = loadedBuffer;
        source.connect(bassFilter);
        gainNode.connect(audioContext.destination);
        source.start();
      };

      document.getElementById("stopBtn").onclick = () => {
        if (source) source.stop();
      };

      document.getElementById("downloadBtn").onclick = async () => {
        const wavBlob = await exportWAV();
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "modified.wav"; 
        a.click();
      };

      bass.oninput = (e) => {
        bassFilter.gain.value = e.target.value;
        bassValue.textContent = e.target.value;
      };
      mid.oninput = (e) => {
        midFilter.gain.value = e.target.value;
        midValue.textContent = e.target.value;
      };
      treble.oninput = (e) => {
        trebleFilter.gain.value = e.target.value;
        trebleValue.textContent = e.target.value;
      };
      volume.oninput = (e) => {
        gainNode.gain.value = e.target.value / 100;
        volumeValue.textContent = e.target.value;
      };
    });
  };
  reader.readAsArrayBuffer(file);
}

async function exportWAV() {
  const offlineCtx = new OfflineAudioContext(
    loadedBuffer.numberOfChannels,
    loadedBuffer.length,
    loadedBuffer.sampleRate
  );

  const offlineSource = offlineCtx.createBufferSource();
  offlineSource.buffer = loadedBuffer;

  const offlineBass = offlineCtx.createBiquadFilter();
  offlineBass.type = "lowshelf";
  offlineBass.frequency.value = 200;
  offlineBass.gain.value = bassFilter.gain.value;

  const offlineMid = offlineCtx.createBiquadFilter();
  offlineMid.type = "peaking";
  offlineMid.frequency.value = 1000;
  offlineMid.Q.value = 1;
  offlineMid.gain.value = midFilter.gain.value;

  const offlineTreble = offlineCtx.createBiquadFilter();
  offlineTreble.type = "highshelf";
  offlineTreble.frequency.value = 3000;
  offlineTreble.gain.value = trebleFilter.gain.value;

  const offlineGain = offlineCtx.createGain();
  offlineGain.gain.value = volume.value / 100;

  offlineSource.connect(offlineBass);
  offlineBass.connect(offlineMid);
  offlineMid.connect(offlineTreble);
  offlineTreble.connect(offlineGain);
  offlineGain.connect(offlineCtx.destination);

  offlineSource.start(0);
  const renderedBuffer = await offlineCtx.startRendering();

  return bufferToWavBlob(renderedBuffer);
}

function bufferToWavBlob(buffer) {
  const numOfChan = buffer.numberOfChannels,
    length = buffer.length * numOfChan * 2 + 44,
    bufferArray = new ArrayBuffer(length),
    view = new DataView(bufferArray);

  let offset = 0;
  function writeString(s) {
    for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i));
  }

  writeString("RIFF");
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numOfChan, true); offset += 2;
  view.setUint32(offset, buffer.sampleRate, true); offset += 4;
  view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true); offset += 4;
  view.setUint16(offset, numOfChan * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString("data");
  view.setUint32(offset, length - offset - 4, true); offset += 4;

  const interleaved = new Float32Array(buffer.length * numOfChan);
  for (let ch = 0; ch < numOfChan; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < channelData.length; i++) {
      interleaved[i * numOfChan + ch] = channelData[i];
    }
  }

  let index = 44;
  for (let i = 0; i < interleaved.length; i++, index += 2) {
    let s = Math.max(-1, Math.min(1, interleaved[i]));
    view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: "audio/wav" });
}

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) setupEqualizer(e.target.files[0]);
});

dropZone.addEventListener("dragover", (e) => { 
  e.preventDefault(); 
  dropZone.classList.add("dragover"); 
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) setupEqualizer(e.dataTransfer.files[0]);
});

if (presetsDropdown) {
  presetsDropdown.addEventListener("change", function () {
    const preset = this.value;

    const presets = {
      flat:   { bass: 0, mid: 0, treble: 0 },
      rock:   { bass: 6, mid: 3, treble: 7 },
      pop:    { bass: 4, mid: 5, treble: 6 },
      jazz:   { bass: 3, mid: 6, treble: 5 },
      classical: { bass: 0, mid: 4, treble: 7 },
      vocal:  { bass: -2, mid: 7, treble: 5 },
      bass:  { bass: 6, mid: 5, treble: 4 }
    };

    const values = presets[preset];

    for (let band in values) {
      let slider = document.getElementById(band);
      let label = document.getElementById(band + "Value");
      if (slider && label) {
        slider.value = values[band];
        slider.dispatchEvent(new Event("input"));
        label.textContent = values[band];
      }
    }
  });
}
