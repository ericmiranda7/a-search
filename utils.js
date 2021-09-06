import PriorityQueue from './PriorityQueue.js'

const costs = {
  1: "white",
  2: "#68bb59",
  3: "#70543e",
  0: "grey"
}

function createSquare(squareNumber) {
  let square = document.createElement('span');
  square.className = 'square';
  square.id = squareNumber;
  return { id: squareNumber, element: square, cost: 1 }
}

class Board {
  squares = []
  n
  editor = null
  editorCost = 1
  myPosition = 0
  xPosition
  constructor(n) {
    this.n = n;
    this.xPosition = (n * n) - 1
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const sqNo = (n * i) + j;
        const square = createSquare(sqNo);
        square.element.tabIndex = 0;
        square.element.onmouseover = () => this.changeCost(sqNo);
        square.element.onkeydown = (e) => this.changePositions(sqNo, e.key);
        this.squares.push(square);
      }
    }
    this.initBoard();
  }

  initBoard() {
    for (let i = 0; i < this.n; i++) {
      let tr = document.createElement('tr')
      for (let j = 0; j < this.n; j++) {
        const sqNo = (this.n * i) + j;
        let td = document.createElement('td');
        if (sqNo === this.myPosition || sqNo === this.xPosition) {
          const mySquare = this.squares[sqNo].element;
          const positionText = document.createElement('span');
          positionText.innerHTML = sqNo === this.myPosition ? 'E' : 'X';
          mySquare.appendChild(positionText);
        }
        td.appendChild(this.squares[sqNo].element);
        tr.appendChild(td);
      }
      table.appendChild(tr)
    }
  }

  reDrawBoard() {
    for (let square of this.squares) {
      if (square.id === this.myPosition) square.element.innerHTML = 'E';
      else if (square.id === this.xPosition) square.element.innerHTML = 'X';
      else square.element.innerHTML = '';
    }
  }

  changeCost(squareNumber) {
    if (!this.editor) return
    let square = this.squares[squareNumber]
    square.cost = this.editorCost;
    square.element.style.backgroundColor = costs[square.cost];
  }

  changePositions(squareNumber, key) {
    console.log(squareNumber, key)
    if (key === 'e') this.myPosition = squareNumber;
    else if (key === 'x') this.xPosition = squareNumber;
    this.reDrawBoard();
  }

  clearBoard() {
    for (const square of this.squares) {
      square.cost = 1;
      square.element.style.backgroundColor = "white";
    }
  }

  clearFoundPath() {
    for (let square of this.squares) {
      if (square.element.style.backgroundColor === "yellow") {
        // reset to cost color
        square.element.style.backgroundColor = costs[square.cost];
      }
    }
  }

  setEditor(cost) {
    this.editorCost = cost;
  }

  toggleEditMode() {
    this.editor = !this.editor;
  }

}


function findPath(board) {
  const frontier = new PriorityQueue((a, b) => a[1] < b[1]);
  board = { ...board };
  const squares = board.squares;
  const start = squares[board.myPosition];
  const cameFrom = { [start.id]: null }
  const costSoFar = { [start.id]: 0 }

  frontier.push([start, 0])
  console.log(board.xPosition);

  while (!frontier.isEmpty()) {
    const square = frontier.pop()[0];

    if (square.id === board.xPosition) break;
    console.log(expand(board.squares, square, board.n))
    for (let neighbour of expand(board.squares, square, board.n)) {
      if (neighbour.cost === 0) continue; // wall
      const newCostSoFar = costSoFar[square.id] + neighbour.cost;
      if (!costSoFar[neighbour.id] || newCostSoFar < costSoFar[neighbour.id]) {
        cameFrom[neighbour.id] = square.id;
        costSoFar[neighbour.id] = newCostSoFar;
        frontier.push([neighbour, (newCostSoFar + h(neighbour.id, board.xPosition, board.n))]);
      }
    }
    console.log('whiling');
  }
  console.log(cameFrom);

  if (!cameFrom[board.xPosition]) return []
  let res = cameFrom[board.xPosition];
  let path = []
  while (res !== board.myPosition) {
    path.push(res)
    res = cameFrom[res];
  }
  return path
}

function expand(squares, square, n) {
  let res = []

  if (square.id % n === 0) {
    res.push(squares[square.id + 1], squares[square.id - n], squares[square.id + n])
  } else if ((square.id + 1) % n === 0) {
    res.push(squares[square.id - 1], squares[square.id + n], squares[square.id - n])
  } else {
    res.push(squares[square.id - 1], squares[square.id + 1], squares[square.id - n], squares[square.id + n])
  }

  return res.filter(square => square != null);
}

/* Uses manhattan distance */
function h(current, goal, n) {
  const [x1, y1] = convertToXy(current, n);
  const [x2, y2] = convertToXy(goal, n);

  return (Math.abs(x2 - x1) + Math.abs(y2 - y1))
}


function convertToXy(pos, n) {
  return [(pos % n), (Math.floor(pos / n))]
}

export default { Board, findPath }