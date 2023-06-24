var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var bullets = 70;
var bulletGroup;

var gameState = "fight";

var score = 0;

var life = 3;

var loseSound, explosionSound, winSound;

function preload()
{
  heart1Img = loadImage ("assets/heart_1.png");
  heart2Img = loadImage ("assets/heart_2.png");
  heart3Img = loadImage ("assets/heart_3.png");

  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

  zombieImg = loadImage("assets/zombie.png");

  bgImg = loadImage("assets/bg.jpeg");

  loseSound = loadSound("assets/lose.mp3");
  explosionSound = loadSound("assets/explosion.mp3");
  winSound = loadSound("assets/win.mp3");

}

function setup() 
{  
  createCanvas(windowWidth,windowHeight);

  //adicionando a imagem de fundo
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20);
  bg.addImage(bgImg);
  bg.scale = 1.1;

  //criando o sprite do jogador
  player = createSprite (displayWidth-1225,displayHeight-475,50,50);
  player.addImage(shooterImg);
  player.scale = 0.3;
  player.debug = true;
  player.setCollider("rectangle",0,0,250,490);

  heart1 = createSprite(displayWidth-220, 40, 20, 20);
  heart1.visible = false;
  heart1.addImage("heart1", heart1Img);
  heart1.scale = 0.4;

  heart2 = createSprite(displayWidth-170, 40, 20, 20);
  heart2.visible = false;
  heart2.addImage("heart2", heart2Img);
  heart2.scale = 0.4;

  heart3 = createSprite(displayWidth-220, 40, 20, 20);
  heart3.addImage("heart3", heart3Img);
  heart3.scale = 0.4;

  zombieGroup = new Group();
  bulletGroup = new Group();

}

function enemy(){
  if(frameCount%20===0){



    zombie = createSprite(random(500,1100),random(100,500),40, 40);

    zombie.addImage(zombieImg);
    zombie.scale = 0.15;
    zombie.velocityX = -3;
    zombie.debug = true;
    zombie.setCollider("rectangle",0,0,400,400);

    zombie.lifetime = 400;
    zombieGroup.add(zombie);

  }
}
function draw() 
{
  background(0); 
  if(gameState == "fight"){
    if(life === 3){
      heart3.visible = true;
      heart1.visible =  false;
      heart2.visible =  false;
    }
    if(life === 2){
      heart2.visible = true;
      heart1.visible =  false;
      heart3.visible =  false;
    }
    if (life === 1){
      heart1.visible = true;
      heart3.visible =  false;
      heart2.visible =  false;
    }
    if(life === 0){
      gameState = "lost";
    }
    if(score == 100){
      gameState = "won";
      winSound.play();
    }
    if(keyDown("UP_ARROW")&& player.y > height-625||touches.length>0)
    {
     player.y -= 20;
    }
  
    if(keyDown("DOWN_ARROW") && player.y < height-100||touches.length>0)
    {
     player.y += 20;
    }

    if(keyWentDown("space"))
    {
      
      bullet = createSprite(displayWidth-1150,player.y-30,20,10);
      bullet.velocityX = 20;
      bulletGroup.add(bullet);
      player.depth = bullet.depth;
      player.depth = player.depth + 2;
      player.addImage(shooter_shooting);
      player.setCollider("rectangle",0,0,420,490);
      bullets = bullets - 1;
      explosionSound.play();
      explosionSound.setVolume(0.3);
    }

    else if(keyWentUp("space"))
    {
      player.addImage(shooterImg);
      player.setCollider("rectangle",0,0,250,490);
    }

    if(bullets == 0){
      gameState = "bullet";
      loseSound.play();
      loseSound.setVolume(100);
    }

    if(zombieGroup.isTouching(bulletGroup)){
      for(var b=0; b<zombieGroup.length;b++){
        
        if(zombieGroup[b].isTouching(bulletGroup)){
          zombieGroup[b].destroy();
         bulletGroup.destroyEach();
         explosionSound.play();
         score = score + 2;
        }
      }
    }
    
  
    if(zombieGroup.isTouching(player)){
      for(var i=0; i<zombieGroup.length; i++){
        
        if(zombieGroup[i].isTouching(player)){
          zombieGroup[i].destroy();
          loseSound.play();
          life = life-1;
        }
      }
    }
  
    enemy();
    }
  drawSprites();
  textSize(20);
  fill("white");
  text("Balas: " + bullets, displayWidth-210, displayHeight/2-250);
  text("Pontos: " + score, displayWidth-210,displayHeight/2-220);
  text("Vidas: " + life, displayWidth-210,displayHeight/2-280);
  if(gameState == "lost"){
    textSize(100);
    fill("red");
    text("Você perdeu... :(",400,400);
    zombieGroup.destroyEach();
    player.destroy();
  }

else if(gameState == "won"){
  textSize(100);
    fill("green");
    text("Você venceuu!! :)",400,400);
    zombieGroup.destroyEach();
    player.destroy();
}

else if(gameState == "bullet"){
    textSize(100);
      fill("orange");
      text("Você ficou sem balas... :(",400,400);
      zombieGroup.destroyEach();
      player.destroy();
      bulletGroup.destroyEach();
  }
}

