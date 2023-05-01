
let canvas;
let ctx;
let gameOver    = false
let score       = 0
let level       = 0;

canvas = document.createElement("canvas")

ctx =   canvas.getContext("2d")
canvas.width    =   600;
canvas.height   =   600;

document.body.appendChild(canvas); 

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;

let spaceshipX  =   canvas.width/2 - 32
let spaceshipY  =   canvas.height - 48

function loadImage(){

    backgroundImage = new Image();
    backgroundImage.src = "images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";
    
    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";
    
    gameOverImage = new Image();
    gameOverImage.src = "images/Gameover.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";
    
}

let keysDown=[]
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        keysDown[event.keyCode] = true
        //console.log("키다운객체값은? ", keysDown)
    })

    document.addEventListener("keyup",function(event){
        delete keysDown[event.keyCode]
       // console.log("delete 객체? ", keysDown)
       if(event.keyCode == 32){
            createBullet() //총알 생성

       }
    })
}

let enemyList = []  //적기 리스트
function Enemy(){
    this.x = 0
    this.y = spaceshipY;
    this.init= function(){
        this.x = generateRandomValue(0, canvas.width -40);
        this.y = 0

        enemyList.push(this)
    }

    this.update = function(){
        level   =   Math.floor(score /10);
        if(level < 1){
            this.y += 1;
        }else{
            this.y = this.y + level;
        }

        if(this.y >= canvas.height - 34){
            gameOver = true
        }
    }
}



function generateRandomValue(max, min){
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min
    return randomNum;
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    }, 1000)
}

let bulletList = [] //총알저장 리스트
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init= function(){
        this.x = spaceshipX
        this.y = spaceshipY
        this.alive = true       //총알 존재 유무
        bulletList.push(this)
    }
    this.update = function(){
        this.y -= 4;
    }

    this.bumHit = function(){
        for(let i=0; i<enemyList.length; i++){
            if(  this.y <= enemyList[i].y &&
                 this.x >= enemyList[i].x - 34 &&
                 this.x <= enemyList[i].x + 34
            ){
                this.alive = false;
                enemyList.splice(i,1);
                score++;
            }
        }
    }
}

function createBullet(){
    let b = new Bullet()
    b.init();
}

function update(){
    if( 39 in keysDown){   //right
        spaceshipX += 5;
    }
    if( 37 in keysDown){   //left
        spaceshipX -= 5;
    }
    if(spaceshipX <= 0){
        spaceshipX = 0
    }
    if(spaceshipX >= canvas.width - 48){
        spaceshipX = canvas.width - 48
    }

    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].bumHit();
            bulletList[i].update();
        }
    }

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}


function render(){
    
    
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
    ctx.fillText(`SCORE : ${score}`,20,30);
    ctx.fillText(`Level : ${level}`, 20, 60);
    ctx.fillStyle="white";
    ctx.font="20px Arial";

     for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x, enemyList[i].y)
    }

    for(let i=0; i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x + 12,bulletList[i].y)
        }
    }
}

function main(){
    if(!gameOver){
        update()
        render()
        //console.log("anyandy");
        requestAnimationFrame(main);
    }else{ 
       ctx.drawImage(gameOverImage,25,100 );
    }    
}


loadImage();
setupKeyboardListener();
createEnemy();
main()

function startGame() {
    console.log("재시작 Sssss");
    gameOver = false;
    score = 0;
    level = 0;
    enemyList = [];
    bulletList = [];
    keysDown=[]
    loadImage();
    setupKeyboardListener();
    createEnemy();
    main();
}



// restart 버튼 이벤트 핸들러
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", function() {
  startGame();
  console.log("재시작 S");
});







//총알만들기
//1.스페이스바 누르면 발사
//2.총알발사 = 총알 y값이 --, 총알 x값은 스페이스바 누른순간의 우주선 x좌표값
//3.발사된 총알은 총알배열에 저장
//4. 총알들은 x,y좌표값이 있어야 된다
//5. 총알 배열을 가지고 render()한다.