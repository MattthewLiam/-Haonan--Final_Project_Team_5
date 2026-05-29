class Flower {
  constructor() {
    this.baseX = random(width);
    this.baseY = random(height);
    this.size = random(45, 95);
    this.petalCount = floor(random(3, 24));
    this.rotation = random(TWO_PI);
    this.age = 0;
    this.fadeInTime = random(45, 75);
    this.stayTime = random(300, 500);
    this.fadeOutTime = random(50, 90);
    this.totalLife = this.fadeInTime + this.stayTime + this.fadeOutTime;
    this.noiseSeedX = random(1000);
    this.noiseSeedY = random(1000);
    this.noiseSeedR = random(1000);
    this.petalColor = color(random(255), random(255), random(255));
    this.centerColor = color(random(255), random(255), random(255));
  }

  update() {
    this.age++;
    let driftX = map(noise(this.noiseSeedX + frameCount * 0.004), 0, 1, -22, 22);
    let driftY = map(noise(this.noiseSeedY + frameCount * 0.004), 0, 1, -22, 22);
    this.x = this.baseX + driftX;
    this.y = this.baseY + driftY;
  }

  getProgress() {
    if (this.age < this.fadeInTime) {
      return map(this.age, 0, this.fadeInTime, 0, 1);
    } else if (this.age < this.fadeInTime + this.stayTime) {
      return 1;
    } else {
      return map(this.age, this.fadeInTime + this.stayTime, this.totalLife, 1, 0);
    }
  }

  getAlpha() {
    if (this.age < this.fadeInTime * 0.25) {
      return map(this.age, 0, this.fadeInTime * 0.25, 0, 190);
    } else if (this.age < this.fadeInTime + this.stayTime) {
      return 190;
    } else {
      return map(this.age, this.fadeInTime + this.stayTime, this.totalLife, 190, 0);
    }
  }

  display() {
    let progress = this.getProgress();
    let alpha = this.getAlpha();
    let petalProgress = constrain(map(progress, 0.18, 1, 0, 1), 0, 1);
    petalProgress = easeInOutCubic(petalProgress);
    let centerProgress = constrain(map(progress, 0, 0.25, 0, 1), 0, 1);
    centerProgress = easeOutCubic(centerProgress);

    push();
    translate(this.x, this.y);
    let noiseRotation = map(noise(this.noiseSeedR + frameCount * 0.003), 0, 1, -0.18, 0.18);
    rotate(this.rotation + noiseRotation);
    noStroke();

    let petalLength = this.size * petalProgress;
    let petalWidth = this.size * 0.34 * petalProgress;

    for (let i = 0; i < this.petalCount; i++) {
      push();
      rotate((TWO_PI / this.petalCount) * i);
      fill(red(this.petalColor), green(this.petalColor), blue(this.petalColor), alpha * petalProgress);
      ellipse(0, petalLength * 0.36, petalWidth, petalLength);
      pop();
    }

    fill(red(this.centerColor), green(this.centerColor), blue(this.centerColor), alpha);
    circle(0, 0, this.size * 0.42 * centerProgress);
    pop();
  }

  isDead() {
    return this.age > this.totalLife;
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}