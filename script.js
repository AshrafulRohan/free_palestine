// Game variables
let score = 0;
let timeLeft = 60;
let level = 1;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let isPaused = false;
let difficulty = 'medium';

// Criminal images (use your own images)
const criminals = [
    'https://www.publicdomainpictures.net/pictures/370000/t2/model-face-of-president-trump.jpg', // ক্রিমিনাল ১
    'https://thumbs.dreamstime.com/z/benjamin-netanyahu-prime-minister-israel-cartoon-portrait-illustrated-ayval%C4%B1k-erkan-atay-caricature-portrait-israeli-195086671.jpg'  // ক্রিমিনাল ২
];

// DOM elements
const targetArea = document.getElementById('target-area');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const levelDisplay = document.getElementById('level');
const highScoreDisplay = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const difficultySelect = document.getElementById('difficulty');
const shotSound = document.getElementById('shot-sound');
const hitSound = document.getElementById('hit-sound');

// Start game
function startGame() {
    score = 0;
    timeLeft = 60;
    level = 1;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    levelDisplay.textContent = level;
    targetArea.innerHTML = '';
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    difficultySelect.disabled = true;
    isPaused = false;
    
    // Create targets
    gameInterval = setInterval(createTarget, getSpawnRate());
    
    // Timer
    const timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame(timer);
            }
            
            // Level up every 15 seconds
            if (timeLeft % 15 === 0 && timeLeft < 60) {
                levelUp();
            }
        }
    }, 1000);
}

// End game
function endGame(timer) {
    clearInterval(timer);
    clearInterval(gameInterval);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    difficultySelect.disabled = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = highScore;
        alert(`New High Score! Your score: ${score}`);
    } else {
        alert(`Game Over! Your score: ${score}`);
    }
}

// Level up
function levelUp() {
    level++;
    levelDisplay.textContent = level;
    
    // Increase difficulty
    clearInterval(gameInterval);
    gameInterval = setInterval(createTarget, getSpawnRate());
    
    // Animation
    targetArea.style.borderColor = 'gold';
    setTimeout(() => {
        targetArea.style.borderColor = 'rgba(255,0,0,0.3)';
    }, 500);
}

// Create target
function createTarget() {
    if (isPaused) return;
    
    const target = document.createElement('img');
    target.className = 'target';
    
    // Random position
    const x = Math.random() * (targetArea.offsetWidth - 80);
    const y = Math.random() * (targetArea.offsetHeight - 80);
    
    // Random criminal image
    const randomCriminal = criminals[Math.floor(Math.random() * criminals.length)];
    target.src = randomCriminal;
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    
    // Click event
    target.addEventListener('click', function() {
        if (!this.classList.contains('shot')) {
            this.classList.add('shot');
            shotSound.currentTime = 0;
            shotSound.play();
            
            // Score points for hitting criminals
            score += 10;
            hitSound.play();
            
            scoreDisplay.textContent = score;
            
            // Remove target
            setTimeout(() => {
                if (this.parentNode) {
                    this.remove();
                }
            }, 300);
        }
    });
    target.addEventListener('click', function() {
    if (!this.classList.contains('shot')) {
        this.classList.add('shot');
        
        // Create blood effect
        const blood = document.createElement('div');
        blood.className = 'blood-effect';
        blood.style.left = `${this.offsetLeft}px`;
        blood.style.top = `${this.offsetTop}px`;
        targetArea.appendChild(blood);
        
        // Remove blood after animation
        setTimeout(() => {
            blood.remove();
        }, 800);

        if(shotSound) {
            shotSound.currentTime = 0;
            shotSound.play();
        }
        
        score += 10;
        if(hitSound) {
            hitSound.currentTime = 0;
            hitSound.play();
        }
        
        scoreDisplay.textContent = score;
        
        setTimeout(() => {
            if (this.parentNode) {
                this.remove();
            }
        }, 300);
    }
});
    // Auto-remove
    setTimeout(() => {
        if (target.parentNode && !target.classList.contains('shot')) {
            target.remove();
        }
    }, getTargetDuration());
    
    targetArea.appendChild(target);
}

// Get spawn rate based on difficulty
function getSpawnRate() {
    switch(difficulty) {
        case 'easy': return 1500;
        case 'hard': return 500;
        default: return 1000;
    }
}

// Get target duration based on difficulty
function getTargetDuration() {
    switch(difficulty) {
        case 'easy': return 2500;
        case 'hard': return 1000;
        default: return 2000;
    }
}

// Pause/resume game
function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    
    if (isPaused) {
        targetArea.style.opacity = '0.5';
    } else {
        targetArea.style.opacity = '1';
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
});

// Load high score
highScoreDisplay.textContent = highScore;