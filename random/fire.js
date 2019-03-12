var particles = [];
var particleGravity;
var modeSwitch = true;
var currentPos;
var spawners = [];
var spawnerDistance = 100;
var colorStart;
function setup() {
  createCanvas(windowWidth, windowHeight);
  particleGravity = createVector(0, -1);
  frameRate(60);
  currentPos = createVector(width / 2, height / 2)
  spawners[0] = createVector(width/2 - spawnerDistance, height/2)
  spawners[1] = createVector(width/2 + spawnerDistance, height/2)
  spawners[2] = createVector(width/2, height/2 - spawnerDistance)
  spawners[3] = createVector(width/2, height/2 + spawnerDistance)

}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.size = 12;
    this.fade = false;
    particles.push(this);
    this.col = createVector(255, 221, 0)
    //this.col = createVector(0, 255, 255);
    let angle = Math.random() * Math.PI * 3;
    let dx = Math.cos(angle) * random(1, 2.5);
    let dy = Math.sin(angle) * random(1, 2.5);
    this.dir = createVector(dx, dy);
  }
  update() {
    this.size = map(this.age, 0, 200, 15, 0);
    this.x += this.dir.x;
    this.y += this.dir.y;
    this.dir = p5.Vector.lerp(this.dir, particleGravity, 0.1);
    this.age += 1;
    if (!this.fade) {
      this.col.lerp(255, 0, 0, 0.03);
      //this.col.lerp(255, 255, 255, 0.03)
    } else {
      this.col.lerp(0, 0, 0, 0.03);
    }
    if (this.col.x > 230 && this.col.y < 30 && this.col.z < 30) {
      this.fade = true;
    }

  }
  show() {
    noStroke();
    fill(this.col.x, this.col.y, this.col.z);
    ellipse(this.x, this.y, this.size, this.size);


  }

}

function draw() {
  background(30);

  for (i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
    if (particles[i].age >= 200) {
      particles.splice(i, 1);
    }
  }
  if (modeSwitch) {
    currentPos.x = width / 2;
    currentPos.y = height / 2;
    //new Particle(currentPos.x, currentPos.y);
    for (i = 0; i < spawners.length; i++) {
    	new Particle(spawners[i].x, spawners[i].y);
      spawners[i] = pointRotate(width/2, height/2, spawners[i].x, spawners[i].y, 1);
    }
  } else {
    currentPos = p5.Vector.lerp(currentPos, createVector(mouseX, mouseY), 0.1);
    new Particle(currentPos.x, currentPos.y);
  }



}

function mouseClicked() {
  modeSwitch = !modeSwitch;
  
  
  //disable mouseSwitching code above, and enable code below to make it so when you click,
  //flame goes towards where you last clicked.
  // angle = angleFromPoints(width / 2, height / 2, mouseX, mouseY);
  // let dx = Math.cos(angle)
  // let dy = Math.sin(angle)
  // particleGravity = createVector(dx, dy);


}
function pointRotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return createVector(nx, ny);
}
function angleFromPoints(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  //theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}