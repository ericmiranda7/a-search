import utils from './utils.js';

let board = new utils.Board(10);

const main = document.getElementById('main');
const table = document.getElementById('table');
const pathButton = document.getElementById('path');
const grassButton = document.getElementById('grass');
const mudButton = document.getElementById('mud');
const wallButton = document.getElementById('wall');
const editButton = document.getElementById('edit');
const clearButton = document.getElementById('clear');
const findPathButton = document.getElementById('findPath');
const result = document.getElementById('result');
const setSizeButton = document.getElementById('setSize');

editButton.onclick = () => {
  board.clearFoundPath();
  result.textContent = '';
  board.toggleEditMode();
  editButton.textContent = board.editor ? 'Edit mode: ON' : 'Edit mode: OFF';
}
setSizeButton.onclick = () => {
  table.innerHTML = '';
  const size = prompt('Size of board ?');
  board = new utils.Board(parseInt(size));
}
pathButton.onclick = () => board.setEditor(1);
grassButton.onclick = () => board.setEditor(2);
mudButton.onclick = () => board.setEditor(3);
wallButton.onclick = () => board.setEditor(0);
clearButton.onclick = () => board.clearBoard();
findPathButton.onclick = () => {
  let path = utils.findPath(board);
  if (path.length === 0) result.textContent = "Probably a wall blocking :("
  path.reverse();
  path.forEach((s, i) => {
    setTimeout(() => board.squares[s].element.style.backgroundColor = "yellow", i*500);
  })
}