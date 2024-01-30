const player = document.getElementById('player');
const wrapper = document.querySelector('.game-wrapper');
const score = document.getElementById('score');
const restartBtn = document.querySelector('.restart')
const instructionsContainer = document.querySelector('.instructions')
const instructionsButton = document.querySelector('.instructions-button')

let gameActive = false;
let currentScore = 0;

let playerPosition = 250;
const stepSize = 30;

function handleKeyPress(event) {
	if (event.key === 'ArrowLeft' && playerPosition > 0) {
		playerPosition -= stepSize;
	} else if (event.key === 'ArrowRight' && playerPosition < 460) {
		playerPosition += stepSize;
	} else if (event.key === ' ' || event.key === 'ArrowUp') {
		if(gameActive){
            createBullet()
        }
	}
	player.style.left = playerPosition + 'px';
}

function createBullet() {
	const newBullet = document.createElement('div');
	newBullet.classList.add('bullet');
	newBullet.style.left = playerPosition + 10 + 'px';
	wrapper.appendChild(newBullet);
	moveBullet(newBullet);
}

function moveBullet(bullet) {
	const bulletSpeed = 8;
	let collisionOccurred = false;

	const bulletInterval = setInterval(() => {
		const bulletPosition = parseInt(bullet.style.bottom) || 0;
		bullet.style.bottom = bulletPosition + bulletSpeed + 'px';
		const aliens = document.querySelectorAll('.alien');
		aliens.forEach((alien) => {
			if (!collisionOccurred && checkCollision(bullet, alien)) {
				clearInterval(bulletInterval);
				bullet.remove();
				alien.remove();
				currentScore++;
				score.innerHTML = currentScore;
				collisionOccurred = true;
			}
		});
		if (bulletPosition > wrapper.clientHeight || collisionOccurred) {
			clearInterval(bulletInterval);
			if (bullet.parentNode === wrapper) {
				wrapper.removeChild(bullet);
			}
		}
	}, 20);
}

function checkCollision(element1, element2) {
	const rect1 = element1.getBoundingClientRect();
	const rect2 = element2.getBoundingClientRect();

	return !(
		rect1.right < rect2.left ||
		rect1.left > rect2.right ||
		rect1.bottom < rect2.top ||
		rect1.top > rect2.bottom
	);
}

function createAlien() {
	const createAlienInterval = setInterval(() => {
		if (!gameActive) {
			clearInterval(createAlienInterval);
			return;
		}

		const randomPosition = Math.floor(Math.random() * 461);
		const newAlien = document.createElement('div');
		newAlien.classList.add('alien');
		newAlien.style.left = randomPosition + 'px';
		wrapper.appendChild(newAlien);
		moveAlien(newAlien);
	}, 1000);
}

function moveAlien(alien) {
	const alienSpeed = 4;
	const moveAlienInterval = setInterval(() => {
		const alienPosition = parseInt(alien.style.top) || 0;
		alien.style.top = alienPosition + alienSpeed + 'px';
		if (alienPosition > wrapper.clientHeight) {
			if (alien.parentNode === wrapper) {
				clearInterval(moveAlienInterval);
				endGame();
			}
		}
	}, 20);
}

function endGame() {
	gameActive = false;
	player.style.display = 'none';
	const aliens = document.querySelectorAll('.alien');
	aliens.forEach((alien) => alien.remove());
    restartBtn.style.display = 'block'
    restartBtn.innerText = 'Game over, press to restart!'
	currentScore = 0
}

function handleStart() {
    gameActive = true
	player.style.display = 'block';
    restartBtn.style.display = 'none'
	score.innerText = 0
    createAlien()
}

document.addEventListener('keydown', handleKeyPress);
window.addEventListener('DOMContentLoaded', createAlien);
restartBtn.addEventListener('click', handleStart)
instructionsButton.addEventListener('click', () => instructionsContainer.style.display = 'none')