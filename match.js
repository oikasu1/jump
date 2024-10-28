let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'match.css';
document.head.appendChild(link);

const style = document.createElement('style');
style.textContent = `

`;
document.head.appendChild(style);





let htmlSettingsPage = `

<div id="settingsPage">
    <h2>🥷客事100對對碰</h2>
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
		    <option value="2">2</option>
			<option value="3">3</option>
            <option value="4" selected>4</option>
			<option value="5">5</option>
            <option value="6">6</option>
			<option value="7">7</option>
			<option value="8">8</option>
        </select>
    </div>

	<div>
	<label for="cardModeSelect">模式：</label>
	<select id="cardModeSelect">
	<option value="covered">蓋牌</option>
	<option value="uncovered" selected>開牌</option>
	</select>
	</div>

	<div>
	<label for="winConditionSelect">過關：</label>
	<select id="winConditionSelect">
	  <option value="none">無限定</option>
	  <option value="time" selected>限定時間</option>
	  <option value="pairs">答對數量</option>
	</select>
	</div>
	<div id="timeConditionDiv" style="display: none;">
	<label for="timeConditionSelect">限時：</label>
	<select id="timeConditionSelect">
	  <option value="20">20秒</option>
	  <option value="60" selected>60秒</option>
	  <option value="90">90秒</option>
	  <option value="100">100秒</option>
	  <option value="120">120秒</option>
	  <option value="150">150秒</option>
	  <option value="180">180秒</option>
	</select>
	</div>
	<div id="pairsConditionDiv" style="display: none;">
	<label for="pairsConditionInput">組數：</label>
		<select id="pairsConditionSelect">
		<option value="5">5組</option>
		  <option value="10">10組</option>
		  <option value="15">15組</option>
		  <option value="20">20組</option>
		  <option value="25">25組</option>
		  <option value="30">30組</option>
		  <option value="35">35組</option>
		  <option value="40">40組</option>
		  <option value="50">50組</option>
		</select>
	</div>

    <div>
        <label for="playbackTimesSelect">播音：</label>
        <select id="playbackTimesSelect">
            <option value="1" selected>1</option>
        </select>
    </div>
    <button id="startButton">開始配對</button>
</div>

<div id="gameContainer" style="display: none;">
    <div id="gameHeader">
        <button id="closeButton">X</button>
        <div id="gameStats">
            <span id="timeDisplay">時間: 0秒</span>
        </div>
    </div>
    <div id="cardGrid"></div>
</div>

<div id="gameEndModal" class="modal" style="display: none;">
    <div class="modal-content">
        <p id="gameEndMessage"></p>
        <div class="modal-buttons">
            <button id="returnButton">返回設定</button>
            <button id="continueButton">繼續遊戲</button>
        </div>
    </div>
</div>
`;

document.body.innerHTML = htmlSettingsPage;

/*
const myData = `
分類	國語	客語	拼音	注音	音檔
一、問好 00百句	ˊ ˆ	對不起	失禮	shidˊ liˆ	k014.k100
一、問好 00百句	ˋ ˆ ˆ	沒關係	無要緊	moˋ rhioˆ ginˆ	k015.k100
一、問好 00百句	ˆ ˋ	謝謝	勞力	looˆ ladˋ	k016.k100
一、問好 00百句	 ˆ ˆ 	不必客氣	毋使細義	m suˆ seˆ ngi	k021.k100
一、問好 00百句	ˇ ˇ ˆ ˆ	老師再見	先生再見	sienˇ senˇ zaiˆ gienˆ	k022.k100
一、問好 00百句	ˆ ˋ 	再見	正來尞	zhangˆ loiˋ leeu	k023.k100
二、紹介 00百句	ˋ ˆ ˆ ˊ ˆ ˋ	你叫什麼名字	你喊做麼个名	henˋ heemˆ zooˆ bbooˊ gaiˆ miangˋ	k027.k100
二、紹介 00百句	ˋ ˆ ˆ ˆ ˇ ˇ	我叫做李東興	𠊎喊做李東興	ngaiˋ heemˆ zooˆ liˆ dungˇ hinˇ	k028.k100
二、紹介 00百句	ˋ ˆ ˇ ˆ	你幾歲	你幾多歲	henˋ giˆ dooˇ seˆ	k036.k100
二、紹介 00百句	ˋ ˊ ˆ	我[七歲]	𠊎[七歲]	ngaiˋ cidˊ seˆ	k037.k100
二、紹介 00百句	ˋ  ˆ ˇ ˋ	你讀幾年級	你讀幾多年	henˋ tu giˆ dooˇ neenˋ	k049.k100
二、紹介 00百句	ˋ  ˊ ˋ	我讀[一年級]	𠊎讀[一年]	ngaiˋ tu rhidˊ neenˋ	k050.k100
`;
*/


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



/*音檔、音效播放*/
const rightAudio = new Audio('right.mp3');
const wrongAudio = new Audio('wrong.mp3');

// 播放音效;
function playAudio(audio) {
    audio.currentTime = 0;
    audio.play();
}

// 播放音檔;
function playCurrentAudio(audioFileInfo, times = 1) {
	    const playbackSpeed = audioFileInfo.toLowerCase().endsWith('.k100') ? 1.4 : 1;
        let audioUrl = getAudioUrl(audioFileInfo);
        if (audioUrl) {
            playAudioMultipleTimes(audioUrl, times, playbackSpeed)
                .catch(error => console.error('播放音頻時發生錯誤:', error));
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
/*---------------*/


// 1. 修改資料準備和遊戲啟動邏輯
let gameData = []; // 儲存當前遊戲的題目資料
let totalPairs = 0; // 總配對數量
let usedQuestions = []; // 用於追踪已使用題目的陣列
let originalFilteredData = []; // 儲存原始篩選後的資料

// 準備遊戲資料
function prepareGameData() {
    const selectedCategory = lessonSelect.value;
    const questionType = questionSelect.value;
    const answerType = answerSelect.value;
    const selectedCount = parseInt(countSelect.value);

    // 修改：先複製並打亂整個題庫
    let allData = [...data];
    shuffleArray(allData);

    // 根據分類篩選資料
    let filteredData = selectedCategory === '全部' 
        ? allData  // 使用已經打亂的資料
        : allData.filter(item => item[0] === selectedCategory);  // 使用已經打亂的資料進行篩選

    // 第一次載入時初始化題庫
    if (originalFilteredData.length === 0) {
        originalFilteredData = filteredData;
    }

    // 從未使用的題目中選擇
    let availableQuestions = filteredData.filter(q => 
        !usedQuestions.some(used => 
            used[headers.indexOf(questionType)] === q[headers.indexOf(questionType)] &&
            used[headers.indexOf(answerType)] === q[headers.indexOf(answerType)]
        )
    );

    // 如果可用題目不足，重置已使用題目清單
    if (availableQuestions.length < selectedCount) {
        usedQuestions = [];
        availableQuestions = [...originalFilteredData];
    }

    // 選擇指定數量的題目
    gameData = availableQuestions.slice(0, selectedCount);

    // 將選中的題目加入已使用清單
    gameData.forEach(q => usedQuestions.push(q));

    totalPairs = gameData.length;

    if (gameData.length < selectedCount) {
        alert(`警告：僅有 ${gameData.length} 個不重複題目可用`);
    }

    return gameData.length > 0;
}

// 新增：分類選擇變更時重置資料
lessonSelect.addEventListener('change', () => {
    // 重置資料追踪
    usedQuestions = [];
    originalFilteredData = [];
});

// 新增：題目或答案類型選擇變更時重置資料
questionSelect.addEventListener('change', () => {
    usedQuestions = [];
    originalFilteredData = [];
});

// 洗牌函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

answerSelect.addEventListener('change', () => {
    usedQuestions = [];
    originalFilteredData = [];
});

// 更新顯示
function updateDisplays() {
    updateTimeDisplay();
}


// 開始按鈕
// 修改開始按鈕事件處理
startButton.addEventListener('click', () => {
    // 準備遊戲資料
    if (!prepareGameData()) {
        alert('無法開始遊戲：沒有足夠的題目');
        return;
    }
    
    // 重置遊戲狀態
    resetGameState();
    
    // 設定音檔播放次數
    gameState.audioPlaybackTimes = parseInt(playbackTimesSelect.value);
    
    // 設定倒數時間（如果是限時模式）
    if (gameState.winCondition === 'time') {
        gameState.countdown = parseInt(document.getElementById('timeConditionSelect').value);
    }
    
    // 隱藏設定頁面，顯示遊戲容器
    document.getElementById('settingsPage').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // 初始化遊戲
    initGame();
    
    // 開始遊戲和計時
    gameState.isPlaying = true;
    startTimer();
});

// 計時器功能
let timerInterval;




function startTimer() {
    clearInterval(timerInterval);
    
    // 修改：只在第一次開始遊戲時設定倒數時間
    if (gameState.winCondition === 'time' && !timerInterval) {
        gameState.countdown = parseInt(document.getElementById('timeConditionSelect').value);
        gameState.accumulatedScore = 0;
        gameState.completedRounds = 0;
    }
    
    timerInterval = setInterval(() => {
        if (gameState.isPlaying) {
            if (gameState.winCondition === 'time') {
                gameState.countdown--;
                updateTimeDisplay();
                // 修改：時間到時立即停止遊戲並顯示結果
                if (gameState.countdown < 0) {
                    gameState.isPlaying = false;  // 新增：立即停止遊戲
                    clearInterval(timerInterval); // 新增：清除計時器
                    endGame('timeout');
                    return;
                }
            } else {
                gameState.timer++;
                gameState.totalTimer++;
                updateTimeDisplay();
            }
        }
    }, 1000);
}

// 1. 新增遊戲狀態管理

const gameState = {
    selectedCards: [],
    matchedPairs: 0,
    totalMatchedPairs: 0,
    moves: 0,
    score: 0,
    accumulatedScore: 0,    // 新增：追踪限時模式下的累積分數
    completedRounds: 0,     // 新增：追踪限時模式下完成的回合數
    timer: 0,
    totalTimer: 0,
    countdown: 0,
    isPlaying: false,
    audioPlaybackTimes: 2,
    cardMode: 'covered',
    winCondition: 'none',
    timeLimit: 0,
    requiredPairs: 0
};

// 2. 新增卡片建立函數
function createCard(content, type, dataIndex, audioFile = '') {
    const card = document.createElement('div');
    card.className = 'card';
    // 移除任何可能的舊狀態類別
    card.classList.remove('flipped', 'matched', 'selected');
    
    card.dataset.type = type;
    card.dataset.content = content;
    card.dataset.index = dataIndex;
    if (audioFile) {
        card.dataset.audio = audioFile;
    }

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'card-front';

    const back = document.createElement('div');
    back.className = 'card-back';
    back.textContent = content;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    // 根據模式決定是否直接翻開
    if (gameState.cardMode === 'uncovered') {
        card.classList.add('flipped');
    }

    return card;
}

// 3. 新增卡片處理函數

function handleCardClick(card) {
    if (!gameState.isPlaying || 
        card.classList.contains('matched') || 
        gameState.selectedCards.length >= 2) return;

    // 在開牌模式下的特殊處理
    if (gameState.cardMode === 'uncovered') {
        // 已經是翻開狀態，只需要處理選中邏輯
        if (!gameState.selectedCards.includes(card)) {
            // 視覺上標示選中的卡片
            card.classList.add('selected');
            gameState.selectedCards.push(card);
        }
    } else {
        // 蓋牌模式的原有邏輯
        if (card.classList.contains('flipped')) return;
        card.classList.add('flipped');
        gameState.selectedCards.push(card);
    }

    // 播放音效（如果是問題卡片）
    if (card.dataset.type === 'question' && card.dataset.audio) {
        playCurrentAudio(card.dataset.audio, gameState.audioPlaybackTimes);
    }

    if (gameState.selectedCards.length === 2) {
        gameState.moves++;
        updateDisplays();
        checkMatch();
    }
}

// 4. 新增配對檢查函數
function checkMatch() {
    const card1 = gameState.selectedCards[0];
    const card2 = gameState.selectedCards[1];
    // 根據模式設定不同的延遲時間
    const delayTime = gameState.cardMode === 'uncovered' ? 300 : 1000;

    setTimeout(() => {
        // 如果遊戲已經不在進行中，直接返回
        if (!gameState.isPlaying) {
            gameState.selectedCards = [];
            return;
        }

        if (card1.dataset.index === card2.dataset.index) {
            // 配對成功
            card1.classList.add('matched');
            card2.classList.add('matched');

            playAudio(rightAudio);
            gameState.matchedPairs++;          // 當前回合的配對數
            gameState.totalMatchedPairs++;     // 總配對數
            gameState.score += 10;
            if (gameState.winCondition === 'time') {
                gameState.accumulatedScore = gameState.score;
            }

            // 修改：先檢查配對數量模式是否達到目標
            if (gameState.winCondition === 'pairs' && 
                gameState.totalMatchedPairs >= gameState.requiredPairs) {
                gameState.completedRounds++;
                endGame('pairs');
                return; // 重要：達到目標後立即返回，不執行後續代碼
            }

            // 檢查當前回合是否完成
            if (gameState.matchedPairs === totalPairs) {
                // 檢查遊戲是否仍在進行中
                if (!gameState.isPlaying) return;

                if (gameState.winCondition === 'time') {
                    if (gameState.countdown > 0) {  
                        gameState.completedRounds++;
                        setTimeout(() => {
                            document.getElementById('continueButton').click();
                        }, 300);
                    }
                } else if (gameState.winCondition === 'none') {
                    gameState.completedRounds++;
                    endGame('complete');
                } else {
                    // 當前回合完成但未達到配對數量目標，繼續下一回合
                    setTimeout(() => {
                        document.getElementById('continueButton').click();
                    }, 300);
                }
            }
        } else {
            // 配對失敗邏輯
            playAudio(wrongAudio);
            if (gameState.cardMode === 'covered') {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            card1.classList.remove('selected');
            card2.classList.remove('selected');
            gameState.score = Math.max(0, gameState.score - 5);
            if (gameState.winCondition === 'time') {
                gameState.accumulatedScore = gameState.score;
            }
        }
        gameState.selectedCards = [];
    }, delayTime);
}

// 5. 修改遊戲初始化函數

function initGame() {
  const cardGrid = document.getElementById('cardGrid');
  while (cardGrid.firstChild) {
    cardGrid.removeChild(cardGrid.firstChild);
  }

  // 判斷是否需要重置所有數據
  const shouldResetAll = 
    (gameState.winCondition === 'time' && gameState.countdown <= 0) || // 限時模式且時間到
    (gameState.winCondition === 'pairs' && 
    (gameState.totalMatchedPairs === 0 || 
    gameState.totalMatchedPairs >= gameState.requiredPairs)) || // 配對模式且達標或新遊戲
    gameState.winCondition === 'none'; // 一般模式

  // 只在需要時重置總數據
  if (shouldResetAll) {
    gameState.totalMatchedPairs = 0;
    gameState.totalTimer = 0;
    gameState.moves = 0;
    gameState.score = 0;
    gameState.accumulatedScore = 0;
    gameState.completedRounds = 0;
  }

  // 重置當前回合狀態
  gameState.selectedCards = [];
  gameState.matchedPairs = 0;
  gameState.timer = 0;
  gameState.isPlaying = true;

  // 設定卡片模式
  gameState.cardMode = cardModeSelect.value;
  
  // 更新顯示
  updateDisplays();
    
    gameState.audioPlaybackTimes = parseInt(playbackTimesSelect.value) || 2;

    const questionType = questionSelect.value;
    const answerType = answerSelect.value;
    const cards = [];

    // 創建新卡片
    gameData.forEach((item, index) => {
        const questionCard = createCard(
            item[headers.indexOf(questionType)],
            'question',
            index,
            item[headers.indexOf('音檔')]
        );
        const answerCard = createCard(
            item[headers.indexOf(answerType)],
            'answer',
            index
        );
        cards.push(questionCard, answerCard);
    });

    // 設定通過條件
    gameState.winCondition = document.getElementById('winConditionSelect').value;
    // 只在新遊戲開始時設定時間限制
    if (gameState.winCondition === 'pairs') {
        gameState.requiredPairs = parseInt(document.getElementById('pairsConditionSelect').value);
    }

    // 新增：設置卡片網格的 data-card-count 屬性
    const totalCards = cards.length;
    cardGrid.setAttribute('data-card-count', totalCards.toString());

    // 洗牌並添加到網格
    shuffleArray(cards);
    cards.forEach(card => {
        const newCard = card.cloneNode(true);
        cardGrid.appendChild(newCard);
        newCard.addEventListener('click', () => handleCardClick(newCard));
    });
}

// 6. 新增遊戲結束處理
// 格式化時間顯示
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
}

// 建立遊戲結束訊息
function createEndMessage(stats) {
  const messages = [];
  
  // 根據不同統計數據建立訊息
  if (stats.score !== undefined) messages.push(`得分：${stats.score}`);
  if (stats.rounds) messages.push(`回合：${stats.rounds}`);
  if (stats.totalPairs) messages.push(`答對：${stats.totalPairs}`);
  // if (stats.targetPairs) messages.push(`目標配對數：${stats.targetPairs}`);
  if (stats.moves) messages.push(`步數：${stats.moves}`);
  if (stats.time) messages.push(`時間：${formatTime(stats.time)}`);

  
  return messages.join('\n');
}


// 修改 endGame 函數
function endGame(reason) {
  // 停止遊戲
  gameState.isPlaying = false;
  clearInterval(timerInterval);

  const modal = document.getElementById('gameEndModal');
  const messageElement = document.getElementById('gameEndMessage');

  // 根據不同結束原因準備統計數據
  let endMessage;
  const score = gameState.winCondition === 'time' ? 
                gameState.accumulatedScore : 
                gameState.score;

  switch (reason) {
    case 'timeout':
      endMessage = [
        '⏰', // 時間到！
        createEndMessage({
          rounds: gameState.completedRounds,
          totalPairs: gameState.totalMatchedPairs,
          score: score
        })
      ].join('\n');
      break;

    case 'complete':
      endMessage = [
        '🎊', //遊戲完成！
        createEndMessage({
          totalPairs: gameState.totalMatchedPairs,
          moves: gameState.moves,
          time: gameState.totalTimer,
          score: score
        })
      ].join('\n');
      break;

    case 'pairs':
      endMessage = [
        '✨', //達到目標配對數！
        createEndMessage({
          rounds: gameState.completedRounds,
          totalPairs: gameState.totalMatchedPairs,
          targetPairs: gameState.requiredPairs,
          moves: gameState.moves,
          time: gameState.totalTimer,
          score: score
        })
      ].join('\n');
      break;
  }

  // 設置訊息並顯示模態框
  if (messageElement) {
    messageElement.innerHTML = endMessage.replace(/\n/g, '<br>');
  }
  
	setTimeout(function() {
	  if (modal) {
		modal.style.display = 'block';
	  }
	}, 1000); 
  
  // 紀錄遊戲結果
  const gameResult = {
    endReason: reason,
    finalScore: score,
    totalPairs: gameState.totalMatchedPairs,
    totalTime: gameState.totalTimer,
    totalMoves: gameState.moves,
    completedRounds: gameState.completedRounds
  };
  
  // 可以在這裡添加遊戲結果的其他處理，例如儲存最高分等
  // console.log('Game Result:', gameResult);
}


// 修改關閉按鈕事件處理
document.getElementById('closeButton').addEventListener('click', () => {
    // 停止遊戲
    gameState.isPlaying = false;
    clearInterval(timerInterval);
	timerInterval = null;
    
    // 隱藏遊戲容器，顯示設定頁面
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';
    
    // 重置遊戲狀態
    resetGameState();
	updateTimeDisplay();
});

// 修改遊戲結束對話框按鈕事件
document.getElementById('returnButton').addEventListener('click', () => {
    document.getElementById('gameEndModal').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('settingsPage').style.display = 'block';
    
    // 只有在達成目標配對數時才重置追踪
    if (gameState.winCondition !== 'pairs' || 
        gameState.totalMatchedPairs >= gameState.requiredPairs) {
        usedQuestions = [];
        originalFilteredData = [];
        // 重置遊戲狀態
        gameState.totalMatchedPairs = 0;
        gameState.totalTimer = 0;
        gameState.moves = 0;
        gameState.score = 0;
    }
});

// 繼續按鈕事件處理
// 修改 continueButton 的事件處理器
document.getElementById('continueButton').addEventListener('click', () => {
  document.getElementById('gameEndModal').style.display = 'none';
  
  // 限時模式的特殊處理
  if (gameState.winCondition === 'time') {
    if (gameState.countdown <= 0) {
      // 時間結束後重新開始，重置所有數據
      usedQuestions = [];
      originalFilteredData = [];
      gameState.totalMatchedPairs = 0;
      gameState.totalTimer = 0;
      gameState.moves = 0;
      gameState.score = 0;
      gameState.accumulatedScore = 0;
      gameState.completedRounds = 0;
      gameState.countdown = parseInt(document.getElementById('timeConditionSelect').value);
    }
    // 如果時間還沒到，保持累計分數和回合數
  } else if (gameState.winCondition === 'pairs' && 
             gameState.totalMatchedPairs >= gameState.requiredPairs) {
    // 配對模式達標時重置
    usedQuestions = [];
    originalFilteredData = [];
    gameState.totalMatchedPairs = 0;
    gameState.totalTimer = 0;
    gameState.moves = 0;
    gameState.score = 0;
    gameState.accumulatedScore = 0;
    gameState.completedRounds = 0;
  }
  
  // 準備新的遊戲資料
  if (!prepareGameData()) {
    alert('無法開始遊戲：沒有足夠的題目');
    return;
  }
  
  // 重新開始遊戲
  gameState.isPlaying = true;
  initGame();
  startTimer();
});

function updateDisplays() {
    updateMoveDisplay();
    updateScoreDisplay();
    updateTimeDisplay();
}



// 更新移動步數顯示
function updateMoveDisplay() {
    const moveDisplay = document.getElementById('moveDisplay');
    if (moveDisplay) {
        moveDisplay.textContent = `步數: ${gameState.moves}`;
    }
}

// 更新分數顯示
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (scoreDisplay) {
        scoreDisplay.textContent = `分數: ${gameState.score}`;
    }
}

// 更新時間顯示

function updateTimeDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        if (gameState.winCondition === 'time') {
            // 倒數計時顯示
            const minutes = Math.floor(gameState.countdown / 60);
            const seconds = gameState.countdown % 60;
            timeDisplay.textContent = `剩餘時間: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // 當時間少於10秒時加入視覺提醒
            if (gameState.countdown <= 10) {
                timeDisplay.className = 'time-warning';
            } else {
                timeDisplay.className = '';
            }
        } else {
            // 一般計時顯示
            const minutes = Math.floor(gameState.totalTimer / 60);
            const seconds = gameState.totalTimer % 60;
            timeDisplay.textContent = `時間: ${minutes}:${seconds.toString().padStart(2, '0')}`;
			timeDisplay.classList.remove('time-warning');
        }
    }
}


document.getElementById('winConditionSelect').addEventListener('change', function() {
    const timeConditionDiv = document.getElementById('timeConditionDiv');
    const pairsConditionDiv = document.getElementById('pairsConditionDiv');
	const timeDisplay = document.getElementById('timeDisplay'); 
    
    timeConditionDiv.style.display = 'none';
    pairsConditionDiv.style.display = 'none';

    // 清除時間警告樣式
    if (timeDisplay) {  // 新增這段
        timeDisplay.classList.remove('time-warning');
    }

    if (this.value === 'time') {
        timeConditionDiv.style.display = 'block';
    } else if (this.value === 'pairs') {
        pairsConditionDiv.style.display = 'block';
    }
});


// 重置遊戲狀態的函數
function resetGameState() {
    // 重置所有追蹤數據
    usedQuestions = [];
    originalFilteredData = [];
    
    // 重置遊戲狀態
    gameState.totalMatchedPairs = 0;
    gameState.matchedPairs = 0;
    gameState.totalTimer = 0;
    gameState.timer = 0;
    gameState.moves = 0;
    gameState.score = 0;
    gameState.accumulatedScore = 0;
    gameState.completedRounds = 0;
    gameState.selectedCards = [];
    gameState.isPlaying = false;
    
    // 清除計時器
    clearInterval(timerInterval);
	timerInterval = null;
}

// 初始化時根據預設選項顯示對應的條件選項
document.addEventListener('DOMContentLoaded', function() {
    const winCondition = document.getElementById('winConditionSelect').value;
    const timeConditionDiv = document.getElementById('timeConditionDiv');
    const pairsConditionDiv = document.getElementById('pairsConditionDiv');
    
    timeConditionDiv.style.display = 'none';
    pairsConditionDiv.style.display = 'none';
    
    if (winCondition === 'time') {
        timeConditionDiv.style.display = 'block';
    } else if (winCondition === 'pairs') {
        pairsConditionDiv.style.display = 'block';
    }
});