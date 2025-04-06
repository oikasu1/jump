let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://oikasu1.github.io/kasuexam/kasu/fonts/twhei.css';
document.head.appendChild(link);


// 在原始檔案的開頭添加這些變數
let lastTime = 0
let deltaTime = 0



const myTitle = document.title
const htmlSettingsPage = `

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

    <!-- 新增過關條件選擇 -->
    <div>
        <label for="winConditionSelect">過關：</label>
        <select id="winConditionSelect">
            <option value="none">無限定</option>
            <option value="time" selected>限定時間</option>
            <option value="pairs">答對數量</option>
        </select>
    </div>
    
    <!-- 新增時間條件選擇 -->
    <div id="timeConditionDiv">
        <label for="timeConditionSelect">限時：</label>
        <select id="timeConditionSelect">
            <option value="30">30秒</option>
            <option value="60" selected>60秒</option>
            <option value="100">100秒</option>
            <option value="120">120秒</option>
            <option value="150">150秒</option>
            <option value="180">180秒</option>
        </select>
    </div>
    
    <!-- 新增答對數量條件選擇 -->
    <div id="pairsConditionDiv" style="display: none;">
        <label for="pairsConditionSelect">答對：</label>
        <select id="pairsConditionSelect">
            <option value="5">5個</option>
            <option value="10">10個</option>
            <option value="15">15個</option>
            <option value="20">20個</option>
            <option value="30">30個</option>
        </select>
    </div>

	<div class="button-container">
		<button id="viewButton">檢視</button>
		<button id="startButton">開始</button>
	</div>
</div>

<div id="gameContainer" style="position: relative; display: none;">
    <button id="closeButton">X</button>
    <div id="questionDisplay"></div>
    <div id="gameStats">
        <div id="timerDisplay"></div>
        <div id="scoreDisplay"></div>
    </div>
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

`

document.body.innerHTML = htmlSettingsPage

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const settingsPage = document.getElementById("settingsPage")
const lessonSelect = document.getElementById("lessonSelect")
const questionSelect = document.getElementById("questionSelect")
const answerSelect = document.getElementById("answerSelect")
const countSelect = document.getElementById("countSelect")
const startButton = document.getElementById("startButton")
const controls = document.getElementById("controls")
const questionDisplay = document.getElementById("questionDisplay")
const difficultySelect = document.getElementById("difficultySelect")
const winConditionSelect = document.getElementById("winConditionSelect")
const timeConditionSelect = document.getElementById("timeConditionSelect")
const pairsConditionSelect = document.getElementById("pairsConditionSelect")
const playbackTimesSelect = document.getElementById("playbackTimesSelect") // 宣告 playbackTimesSelect

let canvasWidth = 800
let canvasHeight = 400
let scale = 1

let gameData = []
let currentQuestionIndex = 0
let score = 0
const newPlatformConut = 0
let move = true

let totalQuestions = 0
let answeredQuestions = 0

const playerStartX = 50
const playerStartY = 100

const playerColor = "red"
const livesCount = 3
let audioPlaybackTimes = 2 // 預設播兩次;

let availableQuestions = []
let usedQuestions = []

// 新增過關條件相關變數
let winCondition = "none"
const timeLimit = 60
let requiredPairs = 5
let gameTimer = 0
let countdown = 0
let totalCorrectAnswers = 0

const totalScore = 0
const passedLevels = 0

const minWordDistance = 100 // 單詞之間的最小距離
const safeZoneRadius = 100 // 主角初始位置周圍的安全區域半徑

// 新增遊戲結束標記
let isGameEnding = false

// 解析題庫資料
const parsedData = myData
  .trim()
  .split("\n")
  .map((line) => line.split("\t"))
const headers = parsedData[0]
const dataSlice = parsedData.slice(1)
const data = Array.from(new Set(dataSlice.map(JSON.stringify)), JSON.parse) // 使用 Set 移除重複項目;

// 獲取所有分類
const categories = ["全部", ...new Set(data.map((row) => row[0]))]

// 動態生成選項
categories.forEach((category) => {
  const option = document.createElement("option")
  option.value = option.textContent = category
  lessonSelect.appendChild(option)
})

// 修改 initializeLanguageSelects 函數，確保正確初始化語言選項
function initializeLanguageSelects() {
  // 取得可用語言並過濾掉 '分類' 和 '音檔'
  const availableLanguages = headers.filter((header) => !["分類", "音檔"].includes(header))

  // 清空 questionSelect 和 answerSelect 並添加語言選項
  populateSelects(availableLanguages)

  // 添加事件監聽器，當 questionSelect 變更時更新 answerSelect
  questionSelect.addEventListener("change", () => updateAnswerSelect(availableLanguages))

  // 添加事件監聽器，當分類變更時重新載入語言選項
  lessonSelect.addEventListener("change", () => {
    // 重新初始化語言選項
    populateSelects(availableLanguages)
    // 重置題庫
    resetQuestionPool()
    // 保存設定
    saveGameSettings()
  })
}

// 填充選項到 questionSelect 和 answerSelect
function populateSelects(languages) {
  questionSelect.innerHTML = ""
  answerSelect.innerHTML = ""

  languages.forEach((lang) => {
    const option = createOption(lang)
    questionSelect.appendChild(option)
  })

  updateAnswerSelect(languages)
}

// 創建選項元素
function createOption(lang) {
  const option = document.createElement("option")
  option.value = option.textContent = lang
  return option
}

// 修改 updateAnswerSelect 函數，確保正確處理語言選擇
function updateAnswerSelect(languages) {
  const selectedQuestion = questionSelect.value
  answerSelect.innerHTML = ""

  // 確保選擇的問題語言有效
  if (!selectedQuestion || !languages.includes(selectedQuestion)) {
    console.warn("Invalid question language selected:", selectedQuestion)
    startButton.disabled = true
    return
  }

  // 從可用答案語言中過濾掉問題語言
  const availableAnswerLanguages = languages.filter((lang) => lang !== selectedQuestion)

  // 檢查是否有可用的答案語言
  if (availableAnswerLanguages.length === 0) {
    console.warn("No available answer languages")
    startButton.disabled = true
    return
  }

  // 添加所有可用的答案語言選項
  availableAnswerLanguages.forEach((lang) => {
    const option = document.createElement("option")
    option.value = option.textContent = lang
    answerSelect.appendChild(option)
  })

  // 選擇第一個選項
  answerSelect.selectedIndex = 0
  startButton.disabled = false

  // 保存設定
  saveGameSettings()
}

// 在頁面加載時初始化語言選項
document.addEventListener("DOMContentLoaded", () => {
  initializeLanguageSelects()

  // Load saved settings first
  loadGameSettings()

  // Initialize win condition selectors
  initWinConditionSelectors()
})

document.addEventListener("DOMContentLoaded", () => {
    // 修改：為檢視按鈕添加事件監聽器
    const viewButton = document.getElementById('viewButton');
    viewButton.addEventListener('click', showViewList);
})


// 添加設定變更事件監聽器
function addSettingsSaveListeners() {
  lessonSelect.addEventListener("change", saveGameSettings)
  questionSelect.addEventListener("change", saveGameSettings)
  answerSelect.addEventListener("change", saveGameSettings)
  countSelect.addEventListener("change", saveGameSettings)
  playbackTimesSelect.addEventListener("change", saveGameSettings)
  difficultySelect.addEventListener("change", saveGameSettings)
  winConditionSelect.addEventListener("change", saveGameSettings)
  timeConditionSelect.addEventListener("change", saveGameSettings)
  pairsConditionSelect.addEventListener("change", saveGameSettings)
}

// 新增：初始化過關條件選擇器
function initWinConditionSelectors() {
  const winConditionSelect = document.getElementById("winConditionSelect")
  const timeConditionDiv = document.getElementById("timeConditionDiv")
  const pairsConditionDiv = document.getElementById("pairsConditionDiv")

  // 根據初始選擇顯示對應的條件選項
  if (winConditionSelect.value === "time") {
    timeConditionDiv.style.display = "block"
    pairsConditionDiv.style.display = "none"
  } else if (winConditionSelect.value === "pairs") {
    timeConditionDiv.style.display = "none"
    pairsConditionDiv.style.display = "block"
  } else {
    timeConditionDiv.style.display = "none"
    pairsConditionDiv.style.display = "none"
  }

  // 添加變更事件監聽器
  winConditionSelect.addEventListener("change", function () {
    if (this.value === "time") {
      timeConditionDiv.style.display = "block"
      pairsConditionDiv.style.display = "none"
    } else if (this.value === "pairs") {
      timeConditionDiv.style.display = "none"
      pairsConditionDiv.style.display = "block"
    } else {
      timeConditionDiv.style.display = "none"
      pairsConditionDiv.style.display = "none"
    }
  })
}

// 驗證語言索引
// 修改 startButton 的點擊事件處理函數，添加額外的檢查
startButton.addEventListener("click", () => {
  // 確保語言選擇有效
  if (questionSelect.selectedIndex === -1 || answerSelect.selectedIndex === -1) {
    alert("請選擇有效的題目和答案語言")
    return
  }

  // 驗證語言索引
  const questionLangIndex = headers.indexOf(questionSelect.value)
  const answerLangIndex = headers.indexOf(answerSelect.value)

  if (questionLangIndex === -1 || answerLangIndex === -1) {
    alert("語言選擇無效，請重新選擇")
    // 重新初始化語言選項
    initializeLanguageSelects()
    return
  }

  // 確保有選擇分類
  const selectedCategory = lessonSelect.value
  if (!selectedCategory) {
    alert("請選擇一個分類")
    return
  }

  // 重置題庫，確保在每次開始遊戲時都有新的題目
  resetQuestionPool()

  disableTouchBehaviors()
  handleGameStart() //全螢幕

  // 選擇新題目
  selectNewQuestions()

  // 檢查是否有題目
  if (gameData.length > 0) {
    totalQuestions = gameData.length
    // 開始遊戲
    settingsPage.style.display = "none"
    document.getElementById("gameContainer").style.display = "block"
    canvas.style.display = "block"
    controls.style.display = "flex"
    // 重新初始化遊戲
    initGame()
    resizeCanvas()
    gameLoopId = requestAnimationFrame(gameLoop)
  } else {
    alert("無法生成題目，請嘗試選擇其他分類或語言")
    // 重新初始化語言選項
    initializeLanguageSelects()
  }

  iosTouch = true
})

let gameLoopId
let meteors = []
let bullets = []
let canShoot = true
const explosions = []

const player = {
  x: 50,
  y: canvasHeight / 2,
  width: 50,
  height: 30,
  speed: 5,
  lives: 5,
  maxLives: 10,
}
function shoot() {
  const difficulty = Number.parseInt(difficultySelect.value)
  if (difficulty === 0) {
    return
  }
  if (canShoot && bullets.length === 0) {
    const isPortrait = window.innerHeight > window.innerWidth
    bullets.push({
      x: player.x + player.width / 2 - 2.5, // 子彈寬度的一半
      y: isPortrait ? player.y : player.y + player.height / 2,
      width: 5,
      height: 10,
      speed: 5,
      direction: isPortrait ? "up" : "right",
    })
    canShoot = false
  }
}
// 修改 updateBullets 函數，添加遊戲結束檢查
function updateBullets() {
  // 如果遊戲已結束，不更新子彈位置
  if (isGameEnding) return

  const isPortrait = window.innerHeight > window.innerWidth
  const adjustedSpeed = 5 * deltaTime * 60 // 標準化為60FPS的速度

  bullets = bullets.filter((bullet) => (isPortrait ? bullet.y > 0 : bullet.x < canvasWidth))
  bullets.forEach((bullet) => {
    if (bullet.direction === "up") {
      bullet.y -= adjustedSpeed
    } else {
      bullet.x += adjustedSpeed
    }
  })
  if (bullets.length === 0) {
    canShoot = true
  }
}
function drawBullets() {
  ctx.fillStyle = "yellow"
  bullets.forEach((bullet) => {
    if (bullet.direction === "up") {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    } else {
      ctx.fillRect(bullet.x, bullet.y, bullet.height, bullet.width)
    }
  })
}

// 新增：敵人物件
const enemy = {
  x: canvasWidth - 100,
  y: canvasHeight / 2,
  width: 50,
  height: 30,
  color: "black",
  bullets: [],
  lastShootTime: 0,
}

// 新增：敵人子彈物件
class EnemyBullet {
  constructor(x, y, targetX, targetY) {
    const isPortrait = window.innerHeight > window.innerWidth

    // 先設定子彈大小和速度
    this.width = 10
    this.height = 5
    this.speed = 3

    // 設定子彈起始位置
    if (isPortrait) {
      // 直向模式
      this.x = x - this.width / 2 // 從敵人中心發射
      this.y = enemy.y + enemy.height // 從敵人底部發射
    } else {
      // 橫向模式
      this.x = enemy.x // 從敵人左側發射
      this.y = enemy.y + enemy.height / 2 - this.height / 2 // 從敵人垂直中心發射
    }

    if (Number.parseInt(difficultySelect.value) === 2) {
      // 難度2時，計算子彈飛行角度
      const angle = Math.atan2(targetY - y, targetX - x)
      this.dx = Math.cos(angle) * this.speed
      this.dy = Math.sin(angle) * this.speed
    } else {
      // 難度1時維持直線移動
      if (isPortrait) {
        this.dx = 0
        this.dy = this.speed
      } else {
        this.dx = -this.speed // 往左移動
        this.dy = 0
      }
    }
  }

  update() {
    // 這個方法將在 updateEnemyBullets 中被重寫，不再使用
    this.x += this.dx
    this.y += this.dy
  }
}

// 新增：繪製敵人
function drawEnemy() {
  if (Number.parseInt(difficultySelect.value) === 1 || Number.parseInt(difficultySelect.value) === 2) {
    ctx.fillStyle = enemy.color
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  }
}

// 新增：敵人射擊函數
function enemyShoot() {
  const currentTime = Date.now()
  const difficulty = Number.parseInt(difficultySelect.value)
  const isPortrait = window.innerHeight > window.innerWidth

  // 根據難度設定不同的發射間隔
  const shootInterval = difficulty === 1 ? 3500 : 2500 // 難度1為3秒，難度2為2秒

  if ((difficulty === 1 || difficulty === 2) && currentTime - enemy.lastShootTime > shootInterval) {
    const bullet = new EnemyBullet(
      enemy.x + enemy.width / 2,
      isPortrait ? enemy.y + enemy.height : enemy.y + enemy.height / 2,
      player.x + player.width / 2,
      player.y + player.height / 2,
    )
    enemy.bullets.push(bullet)
    enemy.lastShootTime = currentTime
  }
}

// 修改 updateEnemyBullets 函數，添加遊戲結束檢查
function updateEnemyBullets() {
  // 如果遊戲已結束，不更新敵人子彈位置
  if (isGameEnding) return

  const isPortrait = window.innerHeight > window.innerWidth
  const isMobileScreen = window.innerWidth < 768 // 判斷是否為手機較小視窗

  // 移除超出畫面的子彈
  enemy.bullets = enemy.bullets.filter((bullet) => {
    if (isPortrait) {
      return bullet.y < canvasHeight
    } else {
      return bullet.x > 0
    }
  })

  // 更新子彈位置，使用 deltaTime 調整速度
  enemy.bullets.forEach((bullet) => {
    // 調整子彈速度
    let speedMultiplier = deltaTime * 60

    // 如果是手機較小視窗，速度乘以0.91
    if (isMobileScreen) {
      speedMultiplier *= 0.91
    }

    // 直接更新位置，而不是修改 dx 和 dy
    if (isPortrait) {
      if (Number.parseInt(difficultySelect.value) === 2) {
        // 難度2時，保持原有的角度移動
        bullet.x += bullet.dx * speedMultiplier
        bullet.y += bullet.dy * speedMultiplier
      } else {
        // 難度1時，直線向下移動
        bullet.y += bullet.speed * speedMultiplier
      }
    } else {
      if (Number.parseInt(difficultySelect.value) === 2) {
        // 難度2時，保持原有的角度移動
        bullet.x += bullet.dx * speedMultiplier
        bullet.y += bullet.dy * speedMultiplier
      } else {
        // 難度1時，直線向左移動
        bullet.x -= bullet.speed * speedMultiplier
      }
    }
  })
}

// 新增：繪製敵人子彈
function drawEnemyBullets() {
  const difficulty = Number.parseInt(difficultySelect.value)
  const isPortrait = window.innerHeight > window.innerWidth

  enemy.bullets.forEach((bullet) => {
    ctx.save() // 保存當前畫布狀態
    if (difficulty === 2) {
      // 計算子彈的旋轉角度
      const angle = Math.atan2(bullet.dy, bullet.dx)
      // 移動到子彈位置並旋轉
      ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2)
      ctx.rotate(angle)
      ctx.translate(-bullet.width / 2, -bullet.height / 2)
    } else if (isPortrait) {
      // 直式螢幕時，旋轉子彈90度
      ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2)
      ctx.rotate(Math.PI / 2)
      ctx.translate(-bullet.height / 2, -bullet.width / 2)
    } else {
      // 橫式螢幕時
      ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2)
      ctx.translate(-bullet.height / 2, -bullet.width / 2)
    }

    // 繪製子彈
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, bullet.width, bullet.height)

    ctx.restore() // 恢復畫布狀態
  })
}

// 新增：檢查敵人子彈與玩家的碰撞
function checkEnemyBulletCollisions() {
  enemy.bullets.forEach((bullet, index) => {
    if (checkCollision(bullet, player)) {
      enemy.bullets.splice(index, 1)
      player.lives--
      createExplosion(player.x + player.width / 2, player.y + player.height / 2)
      if (!isGameEnding) {
        playAudio(wrongAudio)
      }
      if (player.lives <= 0) {
        endGame()
      }
    }
  })
}

// 隕石(語詞)系統
// 修改 generateMeteors 函數，使正確答案位置隨機化
function generateMeteors() {
  meteors = []
  const [questionLangIndex, answerLangIndex] = [
    headers.indexOf(questionSelect.value),
    headers.indexOf(answerSelect.value),
  ]
  const selectedCategory = lessonSelect.value
  const totalMeteors = Number.parseInt(countSelect.value)
  const isPortrait = window.innerHeight > window.innerWidth
  const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isMobileScreen = window.innerWidth < 768 // 判斷是否為手機較小視窗

  // 取得分類的所有可能答案，排除正確答案
  const correctAnswer = gameData[currentQuestionIndex][answerLangIndex]
  const categoryAnswers =
    selectedCategory === "全部"
      ? data.map((row) => row[answerLangIndex])
      : data.filter((row) => row[0] === selectedCategory).map((row) => row[answerLangIndex])
  const availableAnswers = categoryAnswers.filter((answer) => answer !== correctAnswer)

  // 定義方塊大小和間距
  const meteorWidth = 40
  const meteorHeight = 40
  const minDistance = isPortrait ? 60 : 80 // 方塊之間的最小距離，橫式視窗給更多空間

  // 已放置的方塊位置
  const placedPositions = []

  // 生成隕石參數的通用函數
  const createMeteor = (text, isCorrect, id, position) => {
    // 基本速度設定
    let baseSpeed = isMobileOrTablet ? Math.random() * 0.4 + 0.7 : Math.random() * 0.6 + 0.9

    // 如果是手機較小視窗，速度乘以0.91
    if (isMobileScreen) {
      baseSpeed *= 0.91
    }

    return {
      x: position.x,
      y: position.y,
      width: meteorWidth,
      height: meteorHeight,
      speed: baseSpeed,
      text,
      collected: false,
      isCorrect,
      id,
    }
  }

  // 檢查新位置是否與已放置的方塊重疊
  const isOverlapping = (newX, newY) => {
    for (const pos of placedPositions) {
      const distance = Math.sqrt(Math.pow(newX - pos.x, 2) + Math.pow(newY - pos.y, 2))
      if (distance < minDistance) {
        return true
      }
    }
    return false
  }

  // 生成不重疊的位置
  const generateNonOverlappingPosition = () => {
    let x, y
    let attempts = 0
    const maxAttempts = 50

    if (isPortrait) {
      // 直式視窗：水平分散，垂直位置在頂部
      const availableWidth = canvasWidth - meteorWidth
      const sectionWidth = availableWidth / totalMeteors

      do {
        // 在每個區段內隨機生成位置
        const sectionIndex = placedPositions.length
        x = sectionIndex * sectionWidth + Math.random() * (sectionWidth - meteorWidth)
        y = -meteorHeight - Math.random() * 50 // 從畫面上方開始
        attempts++
      } while (isOverlapping(x, y) && attempts < maxAttempts)
    } else {
      // 橫式視窗：垂直分散，水平位置在右側
      const availableHeight = canvasHeight - meteorHeight
      const sectionHeight = availableHeight / totalMeteors

      do {
        // 在每個區段內隨機生成位置
        const sectionIndex = placedPositions.length
        x = canvasWidth + Math.random() * 50 // 從畫面右側開始
        y = sectionIndex * sectionHeight + Math.random() * (sectionHeight - meteorHeight)
        attempts++
      } while (isOverlapping(x, y) && attempts < maxAttempts)
    }

    return { x, y }
  }

  // 先生成所有隕石的位置
  const allPositions = []
  for (let i = 0; i < totalMeteors; i++) {
    const position = generateNonOverlappingPosition()
    placedPositions.push(position)
    allPositions.push(position)
  }

  // 隨機選擇一個位置放置正確答案
  const correctAnswerIndex = Math.floor(Math.random() * totalMeteors)
  meteors.push(createMeteor(correctAnswer, true, "meteor-correct", allPositions[correctAnswerIndex]))

  // 隨機選取錯誤答案隕石，放置在剩餘的位置
  const remainingPositions = [...allPositions]
  remainingPositions.splice(correctAnswerIndex, 1) // 移除已用於正確答案的位置

  for (let i = 0; i < totalMeteors - 1 && availableAnswers.length > 0; i++) {
    const wrongAnswer = availableAnswers.splice(Math.floor(Math.random() * availableAnswers.length), 1)[0]
    meteors.push(createMeteor(wrongAnswer, false, `meteor-wrong-${i}`, remainingPositions[i]))
  }
}

// 修改 updateMeteors 函數，添加遊戲結束檢查並修正邊界判斷
function updateMeteors() {
  // 如果遊戲已結束，不更新方塊位置
  if (isGameEnding) return

  let allMeteorsOffScreen = true
  let correctAnswerOffScreen = false
  const isPortrait = window.innerHeight > window.innerWidth
  const isMobileScreen = window.innerWidth < 768 // 判斷是否為手機較小視窗

  // 用於標記需要移除的錯誤方塊
  const meteorsToRemove = []

  meteors.forEach((meteor, index) => {
    if (!meteor.collected) {
      // 使用 deltaTime 調整隕石速度
      let adjustedSpeed = meteor.speed * deltaTime * 60 // 標準化為60FPS的速度

      // 如果是手機較小視窗，速度乘以0.91
      if (isMobileScreen) {
        adjustedSpeed *= 0.91
      }

      if (isPortrait) {
        meteor.y += adjustedSpeed

        // 檢查方塊是否仍在畫面內
        if (meteor.y < canvasHeight) {
          // 方塊仍在畫面內
          allMeteorsOffScreen = false

          // 檢查錯誤方塊是否碰到底部邊緣
          if (!meteor.isCorrect && meteor.y + meteor.height >= canvasHeight) {
            // 錯誤方塊碰到底部邊緣，標記為移除（不扣分）
            meteorsToRemove.push(index)
          }
        }

        // 檢查正確答案是否碰到底部邊緣
        if (meteor.isCorrect && meteor.y >= canvasHeight) {
          // 正確方塊頂部碰到底部邊緣，標記為超出畫面（扣分）
          correctAnswerOffScreen = true
        }
      } else {
        // 橫式模式邏輯保持不變
        meteor.x -= adjustedSpeed
        if (meteor.x + meteor.width > 0) {
          allMeteorsOffScreen = false
        }

        // 檢查錯誤方塊是否碰到左邊緣
        if (!meteor.isCorrect && meteor.x + meteor.width <= 0) {
          meteorsToRemove.push(index)
        }

        // 檢查正確方塊是否碰到左邊緣
        if (meteor.isCorrect && meteor.x + meteor.width <= 0) {
          correctAnswerOffScreen = true
        }
      }
    }
  })

  // 從後往前移除錯誤方塊（不扣分）
  for (let i = meteorsToRemove.length - 1; i >= 0; i--) {
    const index = meteorsToRemove[i]
    // 創建爆炸效果
    createExplosion(meteors[index].x + meteors[index].width / 2, meteors[index].y + meteors[index].height / 2)
    // 標記為已收集
    meteors[index].collected = true
  }

  // 處理正確方塊超出畫面或所有方塊都超出畫面的情況
  if (correctAnswerOffScreen || allMeteorsOffScreen) {
    player.lives--
    if (player.lives <= 0) {
      endGame()
    } else {
      // 生成新的問題和隕石
      currentQuestionIndex++
      if (currentQuestionIndex < totalQuestions) {
        updateQuestionDisplay()
        playCurrentAudio()
        generateMeteors()
      } else {
        endGame()
      }
    }
  }
}

function drawMeteors() {
  // 先清除所有現有的文字標籤
  const existingLabels = document.querySelectorAll(".meteor-label")
  existingLabels.forEach((label) => label.remove())

  meteors.forEach((meteor) => {
    if (!meteor.collected) {
      // 繪製隕石方塊
      if (meteor.hitTime && Date.now() - meteor.hitTime < 200) {
        ctx.fillStyle = "red" // 被射中時短暫變紅
      } else {
        ctx.fillStyle = "brown"
      }
      ctx.fillRect(meteor.x, meteor.y, meteor.width, meteor.height)

      // 創建文字標籤
      const label = document.createElement("div")
      label.className = "meteor-label"
      label.innerHTML = meteor.text
      label.style.position = "absolute"
      label.style.left = `${(meteor.x + meteor.width / 2) * scale}px`
      label.style.top = `${(meteor.y + meteor.height / 2) * scale}px`
      label.style.transform = "translate(-50%, -50%)"
      label.style.color = "white"
      label.style.fontSize = "22px"
      label.style.pointerEvents = "none" // 防止標籤干擾點擊事件
      label.style.zIndex = "1000"
      document.getElementById("gameContainer").appendChild(label)
    }
  })
}

// 碰撞檢測
function checkBulletCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    meteors.forEach((meteor) => {
      if (!meteor.collected && checkCollision(bullet, meteor)) {
        bullets.splice(bulletIndex, 1)
        handleMeteorHit(meteor) // 抽出共用的處理邏輯
      }
    })
  })
}

// 新增玩家與隕石的碰撞檢測
function checkPlayerMeteorCollisions() {
  meteors.forEach((meteor) => {
    if (!meteor.collected && checkCollision(player, meteor)) {
      handleMeteorHit(meteor) // 使用相同的處理邏輯
    }
  })
}

// 抽出共用的處理邏輯
function handleMeteorHit(meteor) {
  if (meteor.isCorrect) {
    // 正確答案
    score++
    answeredQuestions++
    totalCorrectAnswers++ // 新增：累計正確答案數
    meteors.forEach((m) => {
      m.collected = true
      createExplosion(m.x + m.width / 2, m.y + m.height / 2)
    })

    // 檢查是否達到答對數量條件
    if (winCondition === "pairs" && totalCorrectAnswers >= requiredPairs) {
      endGame("pairs")
      return
    }

    if (currentQuestionIndex >= totalQuestions - 1) {
      selectNewQuestions()
      currentQuestionIndex = 0
    } else {
      currentQuestionIndex++
    }
    updateQuestionDisplay()
    playCurrentAudio()
    generateMeteors()
  } else {
    // 錯誤答案
    player.lives--
    playAudio(wrongAudio)
    createExplosion(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2)
    meteor.hitTime = Date.now()
    meteor.collected = true
    if (player.lives <= 0) {
      endGame()
    }
  }
}

// 通用的碰撞檢測函數保持不變
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  )
}

let words = []

// 修改 generateWords 函數，不再生成與問題相關的文字
function generateWords() {
  words = []
  // 不再需要生成與問題相關的文字，因為已經在 questionDisplay 中顯示了
  // 這裡可以留空或者添加其他功能
}

// 修改 updateWordLabels 函數，避免重複顯示題目文字
function updateWordLabels() {
  const labelsContainer = document.getElementById("wordLabels")
  labelsContainer.innerHTML = ""
  const canvasRect = canvas.getBoundingClientRect()
  const canvasCenterX = canvasRect.left + canvasRect.width / 2

  words.forEach((word) => {
    if (!word.collected) {
      const label = document.createElement("div")
      label.className = "word-label"
      label.id = word.id
      label.innerHTML = word.text // 文字可HTML

      // 計算標籤的精確位置
      const scaledWordX = word.x * scale
      const scaledWordY = word.y * scale

      // 決定標籤在方塊的左側還是右側
      const wordCenterX = canvasRect.left + scaledWordX + (word.width * scale) / 2
      const labelOnRight = wordCenterX < canvasCenterX

      // 設置標籤位置
      const labelX = labelOnRight ? scaledWordX + word.width * scale + 5 : scaledWordX - 5

      label.style.left = `${canvasRect.left + labelX}px`
      label.style.top = `${canvasRect.top + scaledWordY + (word.height * scale) / 2}px`

      // 設置文本對齊方式
      label.style.textAlign = labelOnRight ? "left" : "right"
      label.style.transform = labelOnRight ? "translate(0, -50%)" : "translate(-100%, -50%)"

      labelsContainer.appendChild(label)
    }
  })
}

function resizeCanvas() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const isPortrait = windowHeight > windowWidth

  if (isPortrait) {
    // 直式模式
    canvasWidth = 400
    canvasHeight = 600
  } else {
    // 橫式模式
    canvasWidth = 800
    canvasHeight = 400
  }

  if (windowWidth / windowHeight < canvasWidth / canvasHeight) {
    scale = windowWidth / canvasWidth
  } else {
    scale = windowHeight / canvasHeight
  }

  canvas.width = Math.floor(canvasWidth * scale)
  canvas.height = Math.floor(canvasHeight * scale)
  ctx.scale(scale, scale)

  if (isPortrait) {
    // 直式模式
    canvasWidth = 400
    canvasHeight = 600
    player.width = 30
    player.height = 50
    enemy.width = 30
    enemy.height = 50
    player.x = canvasWidth / 2 - player.width / 2
    player.y = canvasHeight - player.height - 10
    enemy.x = canvasWidth / 2 - enemy.width / 2
    enemy.y = 10
  } else {
    // 橫式模式
    canvasWidth = 800
    canvasHeight = 400
    player.width = 50
    player.height = 30
    enemy.width = 50
    enemy.height = 30
    player.x = playerStartX
    player.y = playerStartY
    enemy.x = canvasWidth - 100
    enemy.y = canvasHeight / 2
  }

  // 調整設定頁面
  const settingsPage = document.getElementById("settingsPage")
  if (isPortrait) {
    settingsPage.style.height = "auto"
    settingsPage.style.overflowY = "visible"
  } else {
    settingsPage.style.height = "90vh"
    settingsPage.style.overflowY = "auto"
    settingsPage.style.webkitOverflowScrolling = "touch" // 新增：增強 iOS 滾動體驗
  }

  // 設置計時器和得分的樣式
  const gameStats = document.getElementById("gameStats")
  if (gameStats) {
    gameStats.style.position = "absolute"
    gameStats.style.top = "40px" // 紅色方塊下方
    gameStats.style.right = "25px"
    gameStats.style.textAlign = "right"
    gameStats.style.fontSize = "14px"
    gameStats.style.color = "white"
    gameStats.style.textShadow = "1px 1px 2px black"
    gameStats.style.zIndex = "1000"
  }
}

difficultySelect.addEventListener("change", function () {
  const shootBtn = document.getElementById("shootBtn")
  const difficulty = Number.parseInt(this.value)
  shootBtn.style.display = difficulty === 0 ? "none" : "block"
})

function initGame() {
  // 重置遊戲結束標記
  isGameEnding = false

  move = true
  resizeCanvas()
  player.x = playerStartX
  player.y = playerStartY
  player.moveLeft = false
  player.moveRight = false
  player.lives = livesCount
  currentQuestionIndex = 0
  score = 0
  answeredQuestions = 0

  // 重置時間相關變數
  lastTime = 0
  deltaTime = 0

  // 設定過關條件
  winCondition = winConditionSelect.value
  if (winCondition === "time") {
    countdown = Number.parseInt(timeConditionSelect.value)
    gameTimer = 0
  } else if (winCondition === "pairs") {
    requiredPairs = Number.parseInt(pairsConditionSelect.value)
    gameTimer = 0
    // 如果是新遊戲，重置正確答案計數
    if (totalCorrectAnswers >= requiredPairs || totalCorrectAnswers === 0) {
      totalCorrectAnswers = 0
    }
  } else {
    // 無限定模式
    gameTimer = 0
  }

  const difficultySelect = document.getElementById("difficultySelect")
  const difficulty = Number.parseInt(difficultySelect.value)
  // 根據難度控制射擊按鈕顯示
  const shootBtn = document.getElementById("shootBtn")
  shootBtn.style.display = difficulty === 0 ? "none" : "block"

  const isPortrait = window.innerHeight > window.innerWidth

  if (isPortrait) {
    player.width = 30
    player.height = 50
    enemy.width = 30
    enemy.height = 50
    player.x = canvasWidth / 2 - player.width / 2
    player.y = canvasHeight - player.height - 10
    enemy.x = canvasWidth / 2 - enemy.width / 2
    enemy.y = 10
  } else {
    player.width = 50
    player.height = 30
    enemy.width = 50
    enemy.height = 30
    player.x = playerStartX
    player.y = playerStartY
    enemy.x = canvasWidth - 100
    enemy.y = canvasHeight / 2
  }

  // 重新選擇題目
  selectNewQuestions()
  if (gameData.length > 0) {
    updateQuestionDisplay()
    playCurrentAudio()
    generateMeteors()
  }
  const playbackTimesSelect = document.getElementById("playbackTimesSelect")
  playbackTimesSelect.addEventListener("change", (e) => {
    audioPlaybackTimes = Number.parseInt(e.target.value)
  })

  // 移除對 generateWords 和 updateWordLabels 的調用
  // generateWords()
  // updateWordLabels()

  updateControlsPosition()
  handleSettingsTouch()
  // 重置敵人狀態
  enemy.bullets = []
  enemy.lastShootTime = 0

  // 更新時間顯示
  updateTimeDisplay()
}

function updateQuestionDisplay() {
  playAudio(rightAudio)
  if (gameData.length > 0) {
    // if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
    const questionLangIndex = headers.indexOf(questionSelect.value)
    questionDisplay.textContent = "🥷 " + gameData[currentQuestionIndex][questionLangIndex]
  } else {
  }
}

// 修改 selectNewQuestions 函數，添加額外的檢查
function selectNewQuestions() {
  const selectedCategory = lessonSelect.value
  const count = Number.parseInt(countSelect.value)

  // Get the indices for question and answer languages
  const questionLangIndex = headers.indexOf(questionSelect.value)
  const answerLangIndex = headers.indexOf(answerSelect.value)


  // If there aren't enough available questions, reset the question pool
  if (availableQuestions.length < count) {
    availableQuestions = [...usedQuestions, ...availableQuestions]
    usedQuestions = []
  }

  // Filter questions based on selected category
  const filteredData =
    selectedCategory === "全部"
      ? [...availableQuestions]
      : availableQuestions.filter((row) => row[0] === selectedCategory)

  // Ensure we have enough questions
  if (filteredData.length === 0) {
    console.warn("No questions available for the selected category")
    gameData = []
    return
  }

  gameData = []
  const usedAnswers = new Set() // Track already selected answers
  let attempts = 0
  const maxAttempts = 100 // Prevent infinite loops

  // Try to select unique questions
  while (gameData.length < count && filteredData.length > 0 && attempts < maxAttempts) {
    attempts++

    // Select a random question
    const index = Math.floor(Math.random() * filteredData.length)
    const selectedQuestion = filteredData[index]

    // Validate the selected question
    if (!selectedQuestion || selectedQuestion.length <= answerLangIndex || !selectedQuestion[answerLangIndex]) {
      // Remove invalid question and continue
      filteredData.splice(index, 1)
      continue
    }

    const answer = selectedQuestion[answerLangIndex]

    // Check if the answer is already used
    if (!usedAnswers.has(answer)) {
      gameData.push(selectedQuestion)
      usedAnswers.add(answer)
      usedQuestions.push(selectedQuestion)

      // Remove the selected question from available questions and filtered data
      availableQuestions = availableQuestions.filter((q) => q !== selectedQuestion)
      filteredData.splice(index, 1)
    } else {
      // If the answer already exists, just remove it from filtered data
      filteredData.splice(index, 1)
    }
  }

  totalQuestions = gameData.length

  // Log warning if we couldn't generate enough questions
  if (gameData.length < count) {
    console.warn(`Only generated ${gameData.length} questions, fewer than requested ${count}`)
  }

  // If no questions were generated, log an error
  if (gameData.length === 0) {
    console.error("Failed to generate any questions")
  }
}

function drawPlayer() {
  ctx.fillStyle = "blue"
  ctx.fillRect(player.x, player.y, player.width, player.height)
}

function drawLives() {
  const blockSize = 15
  const gap = 5
  ctx.fillStyle = "red"
  const rightMargin = 10

  for (let i = 0; i < player.lives; i++) {
    const x = canvasWidth - rightMargin - (player.lives - i) * (blockSize + gap)
    ctx.fillRect(x, 10, blockSize, blockSize)
  }
}

// 繪製單詞方塊
function drawWords() {
  ctx.fillStyle = "blue"
  words.forEach((word) => {
    if (!word.collected) {
      ctx.fillRect(word.x, word.y, word.width, word.height)
      ctx.fillStyle = "white"
      ctx.fillRect(word.x, word.y, word.width, 10) // 白色線
      ctx.fillStyle = "green"
      ctx.fillRect(word.x, word.y, word.width, 8) // 綠色線
      // 重置填充顏色為藍色，為下一個單詞做準備
      ctx.fillStyle = "blue"
    }
  })
}

// 修改 update 函數，添加遊戲結束檢查
function update() {
  // 如果遊戲已結束，不更新遊戲狀態
  if (isGameEnding) return

  // 使用 deltaTime 調整移動速度
  const adjustedSpeed = player.speed * deltaTime * 60 // 標準化為60FPS的速度

  if (player.moveUp && player.y > 0) player.y -= adjustedSpeed
  if (player.moveDown && player.y < canvasHeight - player.height) player.y += adjustedSpeed
  if (player.moveLeft && player.x > 0) player.x -= adjustedSpeed
  if (player.moveRight && player.x < canvasWidth - player.width) player.x += adjustedSpeed

  const isPortrait = window.innerHeight > window.innerWidth

  if (isPortrait) {
    player.width = 30
    player.height = 50
    enemy.width = 30
    enemy.height = 50
  } else {
    player.width = 50
    player.height = 30
    enemy.width = 50
    enemy.height = 30
  }

  // 更新敵人位置
  if (isPortrait) {
    enemy.x = canvasWidth / 2 - enemy.width / 2
    enemy.y = 10 // 保持在上方
  } else {
    enemy.x = canvasWidth - 100
    enemy.y = canvasHeight / 2
  }

  updateBullets()
  updateMeteors()

  // 更新敵人相關邏輯
  const difficulty = Number.parseInt(difficultySelect.value)
  if (difficulty === 1 || difficulty === 2) {
    enemyShoot()
    updateEnemyBullets()
    checkEnemyBulletCollisions()
  }

  checkBulletCollisions()
  checkPlayerMeteorCollisions()

  // 更新遊戲時間和過關條件檢查
  updateGameTime()
}

// 新增：更新遊戲時間和過關條件檢查
function updateGameTime() {
  // 更新時間
  if (winCondition === "time") {
    countdown -= deltaTime
    if (countdown <= 0) {
      endGame("timeout")
    }
  } else {
    // 無限定模式或答對數量模式都需要計時
    gameTimer += deltaTime
  }

  // 更新時間顯示
  updateTimeDisplay()
}

// 修改 updateTimeDisplay 函數，將計時器和得分顯示在右上角
function updateTimeDisplay() {
  const timerDisplay = document.getElementById("timerDisplay")
  const scoreDisplay = document.getElementById("scoreDisplay")
  const questionDisplay = document.getElementById("questionDisplay")

  if (!timerDisplay || !scoreDisplay || !questionDisplay) return

  // 更新問題顯示
  if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
    const questionLangIndex = headers.indexOf(questionSelect.value)
    questionDisplay.textContent = "🥷 " + gameData[currentQuestionIndex][questionLangIndex]
  }

  // 更新計時器顯示
  let timeText = ""
  if (winCondition === "time") {
    // 倒數計時
    const minutes = Math.floor(countdown / 60)
    const seconds = Math.floor(countdown % 60)
    timeText = `⏱️ ${minutes}:${seconds.toString().padStart(2, "0")}`
  } else {
    // 正常計時
    const minutes = Math.floor(gameTimer / 60)
    const seconds = Math.floor(gameTimer % 60)
    timeText = `⏱️ ${minutes}:${seconds.toString().padStart(2, "0")}`
  }
  timerDisplay.textContent = timeText

  // 更新得分顯示
  let scoreText = `✨ 得分: ${score}`

  // 添加答對數量顯示（如果是答對數量模式）
  if (winCondition === "pairs") {
    scoreText += ` | 🎯 ${totalCorrectAnswers}/${requiredPairs}`
  }

  scoreDisplay.textContent = scoreText
}

function createExplosion(x, y) {
  explosions.push({
    x: x,
    y: y,
    radius: 0,
    maxRadius: 30,
    speed: 2,
  })
}

// 修改 createExplosion 函數中的爆炸動畫
function drawExplosions() {
  explosions.forEach((explosion, index) => {
    ctx.beginPath()
    ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255, 165, 0, " + (1 - explosion.radius / explosion.maxRadius) + ")"
    ctx.fill()

    // 使用 deltaTime 調整爆炸動畫速度
    explosion.radius += explosion.speed * deltaTime * 60
    if (explosion.radius > explosion.maxRadius) {
      explosions.splice(index, 1)
    }
  })
}

// 修改 gameLoop 函數，移除對 updateWordLabels 的調用
function gameLoop(timestamp) {
  // 計算時間差 (delta time)
  if (!lastTime) lastTime = timestamp
  deltaTime = (timestamp - lastTime) / 1000 // 轉換為秒
  lastTime = timestamp

  // 限制 deltaTime 的最大值，防止在切換標籤或設備休眠後出現大跳躍
  if (deltaTime > 0.1) deltaTime = 0.1

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  update()
  updateBullets()
  drawPlayer()
  drawMeteors()
  drawBullets()

  // 繪製敵人相關元素
  if (Number.parseInt(difficultySelect.value) === 1 || Number.parseInt(difficultySelect.value) === 2) {
    drawEnemy()
    drawEnemyBullets()
  }

  drawLives()
  drawExplosions()
  // 移除對 updateWordLabels 的調用
  // updateWordLabels()
  gameLoopId = requestAnimationFrame(gameLoop)
}

document.addEventListener("keydown", (e) => {
  if (move) {
    switch (e.key) {
      case "ArrowLeft":
        player.moveLeft = true
        break
      case "ArrowRight":
        player.moveRight = true
        break
      case "ArrowUp":
        player.moveUp = true
        break
      case "ArrowDown":
        player.moveDown = true
        break
      case " ":
        if (Number.parseInt(difficultySelect.value) !== 0) {
          shoot()
        }
        break
    }
  }
})

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      player.moveLeft = false
      break
    case "ArrowRight":
      player.moveRight = false
      break
    case "ArrowUp":
      player.moveUp = false
      break
    case "ArrowDown":
      player.moveDown = false
      break
  }
})

const upBtn = document.getElementById("upBtn")
const downBtn = document.getElementById("downBtn")
const leftBtn = document.getElementById("leftBtn")
const rightBtn = document.getElementById("rightBtn")
const shootBtn = document.getElementById("shootBtn")

// 移動控制
upBtn.addEventListener("touchstart", (e) => {
  if (move) {
    e.preventDefault()
    player.moveUp = true
  }
})

upBtn.addEventListener("touchend", (e) => {
  e.preventDefault()
  player.moveUp = false
})

downBtn.addEventListener("touchstart", (e) => {
  if (move) {
    e.preventDefault()
    player.moveDown = true
  }
})

downBtn.addEventListener("touchend", (e) => {
  e.preventDefault()
  player.moveDown = false
})

leftBtn.addEventListener("touchstart", (e) => {
  if (move) {
    e.preventDefault()
    player.moveLeft = true
  }
})

leftBtn.addEventListener("touchend", (e) => {
  e.preventDefault()
  player.moveLeft = false
})

rightBtn.addEventListener("touchstart", (e) => {
  if (move) {
    e.preventDefault()
    player.moveRight = true
  }
})

rightBtn.addEventListener("touchend", (e) => {
  e.preventDefault()
  player.moveRight = false
})

// 射擊控制
shootBtn.addEventListener("touchstart", (e) => {
  if (move) {
    e.preventDefault()
    // 新增難度檢查
    if (Number.parseInt(difficultySelect.value) !== 0) {
      shoot()
    }
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && document.getElementById("gameEndModal").style.display === "block") {
    event.preventDefault() // 防止表單提交或其他默認行為
    document.getElementById("continueButton").click()
  }
})

function updateControlsPosition() {
  const controls = document.getElementById("controls")
  const isLandscape = window.innerWidth > window.innerHeight
  const bottomPadding = isLandscape ? "50px" : "10px"
  controls.style.bottom = bottomPadding
}

document.getElementById("closeButton").addEventListener("click", returnToSettings)

// 修改：遊戲結束模態框顯示
function showGameEndModal(reason) {
  const modal = document.getElementById("gameEndModal")
  const messageElement = document.getElementById("gameEndMessage")
  const continueButton = document.getElementById("continueButton")
  let message = ""

  switch (reason) {
    case "timeout":
      message = `
        <h2>⏱️ 時間到！</h2>
        <p>✨您這次獲得 ${score} 分</p>
        <p>🎯答對題數：${answeredQuestions} 題</p>
        <p>⏱️遊戲時間：${formatTime(Number.parseInt(timeConditionSelect.value))}</p>
      `
      continueButton.textContent = "重新開始🔄"
      break
    case "pairs":
      message = `
        <h2>🎯 達成目標！</h2>
        <p>✨您這次獲得 ${score} 分</p>
        <p>🎯答對題數：${totalCorrectAnswers} 題</p>
        <p>⏱️遊戲時間：${formatTime(Math.floor(gameTimer))}</p>
      `
      continueButton.textContent = "重新開始🔄"
      break
    case "complete":
      message = `
        <h2>🎮 遊戲完成</h2>
        <p>✨您這次獲得 ${score} 分</p>
        <p>🎯答對題數：${answeredQuestions} 題</p>
        <p>⏱️遊戲時間：${formatTime(Math.floor(gameTimer))}</p>
      `
      continueButton.textContent = "繼續遊戲➡️"
      break
    default:
      message = `
        <h2>遊戲結束</h2>
        <p>✨您這次獲得 ${score} 分</p>
        <p>🎯答對題數：${answeredQuestions} 題</p>
      `
      continueButton.textContent = "重新開始🔄"
  }

  messageElement.innerHTML = message
  modal.style.display = "block"
  continueButton.focus()
}

// 新增：格式化時間顯示
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

function hideGameEndModal() {
  const modal = document.getElementById("gameEndModal")
  modal.style.display = "none"
}

// 修改：遊戲結束函數
function endGame(reason = "default") {
  if (isGameEnding) return
  isGameEnding = true

  move = false
  enableTouchBehaviors()
  stopCurrentAudio()

  // 根據不同的結束原因顯示不同的結果
  showGameEndModal(reason)
}

// 修改：繼續按鈕事件處理
document.getElementById("continueButton").addEventListener("click", () => {
  hideGameEndModal()

  // 根據過關條件決定是否重置遊戲
  if (winCondition === "time" && countdown <= 0) {
    // 時間到，重置遊戲
    score = 0
    answeredQuestions = 0
    countdown = Number.parseInt(timeConditionSelect.value)
  } else if (winCondition === "pairs" && totalCorrectAnswers >= requiredPairs) {
    // 達到答對數量，重置遊戲
    score = 0
    answeredQuestions = 0
    totalCorrectAnswers = 0
  }

  isGameEnding = false
  initGame()
})

document.getElementById("returnButton").addEventListener("click", () => {
  handleReturnToSettings() // 退出全螢幕
  hideGameEndModal()
  returnToSettings()
  // 重置分數
  score = 0
  answeredQuestions = 0
  totalCorrectAnswers = 0
  isGameEnding = false
})

// 修改 returnToSettings 函數，確保在關閉遊戲後重置語言選擇
function returnToSettings() {
  handleReturnToSettings() //退出全螢幕
  document.getElementById("gameContainer").style.display = "none"
  document.getElementById("settingsPage").style.display = "block"
  stopCurrentAudio()

  // 重置遊戲相關狀態
  player.x = playerStartX
  player.y = playerStartY
  player.moveLeft = false
  player.moveRight = false
  player.lives = livesCount
  currentQuestionIndex = 0
  score = 0
  answeredQuestions = 0
  isGameEnding = false // 重置結束標記

  // 清空隕石和子彈
  meteors = []
  bullets = []

  // 停止遊戲循環
  cancelAnimationFrame(gameLoopId)
  enableTouchBehaviors()

  // 重新初始化語言選項，確保在切換分類後語言選擇有效
  initializeLanguageSelects()

  // 重置題庫
  resetQuestionPool()
  viewContainerRemove();
}

// 新增 resetQuestionPool 函數，用於重置題庫
function resetQuestionPool() {
  // 清空所有題庫相關陣列
  gameData = []
  availableQuestions = []
  usedQuestions = []

  // 重新初始化可用題目
  const selectedCategory = lessonSelect.value
  if (selectedCategory === "全部") {
    availableQuestions = [...data]
  } else {
    availableQuestions = data.filter((item) => item[0] === selectedCategory)
  }
}

window.addEventListener("resize", () => {
  resizeCanvas()
  updateControlsPosition()
  updateWordLabels()
})

window.addEventListener("orientationchange", updateControlsPosition)

// 初始化遊戲設定頁面
initGame()

document.addEventListener(
  "touchmove",
  (event) => {
    // 只在遊戲進行時阻止默認行為
    if (document.getElementById("gameContainer").style.display !== "none") {
      if (event.scale !== 1) {
        event.preventDefault()
      }
    }
  },
  { passive: false },
)

// 修改 disableTouchBehaviors 函數
function disableTouchBehaviors() {
  document.getElementById("gameContainer").style.touchAction = "none"
}

// 修改 enableTouchBehaviors 函數
function enableTouchBehaviors() {
  document.getElementById("gameContainer").style.touchAction = "auto"
  document.body.style.touchAction = "auto"
}

// 新增這個函數
function handleSettingsTouch() {
  const settingsPage = document.getElementById("settingsPage")
  let startY

  settingsPage.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY
  })

  settingsPage.addEventListener(
    "touchmove",
    (e) => {
      const touchY = e.touches[0].clientY
      const scrollTop = settingsPage.scrollTop
      const scrollHeight = settingsPage.scrollHeight
      const clientHeight = settingsPage.clientHeight

      // 允許滾動，除非已經到達頂部或底部
      if ((scrollTop === 0 && touchY > startY) || (scrollTop + clientHeight === scrollHeight && touchY < startY)) {
        e.preventDefault()
      }
    },
    { passive: false },
  )
}

let iosTouch = false
function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase()
  const isIOSDevice = /iphone|ipod/.test(userAgent) // iPhone 和 iPod 檢測
  const isIPad = /ipad/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) // iPad 檢測
  return isIOSDevice || isIPad
}

let touchStartX
let touchStartY

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY

  if (isIOS() && !iosTouch) {
    playCurrentAudio()
    iosTouch = true
  }
}

document.addEventListener("touchstart", handleTouchStart, false)

/*全螢幕*/

// 檢查設備類型
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 檢查是否為平板或電腦
function isTabletOrDesktop() {
  return window.innerWidth >= 768 // 假設寬度大於等於 768px 的設備為平板或電腦
}

// 進入全螢幕模式
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari 和 Opera
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    // Internet Explorer/Edge
    element.msRequestFullscreen()
  }
}

// 退出全螢幕模式
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari 和 Opera
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    // Internet Explorer/Edge
    document.msExitFullscreen()
  }
}

// 處理遊戲開始時的全螢幕模式
function handleGameStart() {
  if (isMobile() && !isTabletOrDesktop()) {
    enterFullscreen(document.documentElement)
  }
}

// 處理返回設定時的全螢幕模式
function handleReturnToSettings() {
  if (document.fullscreenElement) {
    exitFullscreen()
  }
}

window.addEventListener("orientationchange", () => {
  if (isMobile() && !isTabletOrDesktop()) {
    setTimeout(() => {
      if (document.fullscreenElement) {
        exitFullscreen()
        enterFullscreen(document.documentElement)
      }
      resizeCanvas() // 新增：在方向變化時調用 resizeCanvas
    }, 300)
  }
})

/*音檔、音效播放*/
const rightAudio = new Audio("right.mp3")
const wrongAudio = new Audio("wrong.mp3")

// 播放音效;
function playAudio(audio) {
  audio.currentTime = 0
  audio.play()
}

// 播放音檔;
function playCurrentAudio(times = audioPlaybackTimes) {
  if (gameData.length > 0 && currentQuestionIndex < gameData.length) {
    const audioFileInfo = gameData[currentQuestionIndex][headers.indexOf("音檔")]
    const playbackSpeed = audioFileInfo.toLowerCase().endsWith(".k100") ? 1.4 : 1
    const audioUrl = getAudioUrl(audioFileInfo)

    if (audioUrl) {
      playAudioMultipleTimes(audioUrl, times, playbackSpeed).catch((error) =>
        console.error("播放音頻時發生錯誤:", error),
      )
    }
  } else {
    console.warn("沒有可用的音頻數據")
  }
}

function playCurrentAudioData(audioFileInfo, times = 1) {
	    const playbackSpeed = audioFileInfo.toLowerCase().endsWith('.k100') ? 1.4 : 1;
        let audioUrl = getAudioUrl(audioFileInfo);
        if (audioUrl) {
            playAudioMultipleTimes(audioUrl, times, playbackSpeed)
                .catch(error => console.error('播放音頻時發生錯誤:', error));
        }
}


// 取得路徑;
function getAudioUrl(audioFileInfo) {
  if (audioFileInfo.endsWith(".k100")) {
    return `https://oikasu1.github.io/kasu100/${audioFileInfo.replace(".k100", ".mp3")}`
  } else if (audioFileInfo.endsWith(".kasu")) {
    return `https://oikasu1.github.io/snd/mp3kasu/${audioFileInfo.replace(".kasu", ".mp3")}`
  } else if (audioFileInfo.endsWith(".holo")) {
    return `https://oikasu1.github.io/snd/mp3holo/${audioFileInfo.replace(".holo", ".mp3")}`
  } else if (audioFileInfo.endsWith(".mp3")) {
    return audioFileInfo
  } else {
    let langCode, text

    // 新增的 TTS 處理邏輯
    const ttsMatch = audioFileInfo.match(/^tts\s*[:=]?\s*\(?\s*(\w+)\s*\)?$/i);
    if (ttsMatch) {
      langCode = ttsMatch[1].toLowerCase()
      text = gameData[currentQuestionIndex][headers.indexOf(langCode)]
    } else {
      switch (audioFileInfo) {
        case "zh":
          langCode = "zh-TW"
          text = gameData[currentQuestionIndex][headers.indexOf("國語")]
          break
        case "en":
        case "英":
          langCode = "en"
          text =
            gameData[currentQuestionIndex][headers.indexOf("英語")] ||
            gameData[currentQuestionIndex][headers.indexOf("美語")]
          break
        case "jp":
        case "日":
          langCode = "ja"
          text = gameData[currentQuestionIndex][headers.indexOf("日語")]
          break
        case "es":
        case "西":
          langCode = "es-ES"
          text = gameData[currentQuestionIndex][headers.indexOf("西班牙語")]
          break
        case "vi":
        case "越":
          langCode = "vi"
          text = gameData[currentQuestionIndex][headers.indexOf("越南語")]
          break
        case "ko":
        case "韓":
          langCode = "vi"
          text = gameData[currentQuestionIndex][headers.indexOf("韓語")]
          break
        case "in":
        case "印":
          langCode = "id"
          text = gameData[currentQuestionIndex][headers.indexOf("印尼語")]
          break
        default:
          console.warn("未知的音頻格式:", audioFileInfo)
          return null
      }
    }

    if (langCode && text) {
      return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(text)}`
    } else {
      console.warn("無法確定語言或找不到對應的文本")
      return null
    }
  }
}

let currentAudio = null

// 播放多次;
function playAudioMultipleTimes(audioUrl, times, playbackSpeed = 1) {
  return new Promise((resolve, reject) => {
    // 驗證播放速度的範圍
    if (playbackSpeed <= 0) {
      reject(new Error("Playback speed must be greater than 0"))
      return
    }

    // 如果有正在播放的音頻，停止它
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.removeEventListener("ended", currentAudio.audioEndHandler)
    }

    const audio = new Audio(audioUrl)
    currentAudio = audio // 保存對當前音頻的引用

    // 設置播放速度
    audio.playbackRate = playbackSpeed

    let playCount = 0

    audio.audioEndHandler = () => {
      playCount++
      if (playCount < times) {
        audio.currentTime = 0
        audio.play().catch(reject)
      } else {
        audio.removeEventListener("ended", audio.audioEndHandler)
        currentAudio = null // 清除當前音頻引用
        resolve()
      }
    }

    audio.addEventListener("ended", audio.audioEndHandler)

    audio.addEventListener("error", (e) => {
      currentAudio = null // 發生錯誤時也要清除引用
      reject(e)
    })

    audio.play().catch((e) => {
      currentAudio = null // 播放失敗時清除引用
      reject(e)
    })
  })
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.removeEventListener("ended", currentAudio.audioEndHandler)
    currentAudio = null
  }
}

// 儲存遊戲設定
function saveGameSettings() {
  const lesson = document.getElementById("lessonSelect").value
  const question = document.getElementById("questionSelect").value
  const answer = document.getElementById("answerSelect").value
  const count = document.getElementById("countSelect").value
  const playbackTimes = document.getElementById("playbackTimesSelect").value
  const difficulty = document.getElementById("difficultySelect").value
  const winCondition = document.getElementById("winConditionSelect").value
  const timeCondition = document.getElementById("timeConditionSelect").value
  const pairsCondition = document.getElementById("pairsConditionSelect").value

  const settings = {
    lesson: lesson,
    question: question,
    answer: answer,
    count: count,
    playbackTimes: playbackTimes,
    difficulty: difficulty,
    winCondition: winCondition,
    timeCondition: timeCondition,
    pairsCondition: pairsCondition,
  }

  localStorage.setItem("gameSettings", JSON.stringify(settings))
}

// 修改 loadGameSettings 函數，添加版本檢查和兼容性處理
function loadGameSettings() {
  const savedSettings = localStorage.getItem("gameSettings")

  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)

      // 檢查是否為舊版本設置（沒有過關條件相關設置）
      const isOldVersion = !settings.hasOwnProperty("winCondition")

      // 如果是舊版本，先清除舊設置，然後使用默認值
      if (isOldVersion) {
        console.log("檢測到舊版本設置，正在更新...")
        localStorage.removeItem("gameSettings")

        // 保留舊版本的基本設置
        const newSettings = {
          lesson: settings.lesson || "全部",
          question: settings.question,
          answer: settings.answer,
          count: settings.count || "4",
          playbackTimes: settings.playbackTimes || "2",
          difficulty: settings.difficulty || "0",
          // 添加新版本的默認設置
          winCondition: "time",
          timeCondition: "60",
          pairsCondition: "5",
        }

        // 保存更新後的設置
        localStorage.setItem("gameSettings", JSON.stringify(newSettings))

        // 使用更新後的設置
        resetToDefaultSettings()

        // 如果有有效的舊設置，應用它們
        if (settings.lesson) {
          const lessonSelect = document.getElementById("lessonSelect")
          if (Array.from(lessonSelect.options).some((opt) => opt.value === settings.lesson)) {
            lessonSelect.value = settings.lesson
          }
        }

        // 初始化語言選項後再應用舊設置
        initializeLanguageSelects()

        if (settings.question && settings.answer) {
          // 嘗試設置問題和答案語言
          setTimeout(() => {
            const questionSelect = document.getElementById("questionSelect")
            const answerSelect = document.getElementById("answerSelect")
            const availableLanguages = headers.filter((header) => !["分類", "音檔"].includes(header))

            if (availableLanguages.includes(settings.question)) {
              questionSelect.value = settings.question
              // 手動觸發更新答案選擇
              updateAnswerSelect(availableLanguages)

              // 設置答案語言
              if (availableLanguages.includes(settings.answer) && settings.answer !== settings.question) {
                answerSelect.value = settings.answer
              }
            }

            // 設置其他選項
            if (settings.count) document.getElementById("countSelect").value = settings.count
            if (settings.playbackTimes) document.getElementById("playbackTimesSelect").value = settings.playbackTimes
            if (settings.difficulty) document.getElementById("difficultySelect").value = settings.difficulty

            // 保存更新後的設置
            saveGameSettings()
          }, 100)
        }

        return
      }

      // 以下是正常的新版本設置加載邏輯
      // First set the category as it affects other options
      const lessonSelect = document.getElementById("lessonSelect")
      if (settings.lesson && Array.from(lessonSelect.options).some((opt) => opt.value === settings.lesson)) {
        lessonSelect.value = settings.lesson
      } else {
        lessonSelect.value = "全部"
      }

      // Initialize language options
      const availableLanguages = headers.filter((header) => !["分類", "音檔"].includes(header))

      // Set question language
      const questionSelect = document.getElementById("questionSelect")
      questionSelect.innerHTML = "" // Clear existing options

      // Add all available languages
      availableLanguages.forEach((lang) => {
        const option = document.createElement("option")
        option.value = option.textContent = lang
        questionSelect.appendChild(option)
      })

      // Check if saved question language is valid
      if (settings.question && availableLanguages.includes(settings.question)) {
        questionSelect.value = settings.question
      } else if (questionSelect.options.length > 0) {
        questionSelect.selectedIndex = 0
      }

      // Update answer language options based on selected question language
      const selectedQuestion = questionSelect.value
      const answerSelect = document.getElementById("answerSelect")
      answerSelect.innerHTML = "" // Clear existing options

      // Add all available answer languages (excluding the question language)
      availableLanguages
        .filter((lang) => lang !== selectedQuestion)
        .forEach((lang) => {
          const option = document.createElement("option")
          option.value = option.textContent = lang
          answerSelect.appendChild(option)
        })

      // Check if saved answer language is valid
      if (settings.answer && availableLanguages.includes(settings.answer) && settings.answer !== selectedQuestion) {
        answerSelect.value = settings.answer
      } else if (answerSelect.options.length > 0) {
        answerSelect.selectedIndex = 0
      }

      // Set other options with fallbacks
      document.getElementById("countSelect").value = settings.count || "4"
      document.getElementById("playbackTimesSelect").value = settings.playbackTimes || "2"
      document.getElementById("difficultySelect").value = settings.difficulty || "0"

      // Load win condition settings
      if (settings.winCondition) {
        const winConditionSelect = document.getElementById("winConditionSelect")
        const validWinConditions = ["none", "time", "pairs"]

        if (validWinConditions.includes(settings.winCondition)) {
          winConditionSelect.value = settings.winCondition
        } else {
          winConditionSelect.value = "time" // Default
        }

        // Show/hide condition options based on win condition
        const timeConditionDiv = document.getElementById("timeConditionDiv")
        const pairsConditionDiv = document.getElementById("pairsConditionDiv")

        if (winConditionSelect.value === "time") {
          timeConditionDiv.style.display = "block"
          pairsConditionDiv.style.display = "none"

          // Set time condition with validation
          const timeConditionSelect = document.getElementById("timeConditionSelect")
          const validTimeOptions = Array.from(timeConditionSelect.options).map((opt) => opt.value)

          if (settings.timeCondition && validTimeOptions.includes(settings.timeCondition)) {
            timeConditionSelect.value = settings.timeCondition
          } else {
            timeConditionSelect.value = "60" // Default
          }
        } else if (winConditionSelect.value === "pairs") {
          timeConditionDiv.style.display = "none"
          pairsConditionDiv.style.display = "block"

          // Set pairs condition with validation
          const pairsConditionSelect = document.getElementById("pairsConditionSelect")
          const validPairsOptions = Array.from(pairsConditionSelect.options).map((opt) => opt.value)

          if (settings.pairsCondition && validPairsOptions.includes(settings.pairsCondition)) {
            pairsConditionSelect.value = settings.pairsCondition
          } else {
            pairsConditionSelect.value = "5" // Default
          }
        } else {
          timeConditionDiv.style.display = "none"
          pairsConditionDiv.style.display = "none"
        }
      } else {
        // 如果沒有過關條件設置，使用默認值
        document.getElementById("winConditionSelect").value = "time"
        document.getElementById("timeConditionDiv").style.display = "block"
        document.getElementById("pairsConditionDiv").style.display = "none"
        document.getElementById("timeConditionSelect").value = "60"
      }

      // 保存更新後的設置，確保所有新字段都被保存
      saveGameSettings()
    } catch (error) {
      console.error("Error loading game settings:", error)
      // Reset to defaults if there's an error
      resetToDefaultSettings()
      // 清除可能損壞的設置
      localStorage.removeItem("gameSettings")
    }
  } else {
    // 沒有保的設置，使用默認值
    resetToDefaultSettings()
  }

  // Add this line at the end of the function to ensure settings are applied
  addSettingsSaveListeners()
}

// 添加一個函數來清除所有遊戲設置
function clearGameSettings() {
  localStorage.removeItem("gameSettings")
  resetToDefaultSettings()
  alert("遊戲設置已重置為默認值")
}

// 添加 resetToDefaultSettings 函數
function resetToDefaultSettings() {
  document.getElementById("lessonSelect").value = "全部"
  document.getElementById("questionSelect").selectedIndex = 0
  document.getElementById("answerSelect").selectedIndex = 0
  document.getElementById("countSelect").value = "4"
  document.getElementById("playbackTimesSelect").value = "2"
  document.getElementById("difficultySelect").value = "0"
  document.getElementById("winConditionSelect").value = "time"
  document.getElementById("timeConditionSelect").value = "60"
  document.getElementById("pairsConditionSelect").value = "5"
}

function viewContainerRemove() {
    const viewContainer = document.getElementById('viewContainer');
    if (viewContainer) {
        viewContainer.remove();
    }
}