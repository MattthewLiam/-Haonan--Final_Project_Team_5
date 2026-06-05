function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  initFlowerSystem();
  initInputSystem();
  // Later, teammates can add:
 
  // initAudioSystem();
}

function draw() {
  background(0, 160, 210);

  push();
  translate(width / 2, height / 2);
  scale(gardenScale);
  translate(-width / 2, -height / 2);

  updateFlowerSystem();
  updateInputSystem();
  // Later, teammates can add:
  
  // updateAudioSystem();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

