let inputForceRadius = 200;
let inputMaxForce = 28;   
let inputRotationForce = 0.15;

function initInputSystem() {

}

function updateInputSystem() {
  applyMouseForcesToFlowers();
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
