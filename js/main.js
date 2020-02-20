let btn = document.querySelectorAll('.btn');
let startScreen = document.querySelector('.start-screen');
let lastScreen = document.querySelector('.last-screen');
let gameResult = document.querySelector('.game-result');
let restartBtn = document.querySelector('.restart');
let speed = 0;

restartBtn.addEventListener('click', restart);

for(let elem of btn) {
    elem.addEventListener('click', function(e) {
        if(e.target.classList.contains('easy')) {
            speed = 550;
            startGame(speed);
            hideScreen(startScreen);
        }
        else if(e.target.classList.contains('normal')) {
            speed = 500;
            startGame(speed);
            hideScreen(startScreen);
        }
        else if(e.target.classList.contains('hard')) {
            speed = 400;
            startGame(speed);
            hideScreen(startScreen);
        }
    
    })
}

function hideScreen(elem) {
    elem.style.display = 'none';
}
function showScreen(elem) {
    elem.style.display = 'block';
}

function restart() {
    hideScreen(lastScreen);
    showScreen(startScreen);
    location.reload();
}


function startGame(speed) {
    // creating field and fillig it with cells
    let field = document.createElement('div');
    document.body.insertBefore(field, lastScreen);
    field.classList.add('field');

    for(let i = 1; i < 101; i++) {
        let cells = document.createElement('div');
        field.appendChild(cells);
        cells.classList.add('cell');
    }

    // adding coordinates to each cell
    let cells = document.querySelectorAll('.cell');

    let x = 1;
    let y = 10;

    for(let i = 0; i < cells.length; i++) {
        if(x > 10) {
            x = 1;
            y--;
        }
        cells[i].setAttribute('posX', x);
        cells[i].setAttribute('posY', y);
        x++;
    }

    // generating position of the snake, creating snake's body
    function generateSnake() {
        let posX = Math.round(Math.random() * (10 - 3) + 3);
        let posY = Math.round(Math.random() * (10 - 1) + 1);
        return [posX, posY];
    }

    let coordinates = generateSnake();
    let snakeBody = [document.querySelector('[posX = "' + coordinates[0] + '"][posY = "' + coordinates[1] + '"]'), document.querySelector('[posX = "' + (coordinates[0] - 1) + '"][posY = "' + coordinates[1] + '"]'), document.querySelector('[posX = "' + (coordinates[0] - 2) + '"][posY = "' + coordinates[1] + '"]')];

    for(let i = 0; i < snakeBody.length; i++) {
        if(i == 0) {
            snakeBody[i].classList.add('head');
        }
        else {
            snakeBody[i].classList.add('body');
        }
    }

    // generating position of the mouse
    let mouse;

    function createMouse() {
        function generateMouse() {
            let posX = Math.round(Math.random() * (10 - 3) + 3);
            let posY = Math.round(Math.random() * (10 - 1) + 1);
            return [posX, posY];
        }

        let mouseCoordinates = generateSnake();
        mouse = document.querySelector('[posX = "' + mouseCoordinates[0] + '"][posY = "' + mouseCoordinates[1] + '"]');

        while(mouse.classList.contains('head') || mouse.classList.contains('body')) {
            let mouseCoordinates = generateSnake();
            mouse = document.querySelector('[posX = "' + mouseCoordinates[0] + '"][posY = "' + mouseCoordinates[1] + '"]');
        }

        mouse.classList.add('mouse', 'animated');


        console.log(generateMouse());
    }

    createMouse();

    // adding the ability to move and control the snake


    let score = 0;
    let p = document.createElement('p');
    p.classList.add('totalScore');
    document.body.insertBefore(p, lastScreen);
    p.innerHTML = `Points: ${score}`;
    let direction = 'right';
    let steps = true;

    function move() {
        //move and control
        let snakeCoordinates = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];
        snakeBody[0].classList.remove('head');
        snakeBody[snakeBody.length-1].classList.remove('body');
        snakeBody.pop();

        if(direction == 'right') {
            if(snakeCoordinates[0] < 10) {
                snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0] + 1) + '"][posY = "' + snakeCoordinates[1] + '"]'));
            } else {
                snakeBody.unshift(document.querySelector('[posX = "1"][posY = "' + snakeCoordinates[1] + '"]'));
            }    
        }
        else if(direction =='left') {
            if(snakeCoordinates[0] > 1) {
                snakeBody.unshift(document.querySelector('[posX = "' + (+snakeCoordinates[0] - 1) + '"][posY = "' + snakeCoordinates[1] + '"]'));
            } else {
                snakeBody.unshift(document.querySelector('[posX = "10"][posY = "' + snakeCoordinates[1] + '"]'));
            }
        }
        else if (direction == 'up') {
            if(snakeCoordinates[1] < 10) {
                snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + (+snakeCoordinates[1] + 1) + '"]'));
            } else {
                snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "1"]'));
            }    
        }
        else if (direction == 'down') {
            if(snakeCoordinates[1] > 1) {
                snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "' + (+snakeCoordinates[1] - 1) + '"]'));
            } else {
                snakeBody.unshift(document.querySelector('[posX = "' + snakeCoordinates[0] + '"][posY = "10"]'));
            }
        }


        //eating mouse
        if(snakeBody[0].getAttribute('posX') == mouse.getAttribute('posX') && snakeBody[0].getAttribute('posY') == mouse.getAttribute('posY')) {
            mouse.classList.remove('mouse');
            let a = snakeBody[snakeBody.length - 1].getAttribute('posX');
            let b = snakeBody[snakeBody.length - 1].getAttribute('posY');
            snakeBody.push(document.querySelector('[posX = "' + a + '"][posY = "' + b + '"]'));
            createMouse();

            score++;
            p.innerHTML = `Points: ${score}`;        
        }

        // game over
        if(snakeBody[0].classList.contains('body')) {
            setTimeout(() => {
                showScreen(lastScreen);
                gameResult.textContent = p.innerHTML;
                // alert('Game Over');
            }, 200);

            clearInterval(snakemove);
        }
        

        for(let i = 0; i < snakeBody.length; i++) {
            if(i == 0) {
                snakeBody[i].classList.add('head');
            }
            else {
                snakeBody[i].classList.add('body');
            }
        }

        steps = true;
    }

    let snakemove = setInterval(move, speed);

    window.addEventListener('keyup', function(e) {
        if(steps == true) {
            if(e.keyCode == 37 && direction != 'right') {
                direction = 'left';
                steps = false;            
            }
            else if(e.keyCode == 39 && direction != 'left') {
                direction = 'right';
                steps = false;
            }
            else if(e.keyCode == 38 && direction != 'down') {
                direction = 'up';
                steps = false;
            }
            else if(e.keyCode == 40 && direction != 'up') {
                direction = 'down';
                steps = false;
            }    
        }
    });
}