const desktop = document.querySelector('.desktop');
const mobile = document.querySelector('.mobile');
const controls = document.querySelector('.mobileControls');

mobile.addEventListener('click', () => {
    controls.classList.add('visible');
})
desktop.addEventListener('click', () => {
    controls.classList.remove('visible');
})

const canvas = document.querySelector('canvas');
canvas.width = 300
canvas.height = 300

const ctx = canvas.getContext('2d');

// testing
// ctx.fillRect(0, 0, canvas.width, canvas.height);

const sound1 = document.createElement('audio');
const sound2 = document.createElement('audio');
sound1.src = 'https://cdn.staticcrate.com/stock-hd/audio/soundscrate-8-bit-failed-hit-1.mp3'
sound2.src = 'https://cdn.staticcrate.com/stock-hd/audio/soundscrate-videogamebundle-kick.mp3'
const score = {
    left: 0,
    right: 0
}

const getPaddle = ({ x = 0, color = 'orange' }) => ({
    x,
    y: 130,
    w: 10,
    h: 30,
    color,
    speed: 35,
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h)
    },
    moveUp() {
        if (this.y > 0) return this.y -= this.speed
    },
    moveDown() {
        if (this.y < canvas.height - this.h) return this.y += this.speed
    },
    contains(b) {
        return (this.x < b.x + b.w) &&
            (this.x + this.w > b.x) &&
            (this.y < b.y + b.h) &&
            (this.y + this.h > b.y)
    }
})

const getBall = () => ({
    x: 145,
    y: 145,
    w: 10,
    h: 10,
    color: 'blue',
    directionX: 'right',
    directionY: 'up',
    friction: .7,
    speedX: 1,
    speedY: 1,
    isMoving: false,
    handleMovement() {
        if (!this.isMoving) { return }
        if (this.x > canvas.width - this.w) {
            this.directionX = 'left'
        } else if (this.x < 0) {
            this.directionX = 'right'
        }
        if (this.directionX === 'right') {
            this.speedX++
        } else {
            this.speedX--
        }
        this.speedX *= this.friction
        this.x += this.speedX

        if (this.y < 0) {
            this.directionY = 'down'
        } else if (this.y > canvas.height - this.h) {
            this.directionY = 'up'
        }
        if (this.directionY === 'down') {
            this.speedY++
        } else {
            this.speedY--
        }
        this.speedY *= this.friction
        this.y += this.speedY

    },
    draw() {
        this.handleMovement();
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
})

const paddleLeft = getPaddle({})
const paddleRight = getPaddle({
    x: canvas.width - 10,
    color: 'red'
})
const ball = getBall();

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCourt()
    drawScore()
    checkCollitions()
    ball.draw()
    paddleLeft.draw()
    paddleRight.draw()
    requestAnimationFrame(update);
}

const drawCourt = () => {
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.height, canvas.width);
}

const checkCollitions = () => {
    if (paddleLeft.contains(ball)) {
        ball.directionX = 'right'
        sound1.play()
    } else if (paddleRight.contains(ball)) {
        ball.directionX = 'left';
        sound1.play()
    }
    if (ball.x < 0) {
        ball.x = 145
        ball.y = 145
        ball.isMoving = false
        score.right++
        sound2.play()
    } else if (ball.x > canvas.width - ball.w) {
        ball.x = 145
        ball.y = 145
        ball.isMoving = false
        score.left++
        sound2.play()
    }
}

const drawScore = () => {
    ctx.fillStyle = 'gray'
    ctx.font = '2rem "Press Start 2P"'
    ctx.fillText(score.left, canvas.width / 5, 70)
    ctx.fillText(score.right, canvas.width / 1.5, 70)
}

// listeners
addEventListener('keydown', e => {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 32:
            ball.isMoving = true
            break;
        case 87:
            paddleLeft.moveUp();
            break;
        case 83:
            paddleLeft.moveDown();
            break;
        case 38: // up
            paddleRight.moveUp();
            break;
        case 40: // down
            paddleRight.moveDown();
            break;
    }
})
document.querySelector('.iniciar').addEventListener('click', () => ball.isMoving = true)
document.querySelector('.upOne').addEventListener('click', () => paddleLeft.moveUp())
document.querySelector('.downOne').addEventListener('click', () => paddleLeft.moveDown());
document.querySelector('.upTwo').addEventListener('click', () => paddleRight.moveUp());
document.querySelector('.downTwo').addEventListener('click',() =>  paddleRight.moveDown());

requestAnimationFrame(update);