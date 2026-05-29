let audioMic;
let audioStarted = false;
let smoothAudioLevel = 0;
let audioGlitchAmount = 0;
let dangerMode = false;
let dangerThreshold = 0.03;

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
    smoothAudioLevel = lerp(smoothAudioLevel, level, 0.15);
  } else {
    smoothAudioLevel = 0;
  }

  audioGlitchAmount = map(smoothAudioLevel, 0, 0.3, 0, 55, true);
  dangerMode = smoothAudioLevel > dangerThreshold;
  
  if (dangerMode) {
    audioGlitchAmount *= 2.5; 
  }
}

const originalDisplayWithAudio = Flower.prototype.display;

Flower.prototype.display = function () {
  if (dangerMode) {
    let originalPetalColor = this.petalColor;
    let originalCenterColor = this.centerColor;

    this.petalColor = color(255, 255, 255, 200);
    this.centerColor = color(255, 255, 255, 200);

    originalDisplayWithAudio.call(this);

    this.petalColor = originalPetalColor;
    this.centerColor = originalCenterColor;
  } else {
    originalDisplayWithAudio.call(this);
  }
};

function applyAudioTearing() {
  drawScanlines(15); 

  if (audioGlitchAmount < 3) return;

  let snap = get(); 
  background(0); 
  blendMode(SCREEN); 
  
  tint(255, 0, 0, 220); 
  image(snap, -audioGlitchAmount * 0.4, 0);
  tint(0, 255, 255, 220); 
  image(snap, audioGlitchAmount * 0.4, 0);
  
  blendMode(BLEND); 
  noTint();

  let tearCount = floor(audioGlitchAmount * 0.8);
  for (let i = 0; i < tearCount; i++) {
    let y = random(height);
    let h = random(5, 30); 
    let shift = random(-audioGlitchAmount * 2.5, audioGlitchAmount * 2.5); 
    copy(0, y, width, h, shift, y, width, h);
  }

  if (dangerMode) {
    noStroke();
    let bloodDrops = floor(random(8, 20));
    for (let i = 0; i < bloodDrops; i++) {
      fill(160, 0, 0, random(100, 255)); 
      let bx = random(width);
      let by = random(-50, height);
      let bw = random(2, 12);
      let bh = random(height / 3, height);
      rect(bx, by, bw, bh);
    }
  }

  noStroke();
  let noiseCount = audioGlitchAmount * 15;
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