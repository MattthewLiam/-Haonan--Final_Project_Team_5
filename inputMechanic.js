let inputForceRadius = 200;
let inputMaxForce = 30;   
let inputRotationForce = 0.15;

function initInputSystem() {

}

function updateInputSystem() {
  applyMouseForcesToFlowers();
}

function applyMouseForcesToFlowers() {
  if (!flowers || flowers.length === 0) return;

  for (let f of flowers) {
    let dx = f.displayX - mouseX;
    let dy = f.displayY - mouseY;
    let distToMouse = sqrt(dx * dx + dy * dy);

    if (distToMouse < inputForceRadius) {
      let force = map(distToMouse, 0, inputForceRadius, inputMaxForce, 0);

      let ux = dx / distToMouse;
      let uy = dy / distToMouse;

      f.displayX += ux * force;
      f.displayY += uy * force;

      if (f.rotation !== undefined) {
        let rotPush = map(distToMouse, 0, inputForceRadius, inputRotationForce, 0);
        f.rotation += random(-rotPush, rotPush);
      }
    }

    let restoreX = (f.x - f.displayX) * 0.03;
    let restoreY = (f.y - f.displayY) * 0.03;

    f.displayX += restoreX;
    f.displayY += restoreY;
  }
}
