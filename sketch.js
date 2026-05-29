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
    this.size = random(45, 95);

    // Random number of petals
    this.petalCount = floor(random(3, 24));

    // Random initial rotation angle
    this.rotation = random(TWO_PI);

    // Age counter used for lifecycle animation
    this.age = 0;

    // Duration of fade in, visible state, and fade out
    this.fadeInTime = random(45, 75);
    this.stayTime = random(300, 500);
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
      this.size * 0.34 * petalProgress;

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

// --------------------------------------------------
// Mouse wheel depth / parallax extension
// This section adds a fake 3D depth effect without changing the original flower code.
// --------------------------------------------------

// This value works like a virtual camera depth.
// Scrolling up increases it, making flowers move outward from the centre.
// Scrolling down decreases it, making flowers move back toward the centre.
let cameraDepth = 0;

// Save the original Flower update function
const originalFlowerUpdate = Flower.prototype.update;

// Extend the original update function
Flower.prototype.update = function () {

  // Run the original Perlin noise floating movement first
  originalFlowerUpdate.call(this);

  // Give each flower a random movement speed if it does not already have one
  // This speed is independent from its distance to the centre
  if (this.depthSpeed === undefined) {
    this.depthSpeed = random(80, 360);
  }

  // Direction from the centre of the canvas to the flower's base position
  let dirX = this.baseX - width / 2;
  let dirY = this.baseY - height / 2;

  // Convert the direction into a unit vector
  // This keeps only the direction, not the distance
  let distanceFromCentre = sqrt(dirX * dirX + dirY * dirY);

  if (distanceFromCentre > 0) {
    dirX = dirX / distanceFromCentre;
    dirY = dirY / distanceFromCentre;
  }

  // Move flowers outward from the centre
  // The movement amount is controlled by cameraDepth and each flower's random speed
  let depthMoveX = dirX * cameraDepth * this.depthSpeed;
  let depthMoveY = dirY * cameraDepth * this.depthSpeed;

  // Add the depth movement on top of the original flower position
  this.x += depthMoveX;
  this.y += depthMoveY;
};

// Save the original Flower display function
const originalFlowerDisplay = Flower.prototype.display;

// Extend the original display function
Flower.prototype.display = function () {

  if (this.depth === undefined) {
    this.depth = random(0.3, 1.8);
  }

  // Save the original size
  let originalSize = this.size;

  // Scale flowers slightly based on depth
  // This makes closer flowers appear larger and enhances the fake 3D effect
  let depthScale = constrain(
    1 + cameraDepth * this.depth * 0.35,
    0.5,
    2.2
  );

  this.size = originalSize * depthScale;

  // Run the original display function
  originalFlowerDisplay.call(this);

  // Restore the original size so the flower does not permanently grow
  this.size = originalSize;
};

// Mouse wheel interaction
function mouseWheel(event) {

  // In most browsers, scrolling up gives a negative delta.
  // Multiplying by -1 makes scrolling up push flowers outward.
  cameraDepth += event.delta * -0.0015;

  // Limit the depth range so the movement does not become uncontrollable
  cameraDepth = constrain(cameraDepth, 0, 1.4);

  // Prevent the page from scrolling while interacting with the canvas
  return false;
}

// --------------------------------------------------
// Audio Glitch Extension
// This section uses microphone input to disturb the digital garden.
// Louder sound creates stronger screen tearing.
// If the sound passes a threshold, the background turns blood red
// and the flowers become white.
// --------------------------------------------------

// Microphone input
let audioMic;
let audioStarted = false;

// Smoothed audio level for more stable visual changes
let smoothAudioLevel = 0;

// Current glitch strength
let audioGlitchAmount = 0;

// When this becomes true, the garden enters a corrupted state
let dangerMode = false;

// You can adjust this value.
// Lower value = easier to trigger the red background and white flowers.
let dangerThreshold = 0.18;

// Save the current setup function
const originalSetupWithAudio = setup;

setup = function () {

  // Run the original setup first
  originalSetupWithAudio();

  // Create microphone input
  audioMic = new p5.AudioIn();

  // Add a button to enable microphone
  let micButton = createButton("Enable Microphone");
  micButton.position(20, 20);

  micButton.mousePressed(function () {
    userStartAudio();
    audioMic.start();
    audioStarted = true;
    micButton.hide();
  });
};

// Save the current draw function
const originalDrawWithAudio = draw;

draw = function () {

  // Update microphone level before drawing the garden
  updateAudioGlitch();

  // If the sound is too loud, create a blood-red background state
  // This happens before the original draw, so flowers are still drawn above it
  if (dangerMode) {
    background(255, 0, 0, 180);
  }

  // Run the original draw function
  originalDrawWithAudio();

  // Apply screen tearing after the garden is drawn
  applyAudioTearing();
};

// Update audio level and glitch state
function updateAudioGlitch() {

  if (audioStarted) {

    // Get current microphone volume
    let level = audioMic.getLevel();

    // Smooth the level so the effect does not jump too sharply
    smoothAudioLevel = lerp(smoothAudioLevel, level, 0.15);

  } else {

    smoothAudioLevel = 0;
  }

  // Convert microphone volume to glitch strength
  audioGlitchAmount = map(
    smoothAudioLevel,
    0,
    0.3,
    0,
    55,
    true
  );

  // Enter danger mode when the audio level passes the threshold
  dangerMode = smoothAudioLevel > dangerThreshold;
}

// Apply screen tearing based on microphone volume
function applyAudioTearing() {

  if (audioGlitchAmount < 3) {
    return;
  }

  // The louder the sound, the more tearing lines appear
  let tearCount = floor(audioGlitchAmount * 0.5);

  for (let i = 0; i < tearCount; i++) {

    let y = random(height);
    let h = random(3, 20);

    let shift = random(
      -audioGlitchAmount * 2,
      audioGlitchAmount * 2
    );

    // Copy a horizontal slice of the canvas and shift it sideways
    copy(
      0,
      y,
      width,
      h,
      shift,
      y,
      width,
      h
    );
  }
}

// Save the current Flower display function
const originalDisplayWithAudio = Flower.prototype.display;

Flower.prototype.display = function () {

  // If danger mode is active, temporarily turn the flower white
  if (dangerMode) {

    let originalPetalColor = this.petalColor;
    let originalCenterColor = this.centerColor;

    this.petalColor = color(255);
    this.centerColor = color(255);

    originalDisplayWithAudio.call(this);

    this.petalColor = originalPetalColor;
    this.centerColor = originalCenterColor;

  } else {

    // Otherwise, display flowers normally
    originalDisplayWithAudio.call(this);
  }
};