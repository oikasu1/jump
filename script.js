
let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'style.css';
document.head.appendChild(link);



let myTitle = document.title;
let htmlSettingsPage = `
<div id="settingsPage">
    <h2>${myTitle}</h2>
    <div>
        <label for="lessonSelect">分類：</label>
        <select id="lessonSelect"></select>
    </div>
    <div>
        <label for="questionSelect">題目：</label>
        <select id="questionSelect"></select>
    </div>
    <div>
        <label for="answerSelect">答案：</label>
        <select id="answerSelect"></select>
    </div>
    <div>
        <label for="countSelect">數量：</label>
        <select id="countSelect">
            <option disabled>每次題目數量</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4" selected>4</option>
            <option value="5">5</option>
            <option value="6">6</option>
        </select>
    </div>
    <div>
        <label for="playbackTimesSelect">播音：</label>
        <select id="playbackTimesSelect">
            <option disabled>音檔播放次數</option>
            <option value="1">1</option>
            <option value="2" selected>2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </select>
    </div>

    <div>
        <label for="difficultySelect">難度：</label>
        <select id="difficultySelect">
            <option value="0">預設</option>
            <option value="1">嘗試</option>
            <option value="2">挑戰</option>
        </select>
    </div>

    <button id="startButton">開始</button>
</div>

<div id="gameContainer" style="position: relative; display: none;">
    <button id="closeButton">X</button>
    <div id="questionDisplay"></div>

    <canvas id="gameCanvas"></canvas>

    <div id="wordLabels"></div>

    <div id="controls">
        <div class="control-group">
            <button id="jumpBtn" class="control-btn">↑</button>
        </div>
        <div class="control-group">
            <button id="leftBtn" class="control-btn">←</button>
            <button id="rightBtn" class="control-btn">→</button>
        </div>
    </div>
</div>


<div id="gameEndModal" class="modal">
    <div class="modal-content">
        <p id="gameEndMessage"></p>
        <div class="modal-buttons">
            <button id="returnButton" class="modal-button return-button">返回設定</button>
            <button id="continueButton" class="modal-button continue-button">繼續遊戲</button>
        </div>
    </div>
</div>
`;

document.body.innerHTML = htmlSettingsPage;

/*
const myData = `
分類	國語	客語	拼音	注音	音檔
一、問好 00百句	你好	你好	henˋ hooˆ	ˋ ˆ	k009.k100
一、問好 00百句	老師早	先生𠢕早	sienˇ senˇ ngauˋ zooˆ	ˇ ˇ ˋ ˆ	k010.k100
一、問好 00百句	謝謝	勞力	looˆ ladˋ	ˆ ˋ	k016.k100
一、問好 00百句	不必客氣	毋使細義	m suˆ seˆ ngi	 ˆ ˆ 	k021.k100
一、問好 00百句	老師再見	先生再見	sienˇ senˇ zaiˆ gienˆ	ˇ ˇ ˆ ˆ	k022.k100
一、問好 00百句	再見	正來尞	zhangˆ loiˋ leeu	ˆ ˋ 	k023.k100
二、紹介 00百句	你叫什麼名字	你喊做麼个名	henˋ heemˆ zooˆ bbooˊ gaiˆ miangˋ	ˋ ˆ ˆ ˊ ˆ ˋ	k027.k100
二、紹介 00百句	我叫做李東興	𠊎喊做李東興	ngaiˋ heemˆ zooˆ liˆ dungˇ hinˇ	ˋ ˆ ˆ ˆ ˇ ˇ	k028.k100
二、紹介 00百句	你幾歲	你幾多歲	henˋ giˆ dooˇ seˆ	ˋ ˆ ˇ ˆ	k036.k100
`;
*/
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const settingsPage = document.getElementById('settingsPage');
const lessonSelect = document.getElementById('lessonSelect');
const questionSelect = document.getElementById('questionSelect');
const answerSelect = document.getElementById('answerSelect');
const countSelect = document.getElementById('countSelect');
const startButton = document.getElementById('startButton');
const controls = document.getElementById('controls');
const questionDisplay = document.getElementById('questionDisplay');



let canvasWidth = 800;
let canvasHeight = 400;
let scale = 1;

let gameData = [];
let currentQuestionIndex = 0;
let score = 0;
let newPlatformConut = 0;
let move = true;

let totalQuestions = 0;
let answeredQuestions = 0;

let playerStartX = 50;
let playerStartY = 100;

let playerColor = 'red';
let livesCount = 3;
let audioPlaybackTimes = 2; // 預設播兩次;

let availableQuestions = [];
let usedQuestions = [];

let totalScore = 0;
let passedLevels = 0;

const minWordDistance = 100; // 單詞之間的最小距離
const safeZoneRadius = 100; // 主角初始位置周圍的安全區域半徑

// 解析題庫資料
const parsedData = myData.trim().split('\n').map(line => line.split('\t'));
const headers = parsedData[0];
const data = parsedData.slice(1);


// 獲取所有分類
const categories = ['全部', ...new Set(data.map(row => row[0]))];

// 動態生成選項
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = option.textContent = category;
    lessonSelect.appendChild(option);
});


// 找出 '分類' 和 '音檔' 的索引位置
const categoryIndex = headers.indexOf('分類');
const audioIndex = headers.indexOf('音檔');

// 使用 filter 排除 排除 '分類' 和 '音檔'
const languages = headers.filter((header, index) => index !== categoryIndex && index !== audioIndex);


languages.forEach(lang => {
    const qOption = document.createElement('option');
    const aOption = document.createElement('option');
    qOption.value = aOption.value = qOption.textContent = aOption.textContent = lang;
    questionSelect.appendChild(qOption);
    answerSelect.appendChild(aOption.cloneNode(true));
});


function initializeLanguageSelects() {
    // 清空現有選項
    questionSelect.innerHTML = '';
    answerSelect.innerHTML = '';

    // 獲取所有可用的語言（排除 '分類' 和 '音檔'）
    const availableLanguages = headers.filter(header => !['分類', '音檔'].includes(header));

    // 為 questionSelect 添加所有語言選項
    availableLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = option.textContent = lang;
        questionSelect.appendChild(option);
    });

    // 初始化 answerSelect
    updateAnswerSelect();

    // 添加事件監聽器，當 questionSelect 變更時更新 answerSelect
    questionSelect.addEventListener('change', updateAnswerSelect);
}

// 更新 answerSelect 的選項
function updateAnswerSelect() {
    const selectedQuestion = questionSelect.value;
    const availableLanguages = headers.filter(header => !['分類', '音檔'].includes(header));

    // 清空答案選擇
    answerSelect.innerHTML = '';

    // 添加除了 questionSelect 所選語言以外的所有選項
    availableLanguages.forEach(lang => {
        if (lang !== selectedQuestion) {
            const option = document.createElement('option');
            option.value = option.textContent = lang;
            answerSelect.appendChild(option);
        }
    });

    // 選擇第一個可用的選項
    answerSelect.selectedIndex = 0;

    // 如果 answerSelect 變為空，禁用開始按鈕
    startButton.disabled = answerSelect.options.length === 0;
}

// 在頁面加載時調用初始化函數
document.addEventListener('DOMContentLoaded', initializeLanguageSelects);








startButton.addEventListener('click', () => {
	disableTouchBehaviors();
    // 初始化 availableQuestions（如果還沒有的話）
    if (availableQuestions.length === 0 && usedQuestions.length === 0) {
        availableQuestions = [...data];
    }

    selectNewQuestions();

    if (gameData.length > 0) {
        totalQuestions = gameData.length;
        // 開始遊戲
        settingsPage.style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        canvas.style.display = 'block';
        controls.style.display = 'flex';
        // 重新初始化遊戲
        initGame();
        resizeCanvas();
        gameLoopId = requestAnimationFrame(gameLoop);
    } else {
        alert("沒有足夠的數據來開始遊戲，請選擇其他設置。");
    }
});


const player = {
    x: 50,
    y: 100,
    width: 30,
    height: 30,
    speed: 5,
    yVelocity: 0,
    isJumping: false,
    moveLeft: false,
    moveRight: false,
    lives: 5,
    maxLives: 10,
    jumpStrength: 20,
    doubleJumpStrength: 15, // 二段跳高度
    isVerticalJump: false,
    canDoubleJump: true,
    jumpCount: 0,
    lastJumpTime: 0,
    maxJumpInterval: 500 // 毫秒，連續跳躍的最大間隔時間

};

const enemy = {
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    speed: 1,
    yVelocity: 0,
    isJumping: false,
    canDoubleJump: false,
    direction: 1, // 1 表示向右, -1 表示向左
    jumpTimer: 0,
    currentPlatform: null
};



let platforms = [];
let words = [];
let newPlatformCount = 0;



function jump() {
    const currentTime = Date.now();
    // 檢查是否為垂直跳躍（既不向左也不向右移動）
    player.isVerticalJump = !player.moveLeft && !player.moveRight;

    // 檢查是否為連續跳躍
    if (currentTime - player.lastJumpTime <= player.maxJumpInterval) {
        player.jumpCount++;
    } else {
        player.jumpCount = 1;
    }
    player.lastJumpTime = currentTime;

    if (!player.isJumping) {
        // 第一次跳躍
        player.yVelocity = -player.jumpStrength;
        player.isJumping = true;
        player.canDoubleJump = true;
    } else if (player.canDoubleJump) {
        // 二段跳
        player.yVelocity = -player.doubleJumpStrength;
        player.canDoubleJump = false;
    }

    // 檢查是否需要生成新平台（只在垂直跳躍時）
    if (player.jumpCount >= 3 && newPlatformCount == 0 && player.isVerticalJump && player.lives > 1) {
        generateNewPlatform();
        player.jumpCount = 0; // 重置跳躍計數
        playerColor = 'orange'; // 更新顏色
    }
}


function generateNewPlatform() {
    if (player.lives > 1) {
        const platformWidth = 100;
        const platformHeight = 20;
        const newPlatform = {
            x: player.x - platformWidth / 2 + player.width / 2,
            y: player.y + 50, // 在玩家上方生成平台
            width: platformWidth,
            height: platformHeight,
            isTemporary: true // 標記為臨時平台
        };
        newPlatformCount = 1;
        playerColor = 'orange';

        // 確保平台在畫布範圍內
        newPlatform.x = Math.max(0, Math.min(newPlatform.x, canvasWidth - platformWidth));
        newPlatform.y = Math.max(0, newPlatform.y) + 50;
        platforms.push(newPlatform);

        // 扣除一个生命值
        player.lives--;

        // 5秒後移除臨時平台
        setTimeout(() => {
            platforms = platforms.filter(p => p !== newPlatform);
        }, 5000);

        // 10秒後重置 newPlatformCount
        setTimeout(() => {
            newPlatformCount = 0;
            playerColor = 'red';
        }, 10000);
    } else {
        console.log("生命值不足，無法生成新平台");
    }
}



function generatePlatforms() {
    platforms = [];
    const isPortrait = canvasHeight > canvasWidth;
    const minPlatformWidth = isPortrait ? 80 : 100;
    const maxPlatformWidth = isPortrait ? 150 : 200;
    const minGap = isPortrait ? 100 : 50;
    const maxGap = isPortrait ? 150 : 100;

    // 添加底部平台
    platforms.push({
        x: 0,
        y: canvasHeight - 50,
        width: canvasWidth,
        height: 50
    });

    let currentY = canvasHeight - 150; // 從底部平台上方開始
    while (currentY > 50) { // 確保不會生成太靠近頂部的平台
        const platformWidth = Math.random() * (maxPlatformWidth - minPlatformWidth) + minPlatformWidth;
        const platformX = Math.random() * (canvasWidth - platformWidth);
        platforms.push({
            x: platformX,
            y: currentY,
            width: platformWidth,
            height: 20
        });

        // 計算下一個平台的 Y 坐標
        currentY -= Math.random() * (maxGap - minGap) + minGap;
    }
}



function generateWords() {
    words = [];
    const questionLangIndex = headers.indexOf(questionSelect.value);
    const answerLangIndex = headers.indexOf(answerSelect.value);
    const safeZoneWidth = 50; // 安全區域的寬度
    const safeZoneHeight = canvasHeight; // 安全區域的高度，覆蓋整個畫布高度

    if (questionLangIndex !== -1 && answerLangIndex !== -1 && gameData.length > 0) {
        gameData.forEach((item, index) => {
            let wordX, wordY;
            let attempts = 0;
            const maxAttempts = 100;

            do {
                const platform = platforms[Math.floor(Math.random() * platforms.length)];
                wordX = platform.x + Math.random() * (platform.width - 40);
                wordY = platform.y - 40; // 調整高度，讓方塊位於平台上方
                attempts++;

                if (attempts >= maxAttempts) {
                    console.log("無法找到合適的位置放置單詞");
                    break;
                }
            } while (
                // 檢查是否在安全區域內
                (wordX < playerStartX + safeZoneWidth && wordY < safeZoneHeight) ||
                words.some(w => Math.abs(w.x - wordX) < minWordDistance && Math.abs(w.y - wordY) < minWordDistance)
            );

            if (attempts < maxAttempts) {
                const boxSize = 30;
                words.push({
                    x: wordX,
                    y: wordY,
                    text: item[answerLangIndex],
                    question: item[questionLangIndex],
                    width: boxSize,
                    height: boxSize,
                    collected: false,
                    isCorrect: true,
                    textOnRight: Math.random() < 0.5,
                    id: `word-${index}`
                });
            }
        });
    }
    updateWordLabels();
}



function updateWordLabels() {
    const labelsContainer = document.getElementById('wordLabels');
    labelsContainer.innerHTML = '';
    const canvasRect = canvas.getBoundingClientRect();
    const canvasCenterX = canvasRect.left + (canvasRect.width / 2);

    words.forEach(word => {
        if (!word.collected) {
            const label = document.createElement('div');
            label.className = 'word-label';
            label.id = word.id;
            //label.textContent = word.text;
			label.innerHTML = word.text; // 文字可HTML
			

            // 計算標籤的精確位置
            const scaledWordX = word.x * scale;
            const scaledWordY = word.y * scale;

            // 決定標籤在方塊的左側還是右側
            const wordCenterX = canvasRect.left + scaledWordX + (word.width * scale / 2);
            const labelOnRight = wordCenterX < canvasCenterX;

            // 設置標籤位置
            const labelX = labelOnRight ?
                scaledWordX + (word.width * scale) + 5 :
                scaledWordX - 5;

            label.style.left = `${canvasRect.left + labelX}px`;
            label.style.top = `${canvasRect.top + scaledWordY + (word.height * scale / 2)}px`;

            // 設置文本對齊方式
            label.style.textAlign = labelOnRight ? 'left' : 'right';
            label.style.transform = labelOnRight ?
                'translate(0, -50%)' :
                'translate(-100%, -50%)';

            labelsContainer.appendChild(label);
        }
    });
}


function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isPortrait = windowHeight > windowWidth;

    if (isPortrait) {
        // 直式模式
        canvasWidth = 400;
        canvasHeight = 600;
    } else {
        // 橫式模式
        canvasWidth = 800;
        canvasHeight = 400;
    }

    if (windowWidth / windowHeight < canvasWidth / canvasHeight) {
        scale = windowWidth / canvasWidth;
    } else {
        scale = windowHeight / canvasHeight;
    }

    canvas.width = Math.floor(canvasWidth * scale);
    canvas.height = Math.floor(canvasHeight * scale);
    ctx.scale(scale, scale);

    // 重新生成平台和單詞
    //generatePlatforms();
    //generateWords();
    //updateWordLabels();
}



function initGame() {
    move = true;
    resizeCanvas();
    player.x = playerStartX;
    player.y = playerStartY;
    player.yVelocity = 0;
    player.isJumping = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.lives = livesCount;
    player.jumpCount = 0;
    player.lastJumpTime = 0;
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    newPlatformCount = 0;

    const difficultySelect = document.getElementById('difficultySelect');
    const difficulty = parseInt(difficultySelect.value);

    if (difficulty >= 1) {
        enemy.x = canvasWidth - 50;
        enemy.y = canvasHeight - 80;
        enemy.isJumping = false;
        enemy.yVelocity = 0;
    }

    // 重新選擇題目
    selectNewQuestions();

    if (gameData.length > 0) {
        updateQuestionDisplay();
        playCurrentAudio();
    } else {
        //;
    }
    const playbackTimesSelect = document.getElementById('playbackTimesSelect');
    playbackTimesSelect.addEventListener('change', (e) => {
        audioPlaybackTimes = parseInt(e.target.value);
    });
    generatePlatforms();
    generateWords();
    updateWordLabels();
    updateControlsPosition();
}

function updateQuestionDisplay() {
    if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
        const questionLangIndex = headers.indexOf(questionSelect.value);
        questionDisplay.textContent = "🥷 " + gameData[currentQuestionIndex][questionLangIndex];
    } else {
        questionDisplay.textContent = "沒有更多問題";
    }
}


function selectNewQuestions() {
    const selectedCategory = lessonSelect.value;
    const count = parseInt(countSelect.value);

    // 如果所有題目都用完了，重置 usedQuestions
    if (availableQuestions.length === 0) {
        availableQuestions = [...usedQuestions];
        usedQuestions = [];
    }

    // 過濾並隨機選擇題目
    let filteredData = selectedCategory === '全部' ? availableQuestions : availableQuestions.filter(row => row[0] === selectedCategory);

    gameData = [];
    while (gameData.length < count && filteredData.length > 0) {
        const index = Math.floor(Math.random() * filteredData.length);
        const selectedQuestion = filteredData.splice(index, 1)[0];
        gameData.push(selectedQuestion);
        usedQuestions.push(selectedQuestion);
        availableQuestions = availableQuestions.filter(q => q !== selectedQuestion);
    }

    totalQuestions = gameData.length;
}

function drawPlayer() {
    ctx.fillStyle = playerColor;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawLives() {
    const blockSize = 15;
    const gap = 5;
    ctx.fillStyle = 'red';
    const rightMargin = 10;

    for (let i = 0; i < player.lives; i++) {
        const x = canvasWidth - rightMargin - (player.lives - i) * (blockSize + gap);
        ctx.fillRect(x, 10, blockSize, blockSize);
    }
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach((platform, index) => {
        if (index === platforms.length - 1 && platform.isTemporary) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // 半透明的亮綠色
        } else {
            ctx.fillStyle = 'green';
        }
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// 繪製單詞方塊
function drawWords() {
    ctx.fillStyle = 'blue';
    words.forEach(word => {
        if (!word.collected) {
            ctx.fillRect(word.x, word.y, word.width, word.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(word.x, word.y, word.width, 10); // 白色線
            ctx.fillStyle = 'green';
            ctx.fillRect(word.x, word.y, word.width, 8); // 綠色線
            // 重置填充顏色為藍色，為下一個單詞做準備
            ctx.fillStyle = 'blue';
        }
    });
}

function checkCollision(x, y, width, height, platform) {
    return x < platform.x + platform.width &&
        x + width > platform.x &&
        y < platform.y + platform.height &&
        y + height > platform.y;
}

function update() {
    let nextX = player.x;
    if (player.moveLeft) {
        nextX -= player.speed;
    }
    if (player.moveRight) {
        nextX += player.speed;
    }

    const difficulty = parseInt(document.getElementById('difficultySelect').value);
    if (difficulty >= 1) {
        updateEnemy();
        checkEnemyCollision();
    }

    let canMoveHorizontally = true;
    platforms.forEach(platform => {
        if (checkCollision(nextX, player.y, player.width, player.height, platform)) {
            canMoveHorizontally = false;
        }
    });
    if (canMoveHorizontally) {
        player.x = nextX;
    }

    player.yVelocity += 0.8;
    let nextY = player.y + player.yVelocity;

    let onPlatform = false;
    platforms.forEach(platform => {
        if (checkCollision(player.x, nextY, player.width, player.height, platform)) {
            if (player.yVelocity > 0) {
                nextY = platform.y - player.height;
                player.yVelocity = 0;
                player.isJumping = false;
                player.canDoubleJump = true;
                onPlatform = true;
                // 不要在這裡重置 jumpCount，讓它在空中也能累積
            } else if (player.yVelocity < 0) {
                nextY = platform.y + platform.height;
                player.yVelocity = 0;
            }
        }
    });
    player.y = nextY;
    if (!onPlatform) {
        player.isJumping = true;
    }

    if (!player.isJumping) {
        player.jumpCount = 0;
    }


    let wordCollision = false;

    let onWordPlatform = false;
    words.forEach(word => {
        if (!word.collected) {
            const playerBottom = player.y + player.height;
            const wordTop = word.y;
            const playerRight = player.x + player.width;
            const wordRight = word.x + word.width;

            // 檢查是否從側面或底部碰到單詞
            if (player.x < wordRight && playerRight > word.x &&
                playerBottom > wordTop && player.y < wordTop + word.height) {

                // 檢查是否站在單詞上
                if (playerBottom <= wordTop + 5 && player.yVelocity >= 0) {
                    player.y = wordTop - player.height;
                    player.yVelocity = 0;
                    player.isJumping = false;
                    onWordPlatform = true;
                } else if (player.y >= wordTop + word.height - 5 ||
                    player.x >= wordRight - 5 ||
                    playerRight <= word.x + 5) {
                    // 從底部或側面碰到單詞

                    if (word.isCorrect && currentQuestionIndex === words.indexOf(word)) {
                        word.collected = true;
                        score++;
                        answeredQuestions++;
                        playRightSound();
                        player.lives = Math.min(player.lives + 1, player.maxLives); // 增加生命值,最多10個
                        if (answeredQuestions < totalQuestions) {
                            currentQuestionIndex++;
                            updateQuestionDisplay();                            
							if (isIOS() && !iosTouch) {
								playCurrentAudio();
								iosTouch = true;
							}else{
								playCurrentAudio();							
							}
                        } else {
                            endGame();
                        }
                    } else {
                        player.x = playerStartX;
                        player.y = playerStartY;
                        player.yVelocity = 0;
                        player.lives--; // 減少生命值
                        if (player.lives <= 0 || answeredQuestions >= totalQuestions) {
                            endGame();
                        }
                        playWrongSound();
                    }
                }
            }
        }
        updateWordLabels();
    });

    // 如果不在任何單詞平台上，應用重力
    if (!onWordPlatform) {
        player.yVelocity += 0.8;
    }


    if (!wordCollision) {
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;
        if (player.y + player.height > canvasHeight) {
            player.y = canvasHeight - player.height;
            player.isJumping = false;
        }
    }
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;
    if (player.y + player.height > canvasHeight) {
        player.y = canvasHeight - player.height;
        player.isJumping = false;
    }

    if (player.y > canvasHeight) {
        initGame();
    }
    playerColor = newPlatformCount === 0 ? 'red' : 'orange';
}


function updateEnemy() {
    const difficulty = parseInt(document.getElementById('difficultySelect').value);
    if (move) {
        enemy.x += enemy.speed * enemy.direction;
    }

    // 檢查是否到達畫布邊緣邊緣
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvasWidth) {
        enemy.direction *= -1;
    }

    /*  // 檢查是否到達畫布平台邊緣
        if ( (enemy.currentPlatform && (enemy.x <= enemy.currentPlatform.x ||
            enemy.x + enemy.width >= enemy.currentPlatform.x + enemy.currentPlatform.width))) {
            enemy.direction *= -1;
        }
    */
    enemy.yVelocity += 0.8; // 重力效果
    enemy.y += enemy.yVelocity;

    // 檢查是否落在平台上或地面上
    let onPlatform = false;
    platforms.forEach(platform => {
        if (checkCollision(enemy.x, enemy.y, enemy.width, enemy.height, platform)) {
                enemy.y = platform.y - enemy.height;
                enemy.yVelocity = 0;
                enemy.isJumping = false;
                enemy.canDoubleJump = true;
                enemy.currentPlatform = platform;
                onPlatform = true;
        }
    });

    if (!onPlatform) {
        enemy.currentPlatform = null;
    }

    // 在地面上時重置跳躍能力，並防止敵人落到地面以下
    if (enemy.y + enemy.height >= canvasHeight) {
        enemy.y = canvasHeight - enemy.height;
        enemy.isJumping = false;
        enemy.canDoubleJump = true;
        enemy.yVelocity = 0;
    }

    // 只在難度為 2 時允許跳躍
    if (difficulty === 2) {
        enemy.jumpTimer++;
        if (enemy.jumpTimer > 200 && (enemy.currentPlatform || enemy.y + enemy.height >= canvasHeight)) {
            enemyJump();
            enemy.jumpTimer = 0;
        }
    }
}

function enemyJump() {
    if (!enemy.isJumping) {
        enemy.yVelocity = -20;
        enemy.isJumping = true;
    } else if (enemy.canDoubleJump) {
        enemy.yVelocity = -12;
        enemy.canDoubleJump = false;
    }
}


function checkEnemyCollision() {
    if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    ) {
        enemy.x = canvasWidth - 50;
        enemy.y = canvasHeight - 80;

        player.lives--;

        player.yVelocity = -15; // 給玩家一個小跳躍
        playWrongSound();

        if (player.lives <= 0) {
            endGame();
        }
    }


}


let gameLoopId;

function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    update();
    drawPlatforms();
    drawWords();
    drawPlayer();

    const difficulty = parseInt(document.getElementById('difficultySelect').value);
    if (difficulty >= 1) {
        drawEnemy();
    }

    drawLives();
    updateWordLabels();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function drawEnemy() {
    const difficulty = parseInt(document.getElementById('difficultySelect').value);

    if (difficulty === 1) {
        ctx.fillStyle = 'black';
    } else if (difficulty === 2) {
        ctx.fillStyle = 'black';
    }

    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

document.addEventListener('keydown', (e) => {
    if (move) {
        switch (e.key) {
            case 'ArrowLeft':
                player.moveLeft = true;
                player.isVerticalJump = false;
                break;
            case 'ArrowRight':
                player.moveRight = true;
                player.isVerticalJump = false;
                break;
            case 'ArrowUp':
            case ' ': // 空格鍵
                jump();
                break;
        }
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            player.moveLeft = false;
            break;
        case 'ArrowRight':
            player.moveRight = false;
            break;
    }
});

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const jumpBtn = document.getElementById('jumpBtn');

leftBtn.addEventListener('touchstart', (e) => {
	iosTouch = false;
    if (move) {
        player.jumpCount = 0;
        e.preventDefault();
        player.moveLeft = true;
    }
});

leftBtn.addEventListener('touchend', (e) => {
    player.jumpCount = 0;
    e.preventDefault();
    player.moveLeft = false;
});

rightBtn.addEventListener('touchstart', (e) => {
	iosTouch = false;
    if (move) {
        player.jumpCount = 0;
        e.preventDefault();
        player.moveRight = true;
    }
});

rightBtn.addEventListener('touchend', (e) => {
    player.jumpCount = 0;
    e.preventDefault();
    player.moveRight = false;
});

jumpBtn.addEventListener('touchstart', (e) => {
	iosTouch = false;
    if (move) {
        e.preventDefault();
        player.isVerticalJump = !player.moveLeft && !player.moveRight;
        jump();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.getElementById('gameEndModal').style.display === 'block') {
        event.preventDefault(); // 防止表單提交或其他默認行為
        document.getElementById('continueButton').click();
    }
});







function playWrongSound() {
    const audio = new Audio('wrong.mp3');
    audio.play();
}

function playRightSound() {
    const audio = new Audio('right.mp3');
    audio.play();
}



function playCurrentAudio(times = audioPlaybackTimes) {
    if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
        const audioFileInfo = gameData[currentQuestionIndex][headers.indexOf('音檔')];
        let audioUrl = getAudioUrl(audioFileInfo);

        if (audioUrl) {
            playAudioMultipleTimes(audioUrl, times)
                .catch(error => console.error('播放音頻時發生錯誤:', error));
        }
    } else {
        console.warn('沒有可用的音頻數據');
    }
}


function getAudioUrl(audioFileInfo) {
    if (audioFileInfo.endsWith('.k100')) {
        return `https://oikasu1.github.io/kasu100/${audioFileInfo.replace('.k100', '.mp3')}`;
    } else if (audioFileInfo.endsWith('.kasu')) {
        return `https://oikasu1.github.io/snd/mp3kasu/${audioFileInfo.replace('.kasu', '.mp3')}`;
    } else if (audioFileInfo.endsWith('.holo')) {
        return `https://oikasu1.github.io/snd/mp3holo/${audioFileInfo.replace('.holo', '.mp3')}`;
    } else if (audioFileInfo.endsWith('.mp3')) {
        return audioFileInfo;
    } else {
        let langCode, text;
        switch (audioFileInfo) {
            case 'zh':
                langCode = 'zh-TW';
                text = gameData[currentQuestionIndex][headers.indexOf('國語')];
                break;
            case 'en':
            case '英':
                langCode = 'en';
                text = gameData[currentQuestionIndex][headers.indexOf('英語')] || gameData[currentQuestionIndex][headers.indexOf('美語')];
                break;
            case 'jp':
            case '日':
                langCode = 'ja';
                text = gameData[currentQuestionIndex][headers.indexOf('日語')];
                break;
            case 'in':
            case '印':
                langCode = 'id';
                text = gameData[currentQuestionIndex][headers.indexOf('印尼語')];
                break;
            default:
                console.warn('未知的音頻格式:', audioFileInfo);
                return null;
        }
        if (langCode && text) {
            return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(text)}`;
        } else {
            console.warn('無法確定語言或找不到對應的文本');
            return null;
        }
    }
}


function playAudioMultipleTimes(audioUrl, times) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl);
        let playCount = 0;

        audio.addEventListener('ended', function audioEndHandler() {
            playCount++;
            if (playCount < times) {
                audio.currentTime = 0;
                audio.play().catch(reject);
            } else {
                audio.removeEventListener('ended', audioEndHandler);
                resolve();
            }
        });

        audio.addEventListener('error', reject);

        audio.play().catch(reject);
    });
}

function updateControlsPosition() {
    const controls = document.getElementById('controls');
    const isLandscape = window.innerWidth > window.innerHeight;
    const bottomPadding = isLandscape ? '50px' : '10px';
    controls.style.bottom = bottomPadding;
}

document.getElementById('closeButton').addEventListener('click', closeGame);

function closeGame() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';

    // 重置遊戲相關狀態
    player.x = playerStartX;
    player.y = playerStartY;
    player.yVelocity = 0;
    player.isJumping = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.lives = livesCount;
    player.jumpCount = 0;
    player.lastJumpTime = 0;

    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    newPlatformCount = 0;

    // 清空平台和單詞
    platforms = [];
    words = [];

    selectNewQuestions();

    // 停止遊戲循環（如果有的話）
    cancelAnimationFrame(gameLoopId);
}



function showGameEndModal(isLevelCompleted) {
    const modal = document.getElementById('gameEndModal');
    const messageElement = document.getElementById('gameEndMessage');
    const continueButton = document.getElementById('continueButton');

    let message = '';
    if (isLevelCompleted) {
        message = `
            <h2>🤗恭喜過關</h2>
            <p>✨您已獲得 ${totalScore} 分</p>
            <p>通過 ${passedLevels} 關</p>
        `;
        continueButton.textContent = '繼續遊戲➡️';
    } else {
        message = `
            <h2>遊戲結束</h2>
            <p>✨您共獲得 ${totalScore} 分</p>
            <p>通過 ${passedLevels} 關</p>
        `;
        continueButton.textContent = '重新開始🔄';
    }

    messageElement.innerHTML = message;
    modal.style.display = 'block';
    continueButton.focus();
}

function hideGameEndModal() {
    const modal = document.getElementById('gameEndModal');
    modal.style.display = 'none';
}

document.getElementById('returnButton').addEventListener('click', () => {
    hideGameEndModal();
    closeGame();
});

document.getElementById('continueButton').addEventListener('click', () => {
    hideGameEndModal();
    if (player.lives <= 0) {
        // 重新開始遊戲，重置所有分數
        totalScore = 0;
        passedLevels = 0;
    }
    initGame();
});

function endGame() {
    move = false;
	enableTouchBehaviors();

    let isLevelCompleted = answeredQuestions >= totalQuestions;

    if (isLevelCompleted) {
        totalScore += score;
        passedLevels++;
    }

    showGameEndModal(isLevelCompleted);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    updateControlsPosition();
    updateWordLabels();
});

window.addEventListener('orientationchange', updateControlsPosition);

// 初始化遊戲設定頁面
initGame();



  // 禁用雙擊縮放
  document.addEventListener('dblclick', function(event) {
    event.preventDefault();
  }, { passive: false });

  // 禁用雙指縮放
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
  });

  // 禁用捏合縮放
  document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });

  // 在遊戲開始時調用此函數
  function disableTouchBehaviors() {
    document.body.style.touchAction = 'none';
  }

  // 在遊戲結束時調用此函數恢復默認行為
  function enableTouchBehaviors() {
    document.body.style.touchAction = 'auto';
  }


let iosTouch = false;
function isIOS() {
			const userAgent = navigator.userAgent.toLowerCase();
			const isIOSDevice = /iphone|ipod/.test(userAgent);  // iPhone 和 iPod 檢測
			const isIPad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);  // iPad 檢測
			return isIOSDevice || isIPad;
}






let script = document.createElement('script');
script.src = 'wesingmark.js';
script.type = 'text/javascript';
document.head.appendChild(script);