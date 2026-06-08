function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  initFlowerSystem();
  initInputSystem();
 
  // initAudioSystem();
}

function draw() {
  background(0, 160, 210);

  push();
  translate(camOffsetX, camOffsetY);
  translate(width / 2, height / 2);
  scale(gardenScale);
  translate(-width / 2, -height / 2);

  updateFlowerSystem();
  updateInputSystem();
  
  // updateAudioSystem();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

