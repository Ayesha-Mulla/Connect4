document.addEventListener('DOMContentLoaded', function () {
  const connect4 = new Connect4('connect4');

  connect4.onPlayerMove = function () {
    document.getElementById('player').innerText = connect4.player;
  }

  document.getElementById('restart').onclick = (function () {
    connect4.restart();
  })
});
