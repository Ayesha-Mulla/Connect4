class Connect4 {
  constructor(selector) {
    this.ROWS = 6;
    this.COLS = 7;
    this.player = 'red';
    this.selector = selector;
    this.isGameOver = false;
    this.onPlayerMove = function () { };
    this.createGrid();
    this.setupEventListeners();
  }

  /**
   * This function creates grid.
   */
  createGrid() {
    const board = document.getElementById(this.selector);
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
    this.isGameOver = false;
    this.player = 'red';
    for (let row = 0; row < this.ROWS; row++) {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');
      for (let col = 0; col < this.COLS; col++) {
        const colElement = document.createElement('div');
        colElement.classList.add('col', 'empty');
        colElement.dataset.col = col;
        colElement.dataset.row = row;
        rowElement.appendChild(colElement);
      }
      board.appendChild(rowElement);
    }
  }

  /**
   * This function attaches event listeners.
   */
  setupEventListeners() {
    const board = document.getElementById(this.selector);
    const that = this;

    function findLastEmptyCell(col) {
      const cells = document.querySelectorAll(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--) {
        const cellElement = cells[i];
        if (cellElement.classList.contains('empty')) {
          return cellElement;
        }
      }
      return null;
    }

    board.addEventListener('click', function (event) {
      if (event.target.className === 'col empty') {
        if (that.isGameOver) return;
        const col = event.target.dataset.col;
        const lastEmptyCell = findLastEmptyCell(col);
        lastEmptyCell.classList.remove('empty');
        lastEmptyCell.classList.add(that.player);
        lastEmptyCell.dataset.player = that.player;

        const winner = that.checkForWinner(
          lastEmptyCell.dataset.row,
          lastEmptyCell.dataset.col
        )
        if (winner) {
          that.isGameOver = true;
          alert(`Game Over! Player ${that.player} has won!`);
          document.querySelector('.col.empty').classList.remove('empty');
          return;
        }

        that.player = (that.player === 'red') ? 'black' : 'red';
        that.onPlayerMove();
      }
    });
  }

  /**
   * This function checks for winner whenever user clicks on cell.
   * @param {*} row row Value.
   * @param {*} col col value.
   */
  checkForWinner(row, col) {
    const that = this;

    function getCell(i, j) {
      return document.querySelector(`.col[data-row='${i}'][data-col='${j}']`);
    }

    /**
     * Checks connecting cells in respective direction.
     * @param {*} direction - horizontal/vertical/diagonal.
     */
    function checkDirection(direction) {
      let total = 0;
      let i = parseInt(row) + parseInt(direction.i);
      let j = parseInt(col) + parseInt(direction.j);
      let next = getCell(i, j);
      while (i >= 0 &&
        i < that.ROWS &&
        j >= 0 &&
        j < that.COLS &&
        next.dataset.player === that.player
      ) {
        total++;
        i += direction.i;
        j += direction.j;
        next = getCell(i, j);
      }
      return total;
    }

    /**
     * Checks on each click if total is 4.
     * @param {*} directionA
     * @param {*} directionB
     */
    function checkWin(directionA, directionB) {
      const total = 1 +
        checkDirection(directionA) +
        checkDirection(directionB);
      if (total >= 4) {
        return that.player;
      } else {
        return null;
      }
    }

    /**
     * Checks diagonal from bottom left to top right cells.
     */
    function checkDiagonalBLtoTR() {
      return checkWin({ i: 1, j: -1 }, { i: 1, j: 1 });
    }

    /**
     * Checks diagonal from top left to bottom right cells.
     */
    function checkDiagonalTLtoBR() {
      return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 });
    }

    /**
     * Checks vertical cells.
     */
    function checkVerticals() {
      return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
    }

    /**
     * Checks horizonal cells.
     */
    function checkHorizontals() {
      return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
    }

    return checkVerticals() ||
      checkHorizontals() ||
      checkDiagonalBLtoTR() ||
      checkDiagonalTLtoBR();
  }

  /**
   * This function resets the grid.
   */
  restart() {
    this.createGrid();
    this.onPlayerMove();
  }
}
