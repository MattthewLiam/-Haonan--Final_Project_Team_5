let audioMic;
let audioStarted = false;
let smoothAudioLevel = 0;
let audioGlitchAmount = 0;
let dangerMode = false;
let dangerThreshold = 0.1;

const originalSetupWithAudio = setup;

setup = function () {
  originalSetupWithAudio();
  audioMic = new p5.AudioIn();
  
  let micButton = createButton("Enable Microphone");
  micButton.position(20, 20);
  micButton.style('padding', '10px 15px');
  micButton.style('background', '#fff');
  micButton.style('border', 'none');
  micButton.style('cursor', 'pointer');
  micButton.style('font-weight', 'bold');
  
  micButton.mousePressed(function () {
    userStartAudio();
    audioMic.start();
    audioStarted = true;
    micButton.hide();
  });
};

const originalDrawWithAudio = draw;

draw = function () {
  updateAudioGlitch();

  if (dangerMode) {
    background(120, 0, 0, 220);
  }

  originalDrawWithAudio();
  applyAudioTearing();
};

function updateAudioGlitch() {
  if (audioStarted) {
    let level = audioMic.getLevel();
    if (level > smoothAudioLevel) {
      smoothAudioLevel = lerp(smoothAudioLevel, level, 0.6); 
    } else {
      smoothAudioLevel = lerp(smoothAudioLevel, level, 0.04); 
    }
  } else {
    smoothAudioLevel = 0;
  }

  audioGlitchAmount = map(smoothAudioLevel, 0.05, 0.5, 0, 55, true);
  dangerMode = smoothAudioLevel > dangerThreshold;
  
  if (dangerMode) {
    audioGlitchAmount *= 2.5; 
  }
}

function drawCreepyFace(fs) {
  blendMode(DIFFERENCE);
  fill(255);
  noStroke();
  ellipse(-fs * 0.12, -fs * 0.05, fs * 0.05, fs * 0.15);
  ellipse(fs * 0.15, -fs * 0.03, fs * 0.04, fs * 0.12);
  stroke(255);
  strokeWeight(max(2, fs * 0.025)); // 优化保留：保底 2 像素粗细
  noFill();
  beginShape();
  vertex(-fs * 0.25, fs * 0.1);
  bezierVertex(-fs * 0.1, fs * 0.25, fs * 0.1, fs * 0.25, fs * 0.25, fs * 0.05);
  endShape();
}

const originalDisplayF1 = Flower1.prototype.display;
Flower1.prototype.display = function () {
  if (dangerMode) {
    let origColor = this.flowerColor;
    this.flowerColor = color(255, 255, 255, 200);
    originalDisplayF1.call(this);
    this.flowerColor = origColor;

    push();
    translate(this.displayX, this.displayY); // 注意：队友的新代码用了 displayX/Y
    drawCreepyFace(this.size);
    pop();
  } else {
    originalDisplayF1.call(this);
  }
};

const originalDisplayF2 = Flower2.prototype.display;
Flower2.prototype.display = function () {
  if (dangerMode) {
    let op = this.petalColor;
    let os = this.stamenColor;
    let opi = this.pistilColor;
    
    this.petalColor = color(255, 255, 255, 200);
    this.stamenColor = color(255, 255, 255, 200);
    this.pistilColor = color(255, 255, 255, 200);
    
    originalDisplayF2.call(this);
    
    this.petalColor = op;
    this.stamenColor = os;
    this.pistilColor = opi;

    push();
    translate(this.displayX, this.displayY);
    let noiseRotation = map(noise(this.noiseSeedR + frameCount * 0.003), 0, 1, -0.12, 0.12);
    rotate(this.rotation + noiseRotation);
    drawCreepyFace(this.size);
    pop();
  } else {
    originalDisplayF2.call(this);
  }
};

const originalDisplayF3 = Flower3.prototype.display;
Flower3.prototype.display = function () {
  if (dangerMode) {
    originalDisplayF3.call(this);
    push();
    translate(this.displayX, this.displayY);
    let noiseRotation = map(noise(this.noiseSeedR + frameCount * 0.003), 0, 1, -0.12, 0.12);
    rotate(this.rotation + noiseRotation);
    drawCreepyFace(this.size);
    pop();
  } else {
    originalDisplayF3.call(this);
  }
};

const originalDrawFlower3GradientTriangle = drawFlower3GradientTriangle;
drawFlower3GradientTriangle = function(triLength, triWidth, alpha) {
  if (dangerMode) {
    let ctx = drawingContext;
    let leftW = triWidth * 0.35;
    let rightW = triWidth * 0.75;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-leftW, -triLength);
    ctx.lineTo(rightW, -triLength);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha / 255})`; // 强制变为白色
    ctx.fill();
    ctx.restore();
  } else {
    originalDrawFlower3GradientTriangle(triLength, triWidth, alpha);
  }
};

function applyAudioTearing() {
  drawScanlines(15); 

  if (audioGlitchAmount < 3) return;

  let snap = get(); 
  background(0); 
  blendMode(SCREEN); 
  
  let maxOffset = width * 0.06; 
  let offsetR = constrain(-audioGlitchAmount * 0.4, -maxOffset, maxOffset);
  let offsetC = constrain(audioGlitchAmount * 0.4, -maxOffset, maxOffset);

  tint(255, 0, 0, 220); 
  image(snap, offsetR, 0);
  tint(0, 255, 255, 220); 
  image(snap, offsetC, 0);
  
  blendMode(BLEND); 
  noTint();

  let tearCount = min(floor(audioGlitchAmount * 0.8), 25); 
  
  for (let i = 0; i < tearCount; i++) {
    let y = random(height);
    let h = random(10, 50); 
    let shift = random(-audioGlitchAmount * 2.5, audioGlitchAmount * 2.5); 
    copy(0, y, width, h, shift, y, width, h);
  }

  if (dangerMode) {
    noStroke();
    let bloodDrops = floor(random(8, 20));
    for (let i = 0; i < bloodDrops; i++) {
      let alpha = random(120, 255);
      fill(160, 0, 0, alpha); 
      let bx = random(width);
      let by = random(-50, height / 2); 
      let bw = random(1, 4);            
      let bh = random(height / 3, height);
      rect(bx, by, bw, bh);
      
      fill(100, 0, 0, alpha + 50);
      ellipse(bx + bw / 2, by + bh, bw * 1.8, bw * 3.5);
    }
  }

  noStroke();
  let noiseCount = min(audioGlitchAmount * 15, 300);
  for (let i = 0; i < noiseCount; i++) {
    fill(255, random(50, 150)); 
    rect(random(width), random(height), random(2, 8), random(1, 3));
  }
  
  drawScanlines(map(audioGlitchAmount, 3, 150, 30, 200));
}

function drawScanlines(opacity) {
  stroke(0, opacity);
  strokeWeight(2);
  for (let y = 0; y < height; y += 4) {
    line(0, y, width, y);
  }
}