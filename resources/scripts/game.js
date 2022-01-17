var SCREEN = {};
var PLAYER = {};
function initGame() {
  registerKeyPressEvents();
  showPlayButton(false);
  showScreen(true);

  initScreenObject();
  initPlayerObject();
}

function showPlayButton(state) {
  var play_btn = document.getElementById('play-btn');
  play_btn.style.display = state ? 'inline-block' : 'none';
}

function showScreen(state) {
  var game_screen = document.getElementById('game-screen');
  game_screen.style.display = state ? 'block' : 'none';
}

function initScreenObject() {
  SCREEN['element'] = document.getElementById('game-screen');
  var pos = SCREEN.element.getBoundingClientRect();
  SCREEN['x'] = pos.x;
  SCREEN['left'] = pos.left;
  SCREEN['right'] = pos.right;
}

function initPlayerObject() {
  PLAYER['element'] = document.getElementById('player');
  PLAYER['width'] = PLAYER.element.getBoundingClientRect().width;
}

function registerKeyPressEvents() {
  document.addEventListener('keydown', keydown);
}

function keydown(event) {
  console.log(event.code);
  switch(event.code) {
    case 'ArrowRight': movePlayerRight(); break;
    case 'ArrowLeft': movePlayerLeft(); break;
  }
}

function movePlayerRight() {
  var currentPlayerPos = PLAYER.element.getBoundingClientRect();
  var newPos = (currentPlayerPos.x - SCREEN.x) + PLAYER.width;

  if((newPos + SCREEN.left) < (SCREEN.right - (2 * PLAYER.width))) {
    player.style.left = newPos + 'px';
  } else {
    player.style.left = '0px';
  }
}

function movePlayerLeft() {
  var currentPlayerPos = PLAYER.element.getBoundingClientRect();
  var newPos = (currentPlayerPos.x - SCREEN.x) - PLAYER.width;

  if((newPos + SCREEN.left) > (SCREEN.left + PLAYER.width)) {
    player.style.left = newPos + 'px';
  } else {
    player.style.left = SCREEN.right - SCREEN.left - (2* PLAYER.width) + 'px';
  }
}