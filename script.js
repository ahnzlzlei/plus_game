// 게임 상태 관리
const gameState = {
    currentScore: 0,
    timeLeft: 5,
    timerInterval: null,
    isGameActive: false
};

// DOM 요소
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    coupon: document.getElementById('coupon-screen')
};

const elements = {
    problem: document.getElementById('problem'),
    answerInput: document.getElementById('answer-input'),
    submitButton: document.getElementById('submit-button'),
    timerBar: document.getElementById('timer-bar'),
    score: document.getElementById('score'),
    resultMessage: document.getElementById('result-message'),
    startButton: document.getElementById('start-button'),
    retryButton: document.getElementById('retry-button'),
    homeButton: document.getElementById('home-button'),
    saveCouponButton: document.getElementById('save-coupon'),
    couponHomeButton: document.getElementById('coupon-home'),
    failImage: document.getElementById('fail-image')
};

const sounds = {
    success: new Audio('assets/Ascending 3.mp3'),
    fail: new Audio('assets/fail_05.mp3'),
    finalSuccess: new Audio('assets/suc_02.mp3')
};

// 소리 재생 함수
function playSound(soundType) {
    try {
        sounds[soundType].currentTime = 0; // 재생 위치를 처음으로 리셋
        sounds[soundType].play().catch(error => {
            console.error('소리 재생 실패:', error);
        });
    } catch (error) {
        console.error('소리 재생 중 오류:', error);
    }
}

// 게임 초기화
function initGame() {
    gameState.currentScore = 0;
    gameState.timeLeft = 5;
    updateScore();
    showScreen('game');
    generateProblem();
    startTimer();
    elements.answerInput.value = '';
    elements.answerInput.focus();
}

// 문제 생성
function generateProblem() {
    const num1 = Math.floor(Math.random() * 41) + 10; // 10-50
    const num2 = Math.floor(Math.random() * 41) + 10; // 10-50
    gameState.currentAnswer = num1 + num2;
    elements.problem.textContent = `${num1} + ${num2} = ?`;
}

// 타이머 시작
function startTimer() {
    gameState.timeLeft = 5;
    elements.timerBar.style.width = '100%';
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    const startTime = Date.now();
    const duration = 5000; // 5초

    gameState.timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const percentage = (remaining / duration) * 100;
        
        elements.timerBar.style.width = `${percentage}%`;
        
        if (remaining === 0) {
            clearInterval(gameState.timerInterval);
            handleGameOver('시간 초과!');
        }
    }, 50);
}

// 정답 체크
function checkAnswer() {
    const userAnswer = parseInt(elements.answerInput.value);
    if (userAnswer === gameState.currentAnswer) {
        handleCorrectAnswer();
    } else {
        handleGameOver('틀렸습니다!');
    }
}

// 정답 처리
function handleCorrectAnswer() {
    clearInterval(gameState.timerInterval);
    gameState.currentScore++;
    updateScore();
    playSound('success');

    if (gameState.currentScore === 3) {
        showCouponScreen();
    } else {
        elements.resultMessage.textContent = '🎯 정답입니다!';
        setTimeout(() => {
            generateProblem();
            startTimer();
            elements.answerInput.value = '';
            elements.answerInput.focus();
        }, 1000);
    }
}

// 게임 오버 처리
function handleGameOver(message) {
    clearInterval(gameState.timerInterval);
    elements.resultMessage.textContent = message;
    playSound('fail');
    showScreen('result');
    
    // 실패 이미지 애니메이션
    elements.failImage.style.display = 'block';
    elements.failImage.classList.add('slide-animation');
    
    setTimeout(() => {
        elements.failImage.style.display = 'none';
        elements.failImage.classList.remove('slide-animation');
    }, 4000);
}

// 점수 업데이트
function updateScore() {
    elements.score.textContent = `연속 정답: ${gameState.currentScore}/3`;
}

// 화면 전환
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenId].classList.add('active');
}

// 쿠폰 화면 표시
function showCouponScreen() {
    playSound('finalSuccess');
    showScreen('coupon');
    generateCoupon();
}

// 쿠폰 생성
function generateCoupon() {
    const canvas = document.getElementById('coupon-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 200;
    
    // 배경
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 테두리
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 텍스트
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px "Noto Sans KR"';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 3000원 할인쿠폰 🎉', canvas.width/2, 80);
    
    // 날짜
    const date = new Date();
    ctx.font = '16px "Noto Sans KR"';
    ctx.fillText(`발급일: ${date.toLocaleDateString()}`, canvas.width/2, 120);
}

// 쿠폰 저장
function saveCoupon() {
    const canvas = document.getElementById('coupon-canvas');
    const link = document.createElement('a');
    link.download = '음료수쿠폰.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 이벤트 리스너
elements.startButton.addEventListener('click', initGame);
elements.submitButton.addEventListener('click', checkAnswer);
elements.answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
elements.retryButton.addEventListener('click', initGame);
elements.homeButton.addEventListener('click', () => showScreen('start'));
elements.saveCouponButton.addEventListener('click', saveCoupon);
elements.couponHomeButton.addEventListener('click', () => showScreen('start'));

// 초기 화면 설정
showScreen('start'); 