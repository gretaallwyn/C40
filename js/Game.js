class Game {
  constructor(){
    //load rank images here
    //this.rank1=loadImage("images/rank1.png");
  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.addImage("car2",car2_img);
    car3 = createSprite(500,200);
    car3.addImage("car3",car3_img);
    car4 = createSprite(700,200);
    car4.addImage("car4",car4_img);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175 ;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = 200 + (index * 200) + allPlayers[plr].xPos;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
       // console.log(index, player.index)
       textAlign(CENTER);
       textSize(20);
       text(allPlayers[plr].name, cars[index - 1].x, cars[index - 1].y + 75);
       
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if(player.distance > 3860){
      gameState = 2;
      player.rank +=1
      Player.updateCarsAtEnd(player.rank)
      
      //display the rank images when the players cross the finish line
      /*if(player.rank==1){
          image(this.rank1,displayWidth/2-200,-displayHeight*4-100,400,400)
        }
        if(player.rank==2){
          image(this.rank2,displayWidth/2-200,-displayHeight*4-100,400,400)
        }
        if(player.rank==3){
          image(this.rank3,displayWidth/2-200,-displayHeight*4-100,400,400)
        }
        if(player.rank==4){
          image(this.rank4,displayWidth/2-200,-displayHeight*4-100,400,400)
        } */
    }

   /*PLAYER RANK AND LEADERBOARD-WASTE / USELESS CODE
   
   if(player.status == 1) {
      if(x > player.x && x < player.x+brickWidth && y > player.y && y < player.y+brickHeight) {
        dy = -dy;
        player.status = 0;
        score++;
          if(score == Count) {
            alert("YOU RANK=!");
            document.location.reload();
          clearInterval(interval);
        }
      }
    }*/

/*    to generate random words in a string - this is for genrating secret word to log into the game

https://www.programiz.com/javascript/examples/generate-random-strings

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
let result = ' ';
const charactersLength = characters.length;
for ( let i = 0; i < length; i++ ) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}

return result;
}
*/


//to move car left and right line 137 to 157 
//define a property player.xPos inside constructor of player class
//define two variables xVel and yVel and initialise to zero in sketch.js
//change the vlaue to calculate xposition that is variable x in play()
// additionally you can display the names of the players below the car..optional
  if(keyIsDown(38) && player.index !== null){
      yVel += 0.9;
      if(keyIsDown(37)){
          xVel -= 0.2;
      }
      if(keyIsDown(39)){
          xVel += 0.2;
      }
  }else if(keyIsDown(38) && yVel > 0 && player.index !== null){
      yVel -= 0.1;
      xVel *= 0.9;
  }else{
      yVel *= 0.985;
      xVel *= 0.985;
  }

//move the car
player.distance += yVel;
yVel *= 0.98;
player.xPos += xVel;
xVel *= 0.985;


    if(gameState===2 && player.rank===4){
      game.update(2);
    }   

    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
