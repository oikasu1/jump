
// 在檢視模式狀態部分新增
let isGroupMode = true;
let currentIndex = 0;
let isRandomMode = false;  // 新增：控制是否為亂數模式
let randomIndices = [];    // 新增：儲存亂數順序的陣列

// 在創建導航按鈕容器的部分新增亂數按鈕
const randomButton = document.createElement('button');
randomButton.className = 'nav-button';
randomButton.innerHTML = '順';
randomButton.title = '切換順序/亂數模式';

// 3. 新增顯示檢視清單的函數
function showViewList() {
  const gameContainer = document.getElementById('gameContainer');
  const settingsPage = document.getElementById('settingsPage');
  const selectedCategory = lessonSelect.value;
  const questionType = questionSelect.value;
  const answerType = answerSelect.value;

  // 過濾資料
  let filteredData = selectedCategory === '全部' 
    ? data 
    : data.filter(item => item[0] === selectedCategory);

  // 創建主容器
  const viewContainer = document.createElement('div');
  viewContainer.id = 'viewContainer';
  viewContainer.className = 'view-container';

  // 檢視模式狀態
  let isGroupMode = true;
  let currentIndex = 0;

  // 創建內容容器
  const contentContainer = document.createElement('div');
  contentContainer.className = 'content-container';

  // 創建並設置導航按鈕容器
  const navButtonsContainer = document.createElement('div');
  navButtonsContainer.className = 'nav-buttons-container';

  // 返回設定按鈕
  const backButton = document.createElement('button');
  backButton.className = 'nav-button';
  backButton.innerHTML = '✕';
  backButton.title = '返回設定';
  backButton.onclick = returnToSettings;

  // 檢視模式切換按鈕
  const modeSwitch = document.createElement('button');
  modeSwitch.className = 'nav-button';
  modeSwitch.innerHTML = '單';
  modeSwitch.title = '切換檢視模式';

  // 上一個/組按鈕
  const prevButton = document.createElement('button');
  prevButton.className = 'nav-button';
  prevButton.innerHTML = '←';
  prevButton.title = '上一個';

  // 下一個/組按鈕
  const nextButton = document.createElement('button');
  nextButton.className = 'nav-button';
  nextButton.innerHTML = '→';
  nextButton.title = '下一個';

  // 渲染群組視圖的函數
function renderGroupView() {
    contentContainer.innerHTML = '';
    for (let i = 0; i < filteredData.length; i += 5) {
        const group = filteredData.slice(i, i + 5);
        const groupContainer = document.createElement('div');
        groupContainer.className = 'group-container';
        const groupTitle = document.createElement('h3');
        groupTitle.id = `group-${Math.floor(i/5)}`;
        groupTitle.textContent = `第 ${Math.floor(i/5) + 1} 組`;
        groupContainer.appendChild(groupTitle);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-container';
        group.forEach((item, index) => {
            const itemElement = createItemElement(item, i + index);
            itemsContainer.appendChild(itemElement);
        });
        groupContainer.appendChild(itemsContainer);
        contentContainer.appendChild(groupContainer);
    }
}

// 渲染單個視圖的函數

function renderSingleView() {
    contentContainer.innerHTML = '';
    const singleViewContainer = document.createElement('div');
    singleViewContainer.className = 'single-view-container';
    
    // 創建卡片容器
    const card = document.createElement('div');
    card.className = 'single-card';

    // 創建進度條容器並放在卡片頂部
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    // 創建進度條
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'progress-slider';
    slider.min = '0';
    slider.max = (isRandomMode ? randomIndices.length : filteredData.length) - 1;
    slider.value = isRandomMode ? randomIndices.indexOf(currentIndex) : currentIndex;
    
    // 進度條事件處理
    slider.addEventListener('input', (e) => {
        if (isRandomMode) {
            currentIndex = randomIndices[parseInt(e.target.value)];
        } else {
            currentIndex = parseInt(e.target.value);
        }
        renderCard();
    });
    
    // 加入進度條
    sliderContainer.appendChild(slider);
    
    // 創建內容容器
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';
    
    // 添加語詞卡內容
    const item = filteredData[currentIndex];
    const itemElement = createItemElement(item, currentIndex);
    
    // 組裝卡片：進度條在上，內容在下
    card.appendChild(sliderContainer);
    contentWrapper.appendChild(itemElement);
    card.appendChild(contentWrapper);
    
    singleViewContainer.appendChild(card);
    contentContainer.appendChild(singleViewContainer);
}



function renderCard() {
    const card = document.querySelector('.single-card');
    if (card) {
        // 保存現有的進度條值和監聽器
        const existingSlider = card.querySelector('.progress-slider');
        const currentValue = existingSlider ? existingSlider.value : (isRandomMode ? randomIndices.indexOf(currentIndex) : currentIndex);
        
        // 清空卡片內容
        card.innerHTML = '';
        
        // 重新創建進度條容器
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        // 創建新的進度條
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'progress-slider';
        slider.min = '0';
        slider.max = (isRandomMode ? randomIndices.length : filteredData.length) - 1;
        slider.value = currentValue;
        
        // 重新綁定事件監聽器
        slider.addEventListener('input', function(e) {
            const newIndex = parseInt(e.target.value);
            if (isRandomMode) {
                currentIndex = randomIndices[newIndex];
            } else {
                currentIndex = newIndex;
            }
            updateCardContent();
        });
        
        sliderContainer.appendChild(slider);
        card.appendChild(sliderContainer);
        
        // 創建並添加內容
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        const item = filteredData[currentIndex];
        const itemElement = createItemElement(item, currentIndex);
        contentWrapper.appendChild(itemElement);
        card.appendChild(contentWrapper);
    }
}

// 輔助函數，只更新卡片內容而不重新創建進度條
function updateCardContent() {
    const card = document.querySelector('.single-card');
    if (card) {
        const contentWrapper = card.querySelector('.content-wrapper');
        if (contentWrapper) {
            const item = filteredData[currentIndex];
            const itemElement = createItemElement(item, currentIndex);
            contentWrapper.innerHTML = '';
            contentWrapper.appendChild(itemElement);
        }
        
        // 更新進度條值
        const slider = card.querySelector('.progress-slider');
        if (slider) {
            slider.value = isRandomMode ? randomIndices.indexOf(currentIndex) : currentIndex;
        }
    }
}

// 創建項目元素的輔助函數
function createItemElement(item, index) {
  const itemElement = document.createElement('div');
  itemElement.className = 'item';

  if (!isGroupMode) {
    // 單個檢視模式下
    const indexElement = document.createElement('div');
    indexElement.className = 'item-number';
    indexElement.textContent = `${index + 1} / ${filteredData.length}`;
    itemElement.appendChild(indexElement);
  } else {
    // 分組檢視模式下
    const indexElement = document.createElement('div');
    indexElement.className = 'item-number';
    indexElement.textContent = `${index + 1}`;
    itemElement.appendChild(indexElement);
  }

  // 題目和答案顯示元素
  const questionElement = document.createElement('div');
  questionElement.className = 'item-question clickable';
  questionElement.textContent = item[headers.indexOf(questionType)];
  const answerElement = document.createElement('div');
  answerElement.className = 'item-answer clickable';
  answerElement.textContent = item[headers.indexOf(answerType)];

  // 組裝元素
  itemElement.appendChild(questionElement);
  itemElement.appendChild(answerElement);

  const audioFile = item[headers.indexOf('音檔')];

  // 點擊效果修改
  const clickHandler = (element) => {
    element.addEventListener('click', () => {
      if (audioFile) {
        playCurrentAudioData(audioFile, 1);
        element.style.color = 'blue'; // 播放時變為藍色
        setTimeout(() => {
          element.style.color = ''; // 恢復原色
        }, 1500);
      }
    });
  };

  clickHandler(questionElement);
  clickHandler(answerElement);

  return itemElement;
}

// 導航函數
function navigate(direction) {
    if (isGroupMode) {
        // 分組模式的導航保持不變
        const totalGroups = Math.ceil(filteredData.length / 5);
        const currentGroup = Math.floor(currentIndex / 5);
        const newGroupIndex = currentGroup + direction;
        if (newGroupIndex >= 0 && newGroupIndex < totalGroups) {
            currentIndex = newGroupIndex * 5;
            const targetElement = document.getElementById(`group-${newGroupIndex}`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else {
        // 單字卡模式的導航
        if (isRandomMode) {
            const currentRandomIndex = randomIndices.indexOf(currentIndex);
            const newRandomIndex = currentRandomIndex + direction;
            if (newRandomIndex >= 0 && newRandomIndex < randomIndices.length) {
                currentIndex = randomIndices[newRandomIndex];
                updateCardContent(); // 使用新函數
            }
        } else {
            const newIndex = currentIndex + direction;
            if (newIndex >= 0 && newIndex < filteredData.length) {
                currentIndex = newIndex;
                updateCardContent(); // 使用新函數
            }
        }
    }
}

// 亂數模式切換函數
function toggleRandomMode() {
    isRandomMode = !isRandomMode;
    randomButton.innerHTML = isRandomMode ? '亂' : '順';
    randomButton.title = isRandomMode ? '切換為順序模式' : '切換為亂數模式';
    console.log("B")
    if (isRandomMode) {
		console.log("A")
        // 生成亂數順序
        randomIndices = Array.from({length: filteredData.length}, (_, i) => i);
        for (let i = randomIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomIndices[i], randomIndices[j]] = [randomIndices[j], randomIndices[i]];
        }
        // 從當前組的第一個詞開始
        const currentGroup = Math.floor(currentIndex / 5);
        currentIndex = randomIndices[0];
    } else {
        // 返回順序模式時，回到當前組的第一個詞
        currentIndex = Math.floor(currentIndex / 5) * 5;
    }
    renderSingleView();
}

// 在亂數按鈕加入事件監聽
modeSwitch.addEventListener('click', () => {
    isGroupMode = !isGroupMode;
    modeSwitch.innerHTML = isGroupMode ? '單' : '全';
    modeSwitch.title = isGroupMode ? '切換為單個模式' : '切換為分組模式';
    
    // 控制亂數按鈕的顯示/隱藏
    randomButton.style.display = isGroupMode ? 'none' : 'flex';
    
    if (isGroupMode) {
        // 從單詞檢視切換到分組檢視
        // 計算當前詞應該在哪一組，並滾動到該組
        const groupIndex = Math.floor(currentIndex / 5);
        currentIndex = groupIndex * 5; // 將當前索引設為該組的第一個
        renderGroupView();
        // 滾動到對應的組
        const targetElement = document.getElementById(`group-${groupIndex}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // 從分組檢視切換到單詞檢視
        // 保持 currentIndex 在當前組的第一個詞
        currentIndex = Math.floor(currentIndex / 5) * 5;
        renderSingleView();
    }
});
// 預設隱藏亂數按鈕
randomButton.style.display = 'none';

// 在亂數按鈕加入事件監聽
randomButton.addEventListener('click', toggleRandomMode);

  // 按鈕事件監聽
  prevButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));

  // 添加所有按鈕到容器
  navButtonsContainer.appendChild(backButton);
  navButtonsContainer.appendChild(modeSwitch);
  navButtonsContainer.appendChild(randomButton);
  navButtonsContainer.appendChild(prevButton);
  navButtonsContainer.appendChild(nextButton);

  // 初始渲染群組視圖
  renderGroupView();

  // 添加容器到視圖
  viewContainer.appendChild(contentContainer);
  viewContainer.appendChild(navButtonsContainer);

  // 鍵盤導航
  function handleKeyNavigation(event) {
    switch(event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        navigate(-1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        navigate(1);
        break;
    }
  }

// 滑鼠按鈕事件處理
function handleMouseNavigation(event) {
  // 滑鼠後退鍵 (簡報筆上一頁)
  if (event.button === 33) {
    event.preventDefault();
    navigate(-1);
  }
  // 滑鼠前進鍵 (簡報筆下一頁)
  if (event.button === 34) {
    event.preventDefault();
    navigate(1);
  }
}

document.addEventListener('mouseup', (event) => {
  console.log('按鈕編號:', event.button);
});


// 添加鍵盤和滑鼠事件監聽
document.addEventListener('keydown', handleKeyNavigation);
document.addEventListener('mouseup', handleMouseNavigation);


  document.addEventListener('keydown', handleKeyNavigation);

  // 清理功能
const cleanup = () => {
  document.removeEventListener('keydown', handleKeyNavigation);
  document.removeEventListener('mouseup', handleMouseNavigation);
};
  // 更新返回設定的處理
  backButton.onclick = () => {
    cleanup();
    returnToSettings();
  };

  // 隱藏設定頁面，顯示視圖
  settingsPage.style.display = 'none';
  document.body.appendChild(viewContainer);
}
