// Grab the canvas element and its 2D context. Time to get artsy!
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Setting canvas dimensions. Bigger is better, right?
canvas.width = 1000;
canvas.height = 600;

// Load that retro background image
const backgroundImage = new Image();
backgroundImage.src = 'atari-logo.jpg';
console.log("Image src set:", backgroundImage.src);

// When the image loads, let the games begin!
backgroundImage.onload = function () {
    console.log("Image loaded");
    startGame();
};

// If the image doesn't load, cry about it in the console
backgroundImage.onerror = function () {
    console.error("Image failed to load");
};

// Create an audio context for those sweet game sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Play a sound at the specified frequency. Beep beep!
function playSound(frequency) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.1;
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200); // Stop after 200ms
}

// Pick a random note from our virtual chord. Let's get musical!
function getRandomNoteFromAChord() {
    const notes = [440, 554.37, 659.25]; // Frequencies in Hz (A4, C#5, E5)
    return notes[Math.floor(Math.random() * notes.length)];
}

// Ball object with its attributes. Let's get rolling!
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "#0091FF" // Stylish blue
};

// Player's paddle. Stay cool!
const userPaddle = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "#F1F1E6" // Fancy light grey
};

// AI paddle. Let's hope it's not too smart.
const aiPaddle = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "#F6F9FF" // Subtle white
};

// Draw a rectangle (paddle). It's hip to be square!
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw a circle (ball). Because round is rad!
function drawArc(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// Draw text (scores). Go big or go home!
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px Arial";
    ctx.fillText(text, x, y);
}

// Move the player's paddle with the mouse. Get in the zone!
canvas.addEventListener('mousemove', movePaddle);

// Function to move the paddle. Keep up!
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    userPaddle.y = evt.clientY - rect.top - userPaddle.height / 2;
}

// Check for paddle-ball collisions. Bump and bounce!
function collisionDetect(player, ball) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return ball.right > player.left && ball.top < player.bottom && ball.left < player.right && ball.bottom > player.top;
}

// Update the game state. Keep the action going!
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    let computerLevel = 0.1;
    aiPaddle.y += (ball.y - (aiPaddle.y + aiPaddle.height / 2)) * computerLevel;

    // Bounce the ball off the top and bottom. Boing!
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        playSound(getRandomNoteFromAChord());
    }

    // Determine which paddle is hit. Pong!
    let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;
    if (collisionDetect(player, ball)) {
        playSound(getRandomNoteFromAChord());
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1; // Speed up the ball
    }

    // Reset ball and update scores if it goes out of bounds
    if (ball.x - ball.radius < 0) {
        aiPaddle.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        userPaddle.score++;
        resetBall();
    }
}

// Reset the ball to the center. Ready, set, go!
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
}

// Draw everything on the canvas. Paint the town!
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
    drawText(userPaddle.score, canvas.width / 4, canvas.height / 5);
    drawText(aiPaddle.score, 3 * canvas.width / 4, canvas.height / 5);
}

// Run the game loop. Let's roll!
function game() {
    update();
    draw();
}

// Start the game loop. Here we go!
function startGame() {
    let framePerSecond = 50;
    setInterval(game, 1000 / framePerSecond);
}
