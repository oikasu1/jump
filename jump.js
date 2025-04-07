let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://oikasu1.github.io/kasuexam/kasu/fonts/twhei.css';
document.head.appendChild(link);






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

    <div>
        <label for="characterSelect">角色：</label>
        <select id="characterSelect">
            <option value="default">🟥</option>
            <option value="tiger">🐯</option>
            <option value="cat">🐱</option>
            <option value="tiger">🐯</option>
            <option value="frog">🐸</option>
            <option value="cat">🐱</option>
            <option value="love">💖</option>
            <option value="fox">🦊</option>
            <option value="dog">🐶</option>
            <option value="monkey">🐵</option>
            <option value="snowman">☃️</option>
            <option value="ufo">🛸</option>   
            <option value="butterfly">🦋</option> 
            <option value="bug">🐞</option> 
            <option value="smile">🥰</option> 
        </select>
    </div>
    
    <!-- 新增過關條件選項 -->
    <div>
        <label for="winConditionSelect">過關：</label>
        <select id="winConditionSelect">
            <option value="none">無限定</option>
            <option value="time">限定時間</option>
            <option value="pairs">答對數量</option>
        </select>
    </div>
    
    <!-- 限定時間選項 -->
    <div id="timeConditionDiv" style="display: none;">
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
    
    <!-- 答對數量選項 -->
    <div id="pairsConditionDiv" style="display: none;">
        <label for="pairsConditionSelect">組數：</label>
        <select id="pairsConditionSelect">
            <option value="3" selected>3個</option>
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

    <canvas id="gameCanvas"></canvas>
    
    <!-- 新增遊戲狀態顯示 -->
    <div id="gameStats" style="position: absolute; top: 10px; right: 10px; margin: 40px 10px; text-align: right; color: white; text-shadow: 1px 1px 2px black;">
        <div id="timeDisplay">時間: 0秒</div>
        <div id="scoreDisplay">得分: 0</div>
    </div>

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
`

document.body.innerHTML = htmlSettingsPage

// 添加時間差計算相關變數
let lastTime = 0
let deltaTime = 0

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
const timeDisplay = document.getElementById("timeDisplay")
const scoreDisplay = document.getElementById("scoreDisplay")
const winConditionSelect = document.getElementById("winConditionSelect")
const timeConditionSelect = document.getElementById("timeConditionSelect")
const pairsConditionSelect = document.getElementById("pairsConditionSelect")

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

let playerColor = "red"
const livesCount = 3
let audioPlaybackTimes = 2 // 預設播兩次;

let availableQuestions = []
let usedQuestions = []

let totalScore = 0
let passedLevels = 0

// 新增遊戲狀態變數
let gameMode = "none" // 遊戲模式: none, time, pairs
let timeLimit = 60 // 預設時間限制
let requiredPairs = 5 // 預設答對數量
let gameTime = 0 // 遊戲時間計數
let timerInterval = null // 計時器

const minWordDistance = 100 // 單詞之間的最小距離
const safeZoneRadius = 100 // 主角初始位置周圍的安全區域半徑

/* 題庫解析與選單建立*/

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

// 初始化語言選項

function initializeLanguageSelects() {
  // 取得可用語言並過濾掉 '分類' 和 '音檔'
  const availableLanguages = headers.filter((header) => !["分類", "音檔"].includes(header))

  // 清空 questionSelect 和 answerSelect 並添加語言選項
  populateSelects(availableLanguages)

  // 添加事件監聽器
  questionSelect.addEventListener("change", () => {
    updateAnswerSelect(availableLanguages)
    resetQuestionPool() // 新增：重置題庫
  })

  // 新增：分類選擇變更事件
  lessonSelect.addEventListener("change", () => {
    resetQuestionPool() // 重置題庫
  })

  // 新增：答案選擇變更事件
  answerSelect.addEventListener("change", () => {
    resetQuestionPool() // 重置題庫
  })
}

// 新增：重置題庫的函數
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

// 更新 answerSelect 的選項
function updateAnswerSelect(languages) {
  const selectedQuestion = questionSelect.value
  answerSelect.innerHTML = ""

  languages.filter((lang) => lang !== selectedQuestion).forEach((lang) => answerSelect.appendChild(createOption(lang)))

  // 選擇第一個可用的選項，並根據選項數量啟用或禁用開始按鈕
  answerSelect.selectedIndex = 0
  startButton.disabled = answerSelect.options.length === 0
}

// 在頁面載入時初始化語言選項
document.addEventListener("DOMContentLoaded", initializeLanguageSelects)

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
    const playbackSpeed = audioFileInfo.toLowerCase().endsWith(".k100") ? 1.3 : 1
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
// 播放音檔;
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
/*---------------*/

// 新增過關條件選擇事件處理
winConditionSelect.addEventListener("change", function () {
  const timeConditionDiv = document.getElementById("timeConditionDiv")
  const pairsConditionDiv = document.getElementById("pairsConditionDiv")

  timeConditionDiv.style.display = "none"
  pairsConditionDiv.style.display = "none"

  if (this.value === "time") {
    timeConditionDiv.style.display = "block"
  } else if (this.value === "pairs") {
    pairsConditionDiv.style.display = "block"
  }
})

// 新增計時器函數
function startTimer() {
  // 清除現有計時器
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  // 根據遊戲模式設定計時器
  if (gameMode === "time") {
    // 倒數計時 - 如果是新遊戲則重置時間，否則繼續使用現有時間
    if (gameTime <= 0) {
      gameTime = timeLimit
    }

    timerInterval = setInterval(() => {
      if (move) {
        gameTime--
        updateTimeDisplay()

        // 時間到
        if (gameTime <= 0) {
          clearInterval(timerInterval)
          endGame("timeout")
        }
      }
    }, 1000)
  } else {
    // 正數計時 - 繼續使用現有時間，不重置
    timerInterval = setInterval(() => {
      if (move) {
        gameTime++
        updateTimeDisplay()
      }
    }, 1000)
  }
}

// 更新時間顯示
function updateTimeDisplay() {
  if (gameMode === "time") {
    // 倒數計時顯示
    const minutes = Math.floor(gameTime / 60)
    const seconds = gameTime % 60
    timeDisplay.textContent = `剩餘時間: ${minutes}:${seconds.toString().padStart(2, "0")}`

    // 當時間少於10秒時加入視覺提醒
    if (gameTime <= 10) {
      timeDisplay.className = "time-warning"
    } else {
      timeDisplay.className = ""
    }
  } else {
    // 一般計時顯示
    const minutes = Math.floor(gameTime / 60)
    const seconds = gameTime % 60
    timeDisplay.textContent = `時間: ${minutes}:${seconds.toString().padStart(2, "0")}`
  }
}

// 更新分數顯示
function updateScoreDisplay() {
  scoreDisplay.textContent = `得分: ${score}`
}

startButton.addEventListener("click", () => {
  disableTouchBehaviors()

  // 只有在手機版才進入全螢幕
  if (isMobile()) {
    enterFullscreen(document.documentElement)
  }

  // 確保題庫已正確初始化
  if (availableQuestions.length === 0) {
    resetQuestionPool()
  }

  // 選擇新題目
  selectNewQuestions()

  if (gameData.length > 0) {
    totalQuestions = gameData.length
    // 開始遊戲
    settingsPage.style.display = "none"
    document.getElementById("gameContainer").style.display = "block"
    canvas.style.display = "block"
    controls.style.display = "flex"

    // 設定遊戲模式
    gameMode = winConditionSelect.value

    // 設定時間限制或答對數量
    if (gameMode === "time") {
      timeLimit = Number.parseInt(timeConditionSelect.value)
    } else if (gameMode === "pairs") {
      requiredPairs = Number.parseInt(pairsConditionSelect.value)
    }

    // 重新初始化遊戲
    initGame()
    resizeCanvas()

    // 開始計時
    startTimer()

    gameLoopId = requestAnimationFrame(gameLoop)
  }
  iosTouch = true
})

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
  maxJumpInterval: 500, // 毫秒，連續跳躍的最大間隔時間
  characterType: "default",
}

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
  currentPlatform: null,
}

let platforms = []
let words = []
let newPlatformCount = 0

function jump() {
  const currentTime = Date.now()
  // 檢查是否為垂直跳躍（既不向左也不向右移動）
  player.isVerticalJump = !player.moveLeft && !player.moveRight

  // 檢查是否為連續跳躍
  if (currentTime - player.lastJumpTime <= player.maxJumpInterval) {
    player.jumpCount++
  } else {
    player.jumpCount = 1
  }
  player.lastJumpTime = currentTime

  if (!player.isJumping) {
    // 第一次跳躍
    player.yVelocity = -player.jumpStrength
    player.isJumping = true
    player.canDoubleJump = true
  } else if (player.canDoubleJump) {
    // 二段跳
    player.yVelocity = -player.doubleJumpStrength
    player.canDoubleJump = false
  }

  // 檢查是否需要生成新平台（只在垂直跳躍時）
  if (player.jumpCount >= 3 && newPlatformCount == 0 && player.isVerticalJump && player.lives > 1) {
    generateNewPlatform()
    player.jumpCount = 0 // 重置跳躍計數
    playerColor = "orange" // 更新顏色
  }
}

function generateNewPlatform() {
  if (player.lives > 1) {
    const platformWidth = 100
    const platformHeight = 20
    const newPlatform = {
      x: player.x - platformWidth / 2 + player.width / 2,
      y: player.y + 50, // 在玩家上方生成平台
      width: platformWidth,
      height: platformHeight,
      isTemporary: true, // 標記為臨時平台
    }
    newPlatformCount = 1
    playerColor = "orange"

    // 確保平台在畫布範圍內
    newPlatform.x = Math.max(0, Math.min(newPlatform.x, canvasWidth - platformWidth))
    newPlatform.y = Math.max(0, newPlatform.y) + 50
    platforms.push(newPlatform)

    // 扣除一个生命值
    player.lives--

    // 5秒後移除臨時平台
    setTimeout(() => {
      platforms = platforms.filter((p) => p !== newPlatform)
    }, 5000)

    // 10秒後重置 newPlatformCount
    setTimeout(() => {
      newPlatformCount = 0
      playerColor = "red"
    }, 10000)
  } else {
    console.log("生命值不足，無法生成新平台")
  }
}

function generatePlatforms() {
  platforms = []
  const isPortrait = canvasHeight > canvasWidth
  const minPlatformWidth = isPortrait ? 80 : 100
  const maxPlatformWidth = isPortrait ? 150 : 200
  const minGap = isPortrait ? 100 : 50
  const maxGap = isPortrait ? 150 : 100

  // 添加底部平台
  platforms.push({
    x: 0,
    y: canvasHeight - 50,
    width: canvasWidth,
    height: 50,
  })

  let currentY = canvasHeight - 150 // 從底部平台上方開始
  while (currentY > 50) {
    // 確保不會生成太靠近頂部的平台
    const platformWidth = Math.random() * (maxPlatformWidth - minPlatformWidth) + minPlatformWidth
    const platformX = Math.random() * (canvasWidth - platformWidth)
    platforms.push({
      x: platformX,
      y: currentY,
      width: platformWidth,
      height: 20,
    })

    // 計算下一個平台的 Y 坐標
    currentY -= Math.random() * (maxGap - minGap) + minGap
  }
}

function generateWords() {
  words = []
  const questionLangIndex = headers.indexOf(questionSelect.value)
  const answerLangIndex = headers.indexOf(answerSelect.value)
  const safeZoneWidth = 50 // 安全區域的寬度
  const safeZoneHeight = canvasHeight // 安全區域的高度，覆蓋整個畫布高度

  // 檢測是否為直式頁面
  const isPortrait = canvasHeight > canvasWidth

  // 根據頁面方向設置不同的最小水平和垂直距離
  const minHorizontalDistance = isPortrait ? canvasWidth : minWordDistance * 2
  const minVerticalDistance = 40 // 垂直方向上的最小距離

  if (questionLangIndex !== -1 && answerLangIndex !== -1 && gameData.length > 0) {
    gameData.forEach((item, index) => {
      let wordX, wordY
      let attempts = 0
      const maxAttempts = 100
      let validPosition = false

      do {
        const platform = platforms[Math.floor(Math.random() * platforms.length)]
        wordX = platform.x + Math.random() * (platform.width - 40)
        wordY = platform.y - 40 // 調整高度，讓方塊位於平台上方
        attempts++

        // 檢查是否在安全區域內
        if (wordX < playerStartX + safeZoneWidth && wordY < safeZoneHeight) {
          validPosition = false
        }
        // 檢查與其他單詞的距離
        else {
          validPosition = true
          for (const existingWord of words) {
            // 在直式頁面時，確保單詞不在同一水平面上
            if (isPortrait) {
              if (Math.abs(existingWord.y - wordY) < minVerticalDistance) {
                validPosition = false
                break
              }
            }
            // 在橫式頁面時，如果在同一水平面上，確保有足夠的水平距離
            else {
              if (Math.abs(existingWord.y - wordY) < minVerticalDistance) {
                if (Math.abs(existingWord.x - wordX) < minHorizontalDistance) {
                  validPosition = false
                  break
                }
              }
            }
          }
        }

        if (attempts >= maxAttempts) {
          console.log("無法找到合適的位置放置單詞")
          break
        }
      } while (!validPosition)

      if (attempts < maxAttempts) {
        const boxSize = 30
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
          id: `word-${index}`,
        })
      }
    })
  }
  updateWordLabels()
}

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
      //label.textContent = word.text;
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

  // 修改：調整設定頁面
  const settingsPage = document.getElementById("settingsPage")
  if (isPortrait) {
    settingsPage.style.height = "auto"
    settingsPage.style.overflowY = "visible"
  } else {
    settingsPage.style.height = "90vh"
    settingsPage.style.overflowY = "auto"
    settingsPage.style.webkitOverflowScrolling = "touch"
  }
}

function updateControlsPosition() {
  const controls = document.getElementById("controls")
  const wordLabels = document.getElementById("wordLabels")
  const isLandscape = window.innerWidth > window.innerHeight

  if (isLandscape) {
    // 橫式頁面時，controls可以與wordLabels重疊
    controls.style.bottom = "10px"
    wordLabels.style.bottom = "50px"
  } else {
    // 直式頁面時，controls在最下方，wordLabels在其上方
    controls.style.bottom = "20px"
    wordLabels.style.bottom = "120px"
  }

  // 更新questionDisplay的位置
  const questionDisplay = document.getElementById("questionDisplay")
  if (questionDisplay) {
    questionDisplay.style.bottom = isLandscape ? "10px" : "180px"
  }

  // 更新遊戲狀態顯示的位置
  const gameStats = document.getElementById("gameStats")
  if (gameStats) {
    if (isLandscape) {
      gameStats.style.top = "10px"
      gameStats.style.right = "10px"
    } else {
      gameStats.style.top = "10px"
      gameStats.style.right = "10px"
    }
  }
}

// 修改 initGame 函數，保留分數
function initGame() {
  move = true
  lastTime = 0 // 重置時間差計算
  resizeCanvas()
  // 獲取選擇的角色類型
  const characterSelect = document.getElementById("characterSelect")
  player.characterType = characterSelect.value
  player.x = playerStartX
  player.y = playerStartY
  player.yVelocity = 0
  player.isJumping = false
  player.moveLeft = false
  player.moveRight = false
  player.lives = livesCount
  player.jumpCount = 0
  player.lastJumpTime = 0
  currentQuestionIndex = 0

  // 只有在遊戲結束時才重置分數，否則保留
  const gameEndMessage = document.getElementById("gameEndMessage").innerHTML
  const isGameOver = gameEndMessage && (gameEndMessage.includes("生命耗盡") || gameEndMessage.includes("時間到"))

  if (isGameOver) {
    score = 0
    answeredQuestions = 0
  }
  // 否則保留現有分數

  newPlatformCount = 0

  const difficultySelect = document.getElementById("difficultySelect")
  const difficulty = Number.parseInt(difficultySelect.value)

  if (difficulty >= 1) {
    enemy.x = canvasWidth - 50
    enemy.y = canvasHeight - 80
    enemy.isJumping = false
    enemy.yVelocity = 0
  }

  // 重新選擇題目
  selectNewQuestions()

  if (gameData.length > 0) {
    updateQuestionDisplay()
    playCurrentAudio()

    // 為題目顯示區域添加點擊事件，點擊時重新播放音檔
    questionDisplay.addEventListener("click", () => {
      playCurrentAudio()
    })

    // 添加視覺反饋，讓用戶知道可以點擊
    questionDisplay.style.cursor = "pointer"
    questionDisplay.title = "點擊可重新播放音檔"
  }

  const playbackTimesSelect = document.getElementById("playbackTimesSelect")
  playbackTimesSelect.addEventListener("change", (e) => {
    audioPlaybackTimes = Number.parseInt(e.target.value)
  })

  generatePlatforms()
  generateWords()
  updateWordLabels()
  updateControlsPosition()
  handleSettingsTouch()

  // 更新遊戲狀態顯示
  updateTimeDisplay()
  updateScoreDisplay()
}

function updateQuestionDisplay() {
  playAudio(rightAudio)
  if (gameData.length > 0) {
    const questionLangIndex = headers.indexOf(questionSelect.value)
    questionDisplay.textContent = "🥷 " + gameData[currentQuestionIndex][questionLangIndex]
  }
}

function selectNewQuestions() {
  const selectedCategory = lessonSelect.value
  const count = Number.parseInt(countSelect.value)
  const answerLangIndex = headers.indexOf(answerSelect.value)

  // 如果可用題目不足，重置題庫
  if (availableQuestions.length < count) {
    availableQuestions = [...usedQuestions, ...availableQuestions]
    usedQuestions = []
  }

  // 過濾並隨機選擇題目
  const filteredData =
    selectedCategory === "全部" ? availableQuestions : availableQuestions.filter((row) => row[0] === selectedCategory)

  gameData = []
  const usedAnswers = new Set() // 用來追踪已選擇的答案

  while (gameData.length < count && filteredData.length > 0) {
    const index = Math.floor(Math.random() * filteredData.length)
    const selectedQuestion = filteredData[index]
    const answer = selectedQuestion[answerLangIndex]

    // 檢查答案是否已經存在
    if (!usedAnswers.has(answer)) {
      gameData.push(selectedQuestion)
      usedAnswers.add(answer)
      usedQuestions.push(selectedQuestion)

      // 從可用題目和過濾後的資料中移除已選擇的題目
      availableQuestions = availableQuestions.filter((q) => q !== selectedQuestion)
      filteredData.splice(index, 1)
    }
  }

  totalQuestions = gameData.length
}

function drawPlayer() {
  const characterType = player.characterType

  if (characterType === "default") {
    // 原始的紅色方塊
    ctx.fillStyle = playerColor
    ctx.fillRect(player.x, player.y, player.width, player.height)
  } else {
    // 繪製emoji角色
    ctx.font = `${player.height}px Arial`

    let emoji = "🐱" // 默認

    switch (characterType) {
      case "tiger":
        emoji = "🐯"
        break
      case "frog":
        emoji = "🐸"
        break
      case "cat":
        emoji = "🐱"
        break
      case "love":
        emoji = "💖"
        break
      case "fox":
        emoji = "🦊"
        break
      case "dog":
        emoji = "🐶"
        break
      case "monkey":
        emoji = "🐵"
        break
      case "snowman":
        emoji = "☃️"
        break
      case "ufo":
        emoji = "🛸"
        break
      case "butterfly":
        emoji = "🦋"
        break
      case "bug":
        emoji = "🐞"
        break
      case "smile":
        emoji = "🥰"
        break
    }
    ctx.fillText(emoji, player.x, player.y + player.height)
  }
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

function drawPlatforms() {
  ctx.fillStyle = "green"
  platforms.forEach((platform, index) => {
    if (index === platforms.length - 1 && platform.isTemporary) {
      ctx.fillStyle = "rgba(0, 255, 0, 0.7)" // 半透明的亮綠色
    } else {
      ctx.fillStyle = "green"
    }
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
  })
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

function checkCollision(x, y, width, height, platform) {
  return (
    x < platform.x + platform.width &&
    x + width > platform.x &&
    y < platform.y + platform.height &&
    y + height > platform.y
  )
}

// 修改遊戲循環函數，使用時間差計算
function gameLoop(timestamp) {
  // 計算時間差（毫秒）
  if (!lastTime) lastTime = timestamp
  deltaTime = (timestamp - lastTime) / 1000 // 轉換為秒
  lastTime = timestamp

  // 限制deltaTime的最大值，防止在切換標籤頁或設備休眠後速度異常
  if (deltaTime > 0.1) deltaTime = 0.1

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  update(deltaTime) // 傳遞時間差給update函數
  drawPlatforms()
  drawWords()
  drawPlayer()

  const difficulty = Number.parseInt(document.getElementById("difficultySelect").value)
  if (difficulty >= 1) {
    drawEnemy()
  }

  drawLives()
  updateWordLabels()
  gameLoopId = requestAnimationFrame(gameLoop)
}

// 修改update函數，接收時間差參數
function update(dt) {
  let nextX = player.x
  // 使用時間差調整移動速度
  const moveDistance = player.speed * dt * 60 // 乘以60使速度在60fps下保持一致

  if (player.moveLeft) {
    nextX -= moveDistance
  }
  if (player.moveRight) {
    nextX += moveDistance
  }

  const difficulty = Number.parseInt(document.getElementById("difficultySelect").value)
  if (difficulty >= 1) {
    updateEnemy(dt) // 傳遞時間差給updateEnemy函數
    checkEnemyCollision()
  }

  let canMoveHorizontally = true
  platforms.forEach((platform) => {
    if (checkCollision(nextX, player.y, player.width, player.height, platform)) {
      canMoveHorizontally = false
    }
  })
  if (canMoveHorizontally) {
    player.x = nextX
  }

  // 使用時間差調整重力和跳躍
  const gravity = 0.8 * 60 * dt // 調整重力加速度
  player.yVelocity += gravity
  let nextY = player.y + player.yVelocity * dt * 60 // 調整垂直移動

  let onPlatform = false
  platforms.forEach((platform) => {
    if (checkCollision(player.x, nextY, player.width, player.height, platform)) {
      if (player.yVelocity > 0) {
        nextY = platform.y - player.height
        player.yVelocity = 0
        player.isJumping = false
        player.canDoubleJump = true
        onPlatform = true
      } else if (player.yVelocity < 0) {
        nextY = platform.y + platform.height
        player.yVelocity = 0
      }
    }
  })
  player.y = nextY
  if (!onPlatform) {
    player.isJumping = true
  }

  if (!player.isJumping) {
    player.jumpCount = 0
  }

  const wordCollision = false

  let onWordPlatform = false
  words.forEach((word) => {
    if (!word.collected) {
      const playerBottom = player.y + player.height
      const wordTop = word.y
      const playerRight = player.x + player.width
      const wordRight = word.x + word.width

      // 檢查是否從側面或底部碰到單詞
      if (player.x < wordRight && playerRight > word.x && playerBottom > wordTop && player.y < wordTop + word.height) {
        // 檢查是否站在單詞上
        if (playerBottom <= wordTop + 5 && player.yVelocity >= 0) {
          player.y = wordTop - player.height
          player.yVelocity = 0
          player.isJumping = false
          onWordPlatform = true
        } else if (player.y >= wordTop + word.height - 5 || player.x >= wordRight - 5 || playerRight <= word.x + 5) {
          // 從底部或側面碰到單詞

          if (word.isCorrect && currentQuestionIndex === words.indexOf(word)) {
            word.collected = true
            iosTouch = false
            score++
            answeredQuestions++
            player.lives = Math.min(player.lives + 1, player.maxLives) // 增加生命值,最多10個

            // 更新分數顯示
            updateScoreDisplay()

            // 檢查是否達到答對數量目標
            if (gameMode === "pairs" && score >= requiredPairs) {
              endGame("pairs")
              return
            }

            if (answeredQuestions < totalQuestions) {
              currentQuestionIndex++
              updateQuestionDisplay()
              playCurrentAudio()
            } else {
              endGame("complete")
            }
          } else {
            player.x = playerStartX
            player.y = playerStartY
            player.yVelocity = 0
            player.lives-- // 減少生命值
            if (player.lives <= 0) {
              endGame("lives")
            }
            playAudio(wrongAudio)
          }
        }
      }
    }
    updateWordLabels()
  })

  // 如果不在任何單詞平台上，應用重力
  if (!onWordPlatform) {
    player.yVelocity += gravity
  }

  if (!wordCollision) {
    if (player.x < 0) player.x = 0
    if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width
    if (player.y + player.height > canvasHeight) {
      player.y = canvasHeight - player.height
      player.isJumping = false
    }
  }
  if (player.x < 0) player.x = 0
  if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width
  if (player.y + player.height > canvasHeight) {
    player.y = canvasHeight - player.height
    player.isJumping = false
  }

  if (player.y > canvasHeight) {
    initGame()
  }
  playerColor = newPlatformCount === 0 ? "red" : "orange"
}

// 修改updateEnemy函數，接收時間差參數
function updateEnemy(dt) {
  const difficulty = Number.parseInt(document.getElementById("difficultySelect").value)
  if (move) {
    // 使用時間差調整敵人移動速度
    enemy.x += enemy.speed * enemy.direction * dt * 60
  }

  // 檢查是否到達畫布邊緣
  if (enemy.x <= 0 || enemy.x + enemy.width >= canvasWidth) {
    enemy.direction *= -1
  }

  // 使用時間差調整重力
  const gravity = 0.8 * 60 * dt
  enemy.yVelocity += gravity
  enemy.y += enemy.yVelocity * dt * 60

  // 檢查是否落在平台上或地面上
  let onPlatform = false
  platforms.forEach((platform) => {
    if (checkCollision(enemy.x, enemy.y, enemy.width, enemy.height, platform)) {
      enemy.y = platform.y - enemy.height
      enemy.yVelocity = 0
      enemy.isJumping = false
      enemy.canDoubleJump = true
      enemy.currentPlatform = platform
      onPlatform = true
    }
  })

  if (!onPlatform) {
    enemy.currentPlatform = null
  }

  // 在地面上時重置跳躍能力，並防止敵人落到地面以下
  if (enemy.y + enemy.height >= canvasHeight) {
    enemy.y = canvasHeight - enemy.height
    enemy.isJumping = false
    enemy.canDoubleJump = true
    enemy.yVelocity = 0
  }

  // 只在難度為 2 時允許跳躍
  if (difficulty === 2) {
    // 使用時間差調整跳躍計時器
    enemy.jumpTimer += dt * 60
    if (enemy.jumpTimer > 200 && (enemy.currentPlatform || enemy.y + enemy.height >= canvasHeight)) {
      enemyJump()
      enemy.jumpTimer = 0
    }
  }
}

function checkEnemyCollision() {
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    enemy.x = canvasWidth - 50
    enemy.y = canvasHeight - 80

    player.yVelocity = -15 // 給玩家一個小跳躍
    playAudio(wrongAudio)
  }
}

let gameLoopId

function drawEnemy() {
  const difficulty = Number.parseInt(document.getElementById("difficultySelect").value)

  if (difficulty === 1) {
    ctx.fillStyle = "black"
  } else if (difficulty === 2) {
    ctx.fillStyle = "black"
  }

  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
}

// 修改enemyJump函數
function enemyJump() {
  if (!enemy.isJumping) {
    enemy.yVelocity = -20
    enemy.isJumping = true
  } else if (enemy.canDoubleJump) {
    enemy.yVelocity = -12
    enemy.canDoubleJump = false
  }
}

document.addEventListener("keydown", (e) => {
  if (move) {
    switch (e.key) {
      case "ArrowLeft":
        player.moveLeft = true
        player.isVerticalJump = false
        break
      case "ArrowRight":
        player.moveRight = true
        player.isVerticalJump = false
        break
      case "ArrowUp":
      case " ": // 空格鍵
        jump()
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
  }
})

const leftBtn = document.getElementById("leftBtn")
const rightBtn = document.getElementById("rightBtn")
const jumpBtn = document.getElementById("jumpBtn")

leftBtn.addEventListener("touchstart", (e) => {
  if (move) {
    player.jumpCount = 0
    e.preventDefault()
    player.moveLeft = true
  }
})

leftBtn.addEventListener("touchend", (e) => {
  player.jumpCount = 0
  e.preventDefault()
  player.moveLeft = false
})

rightBtn.addEventListener("touchstart", (e) => {
  if (move) {
    player.jumpCount = 0
    e.preventDefault()
    player.moveRight = true
  }
})

rightBtn.addEventListener("touchend", (e) => {
  player.jumpCount = 0
  e.preventDefault()
  player.moveRight = false
})

jumpBtn.addEventListener("touchstart", (e) => {
  if (move) {
    e.preventDefault()
    player.isVerticalJump = !player.moveLeft && !player.moveRight
    jump()
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && document.getElementById("gameEndModal").style.display === "block") {
    event.preventDefault() // 防止表單提交或其他默認行為
    document.getElementById("continueButton").click()
  }
})

document.getElementById("closeButton").addEventListener("click", returnToSettings)

function returnToSettings() {
  document.getElementById("gameContainer").style.display = "none"
	// 顯示設定頁面
    document.getElementById('settingsPage').style.display = 'flex';
  stopCurrentAudio()

  // 停止計時器
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  // 只有在手機版才退出全螢幕
  if (isMobile()) {
    exitFullscreen()
  }

  // 重置遊戲相關狀態
  player.x = playerStartX
  player.y = playerStartY
  player.yVelocity = 0
  player.isJumping = false
  player.moveLeft = false
  player.moveRight = false
  player.lives = livesCount
  player.jumpCount = 0
  player.lastJumpTime = 0
  currentQuestionIndex = 0
  score = 0
  answeredQuestions = 0
  newPlatformCount = 0

  // 重置遊戲統計數據
  gameTime = 0
  totalScore = 0
  passedLevels = 0

  // 更新顯示
  updateTimeDisplay()
  updateScoreDisplay()

  // 清空平台和單詞
  platforms = []
  words = []

  // 重置題庫
  resetQuestionPool()

  // 取消遊戲循環
  cancelAnimationFrame(gameLoopId)

  // 啟用觸控行為
  enableTouchBehaviors()

    const viewContainer = document.getElementById('viewContainer');
    if (viewContainer) {
        viewContainer.remove();
    }
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

// 修改遊戲結束函數
function endGame(reason) {
  move = false
  enableTouchBehaviors()
  stopCurrentAudio()

  // 暫停計時器，但不清除時間
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  // 根據不同結束原因準備統計數據
  let endMessage = ""

  switch (reason) {
    case "timeout":
      endMessage = `
        <h2>⏰ 時間到！</h2>
        <p>✨您共獲得 ${score} 分</p>
        <p>總時間 ${timeLimit} 秒</p>
      `
      break

    case "pairs":
      endMessage = `
        <h2>🎯 達成目標！</h2>
        <p>✨您共獲得 ${score} 分</p>
        <p>目標數量 ${requiredPairs} 分</p>
        <p>⏰時間 ${gameTime} 秒</p>
      `
      break

    case "complete":
      endMessage = `
        <h2>🎊 關卡完成！</h2>
        <p>✨您共獲得 ${score} 分</p>
        <p>⏰時間 ${gameTime} 秒</p>
      `
      break

    case "lives":
      endMessage = `
        <h2>💔 生命耗盡</h2>
        <p>✨您共獲得 ${score} 分</p>
        <p>⏰時間 ${gameTime} 秒</p>
      `
      break
  }

  // 更新總分和通過關卡數
  totalScore += score
  passedLevels++

  // 設置訊息並顯示模態框
  const messageElement = document.getElementById("gameEndMessage")
  if (messageElement) {
    messageElement.innerHTML = endMessage
  }

  const modal = document.getElementById("gameEndModal")
  modal.style.display = "block"

  // 設置繼續按鈕文字
  const continueButton = document.getElementById("continueButton")
  if (reason === "lives" || reason === "timeout") {
    continueButton.textContent = "重新開始🔄"
  } else {
    continueButton.textContent = "繼續遊戲➡️"
  }
}

// 修改 continueButton 點擊事件處理
document.getElementById("continueButton").addEventListener("click", () => {
  document.getElementById("gameEndModal").style.display = "none"

  // 獲取遊戲結束訊息以確定遊戲結束的原因
  const gameEndMessage = document.getElementById("gameEndMessage").innerHTML

  // 檢查遊戲是否因生命耗盡、時間到或達到目標對數而結束
  const isGameOver = gameEndMessage.includes("生命耗盡") || gameEndMessage.includes("時間到")
  const isLevelComplete = gameEndMessage.includes("達成目標") || gameEndMessage.includes("關卡完成")

  if (isGameOver) {
    // 如果是因為生命耗盡或時間到而結束，重置所有遊戲統計數據
    score = 0
    answeredQuestions = 0
    gameTime = 0 // 重置時間

    // 更新顯示
    updateTimeDisplay()
    updateScoreDisplay()
  } else if (isLevelComplete && gameMode === "none") {
    // 如果是「無限定」模式下完成關卡，保留分數和時間，繼續累計
    // 不需要重置任何數據，直接進入下一關
	    answeredQuestions = 0
  } else if (isLevelComplete && gameMode === "time") {
    // 如果是「限定時間」模式下完成關卡，保留分數和剩餘時間，繼續累計
    // 不需要重置時間，繼續使用剩餘時間
	    answeredQuestions = 0
  } else if (isLevelComplete && gameMode === "pairs") {
    // 如果是「答對數量」模式下達到目標，保留分數，繼續累計
    // 答對數量重置為0，以便重新計算
    answeredQuestions = 0
  }

  // 準備新的遊戲回合
  initGame()

  // 重新啟動計時器，如果是繼續遊戲則保留現有時間
  startTimer()
})

document.getElementById("returnButton").addEventListener("click", () => {
  document.getElementById("gameEndModal").style.display = "none"

  // 只有在手機版才退出全螢幕
  if (isMobile()) {
    exitFullscreen()
  }

  closeGame()
})

window.addEventListener("resize", () => {
  resizeCanvas()
  updateControlsPosition()
  updateWordLabels()
})

window.addEventListener("orientationchange", updateControlsPosition)

// 修改現有的方向變化監聽器
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

let iosTouch = false
function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase()
  const isIOSDevice = /iphone|ipod/.test(userAgent) // iPhone 和 iPod 檢測
  const isIPad = /ipad/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) // iPad 檢測
  return isIOSDevice || isIPad
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function isTabletOrDesktop() {
  return window.innerWidth >= 768
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

let touchStartX = 0
let touchStartY = 0

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY

  if (isIOS() && !iosTouch) {
    playCurrentAudio()
    iosTouch = true
  }
}

document.addEventListener("touchstart", handleTouchStart, false)

// 定義所有設定元素的映射關係
const settingsConfig = [
  { key: "lessonSelect", element: () => document.getElementById("lessonSelect") },
  { key: "questionSelect", element: () => document.getElementById("questionSelect") },
  { key: "answerSelect", element: () => document.getElementById("answerSelect") },
  { key: "countSelect", element: () => document.getElementById("countSelect") },
  { key: "playbackTimesSelect", element: () => document.getElementById("playbackTimesSelect") },
  { key: "difficultySelect", element: () => document.getElementById("difficultySelect") },
  { key: "characterSelect", element: () => document.getElementById("characterSelect") },
  { key: "winConditionSelect", element: () => document.getElementById("winConditionSelect"), triggerChange: true },
  { key: "timeConditionSelect", element: () => document.getElementById("timeConditionSelect") },
  { key: "pairsConditionSelect", element: () => document.getElementById("pairsConditionSelect") },
]

// 儲存設定到 localStorage
function saveSettings() {
  const titleElement = document.querySelector("#settingsPage h2")
  if (!titleElement) return

  const storageKey = `gameSettings_${titleElement.textContent}`

  // 收集所有設定值
  const settings = {}
  settingsConfig.forEach((config) => {
    const element = config.element()
    if (element) {
      settings[config.key] = element.value
    }
  })

  localStorage.setItem(storageKey, JSON.stringify(settings))
}

// 從 localStorage 載入設定
function loadSettings() {
  const titleElement = document.querySelector("#settingsPage h2")
  if (!titleElement) return

  const storageKey = `gameSettings_${titleElement.textContent}`
  const savedSettings = localStorage.getItem(storageKey)
  if (!savedSettings) return

  try {
    const settings = JSON.parse(savedSettings)

    // 套用所有設定
    settingsConfig.forEach(({ key, element, triggerChange }) => {
      const selectElement = element()
      if (selectElement && settings[key]) {
        setSelectValue(selectElement, settings[key])
        if (triggerChange) selectElement.dispatchEvent(new Event("change"))
      }
    })
  } catch (error) {
    console.error("載入設定時發生錯誤:", error)
  }
}

// 設定下拉選單值的輔助函數
function setSelectValue(selectElement, value) {
  const optionIndex = Array.from(selectElement.options).findIndex((option) => option.value === value)
  if (optionIndex >= 0) selectElement.selectedIndex = optionIndex
}

// 為所有設定元素添加變更事件監聽器
function addSettingsSaveListeners() {
  // 為每個元素添加事件監聽器
  settingsConfig.forEach((config) => {
    const element = config.element()
    if (element) {
      element.addEventListener("change", saveSettings)
    }
  })
}

// 在頁面載入完成後初始化設定
document.addEventListener("DOMContentLoaded", () => {
  // 載入已儲存的設定
  loadSettings()
  // 添加設定變更事件監聽器
  addSettingsSaveListeners()

  // 初始化過關條件選項顯示
  const winCondition = document.getElementById("winConditionSelect").value
  const timeConditionDiv = document.getElementById("timeConditionDiv")
  const pairsConditionDiv = document.getElementById("pairsConditionDiv")

  timeConditionDiv.style.display = "none"
  pairsConditionDiv.style.display = "none"

  if (winCondition === "time") {
    timeConditionDiv.style.display = "block"
  } else if (winCondition === "pairs") {
    pairsConditionDiv.style.display = "block"
  }
})

document.addEventListener('DOMContentLoaded', function() {
    const viewButton = document.getElementById('viewButton');
    viewButton.addEventListener('click', showViewList);
});