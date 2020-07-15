import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button
      className = "square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      player1win: 0,
      aiwin: 0,
      gameOver: false,
    }
  }


  handleClick(i) {
    const squares = this.state.squares.slice();
    if (this.state.gameOver) {
      this.setState({
        squares: Array(9).fill(null),
        gameOver: false,
        xIsNext: !this.state.xIsNext,
      })
      return;
    }
    if (squares[i] === null) {
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
      });
    } else {
      return;
    }
  }


  render() {

    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner + ' Click to play again';
      this.state.gameOver = true;
    } else if (!isFull(this.state.squares)) {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } else if (isFull(this.state.squares)) {
      status = 'Result: Tie   Click to play again';
      this.state.gameOver = true;
    }

    if (winner === 'X') {
      this.state.player1win += 1;
    } else if (winner === 'O') {
      this.state.aiwin += 1;
    }
    let results;
    results = "Player 1: " + this.state.player1win + " AI: " + this.state.aiwin;

    if (!this.state.xIsNext && !this.state.gameOver) {
      const bestMove = minimax(this.state.squares, 'O').index;
      //console.log(bestMove);
      this.handleClick(bestMove);
    }

    //console.log(emptySpaces(this.state.squares));
    //console.log(minimax(this.state.squares, 'O'))

    return (
      <>
      <h1 className="title">Unbeatable Tic-Tac-Toe AI</h1>
      <div className="game">
        <div className="status">{status}</div>
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="results">{results}</div>
      </div>
      </>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function emptySpaces(squares) {
  var empty = [];
  for (var i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      empty.push(i);
    }
  }
  return empty;
}

function isFull(s) {
  if(s.includes(null)) {
    return false;
  } else {
    return true;
  }
}


//defining minimax function
function minimax(s, player) {
  const freeSpaces = emptySpaces(s);

  // First check for a terminal state
  if(calculateWinner(s) === 'O') {
    return {score: 10};
  } else if (calculateWinner(s) === 'X') {
    return {score: -10};
  } else if (!calculateWinner(s) && isFull(s)) {
    return {score: 0};
  }

  var moves = [];
  var newBoard = [...s];

  for (var i = 0; i < freeSpaces.length; i++) {
    var move = {};
    move.index = freeSpaces[i];
    newBoard[freeSpaces[i]] = player;

    if (player === 'O') {
      var result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      var result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[freeSpaces[i]] = null;
    moves.push(move);
  }

  var bestMove;
  if (player === 'O') {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if(moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if(moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];

}
