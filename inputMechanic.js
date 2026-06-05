let inputForceRadius = 200;
let inputMaxForce = 28;   
let inputRotationForce = 0.15;

function initInputSystem() {
  for (let f of flowers) {
    if (f.offsetX === undefined) f.offsetX = 0;
    if (f.offsetY === undefined) f.offsetY = 0;
  }
}

function updateInputSystem() {
  applyMouseForcesToFlowers();
}

function applyMouseForcesToFlowers() {
  if (!flowers || flowers.length === 0) return;

  for (let f of flowers) {
    if (f.offsetX === undefined) f.offsetX = 0;
    if (f.offsetY === undefined) f.offsetY = 0;

    let dx = f.displayX - mouseX;
    let dy = f.displayY - mouseY;
    let distToMouse = sqrt(dx * dx + dy * dy);

    if (distToMouse < inputForceRadius) {
      let force = map(distToMouse, 0, inputForceRadius, inputMaxForce, 0);

      let ux = dx / distToMouse;
      let uy = dy / distToMouse;

      f.offsetX += ux * force;
      f.offsetY += uy * force;

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
