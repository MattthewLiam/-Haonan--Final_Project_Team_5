let flowers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  for (let i = 0; i < 10; i++) {
    flowers.push(new Flower());
  }
}

function draw() {
  background(5, 8, 15, 35);
  if (frameCount % 5 === 0 && flowers.length < 100) {
    flowers.push(new Flower());
  }
  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].update();
    flowers[i].display();
    if (flowers[i].isDead()) {
      flowers.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}