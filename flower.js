// --------------------------------------------------
// Generative Flower System with Perlin Noise
// This section creates random flowers that bloom, float with Perlin noise,
// stay briefly, then shrink and fade away.
// --------------------------------------------------

let flowers = [];

function setup() {
  // Create a full-window canvas and set angles to radians for rotation calculations
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Generate a small number of flowers at the beginning
  for (let i = 0; i < 10; i++) {
    flowers.push(new Flower());
  }
}

function draw() {
  // Draw a semi-transparent dark background each frame, to create a soft motion trail effect
  background(5, 8, 15, 35);

  // Generate a new flower every 55 frames, while limiting the maximum number of flowers on screen
  if (frameCount % 5 === 0 && flowers.length < 100) {
    flowers.push(new Flower());
  }

  // Loop backwards through the flower array, to safely update and remove flowers
  for (let i = flowers.length - 1; i >= 0; i--) {

    // Update flower movement and lifecycle
    flowers[i].update();

    // Draw the flower on the canvas
    flowers[i].display();

    // Remove flowers after their lifecycle ends
    if (flowers[i].isDead()) {
      flowers.splice(i, 1);
    }
  }
}

class Flower {

  constructor() {

    // Random base position for each flower
    this.baseX = random(width);
    this.baseY = random(height);

    // Random flower size
    this.size = random(25, 115);

    // Random number of petals
    this.petalCount = floor(random(3, 18));

    // Random initial rotation angle
    this.rotation = random(TWO_PI);

    // Age counter used for lifecycle animation
    this.age = 0;

    // Duration of fade in, visible state, and fade out
    this.fadeInTime = random(45, 75);
    this.stayTime = random(350, 500);
    this.fadeOutTime = random(50, 90);

    // Total lifespan of the flower
    this.totalLife =
      this.fadeInTime +
      this.stayTime +
      this.fadeOutTime;

    // Separate Perlin noise seeds for drifting and rotation
    this.noiseSeedX = random(1000);
    this.noiseSeedY = random(1000);
    this.noiseSeedR = random(1000);

    // Completely random petal colour
    this.petalColor = color(
      random(255),
      random(255),
      random(255)
    );

    // Completely random flower centre colour
    this.centerColor = color(
      random(255),
      random(255),
      random(255)
    );
  }

  update() {

    // Increase flower age every frame
    this.age++;

    // Generate smooth floating movement using Perlin noise
    let driftX = map(
      noise(this.noiseSeedX + frameCount * 0.004),
      0,
      1,
      -22,
      22
    );

    let driftY = map(
      noise(this.noiseSeedY + frameCount * 0.004),
      0,
      1,
      -22,
      22
    );

    // Apply drifting movement to the flower position
    this.x = this.baseX + driftX;
    this.y = this.baseY + driftY;
  }

  getProgress() {

    // Fade in stage
    if (this.age < this.fadeInTime) {

      return map(
        this.age,
        0,
        this.fadeInTime,
        0,
        1
      );

    }

    // Fully visible stage
    else if (
      this.age <
      this.fadeInTime + this.stayTime
    ) {

      return 1;

    }

    // Fade out stage
    else {

      return map(
        this.age,
        this.fadeInTime + this.stayTime,
        this.totalLife,
        1,
        0
      );
    }
  }

  getAlpha() {

    // Fade in transparency
    if (this.age < this.fadeInTime * 0.25) {

      return map(
        this.age,
        0,
        this.fadeInTime * 0.25,
        0,
        190
      );

    }

    // Fully visible transparency
    else if (
      this.age <
      this.fadeInTime + this.stayTime
    ) {

      return 190;

    }

    // Fade out transparency
    else {

      return map(
        this.age,
        this.fadeInTime + this.stayTime,
        this.totalLife,
        190,
        0
      );
    }
  }

  display() {

    // Overall lifecycle progress
    let progress = this.getProgress();

    // Current transparency value
    let alpha = this.getAlpha();

    // Petals appear slightly after the flower centre
    let petalProgress = constrain(
      map(progress, 0.18, 1, 0, 1),
      0,
      1
    );

    // Smooth petal growth and shrinking animation
    petalProgress = easeInOutCubic(petalProgress);

    // Flower centre appears first
    let centerProgress = constrain(
      map(progress, 0, 0.25, 0, 1),
      0,
      1
    );

    centerProgress = easeOutCubic(centerProgress);

    push();

    // Move drawing origin to flower position
    translate(this.x, this.y);

    // Apply subtle noise-based rotation movement
    let noiseRotation = map(
      noise(this.noiseSeedR + frameCount * 0.003),
      0,
      1,
      -0.18,
      0.18
    );

    rotate(this.rotation + noiseRotation);

    noStroke();

    // Current petal dimensions
    let petalLength =
      this.size * petalProgress;

    let petalWidth =
      this.size * 0.35 * petalProgress;

    // Draw petals growing outward from the centre
    for (let i = 0; i < this.petalCount; i++) {

      push();

      rotate(
        (TWO_PI / this.petalCount) * i
      );

      fill(
        red(this.petalColor),
        green(this.petalColor),
        blue(this.petalColor),
        alpha * petalProgress
      );

      ellipse(
        0,
        petalLength * 0.36,
        petalWidth,
        petalLength
      );

      pop();
    }

    // Draw larger flower centre above petals
    fill(
      red(this.centerColor),
      green(this.centerColor),
      blue(this.centerColor),
      alpha
    );

    circle(
      0,
      0,
      this.size * 0.42 * centerProgress
    );

    pop();
  }

  isDead() {

    // Remove flower after its lifespan ends
    return this.age > this.totalLife;
  }
}

// Easing function for smoother petal growth and shrinking animation
function easeInOutCubic(t) {

  return t < 0.5
    ? 4 * t * t * t
    : 1 - pow(-2 * t + 2, 3) / 2;
}

// Easing function for a softer flower centre appearance
function easeOutCubic(t) {

  return 1 - pow(1 - t, 3);
}

function windowResized() {

  // Automatically resize the canvas when the browser window changes size
  resizeCanvas(windowWidth, windowHeight);
}
