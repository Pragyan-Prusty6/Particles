const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
let numParticles = 0;
const width = (canvas.width = window.innerWidth);
const height =( canvas.height = window.innerHeight);
const para = document.querySelector('p');
function random(min,max) {
    const num = Math.floor(Math.random()*(max-min+1))+min;
    return num;
}
function randomColor() {
    return `rgb(${random(0,255)},255,${random(0,255)})`;
}
class Shape{
  constructor(x,y,velX,velY){
    this.x= x;
    this.y= y;
    this.velX= velX;
    this.velY= velY;
    
  }
}
class BlackHole extends Shape{
  constructor(x,y){
    super(x,y,20,20);
    this.color="black";
   this.size=50;
   window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'ArrowLeft':
          this.x -= this.velX;
          break;
        case 'ArrowRight':
          this.x += this.velX;
          break;
        case 'ArrowUp':
          this.y -= this.velY;
          break;
        case 'ArrowDown':
          this.y += this.velY;
          break;
    }
  });
}
draw(){
  ctx.beginPath();
  ctx.lineWidth=4;
  ctx.strokeStyle = this.color;
  //x of center,y of center,radius,start radians,end radians
  ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
  ctx.stroke();

}
checkBounds(){
   if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
 
}
collisionDetect() {
  for (const particle of particles) {
    if (particle.exists) {
      const dx = this.x - particle.x;
      const dy = this.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      //Collision detected
      if (distance < this.size + particle.size) {
       
        particle.exists=false;
        numParticles--;
        para.textContent = "Particle count: " + numParticles;
        
      }
    }
  }
}
}
class Particle extends Shape{
    constructor(x,y,velX,velY,color,size){
       super(x,y,velX,velY);
        this.color=color;
        this.size=size;
        this.exists=true;

    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        //x of center,y of center,radius,start radians,end radians
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fill();

    }
    update() {
      //we include the size of the ball in the calculation
      // because the x/y coordinates are in the center of the ball, but we want the
      // edge of the ball to bounce off the perimeter
      
      //x-coordinate is greater than width of canvas
      //i.e the particle is going off the right edge
        if ((this.x + this.size) >= width) {
          this.velX = -(this.velX);
        }
      
        if ((this.x - this.size) <= 0) {
          this.velX = -(this.velX);
        }
      
        if ((this.y + this.size) >= height) {
          this.velY = -(this.velY);
        }
      
        if ((this.y - this.size) <= 0) {
          this.velY = -(this.velY);
        }
      
        this.x += this.velX;
        this.y += this.velY;
      }
      collisionDetect() {
        for (const particle of particles) {
          if (this !== particle && particle.exists) {
            const dx = this.x - particle.x;
            const dy = this.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            //Collision detected
            if (distance < this.size + particle.size) {
              particle.color = this.color = randomColor();
            }
          }
        }
      }
      
}   

const particles = [];

while (particles.length < 10) {
  const size = random(15, 20);
  const particle = new Particle(
   
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-5, 5),
    random(-5, 5),
    randomColor(),
    size
  );

  particles.push(particle);
    numParticles++;
  para.textContent = "Particle count: " + numParticles;
}
const blackHole = new BlackHole(400,350);
   
function loop() {
  //Sets the canvas fill color to semi-transparent black,
  // then draws a rectangle of the color 
  //across the whole width and height of the
  // canvas, using fillRect()
  //  This serves to cover up the 
  //previous frame's drawing before the next one is drawn
    ctx.fillStyle = "rgba(0, 140, 200,0.5)";
    ctx.fillRect(0, 0, width, height);
    

    for (const particle of particles) {
      if(particle.exists){
        particle.draw();
        particle.update();
        particle.collisionDetect();
      
      }
      blackHole.draw();
      blackHole.checkBounds();
      blackHole.collisionDetect();
      

    }
  // when this method is repeatedly run and passed the same function name
  //, it runs that function a set number of times per second to create a smooth animation. 
  //This is generally done recursively — which means that the function is calling itself 
  //every time it runs, so it runs over and over again
    requestAnimationFrame(loop);
  }
loop();
