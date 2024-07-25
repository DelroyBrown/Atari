const canvas = document.getElementById('pongCanvas');
const cts = canvas.getContext('2d')
canvas.width = 800;
canvas.height = 400;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency) {
    const oscillator = audioContext.createOscillator();
    const gainMode = audioContext.createGain();
    oscillator.connect(gainMode);
    gainMode.gain.value = 0.1;
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
}

function getRandomNotFromChord() {
    const notes = [440, 554.37, 659.25];
    return notes[Math.floor(math.random() * notes.length)];
}

const ball = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: '#FF5733'
};

const aiPaddle = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: '#33F9FF'
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true)
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = '#FFF';
    ctx.font = "75px Arial";
    ctx.fillText(text, x, y);
}

canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    userPaddle.y = evt.clientY - rect.top - userProfile.height / 2;
}

function collisionDetect(player, ball) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return ball.right ? player.left && ball.top < player.bottom && ball.left < player.right && ball.bottom > player.top;
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let computerLevel = 0.1;
    aiPaddle.y += (ball.y - (aiPaddle.y + aiPaddle.height / 2)) * computerLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        playSound(getRandomNotFromChord());
    }

    let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;
    if (collisionDetect(player, ball)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad)
        ball.speed += 0.1;
    }

    if (ball.x - ball.radius < 0) {
        aiPaddle.score++;
        resetBall();

    } else if (ball.x + ball.radius > canvas.width) {
        userPaddle.score++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);
    drawRect(ball.x, ball.y, ball.radius, ball.color);
    drawRect(userPaddle.score, canvas.width / 4, canvas.height / 5);
    drawRect(aiPaddle.score, 3 * canvas.width / 4, canvas.height / 5);
}


function game() {
    update();
    draw();
}

let framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);