let cameraDepth = 0;
let mouseX = 0;
let mouseY = 0;
let mouseInfluence = 120;
let pushStrength = 0.002;
const originalFlowerUpdate = Flower.prototype.update;

function mouseMoved() {
  mouseX = mouseX || mouseX;
  mouseY = mouseY || mouseY;
}

Flower.prototype.update = function () {
  originalFlowerUpdate.call(this);
  if (this.depthSpeed === undefined) {
    this.depthSpeed = random(80, 360);
  }
  let dirX = this.baseX - width / 2;
  let dirY = this.baseY - height / 2;
  let distanceFromCentre = sqrt(dirX * dirX + dirY * dirY);
  if (distanceFromCentre > 0) {
    dirX = dirX / distanceFromCentre;
    dirY = dirY / distanceFromCentre;
  }
  let depthMoveX = dirX * cameraDepth * this.depthSpeed;
  let depthMoveY = dirY * cameraDepth * this.depthSpeed;
  this.x += depthMoveX;
  this.y += depthMoveY;
};

const originalFlowerDisplay = Flower.prototype.display;

Flower.prototype.display = function () {
  if (this.depth === undefined) {
    this.depth = random(0.3, 1.8);
  }
  let originalSize = this.size;
  let depthScale = constrain(1 + cameraDepth * this.depth * 0.35, 0.5, 2.2);
  this.size = originalSize * depthScale;
  originalFlowerDisplay.call(this);
  this.size = originalSize;
};

function mouseWheel(event) {
  cameraDepth += event.delta * -0.0015;
  cameraDepth = constrain(cameraDepth, 0, 1.4);
  return false;
}