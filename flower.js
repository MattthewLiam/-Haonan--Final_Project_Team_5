// --------------------------------------------------
// Generative Flower System
// This file manages different procedural flower types.
// Each flower type can have its own shape, animation, and behaviour.
// Current flower type:
// Flower1: yellow transparent circle-based flower.
// --------------------------------------------------

let flowers = [];

// Add future flower classes here
let flowerTypes = [];

// Initialise the flower system
function initFlowerSystem() {
  flowerTypes = [
    Flower1,
    Flower2,
    Flower3
  ];

  // Create initial flowers when the sketch starts
  for (let i = 0; i < 20; i++) {
    spawnRandomFlower();
  }
}

// Update and display all flowers
function updateFlowerSystem() {
  // Generate new flowers over time
  if (frameCount % 5 === 0 && flowers.length < 140) {
    spawnRandomFlower();
  }

  // Update flowers backwards so dead flowers can be removed safely
  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].update();
    flowers[i].display();

    if (flowers[i].isDead()) {
      flowers.splice(i, 1);
    }
  }
}

// This code was generated with the help of ChatGPT and
// Randomly choose one flower type and create it
function spawnRandomFlower() {
  let FlowerClass = random(flowerTypes);
  flowers.push(new FlowerClass());
}

// --------------------------------------------------
// Flower1
// A yellow transparent flower made from 8 circular petals.
// Each circle appears one by one counterclockwise,
// stays briefly, then disappears in the same order.
// The flower floats subtly using Perlin noise.
// --------------------------------------------------

class Flower1 {
  constructor() {
    // Random position on the canvas
    this.x = random(width);
    this.y = random(height);

    // Random overall size
    this.size = random(40, 120);

    // Circle-based flower structure
    this.petalRadius = this.size * 0.35;
    this.circleSize = this.size * 0.7;
    this.circleCount = 6;

    // Lifecycle timing
    this.age = 0;
    this.appearDuration = 60;
    this.stayDuration = random(180, 360);
    this.disappearDuration = 60;

    this.totalLife =
      this.appearDuration +
      this.stayDuration +
      this.disappearDuration;

    // Fixed yellow colour for Flower1
    this.flowerColor = color(255, 230, 40);

    // Perlin noise seeds for smooth floating movement
    this.noiseSeedX = random(1000);
    this.noiseSeedY = random(1000);
  }

  update() {
    this.age++;

    // This code was generated with the help of ChatGPT and using
    // Perlin noise creates subtle floating movement around the original position
    let driftX = map(
      noise(this.noiseSeedX + frameCount * 0.004),
      0,
      1,
      -20,
      20
    );

    let driftY = map(
      noise(this.noiseSeedY + frameCount * 0.004),
      0,
      1,
      -20,
      20
    );

    this.displayX = this.x + driftX;
    this.displayY = this.y + driftY;
  }

  display() {
    push();
    translate(this.displayX, this.displayY);

    noStroke();

    for (let i = 0; i < this.circleCount; i++) {
      // Start from the bottom circle and move counterclockwise
      let angle = HALF_PI - (TWO_PI / this.circleCount) * i;

      let px = cos(angle) * this.petalRadius;
      let py = sin(angle) * this.petalRadius;

      let alpha = this.getCircleAlpha(i);

      fill(
        red(this.flowerColor),
        green(this.flowerColor),
        blue(this.flowerColor),
        alpha
      );

      circle(px, py, this.circleSize);
    }

    pop();
  }

  getCircleAlpha(index) {
    let maxAlpha = 90;
    let step = this.appearDuration / this.circleCount;

    // Each circle appears one by one
    let appearStart = index * step;

    // Each circle disappears in the same order
    let disappearStart =
      this.appearDuration +
      this.stayDuration +
      index * step;

    if (this.age < appearStart) {
      return 0;
    }

    if (this.age < appearStart + step) {
      return map(
        this.age,
        appearStart,
        appearStart + step,
        0,
        maxAlpha
      );
    }

    if (this.age < this.appearDuration + this.stayDuration) {
      return maxAlpha;
    }

    if (this.age < disappearStart) {
      return maxAlpha;
    }

    if (this.age < disappearStart + step) {
      return map(
        this.age,
        disappearStart,
        disappearStart + step,
        maxAlpha,
        0
      );
    }

    return 0;
  }

  isDead() {
    return this.age > this.totalLife;
  }
}

// --------------------------------------------------
// Flower2
// A structured poster-style flower with:
// 15 oval petals,
// 5 tangent anthers,
// 1 central pistil,
// and 5 filaments passing through the tangent points
// between neighbouring anthers.
// --------------------------------------------------

class Flower2 {
  constructor() {
    // Random position
    this.x = random(width);
    this.y = random(height);

    // Random overall size
    this.size = random(100, 200);

    // Outer petal structure
    this.petalCount = 15;
    this.petalColor = color(208, 88, 131);

    // Inner reproductive structure
    this.stamenCount = 5;
    this.stamenColor = color(150, 174, 245);

    // Central pistil colour
    this.pistilColor = color(245, 205, 75);

    // Random rotation
    this.rotation = random(TWO_PI);

    // Lifecycle timing
    this.age = 0;
    this.appearDuration = 60;
    this.stayDuration = random(180, 360);
    this.disappearDuration = 60;

    this.totalLife =
      this.appearDuration +
      this.stayDuration +
      this.disappearDuration;

    // Perlin noise seeds for smooth drifting
    this.noiseSeedX = random(1000);
    this.noiseSeedY = random(1000);
    this.noiseSeedR = random(1000);

    // Petal dimensions
    this.petalLength = this.size * 0.5;
    this.petalWidth = this.size * 0.2;
    this.petalOffset = this.size * 0.25;

    // Geometry for 5 tangent anthers around a centre circle
    // Let anther radius = r
    // The centre-to-anther-centre distance is d = r / sin(PI / 5)
    // Then pistil radius = d - r
    this.antherRadius = this.size * 0.095;
    this.antherOrbit = this.antherRadius / sin(PI / 5);
    this.pistilRadius = this.antherOrbit - this.antherRadius;

    // Tangent point radius between neighbouring anthers
    this.tangentPointRadius = this.antherOrbit * cos(PI / 5);

    // Filament length extends beyond the tangent point
    this.filamentLength = this.size * 0.3;
  }

  update() {
    this.age++;

    // This code was generated with the help of ChatGPT and create
    // Smooth floating movement using Perlin noise
    let driftX = map(
      noise(this.noiseSeedX + frameCount * 0.003),
      0,
      1,
      -18,
      18
    );

    let driftY = map(
      noise(this.noiseSeedY + frameCount * 0.003),
      0,
      1,
      -18,
      18
    );

    this.displayX = this.x + driftX;
    this.displayY = this.y + driftY;
  }

  display() {
    let progress = this.getProgress();
    let alpha = this.getAlpha();

    push();
    translate(this.displayX, this.displayY);

    // Subtle rotational drift
    let noiseRotation = map(
      noise(this.noiseSeedR + frameCount * 0.003),
      0,
      1,
      -0.12,
      0.12
    );

    rotate(this.rotation + noiseRotation);

    noStroke();

    // --------------------------------------------------
    // 1. Draw 15 outer petals
    // --------------------------------------------------
    for (let i = 0; i < this.petalCount; i++) {
      let angle = (TWO_PI / this.petalCount) * i;

      push();
      rotate(angle - HALF_PI);

      fill(
        red(this.petalColor),
        green(this.petalColor),
        blue(this.petalColor),
        alpha * 0.85
      );

      ellipse(
        0,
        -this.petalOffset * progress,
        this.petalWidth * progress,
        this.petalLength * progress
      );

      pop();
    }

    // --------------------------------------------------
    // 2. Draw 5 filaments
    // Each filament passes through the tangent point
    // between two neighbouring anthers
    // --------------------------------------------------
    stroke(
      red(this.stamenColor),
      green(this.stamenColor),
      blue(this.stamenColor),
      alpha
    );

    strokeWeight(max(1.2, this.size * 0.012 * progress));

    let antherStartAngle = -HALF_PI;

    for (let i = 0; i < this.stamenCount; i++) {
      // Tangent direction lies halfway between neighbouring anther centres
      let filamentAngle =
        antherStartAngle +
        PI / 5 +
        (TWO_PI / this.stamenCount) * i;

      let x2 = cos(filamentAngle) * this.filamentLength * progress;
      let y2 = sin(filamentAngle) * this.filamentLength * progress;

      line(0, 0, x2, y2);
    }

    noStroke();

    // --------------------------------------------------
    // 3. Draw 5 anthers
    // These 5 circles are tangent to each other
    // and tangent to the central pistil
    // --------------------------------------------------
    fill(
      red(this.stamenColor),
      green(this.stamenColor),
      blue(this.stamenColor),
      alpha
    );

    for (let i = 0; i < this.stamenCount; i++) {
      let angle =
        antherStartAngle +
        (TWO_PI / this.stamenCount) * i;

      let ax = cos(angle) * this.antherOrbit * progress;
      let ay = sin(angle) * this.antherOrbit * progress;

      circle(
        ax,
        ay,
        this.antherRadius * 2 * progress
      );
    }

    // --------------------------------------------------
    // 4. Draw central pistil
    // --------------------------------------------------
    fill(
      red(this.pistilColor),
      green(this.pistilColor),
      blue(this.pistilColor),
      alpha
    );

    circle(
      0,
      0,
      this.pistilRadius * 2 * progress
    );

    pop();
  }

  getProgress() {
    if (this.age < this.appearDuration) {
      return map(
        this.age,
        0,
        this.appearDuration,
        0,
        1
      );
    } else if (
      this.age <
      this.appearDuration + this.stayDuration
    ) {
      return 1;
    } else {
      return map(
        this.age,
        this.appearDuration + this.stayDuration,
        this.totalLife,
        1,
        0
      );
    }
  }

  getAlpha() {
    if (this.age < this.appearDuration) {
      return map(
        this.age,
        0,
        this.appearDuration,
        0,
        230
      );
    } else if (
      this.age <
      this.appearDuration + this.stayDuration
    ) {
      return 230;
    } else {
      return map(
        this.age,
        this.appearDuration + this.stayDuration,
        this.totalLife,
        230,
        0
      );
    }
  }

  isDead() {
    return this.age > this.totalLife;
  }
}

// --------------------------------------------------
// Flower3
// A windmill-like flower made from two layers of
// circularly arrayed gradient triangles.
// Layer 1: 5 large triangles
// Layer 2: 5 smaller triangles, rotated by 360 / 5
// --------------------------------------------------

class Flower3 {
  constructor() {
    // Random position
    this.x = random(width);
    this.y = random(height);

    // Random overall size
    this.size = random(30, 100);

    // Structure
    this.triangleCount = 5;
    this.rotation = random(TWO_PI);

    // Triangle dimensions
    this.largeTriangleLength = this.size * 0.95;
    this.largeTriangleWidth = this.size * 0.8;

    this.smallTriangleLength = this.largeTriangleLength * 0.7;
    this.smallTriangleWidth = this.largeTriangleWidth * 0.5;

    // Lifecycle timing
    this.age = 0;
    this.appearDuration = 60;
    this.stayDuration = random(180, 360);
    this.disappearDuration = 60;

    this.totalLife =
      this.appearDuration +
      this.stayDuration +
      this.disappearDuration;

    // Perlin noise seeds for smooth floating movement
    this.noiseSeedX = random(1000);
    this.noiseSeedY = random(1000);
    this.noiseSeedR = random(1000);
  }

  update() {
    this.age++;

    // Smooth floating movement using Perlin noise
    let driftX = map(
      noise(this.noiseSeedX + frameCount * 0.003),
      0,
      1,
      -18,
      18
    );

    let driftY = map(
      noise(this.noiseSeedY + frameCount * 0.003),
      0,
      1,
      -18,
      18
    );

    this.displayX = this.x + driftX;
    this.displayY = this.y + driftY;
  }

  display() {
    let progress = this.getProgress();
    let alpha = this.getAlpha();

    push();
    translate(this.displayX, this.displayY);

    // Subtle rotational drift
    let noiseRotation = map(
      noise(this.noiseSeedR + frameCount * 0.003),
      0,
      1,
      -0.12,
      0.12
    );

    rotate(this.rotation + noiseRotation);

    // --------------------------------------------------
    // Layer 1: 5 large triangles
    // --------------------------------------------------
    for (let i = 0; i < this.triangleCount; i++) {
      push();
      rotate((TWO_PI / this.triangleCount) * i);

      drawFlower3GradientTriangle(
        this.largeTriangleLength * progress,
        this.largeTriangleWidth * progress,
        alpha * 0.9
      );

      pop();
    }

    // --------------------------------------------------
    // Layer 2: 5 smaller triangles
    // Rotated by 360 / 5 = 72 degrees
    // --------------------------------------------------
    for (let i = 0; i < this.triangleCount; i++) {
      push();
      rotate(
        PI / this.triangleCount +
        (TWO_PI / this.triangleCount) * i
      );

      drawFlower3GradientTriangle(
        this.smallTriangleLength * progress,
        this.smallTriangleWidth * progress,
        alpha
      );

      pop();
    }

    pop();
  }

getProgress() {
  let progress;

  if (this.age < this.appearDuration) {
    progress = map(
      this.age,
      0,
      this.appearDuration,
      0,
      1
    );
  } else if (
    this.age <
    this.appearDuration + this.stayDuration
  ) {
    progress = 1;
  } else {
    progress = map(
      this.age,
      this.appearDuration + this.stayDuration,
      this.totalLife,
      1,
      0
    );
  }

  return constrain(progress, 0, 1);
}

  getAlpha() {
    if (this.age < this.appearDuration) {
      return map(
        this.age,
        0,
        this.appearDuration,
        0,
        255
      );
    } else if (
      this.age <
      this.appearDuration + this.stayDuration
    ) {
      return 255;
    } else {
      return map(
        this.age,
        this.appearDuration + this.stayDuration,
        this.totalLife,
        255,
        0
      );
    }
  }

  isDead() {
    return this.age > this.totalLife;
  }
}

// --------------------------------------------------
// This code was generated with the help of ChatGPT
// Helper function for Flower3
// Draws one gradient triangle whose pivot point is
// the centre vertex at (0, 0)
// --------------------------------------------------

function drawFlower3GradientTriangle(triLength, triWidth, alpha) {
  let ctx = drawingContext;
  let leftW = triWidth * 0.35;
  let rightW = triWidth * 0.75;

  ctx.save();

  // Clip to triangle shape
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-leftW, -triLength);
  ctx.lineTo(rightW, -triLength);
  ctx.closePath();
  ctx.clip();

  // 1. Base gradient across the outer edge: pink -> green
  let edgeGradient = ctx.createLinearGradient(
    -leftW,
    -triLength,
    rightW,
    -triLength
  );

  edgeGradient.addColorStop(
    0,
    `rgba(255, 170, 220, ${alpha / 255})`
  );

  edgeGradient.addColorStop(
    1,
    `rgba(170, 255, 150, ${alpha / 255})`
  );

  ctx.fillStyle = edgeGradient;
  ctx.fillRect(
    -leftW,
    -triLength,
    leftW + rightW,
    triLength
  );

  // 2. Red glow from the centre vertex outward
  let centreGradient = ctx.createRadialGradient(
    0,
    0,
    0,
    0,
    0,
    triLength * 0.9
  );

  centreGradient.addColorStop(
    0,
    `rgba(255, 70, 70, ${alpha / 255})`
  );

  centreGradient.addColorStop(
    0.28,
    `rgba(255, 90, 90, ${(alpha * 0.75) / 255})`
  );

  centreGradient.addColorStop(
    1,
    `rgba(255, 90, 90, 0)`
  );

  ctx.fillStyle = centreGradient;
  ctx.fillRect(
    -triWidth,
    -triLength * 1.2,
    triWidth * 2,
    triLength * 1.4
  );

  ctx.restore();
}