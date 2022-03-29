const rulesBtn = document.querySelector('#rules-btn');
const closeBtn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');
const canvas = document.querySelector('#canvas');
const cntxt = canvas.getContext('2d');

let score = 0;

//Number of rows and columns
const blockRowCount = 6;
const blockColumnCount = 9;

//Creating ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2, 
    size: 8, //radius of ball
    speed: 4,
    dx: 4, //how do ball moves along the x axis once it deflects
    dy: -4, //how do ball moves up along the y axis once it deflects
};

//Creating single block property
const blockProp = {
    w: 70,
    h: 24,
    padding: 10,
    offsetX: 45,   //position of brick on x-axis, loop through and change for each brick
    offsetY: 60,
    visible: true //turns to false when ball hits brick
}

//Create the blocks in total
const blocks = [];
for(let i = 0; i < blockColumnCount; i++){
    blocks[i] = [];
    for(let j = 0; j < blockRowCount; j++){
        const x = i * (blockProp.w + blockProp.padding) + blockProp.offsetX;
        const y = j * (blockProp.h + blockProp.padding) + blockProp.offsetY;
        blocks[i][j] = { x, y, ...blockProp };
    }    
}

//Creating paddle properties
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 32,
    w: 80,
    h: 8,
    speed: 8,
    dx: 0
}

//Draw ball onto canvas
function drawBall(){
    cntxt.beginPath();
    cntxt.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    cntxt.fillStyle = '#d300d3';
    cntxt.fill();
    cntxt.closePath();
}

//Draw paddle on canvas
function drawPaddle(){
    cntxt.beginPath();
    cntxt.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    cntxt.fillStyle = '#d300d3';
    cntxt.fill();
    cntxt.closePath();
}

//Function to draw blocks on the canvas
function drawBlocks(){
    blocks.forEach(column => {
        column.forEach(block => {
            cntxt.beginPath();
            cntxt.rect(block.x, block.y, block.w, block.h);
            cntxt.fillStyle = block.visible ? '#d300d3' : 'transparent';
            cntxt.fill();
            cntxt.closePath();
        })
    });
}

//Drawing score on the canvas
function drawScore(){
    cntxt.font = '18px Trebuchet MS';
    cntxt.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Function to move paddle on the canvas
function movePaddle(){
    paddle.x += paddle.dx;

    //Surrounding wall detection
    //To the right side
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

    //Surrounding wall detection
    //To the left side
    if(paddle.x < 0){
        paddle.x = 0;
    }
}

//Function to move ball on the canvas
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    //Surrounding wall collision detection(x-axis)
    //right and left walls
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1; //same as ball.dx = ball.dx * -1
    }

    //Surrounding wall collision detection(y-axis)
    //top and bottom walls
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1; //same as ball.dx = ball.dx * -1
    }

    //Paddle collision functionality
    if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y){
        ball.dy = - ball.speed;
    }

    //Block collision functionality
    blocks.forEach(column => {
        column.forEach(block => {
            if(block.visible){
                if ( //checking to see if it hits any size of the brick
                    ball.x - ball.size > block.x && // left block side check
                    ball.x + ball.size < block.x + block.w && // right block side check
                    ball.y + ball.size > block.y && // top block side check
                    ball.y - ball.size < block.y + block.h // bottom block side check
                  ) {
                    ball.dy *= -1; //same as ball.dy = ball.dy * -1
                    block.visible = false;

                    increaseScore();
                  }
            }
        });
    });

    //Lose on missing paddle
    if(ball.y + ball.size > canvas.height){
        showAllBlocks();
        score = 0;
    }
}

//Funcion to increase score as block is hit
function increaseScore(){
    score++;

    if(score % (blockRowCount * blockRowCount === 0)){
        showAllBlocks();
    }
}

//Make all blocks appear
function showAllBlocks(){
    blocks.forEach(column => {
        column.forEach(block => {
            block.visible = true;
        })
    })
}

// Function called to draw all the canvas elements
function draw(){
    //clear canvas first
    cntxt.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawScore();
    drawPaddle();
    drawBlocks();
}

//Update canvas animation and drawing
function update(){
    movePaddle();
    moveBall();

    //Drawing eveything in the update function
    draw();

    requestAnimationFrame(update);
}

update();

//Keydown event function
//Targetting the right and left arrow keys
function keyDown(e){
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = -paddle.speed;
    }
}

//Keyup event function
function keyUp(e){
    // console.log(e.key);
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
        paddle.dx = 0;
    } 
}

//Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//Event listener for rules and its close button
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
});


