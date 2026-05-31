function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  initFlowerSystem();

  // Later, teammates can add:
  // initInputSystem();
  // initAudioSystem();
}

function draw() {
  background(0, 160, 210);

  updateFlowerSystem();

  // Later, teammates can add:
  // updateInputSystem();
  // updateAudioSystem();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}