let inputForceRadius = 150;
let inputMaxForce = 50;
let inputRotationForce = 0.15;
let camOffsetX = 0;
let camOffsetY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let lastScale = 1;

function initInputSystem() {

}

function updateInputSystem() {
  applyMouseForcesToFlowers();
  handleCameraDrag();
  applyZoomParallax(); 
}

function applyMouseForcesToFlowers() {
  if (!flowers || flowers.length === 0) return;

  for (let f of flowers) {
    if (f.x === undefined || f.y === undefined) continue;

    let dx = f.x - mouseX;
    let dy = f.y - mouseY;
    let distToMouse = sqrt(dx * dx + dy * dy);

    if (distToMouse < inputForceRadius) {
      let force = map(distToMouse, 0, inputForceRadius, inputMaxForce, 0);

      let ux = dx / distToMouse;
      let uy = dy / distToMouse;

      f.x += ux * force;
      f.y += uy * force;

      if (f.rotation !== undefined) {
        let rotPush = map(distToMouse, 0, inputForceRadius, inputRotationForce, 0);
        f.rotation += random(-rotPush, rotPush);
      }
    }

    f.offsetX *= 0.92;
    f.offsetY *= 0.92;
    f.displayX += f.offsetX;
    f.displayY += f.offsetY;

  }
}

let gardenScale = 1;
let zoomSpeed = 0.0015;
let minScale = 1;
let maxScale = 2.5;

// This part of the code was completed under the guidance of the generative AI Copilot, which corrected the error codes I wrote.
function mouseWheel(event) {

  gardenScale -= event.delta * zoomSpeed;

  gardenScale = constrain(gardenScale, minScale, maxScale);

  return false;
}

function mousePressed() {
  if (mouseButton === LEFT) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    isDragging = false;
  }
}

function mouseDragged() {
  if (isDragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;

    camOffsetX += dx;
    camOffsetY += dy;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function clampCamera() {
  let scaledW = width * gardenScale;
  let scaledH = height * gardenScale;

  let limitX = (scaledW - width) / 2;
  let limitY = (scaledH - height) / 2;

  camOffsetX = constrain(camOffsetX, -limitX, limitX);
  camOffsetY = constrain(camOffsetY, -limitY, limitY);
}

function handleCameraDrag() {
  if (mouseIsPressed && mouseButton === LEFT) {
    let dx = mouseX - pmouseX;
    let dy = mouseY - pmouseY;

    camOffsetX += dx;
    camOffsetY += dy;

    clampCamera();
  }
}

function applyZoomParallax() {
  if (!flowers || flowers.length === 0) return;

  let scaleDelta = gardenScale - lastScale;
  lastScale = gardenScale;

  if (abs(scaleDelta) < 0.0001) return;

  for (let f of flowers) {

    let depthFactor = map(f.size, 30, 200, 2.5, 0.2);

    let parallax = scaleDelta * 200 * depthFactor;

    f.x += (f.x - width / 2) * parallax * 0.002;
    f.y += (f.y - height / 2) * parallax * 0.002;
  }
}