
    let watermark = document.createElement('div');
    watermark.innerHTML = '🥷烏衣行';

    // 設定浮水印的樣式
    watermark.style.position = 'fixed';
    watermark.style.bottom = '10px';
    watermark.style.right = '10px'; // left
    watermark.style.opacity = '0.3'; 
    watermark.style.fontSize = '12px';
    watermark.style.color = 'black';
    watermark.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; 
    watermark.style.padding = '5px 10px';
    watermark.style.borderRadius = '5px';
    watermark.style.cursor = 'pointer';
    watermark.style.zIndex = '1000'; 
    watermark.style.textAlign = 'center';

    // 設定 hover 時的效果
    watermark.addEventListener('mouseover', function() {
        watermark.style.opacity = '0.8'; // 滑過時增加透明度
    });
    watermark.addEventListener('mouseout', function() {
        watermark.style.opacity = '0.3'; // 離開滑鼠時恢復透明度
    });

    // 點擊事件：打開新視窗
    watermark.onclick = function() {
        window.open('https://sites.google.com/view/oikasu', '_blank');
    };

    // 將浮水印元素加入到 body
    document.body.appendChild(watermark);
