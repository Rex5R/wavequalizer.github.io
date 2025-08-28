body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Pixelify Sans", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-size: x-large;
  font-weight: 600;
  text-align: center;
}

#fileInput {
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Pixelify Sans", sans-serif;
}

.bigtxt {
  font-size: 80px;
}

#link {
  background-color: #ffc4c4;
  padding: 10px 20px;
  margin-top: 15px;
  border: 2px solid #000000;
  font-size: medium;
  font-weight: 400;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: xx-large;
  gap: 12px;
}

.title-icon {
  width: 150px;
  height: 150px;
}

#dropZone {
  border: 3px dashed #888;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  cursor: pointer;
  margin-bottom: 20px;
}

#dropZone.dragover {
  border-color: #4caf50;
}

#presets {
  margin: 10px;
  padding: 5px 10px;
  font-family: "Pixelify Sans", sans-serif;
  font-size: 14px;
  border: 2px solid #444;
}

input[type="range"] {
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  margin-bottom: 15px;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #ffffff 0%, #000000 100%);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #000000;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  margin-top: -6px;
  transition: background 0.2s, transform 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #000000;
  transform: scale(1.2);
}

input[type="range"]::-moz-range-track {
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #ffffff 0%, #000000 100%);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #000000;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
}

button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border: 2px solid #000000;
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-family: "Pixelify Sans", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

button:hover {
  background-color: #e8e8e8;
}

button:active {
  transform: scale(0.95);
}

#downloadBtn {
  background-color: #ffffff;
}

#downloadBtn:hover {
  background-color: #e8e8e8;
}
