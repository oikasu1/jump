/*
const style = document.createElement('style');
style.textContent = `

`;
document.head.appendChild(style);
*/

let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'shotcss.css';
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

    <button id="startButton">開始 太空隕石</button>
</div>

<div id="gameContainer" style="position: relative; display: none;">
  <button id="closeButton">X</button>
  <div id="questionDisplay"></div>
  <canvas id="gameCanvas"></canvas>
  <div id="wordLabels"></div>
	<div id="controls">
	  <div class="control-group-left">
		<button id="shootBtn" class="control-btn">🎯</button>
	  </div>
	  <div class="control-group-right">
		<button id="upBtn" class="control-btn">↑</button>
		<button id="leftBtn" class="control-btn">←</button>
		<button id="downBtn" class="control-btn">↓</button>
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
一、問好 00百句	你叫什麼名字	你喊做麼个名	henˋ heemˆ zooˆ bbooˊ gaiˆ miangˋ	ˋ ˆ ˆ ˊ ˆ ˋ	k027.k100
一、問好 00百句	你叫什麼名字	你喊做麼个名	henˋ heemˆ zooˆ bbooˊ gaiˆ miangˋ	ˋ ˆ ˆ ˊ ˆ ˋ	k027.k100
一、問好 00百句	你好	你好	henˋ hooˆ	ˋ ˆ	k009.k100
一、問好 00百句	老師早	先生𠢕早	sienˇ senˇ ngauˋ zooˆ	ˇ ˇ ˋ ˆ	k010.k100
一、問好 00百句	謝謝	勞力	looˆ ladˋ	ˆ ˋ	k016.k100
一、問好 00百句	謝謝	勞力	looˆ ladˋ	ˆ ˋ	k016.k100
二、紹介 00百句	你叫什麼名字	你喊做麼个名	henˋ heemˆ zooˆ bbooˊ gaiˆ miangˋ	ˋ ˆ ˆ ˊ ˆ ˋ	k027.k100
二、紹介 00百句	我叫做李東興	𠊎喊做李東興	ngaiˋ heemˆ zooˆ liˆ dungˇ hinˇ	ˋ ˆ ˆ ˆ ˇ ˇ	k028.k100
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


/* 題庫解析與選單建立*/
// 解析題庫資料
const parsedData = myData.trim().split('\n').map(line => line.split('\t'));
const headers = parsedData[0];
const dataSlice = parsedData.slice(1);
const data = Array.from(new Set(dataSlice.map(JSON.stringify)), JSON.parse); // 使用 Set 移除重複項目;


// 獲取所有分類
const categories = ['全部', ...new Set(data.map(row => row[0]))];

// 動態生成選項
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = option.textContent = category;
    lessonSelect.appendChild(option);
});

// 初始化語言選項
function initializeLanguageSelects() {
    // 取得可用語言並過濾掉 '分類' 和 '音檔'
    const availableLanguages = headers.filter(header => !['分類', '音檔'].includes(header));

    // 清空 questionSelect 和 answerSelect 並添加語言選項
    populateSelects(availableLanguages);

    // 添加事件監聽器，當 questionSelect 變更時更新 answerSelect
    questionSelect.addEventListener('change', () => updateAnswerSelect(availableLanguages));
}

// 填充選項到 questionSelect 和 answerSelect
function populateSelects(languages) {
    questionSelect.innerHTML = '';
    answerSelect.innerHTML = '';

    languages.forEach(lang => {
        const option = createOption(lang);
        questionSelect.appendChild(option);
    });

    updateAnswerSelect(languages);
}

// 創建選項元素
function createOption(lang) {
    const option = document.createElement('option');
    option.value = option.textContent = lang;
    return option;
}

// 更新 answerSelect 的選項
function updateAnswerSelect(languages) {
    const selectedQuestion = questionSelect.value;
    answerSelect.innerHTML = '';

    languages
        .filter(lang => lang !== selectedQuestion)
        .forEach(lang => answerSelect.appendChild(createOption(lang)));

    // 選擇第一個可用的選項，並根據選項數量啟用或禁用開始按鈕
    answerSelect.selectedIndex = 0;
    startButton.disabled = answerSelect.options.length === 0;
}

// 在頁面加載時初始化語言選項
document.addEventListener('DOMContentLoaded', initializeLanguageSelects);



startButton.addEventListener('click', () => {
    disableTouchBehaviors();
	handleGameStart(); //全螢幕
    
    // 檢查是否有選擇特定分類
    const selectedCategory = lessonSelect.value;
    
    // 如果可用題目陣列為空，需要重新填充
    if (availableQuestions.length === 0) {
        // 如果選擇「全部」，使用完整資料集
        if (selectedCategory === '全部') {
            availableQuestions = [...data];
        } else {
            // 選擇特定分類時，只取該分類的題目
            availableQuestions = data.filter(item => item[0] === selectedCategory);
        }
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
    }
    
    iosTouch = true;
});




let gameLoopId;
let meteors = [];
let bullets = [];
let canShoot = true;
let explosions = [];


const player = {
  x: 50,
  y: canvasHeight / 2,
  width: 50,
  height: 30,
  speed: 5,
  lives: 5,
  maxLives: 10,
};
function shoot() {
  const difficulty = parseInt(difficultySelect.value);
  if (difficulty === 0) {
    return;
  }
  if (canShoot && bullets.length === 0) {
    const isPortrait = window.innerHeight > window.innerWidth;
    bullets.push({
      x: player.x + player.width / 2 - 2.5, // 子彈寬度的一半
      y: isPortrait ? player.y : player.y + player.height / 2,
      width: 5,
      height: 10,
      speed: 5,
      direction: isPortrait ? 'up' : 'right'
    });
    canShoot = false;
  }
}
function updateBullets() {
  const isPortrait = window.innerHeight > window.innerWidth;
  bullets = bullets.filter(bullet => 
    isPortrait ? bullet.y > 0 : bullet.x < canvasWidth
  );
  bullets.forEach(bullet => {
    if (bullet.direction === 'up') {
      bullet.y -= bullet.speed;
    } else {
      bullet.x += bullet.speed;
    }
  });
  if (bullets.length === 0) {
    canShoot = true;
  }
}
function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach(bullet => {
    if (bullet.direction === 'up') {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    } else {
      ctx.fillRect(bullet.x, bullet.y, bullet.height, bullet.width);
    }
  });
}



// 新增：敵人物件
const enemy = {
  x: canvasWidth - 100,
  y: canvasHeight / 2,
  width: 50,
  height: 30,
  color: 'black',
  bullets: [],
  lastShootTime: 0
};

// 新增：敵人子彈物件
class EnemyBullet {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = 5;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (parseInt(difficultySelect.value) === 2) {
      // 計算子彈飛行角度
      const angle = Math.atan2(targetY - y, targetX - x);
      this.dx = Math.cos(angle) * this.speed;
      this.dy = Math.sin(angle) * this.speed;
    } else {
      // 難度1時維持直線移動
      if (isPortrait) {
        this.dx = 0;
        this.dy = this.speed;
      } else {
        this.dx = -this.speed;
        this.dy = 0;
      }
    }
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
}


// 新增：繪製敵人
function drawEnemy() {
    if (parseInt(difficultySelect.value) === 1 || parseInt(difficultySelect.value) === 2) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

// 新增：敵人射擊函數
function enemyShoot() {
  const currentTime = Date.now();
  const difficulty = parseInt(difficultySelect.value);
  const isPortrait = window.innerHeight > window.innerWidth;
  
  // 根據難度設定不同的發射間隔
  const shootInterval = difficulty === 1 ? 3000 : 2000; // 難度1為3秒，難度2為2秒
  
  if ((difficulty === 1 || difficulty === 2) && 
      currentTime - enemy.lastShootTime > shootInterval) {
    const bullet = new EnemyBullet(
      enemy.x + enemy.width / 2,
      isPortrait ? enemy.y + enemy.height : enemy.y + enemy.height / 2,
      player.x + player.width / 2,
      player.y + player.height / 2
    );
    enemy.bullets.push(bullet);
    enemy.lastShootTime = currentTime;
  }
}

// 敵人子彈位置
function updateEnemyBullets() {
  const isPortrait = window.innerHeight > window.innerWidth;
  
  // 移除超出畫面的子彈
  enemy.bullets = enemy.bullets.filter(bullet => {
    if (isPortrait) {
      return bullet.y < canvasHeight;
    } else {
      return bullet.x > 0;
    }
  });

  // 更新子彈位置
  enemy.bullets.forEach(bullet => {
    bullet.update();
  });
}

// 新增：繪製敵人子彈
function drawEnemyBullets() {
  const difficulty = parseInt(difficultySelect.value);
  const isPortrait = window.innerHeight > window.innerWidth;

  enemy.bullets.forEach(bullet => {
    ctx.save();  // 保存當前畫布狀態
    if (difficulty === 2) {
      // 計算子彈的旋轉角度
      const angle = Math.atan2(bullet.dy, bullet.dx);
      // 移動到子彈位置並旋轉
      ctx.translate(bullet.x + bullet.width/2, bullet.y + bullet.height/2);
      ctx.rotate(angle);
      ctx.translate(-bullet.width/2, -bullet.height/2);
    } else if (isPortrait) {
      // 直式螢幕時，旋轉子彈90度
      ctx.translate(bullet.x + bullet.width/2, bullet.y + bullet.height/2);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-bullet.height/2, -bullet.width/2);
    }
    
    // 繪製子彈
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, bullet.width, bullet.height);
    
    ctx.restore();  // 恢復畫布狀態
  });
}

// 新增：檢查敵人子彈與玩家的碰撞
function checkEnemyBulletCollisions() {
    enemy.bullets.forEach((bullet, index) => {
        if (checkCollision(bullet, player)) {
            enemy.bullets.splice(index, 1);
            player.lives--;
            createExplosion(player.x + player.width / 2, player.y + player.height / 2);
			if(!isGameEnding){
				playAudio(wrongAudio);			
			}			
            if (player.lives <= 0) {
                endGame();
            }
        }
    });
}


// 隕石(語詞)系統
function generateMeteors() {
  meteors = [];
  const questionLangIndex = headers.indexOf(questionSelect.value);
  const answerLangIndex = headers.indexOf(answerSelect.value);
  const selectedCategory = lessonSelect.value;
  const totalMeteors = parseInt(countSelect.value);
  const isPortrait = window.innerHeight > window.innerWidth;
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 獲取當前分類的所有可能答案
  const categoryAnswers = selectedCategory === '全部' ?
    data.map(row => row[answerLangIndex]) :
    data.filter(row => row[0] === selectedCategory).map(row => row[answerLangIndex]);

  // 先加入正確答案
  const correctAnswer = gameData[currentQuestionIndex][answerLangIndex];
  meteors.push({
    x: isPortrait ? Math.random() * (canvasWidth - 40) : canvasWidth,
    y: isPortrait ? 0 : Math.random() * (canvasHeight - 40),
    width: 40,
    height: 40,
    speed: isMobileOrTablet ? (Math.random() * 0.5 + 1) : (Math.random() * 2 + 1), //語詞移動速度
    text: correctAnswer,
    question: gameData[currentQuestionIndex][questionLangIndex],
    collected: false,
    isCorrect: true,
    id: `meteor-correct`
  });

  // 創建一個不包含當前正確答案的可用答案池
  let availableAnswers = categoryAnswers.filter(answer => answer !== correctAnswer);

  // 需要生成的錯誤答案數量 = 總數量 - 1（正確答案）
  const wrongAnswersCount = totalMeteors - 1;

  // 隨機選擇不重複的錯誤答案
  for (let i = 0; i < wrongAnswersCount && availableAnswers.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableAnswers.length);
    const wrongAnswer = availableAnswers[randomIndex];
    meteors.push({
      x: isPortrait ? Math.random() * (canvasWidth - 40) : canvasWidth,
      y: isPortrait ? 0 : Math.random() * (canvasHeight - 40),
      width: 40,
      height: 40,
      speed: isMobileOrTablet ? (Math.random() * 0.5 + 0.3) : (Math.random() * 2 + 1), // 修改這裡
      text: wrongAnswer,
      collected: false,
      isCorrect: false,
      id: `meteor-wrong-${i}`
    });

    // 從可用答案中移除已使用的答案
    availableAnswers.splice(randomIndex, 1);
  }
}

function updateMeteors() {
  let allMeteorsOffScreen = true;
  let correctAnswerOffScreen = false;
  const isPortrait = window.innerHeight > window.innerWidth;

  meteors.forEach(meteor => {
    if (!meteor.collected) {
      if (isPortrait) {
        meteor.y += meteor.speed;
        if (meteor.y < canvasHeight) {
          allMeteorsOffScreen = false;
        }
        if (meteor.isCorrect && meteor.y >= canvasHeight) {
          correctAnswerOffScreen = true;
        }
      } else {
        meteor.x -= meteor.speed;
        if (meteor.x + meteor.width > 0) {
          allMeteorsOffScreen = false;
        }
        if (meteor.isCorrect && meteor.x + meteor.width <= 0) {
          correctAnswerOffScreen = true;
        }
      }
    }
  });

  if (correctAnswerOffScreen || allMeteorsOffScreen) {
    player.lives--;
    if (player.lives <= 0) {
      endGame();
    } else {
      // 生成新的問題和隕石
      currentQuestionIndex++;
      if (currentQuestionIndex < totalQuestions) {
        updateQuestionDisplay();
        playCurrentAudio();
        generateMeteors();
      } else {
        endGame();
      }
    }
  }
}

// here
function drawMeteors() {
  meteors.forEach(meteor => {
    if (!meteor.collected) {
      if (meteor.hitTime && Date.now() - meteor.hitTime < 200) {
        ctx.fillStyle = 'red'; // 被射中時短暫變紅
      } else {
        ctx.fillStyle = 'brown';
      }
      ctx.fillRect(meteor.x, meteor.y, meteor.width, meteor.height);
      
      // 繪製語詞文本
      ctx.fillStyle = 'white';
	  ctx.font = '14px twhei-s, TWHEI, "台灣黑體", tauhu-oo, PingFangTC-Regular, "Microsoft JhengHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(meteor.text, meteor.x + meteor.width / 2, meteor.y + meteor.height / 2);
    }
  });
}

// 碰撞檢測
function checkBulletCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        meteors.forEach(meteor => {
            if (!meteor.collected && checkCollision(bullet, meteor)) {
                bullets.splice(bulletIndex, 1);
                handleMeteorHit(meteor); // 抽出共用的處理邏輯
            }
        });
    });
}

// 新增玩家與隕石的碰撞檢測
function checkPlayerMeteorCollisions() {
    meteors.forEach(meteor => {
        if (!meteor.collected && checkCollision(player, meteor)) {
            handleMeteorHit(meteor); // 使用相同的處理邏輯
        }
    });
}

// 抽出共用的處理邏輯
function handleMeteorHit(meteor) {
    if (meteor.isCorrect) {
        // 正確答案
        score++;
        answeredQuestions++;
        meteors.forEach(m => {
            m.collected = true;
            createExplosion(m.x + m.width / 2, m.y + m.height / 2);
        });

        if (currentQuestionIndex >= totalQuestions - 1) {
            selectNewQuestions();
            currentQuestionIndex = 0;
        } else {
            currentQuestionIndex++;
        }
        updateQuestionDisplay();
        playCurrentAudio();
        generateMeteors();
    } else {
        // 錯誤答案
        player.lives--;
        playAudio(wrongAudio);
        createExplosion(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2);
        meteor.hitTime = Date.now();
        meteor.collected = true;
        if (player.lives <= 0) {
            endGame();
        }
    }
}

// 通用的碰撞檢測函數保持不變
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
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


  if (isPortrait) {
    // 直式模式
    canvasWidth = 400;
    canvasHeight = 600;
    player.width = 30;
    player.height = 50;
    enemy.width = 30;
    enemy.height = 50;
  } else {
    // 橫式模式
    canvasWidth = 800;
    canvasHeight = 400;
    player.width = 50;
    player.height = 30;
    enemy.width = 50;
    enemy.height = 30;
  }


  if (isPortrait) {
    player.x = canvasWidth / 2 - player.width / 2;
    player.y = canvasHeight - player.height - 10;
    enemy.x = canvasWidth / 2 - enemy.width / 2;
    enemy.y = 10;
  } else {
    player.x = playerStartX;
    player.y = playerStartY;
    enemy.x = canvasWidth - 100;
    enemy.y = canvasHeight / 2;
  }



    // 調整設定頁面
    const settingsPage = document.getElementById('settingsPage');
    if (isPortrait) {
        settingsPage.style.height = 'auto';
        settingsPage.style.overflowY = 'visible';
    } else {
        settingsPage.style.height = '90vh';
        settingsPage.style.overflowY = 'auto';
        settingsPage.style.webkitOverflowScrolling = 'touch'; // 新增：增強 iOS 滾動體驗
    }
}

difficultySelect.addEventListener('change', function() {
    const shootBtn = document.getElementById('shootBtn');
    const difficulty = parseInt(this.value);
    shootBtn.style.display = difficulty === 0 ? 'none' : 'block';
});

function initGame() {
    move = true;
    resizeCanvas();
    player.x = playerStartX;
    player.y = playerStartY;
    player.moveLeft = false;
    player.moveRight = false;
    player.lives = livesCount;
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;

    const difficultySelect = document.getElementById('difficultySelect');
    const difficulty = parseInt(difficultySelect.value);
    // 新增：根據難度控制射擊按鈕顯示
    const shootBtn = document.getElementById('shootBtn');
    shootBtn.style.display = difficulty === 0 ? 'none' : 'block';


  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    player.width = 30;
    player.height = 50;
    enemy.width = 30;
    enemy.height = 50;
    player.x = canvasWidth / 2 - player.width / 2;
    player.y = canvasHeight - player.height - 10;
    enemy.x = canvasWidth / 2 - enemy.width / 2;
    enemy.y = 10;
  } else {
    player.width = 50;
    player.height = 30;
    enemy.width = 50;
    enemy.height = 30;
    player.x = playerStartX;
    player.y = playerStartY;
    enemy.x = canvasWidth - 100;
    enemy.y = canvasHeight / 2;
  }

    // 重新選擇題目
	  selectNewQuestions();
	  if (gameData.length > 0) {
		updateQuestionDisplay();
		playCurrentAudio();
		generateMeteors(); // 新增這行
	  } else {
        //;
    }
    const playbackTimesSelect = document.getElementById('playbackTimesSelect');
    playbackTimesSelect.addEventListener('change', (e) => {
        audioPlaybackTimes = parseInt(e.target.value);
    });

    generateWords();
    updateWordLabels();
    updateControlsPosition();
	handleSettingsTouch();
    // 新增：重置敵人狀態
    enemy.bullets = [];
    enemy.lastShootTime = 0;
}

function updateQuestionDisplay() {
	playAudio(rightAudio);
    if (gameData.length > 0 ) {
		// if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
        const questionLangIndex = headers.indexOf(questionSelect.value);
        questionDisplay.textContent = "🥷 " + gameData[currentQuestionIndex][questionLangIndex];
    } else {
    }
}


function selectNewQuestions() {
  const selectedCategory = lessonSelect.value;
  const count = parseInt(countSelect.value);
  const answerLangIndex = headers.indexOf(answerSelect.value);

  // 如果可用題目不足，重置題庫
  if (availableQuestions.length < count) {
    availableQuestions = [...usedQuestions, ...availableQuestions];
    usedQuestions = [];
  }

  // 過濾並隨機選擇題目
  let filteredData = selectedCategory === '全部' ? 
    availableQuestions : 
    availableQuestions.filter(row => row[0] === selectedCategory);

  gameData = [];
  const usedAnswers = new Set(); // 用來追踪已選擇的答案

  while (gameData.length < count && filteredData.length > 0) {
    const index = Math.floor(Math.random() * filteredData.length);
    const selectedQuestion = filteredData[index];
    const answer = selectedQuestion[answerLangIndex];

    // 檢查答案是否已經存在
    if (!usedAnswers.has(answer)) {
      gameData.push(selectedQuestion);
      usedAnswers.add(answer);
      usedQuestions.push(selectedQuestion);

      // 從可用題目和過濾後的資料中移除已選擇的題目
      availableQuestions = availableQuestions.filter(q => q !== selectedQuestion);
      filteredData.splice(index, 1);
    }
  }

  totalQuestions = gameData.length;
}


function drawPlayer() {
  ctx.fillStyle = 'blue';
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




function update() {
    if (player.moveUp && player.y > 0) player.y -= player.speed;
    if (player.moveDown && player.y < canvasHeight - player.height) player.y += player.speed;
    if (player.moveLeft && player.x > 0) player.x -= player.speed;
    if (player.moveRight && player.x < canvasWidth - player.width) player.x += player.speed;

  const isPortrait = window.innerHeight > window.innerWidth;
  
  if (isPortrait) {
    player.width = 30;
    player.height = 50;
    enemy.width = 30;
    enemy.height = 50;
  } else {
    player.width = 50;
    player.height = 30;
    enemy.width = 50;
    enemy.height = 30;
  }

  // 更新敵人位置
  if (isPortrait) {
    enemy.x = canvasWidth / 2 - enemy.width / 2;
    enemy.y = 10; // 保持在上方
  } else {
    enemy.x = canvasWidth - 100;
    enemy.y = canvasHeight / 2;
  }

    updateBullets();
    updateMeteors();

    
    // 更新敵人相關邏輯
    const difficulty = parseInt(difficultySelect.value);
    if (difficulty === 1 || difficulty === 2) {
        enemyShoot();
        updateEnemyBullets();
        checkEnemyBulletCollisions();
    }
    
    checkBulletCollisions();
    checkPlayerMeteorCollisions();
}




function createExplosion(x, y) {
  explosions.push({
    x: x,
    y: y,
    radius: 0,
    maxRadius: 30,
    speed: 2
  });
}

function drawExplosions() {
  explosions.forEach((explosion, index) => {
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 165, 0, ' + (1 - explosion.radius / explosion.maxRadius) + ')';
    ctx.fill();
    
    explosion.radius += explosion.speed;
    if (explosion.radius > explosion.maxRadius) {
      explosions.splice(index, 1);
    }
  });
}



function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    update();
    updateBullets();
    drawPlayer();
    drawMeteors();
    drawBullets();
    // 新增：繪製敵人相關元素
    if (parseInt(difficultySelect.value) === 1 || parseInt(difficultySelect.value) === 2) {
        drawEnemy();
        drawEnemyBullets();
    }
    
    drawLives();
    drawExplosions();
    updateWordLabels();
    gameLoopId = requestAnimationFrame(gameLoop);
}


document.addEventListener('keydown', (e) => {
    if (move) {
        switch (e.key) {
            case 'ArrowLeft':
                player.moveLeft = true;
                break;
            case 'ArrowRight':
                player.moveRight = true;
                break;
            case 'ArrowUp':
                player.moveUp = true;
                break;
            case 'ArrowDown':
                player.moveDown = true;
                break;
            case ' ':
                if (parseInt(difficultySelect.value) !== 0) {
                    shoot();
                }
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
    case 'ArrowUp':
      player.moveUp = false;
      break;
    case 'ArrowDown':
      player.moveDown = false;
      break;
  }
});

const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const shootBtn = document.getElementById('shootBtn');


// 移動控制
upBtn.addEventListener('touchstart', (e) => {
  if (move) {
    e.preventDefault();
    player.moveUp = true;
  }
});

upBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  player.moveUp = false;
});

downBtn.addEventListener('touchstart', (e) => {
  if (move) {
    e.preventDefault();
    player.moveDown = true;
  }
});

downBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  player.moveDown = false;
});

leftBtn.addEventListener('touchstart', (e) => {
  if (move) {
    e.preventDefault();
    player.moveLeft = true;
  }
});

leftBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  player.moveLeft = false;
});

rightBtn.addEventListener('touchstart', (e) => {
  if (move) {
    e.preventDefault();
    player.moveRight = true;
  }
});

rightBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  player.moveRight = false;
});

// 射擊控制
shootBtn.addEventListener('touchstart', (e) => {
    if (move) {
        e.preventDefault();
        // 新增難度檢查
        if (parseInt(difficultySelect.value) !== 0) {
            shoot();
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.getElementById('gameEndModal').style.display === 'block') {
        event.preventDefault(); // 防止表單提交或其他默認行為
        document.getElementById('continueButton').click();
    }
});









function updateControlsPosition() {
    const controls = document.getElementById('controls');
    const isLandscape = window.innerWidth > window.innerHeight;
    const bottomPadding = isLandscape ? '50px' : '10px';
    controls.style.bottom = bottomPadding;
}

document.getElementById('closeButton').addEventListener('click', closeGame);



function showGameEndModal(isLevelCompleted) {
    const modal = document.getElementById('gameEndModal');
    const messageElement = document.getElementById('gameEndMessage');
    const continueButton = document.getElementById('continueButton');
    let message = '';
    
    if (isLevelCompleted) {
        message = `
            <h2>🤗恭喜過關</h2>
            <p>✨您這次獲得 ${score} 分</p>
        `;
        continueButton.textContent = '繼續遊戲➡️';
    } else {
        message = `
            <h2>遊戲結束</h2>
            <p>✨您這次獲得 ${score} 分</p>
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




let isGameEnding = false; 


function endGame() {
    if (isGameEnding) return;
    isGameEnding = true;
    
    move = false;
    enableTouchBehaviors();
    stopCurrentAudio();
    
    let isLevelCompleted = answeredQuestions >= totalQuestions;
    showGameEndModal(isLevelCompleted);
}



document.getElementById('continueButton').addEventListener('click', () => {
    hideGameEndModal();
    if (player.lives <= 0) {
        // 重新開始遊戲，重置分數
        score = 0;
        answeredQuestions = 0;
    }
    isGameEnding = false;
    initGame();
});

document.getElementById('returnButton').addEventListener('click', () => {
	handleReturnToSettings(); // 退出全螢幕
    hideGameEndModal();
    closeGame();
    // 重置分數
    score = 0;
    answeredQuestions = 0;
    isGameEnding = false;
});



function closeGame() {
	handleReturnToSettings(); //退出全螢幕
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';
    stopCurrentAudio();
    
    // 重置遊戲相關狀態
    player.x = playerStartX;
    player.y = playerStartY;
    player.moveLeft = false;
    player.moveRight = false;
    player.lives = livesCount;
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    isGameEnding = false; // 重置結束標記

    // 清空隕石和子彈
    meteors = [];
    bullets = [];
    
    // 停止遊戲循環
    cancelAnimationFrame(gameLoopId);
	enableTouchBehaviors();
}



window.addEventListener('resize', () => {
    resizeCanvas();
    updateControlsPosition();
    updateWordLabels();
});

window.addEventListener('orientationchange', updateControlsPosition);

// 初始化遊戲設定頁面
initGame();





	document.addEventListener('touchmove', function(event) {
		// 只在遊戲進行時阻止默認行為
		if (document.getElementById('gameContainer').style.display !== 'none') {
			if (event.scale !== 1) {
				event.preventDefault();
			}
		}
	}, { passive: false });

	// 修改 disableTouchBehaviors 函數
	function disableTouchBehaviors() {
		document.getElementById('gameContainer').style.touchAction = 'none';
	}

	// 修改 enableTouchBehaviors 函數
	function enableTouchBehaviors() {
		document.getElementById('gameContainer').style.touchAction = 'auto';
		document.body.style.touchAction = 'auto';
	}

// 新增這個函數
function handleSettingsTouch() {
    const settingsPage = document.getElementById('settingsPage');
    let startY;

    settingsPage.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });

    settingsPage.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const scrollTop = settingsPage.scrollTop;
        const scrollHeight = settingsPage.scrollHeight;
        const clientHeight = settingsPage.clientHeight;

        // 允許滾動，除非已經到達頂部或底部
        if ((scrollTop === 0 && touchY > startY) || 
            (scrollTop + clientHeight === scrollHeight && touchY < startY)) {
            e.preventDefault();
        }
    }, { passive: false });
}



let iosTouch = false;
function isIOS() {
			const userAgent = navigator.userAgent.toLowerCase();
			const isIOSDevice = /iphone|ipod/.test(userAgent);  // iPhone 和 iPod 檢測
			const isIPad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);  // iPad 檢測
			return isIOSDevice || isIPad;
}


function handleTouchStart(event) {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;

			if (isIOS() && !iosTouch) {
				playCurrentAudio();
				iosTouch = true;
			}

}

document.addEventListener('touchstart', handleTouchStart, false);


/*全螢幕*/

// 檢查設備類型
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 檢查是否為平板或電腦
function isTabletOrDesktop() {
  return window.innerWidth >= 768; // 假設寬度大於等於 768px 的設備為平板或電腦
}


// 進入全螢幕模式
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // Chrome, Safari 和 Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // Internet Explorer/Edge
    element.msRequestFullscreen();
  }
}


// 退出全螢幕模式
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari 和 Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // Internet Explorer/Edge
    document.msExitFullscreen();
  }
}

// 處理遊戲開始時的全螢幕模式
function handleGameStart() {
  if (isMobile() && !isTabletOrDesktop()) {
    enterFullscreen(document.documentElement);
  }
}

// 處理返回設定時的全螢幕模式
function handleReturnToSettings() {
  if (document.fullscreenElement) {
    exitFullscreen();
  }
}



window.addEventListener('orientationchange', function() {
    if (isMobile() && !isTabletOrDesktop()) {
        setTimeout(function() {
            if (document.fullscreenElement) {
                exitFullscreen();
                enterFullscreen(document.documentElement);
            }
            resizeCanvas(); // 新增：在方向變化時調用 resizeCanvas
        }, 300);
    }
});



/*音檔、音效播放*/
const rightAudio = new Audio('right.mp3');
const wrongAudio = new Audio('wrong.mp3');

// 播放音效;
function playAudio(audio) {
    audio.currentTime = 0;
    audio.play();
}

// 播放音檔;
function playCurrentAudio(times = audioPlaybackTimes) {	
    if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
        const audioFileInfo = gameData[currentQuestionIndex][headers.indexOf('音檔')];
		const playbackSpeed = audioFileInfo.toLowerCase().endsWith('.k100') ? 1.4 : 1;
        let audioUrl = getAudioUrl(audioFileInfo);

        if (audioUrl) {
            playAudioMultipleTimes(audioUrl, times, playbackSpeed)
                .catch(error => console.error('播放音頻時發生錯誤:', error));
        }
    } else {
        console.warn('沒有可用的音頻數據');
    }
}

// 取得路徑;
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
        
        // 新增的 TTS 處理邏輯
        const ttsMatch = audioFileInfo.match(/^tts\s*[:=]?\s*\(?\s*(\w+)\s*\)?$/i);
        if (ttsMatch) {
            langCode = ttsMatch[1].toLowerCase();
            text = gameData[currentQuestionIndex][headers.indexOf(langCode)];
        } else {
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
                case 'es':
                case '西':
                    langCode = 'es-ES';
                    text = gameData[currentQuestionIndex][headers.indexOf('西班牙語')];
                    break;
                case 'vi':
                case '越':
                    langCode = 'vi';
                    text = gameData[currentQuestionIndex][headers.indexOf('越南語')];
                    break;
                case 'ko':
                case '韓':
                    langCode = 'vi';
                    text = gameData[currentQuestionIndex][headers.indexOf('韓語')];
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
        }
        
        if (langCode && text) {
            return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(text)}`;
        } else {
            console.warn('無法確定語言或找不到對應的文本');
            return null;
        }
    }
}

let currentAudio = null;

// 播放多次;
function playAudioMultipleTimes(audioUrl, times, playbackSpeed = 1) {
    return new Promise((resolve, reject) => {
        // 驗證播放速度的範圍
        if (playbackSpeed <= 0) {
            reject(new Error('Playback speed must be greater than 0'));
            return;
        }

        // 如果有正在播放的音頻，停止它
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.removeEventListener('ended', currentAudio.audioEndHandler);
        }

        const audio = new Audio(audioUrl);
        currentAudio = audio; // 保存對當前音頻的引用
        
        // 設置播放速度
        audio.playbackRate = playbackSpeed;
        
        let playCount = 0;
        
        audio.audioEndHandler = function() {
            playCount++;
            if (playCount < times) {
                audio.currentTime = 0;
                audio.play().catch(reject);
            } else {
                audio.removeEventListener('ended', audio.audioEndHandler);
                currentAudio = null; // 清除當前音頻引用
                resolve();
            }
        };

        audio.addEventListener('ended', audio.audioEndHandler);
        
        audio.addEventListener('error', (e) => {
            currentAudio = null; // 發生錯誤時也要清除引用
            reject(e);
        });

        audio.play().catch((e) => {
            currentAudio = null; // 播放失敗時清除引用
            reject(e);
        });
    });
}

function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.removeEventListener('ended', currentAudio.audioEndHandler);
        currentAudio = null;
    }
}
















let script = document.createElement('script');
script.src = 'wesingmark.js';
script.type = 'text/javascript';
document.head.appendChild(script);
