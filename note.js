let container = document.getElementById('simple-notes');
if (!container) {
const fontLink = document.createElement('link');
fontLink.href = 'https://oikasu1.github.io/kasuexam/kasu/fonts/twhei.css';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);
const style = document.createElement('style');
style.textContent = `
#simple-notes {
position: fixed;
top: 20px;
right: 20px;
z-index: 9999;
font-family: "TWHei", sans-serif;
}
.note {
background: #ffeb3b;
padding: 10px 10px 10px 10px;
margin-bottom: 10px;
min-width: 150px;
min-height: 50px;
box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
position: relative;
}
.note-header {
display: flex;
justify-content: flex-end;
align-items: center;
margin-bottom: 5px;
padding: 0 2px;
gap: 5px;
margin-top: -5px;
height: 24px;
}
.note button {
border: none;
background: none;
color: inherit;
cursor: pointer;
font-size: 16px;
padding: 0 4px;
}
.note button:hover {
opacity: 0.7;
}
.note textarea {
    width: 100%;
    box-sizing: border-box;
    height: calc(100% - 25px);
    border: none;
    background: none;
    resize: none;
    font-size: 14px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,0,0,0.2) transparent;
    color: inherit;
    outline: none;
    margin-bottom: 5px;
}
.note textarea::-webkit-scrollbar {
width: 4px;
}
.note textarea::-webkit-scrollbar-thumb {
background: rgba(0,0,0,0.2);
border-radius: 2px;
}
.note textarea::-webkit-scrollbar-track {
background: transparent;
}
.note .resize-handle {
position: absolute;
right: 0;
bottom: 0;
width: 15px;
height: 15px;
cursor: se-resize;
opacity: 0.5;
text-align: right;
line-height: 15px;
font-size: 12px;
padding-right: 2px;
}
.color-picker, .font-size-picker {
position: relative;
}
.color-btn, .font-size-btn {
border: none;
background: none;
color: inherit;
cursor: pointer;
font-size: 16px;
padding: 0 4px;
margin: 0;
line-height: 16px;
}
.color-options, .font-size-options {
display: none;
position: absolute;
top: 100%;
left: 0;
background: white;
padding: 5px;
border-radius: 3px;
box-shadow: 0 2px 5px rgba(0,0,0,0.2);
z-index: 10000;
}
.color-options.show, .font-size-options.show {
display: grid;
}
.color-options {
grid-template-columns: repeat(3, 1fr);
gap: 3px;
}
.font-size-options {
display: none;
width: max-content;
}
.font-size-options.show {
display: block;
}
.color-option {
width: 15px;
height: 15px;
border-radius: 50%;
cursor: pointer;
border: 1px solid #ccc;
}
.font-size-option {
padding: 5px 10px;
cursor: pointer;
white-space: nowrap;
}
.font-size-option:hover {
background: #f0f0f0;
}
`;
document.head.appendChild(style);
container = document.createElement('div');
container.id = 'simple-notes';
document.body.appendChild(container);
}
const colors = {
'#ffeb3b': 'dark',
'#ff9800': 'dark',
'#4caf50': 'light',
'#03a9f4': 'light',
'#e91e63': 'light',
'#9c27b0': 'light',
'#3f51b5': 'light',
'#607d8b': 'light',
'#fff': 'dark',
'#333': 'light'
};
const fontSizes = [
{ label: '小', value: '14px', lightColor: 'white', darkColor: 'black' },
{ label: '中', value: '16px', lightColor: 'white', darkColor: 'black' },
{ label: '大', value: '22px', lightColor: 'white', darkColor: 'black' },
{ label: '特大', value: '32px', lightColor: 'white', darkColor: 'black' },
{ label: '超大', value: '56px', lightColor: 'white', darkColor: 'black' }
];
function createNote(text = '', left = '', top = '', width = '', height = '', color = '#ffeb3b', fontSize = '14px') {
const note = document.createElement('div');
note.className = 'note';
setNoteColor(note, color);
if (width) note.style.width = width;
if (height) note.style.height = height;
note.innerHTML = `
<div class="note-header">
<div class="font-size-picker">
<button class="font-size-btn" title="字體大小">A</button>
<div class="font-size-options">
${fontSizes.map(size => 
`<div class="font-size-option" data-size="${size.value}" style="color: ${colors[color] === 'light' ? size.lightColor : size.darkColor}">${size.label}</div>`
).join('')}
</div>
</div>
<div class="color-picker">
<button class="color-btn" title="更換顏色">⊙</button>
<div class="color-options">
${Object.keys(colors).map(c =>
`<div class="color-option" style="background-color: ${c}" data-color="${c}"></div>`
).join('')}
</div>
</div>
<button class="add" title="新增">⊕</button>
<button class="close" title="刪除">⊗</button>
</div>
<textarea placeholder="輸入內容...">${text}</textarea>
<div class="resize-handle">⋯</div>
`;
const textarea = note.querySelector('textarea');
textarea.style.height = `${Math.max(note.offsetHeight - 35, 15)}px`;
textarea.style.fontSize = fontSize;
if (left && top) {
note.style.position = 'fixed';
note.style.left = left;
note.style.top = top;
}
const colorBtn = note.querySelector('.color-btn');
const colorOptions = note.querySelector('.color-options');
colorBtn.onclick = (e) => {
e.stopPropagation();
colorOptions.classList.toggle('show');
fontSizeOptions.classList.remove('show'); 
};
const fontSizeBtn = note.querySelector('.font-size-btn');
const fontSizeOptions = note.querySelector('.font-size-options');
fontSizeBtn.onclick = (e) => {
e.stopPropagation();
fontSizeOptions.classList.toggle('show');
colorOptions.classList.remove('show');
};
document.addEventListener('click', () => {
colorOptions.classList.remove('show');
fontSizeOptions.classList.remove('show');
});
note.querySelectorAll('.color-option').forEach(option => {
option.onclick = function(e) {
e.stopPropagation();
const newColor = this.dataset.color;
setNoteColor(note, newColor);
colorOptions.classList.remove('show');
saveNotes();
};
});
note.querySelectorAll('.font-size-option').forEach(option => {
option.onclick = function(e) {
    e.stopPropagation();
    const newSize = this.dataset.size;
    const textarea = note.querySelector('textarea');
    textarea.style.fontSize = newSize;
    fontSizeOptions.classList.remove('show');
    saveNotes();
};
});
function setNoteColor(noteElement, bgColor) {
  noteElement.style.backgroundColor = bgColor;
  const textColor = colors[bgColor] === 'light' ? 'white' : 'black';
  const headerColor = colors[bgColor] === 'light' ? 'white' : textColor;
  noteElement.style.color = textColor;
  noteElement.querySelectorAll('.font-size-btn').forEach(button => {
    button.style.color = headerColor;
  });
}
note.addEventListener('mousedown', function(e) {
if (e.target.tagName === 'TEXTAREA' ||
e.target.tagName === 'BUTTON' ||
e.target.classList.contains('color-option') ||
e.target.classList.contains('font-size-option') ||
e.target.classList.contains('resize-handle')) return;
const shiftX = e.clientX - note.getBoundingClientRect().left;
const shiftY = e.clientY - note.getBoundingClientRect().top;
note.style.position = 'fixed';
function moveAt(x, y) {
note.style.left = (x - shiftX) + 'px';
note.style.top = (y - shiftY) + 'px';
}
function onMouseMove(e) {
moveAt(e.clientX, e.clientY);
}
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', () => {
document.removeEventListener('mousemove', onMouseMove);
saveNotes();
});
});
const resizeHandle = note.querySelector('.resize-handle');
resizeHandle.addEventListener('mousedown', function(e) {
e.stopPropagation();
const startX = e.clientX;
const startY = e.clientY;
const startWidth = note.offsetWidth;
const startHeight = note.offsetHeight;
function onMouseMove(e) {
let newWidth = startWidth + (e.clientX - startX);
let newHeight = startHeight + (e.clientY - startY);
newWidth = Math.max(150, newWidth);
newHeight = Math.max(50, newHeight);
note.style.width = newWidth + 'px';
note.style.height = newHeight + 'px';
textarea.style.height = `${newHeight - 35}px`;
}
function onMouseUp() {
document.removeEventListener('mousemove', onMouseMove);
document.removeEventListener('mouseup', onMouseUp);
saveNotes();
}
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);
});
note.querySelector('.add').onclick = () => {
createNote();
saveNotes();
};
note.querySelector('.close').onclick = () => {
note.remove();
saveNotes();
};
note.querySelector('textarea').addEventListener('input', saveNotes);
container.appendChild(note);
requestAnimationFrame(() => {
textarea.style.height = `${Math.max(note.offsetHeight - 35, 15)}px`;
});
return note;
}
function saveNotes() {
const notes = Array.from(document.querySelectorAll('.note')).map(note => ({
text: note.querySelector('textarea').value,
left: note.style.left,
top: note.style.top,
width: note.style.width,
height: note.style.height,
color: note.style.backgroundColor,
fontSize: note.querySelector('textarea').style.fontSize
}));
localStorage.setItem('simple-notes', JSON.stringify(notes));
}
const saved = localStorage.getItem('simple-notes');
if (saved) {
const notes = JSON.parse(saved);
if (notes.length > 0) {
notes.forEach(note => {
createNote(note.text, note.left, note.top, note.width, note.height, note.color, note.fontSize);
});
} else {
createNote();
}
} else {
createNote();
}