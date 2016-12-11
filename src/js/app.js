var React = require('react');
var ReactDOM = require('react-dom');

var TicTacToeBoard = React.createClass({
  getInitialState: function() {
    return {
      headline: 'Tic Tac Toe',
      subheader: 'Click the button in the lower right corner of your browser to create a new game!',
      games: []
    };
  },

  add: function() {
    // adds a new game
    var games = this.state.games;

    // each game needs a unique ID
    games.push({
      id: this.nextId()
    });

    this.setState({games: games});
  },

  eachGame: function(game, i) {
    return (
      <Game key={game.id} index={i}/>
    );
  },

  nextId: function() {
    // keeps track of most recent ID
    this.uniqueId = this.uniqueId || 0;

    return this.uniqueId++;
  },

  render: function() {
    return (
      <div className="container">
        <h1>{this.state.headline}</h1>
        <p>{this.state.subheader}</p>
        {this.state.games.map(this.eachGame)}
        <button id="btn-add" className="btn btn-sm btn-success" onClick={this.add}>Add Game</button>
      </div>
    )
  }
});

// child of TicTacToeBoard
var Game = React.createClass({
  getInitialState: function() {
    return {
      currentPlayer: 'X',
      board: [
        ['','',''],
        ['','',''],
        ['','','']
      ],
      completed: false,
      tie: false
    };
  },

  componentDidMount: function(){
    // make game draggable (by outer edges)
    // $(this.getDOMNode()).draggable();
  },

  play: function(x, y) {
    var board = this.state.board;

    // store current player on 'board'
    board[x][y] = this.state.currentPlayer;

    // set state and check winner
    this.setState({board: board}, this._checkWinner.bind(this, x, y));
  },

  _checkWinner: function(x, y) {
    var board = this.state.board;
    var cases = this._checkRow(x) || this._checkColumn(y) || this._checkDiagonal();

    // keep track of total moves
    this.moves = this.moves || 1;

    // if we won by one of the cases
    if (cases) {
      // mark game as completed
      this.setState({completed: true});
      return;
    }

    // if the game ends in a tie
    if (this.moves === 9 && !cases) {
      this._displayTie();
      return;
    }

    // no winner yet, other player's turn
    this._swapPlayer();
    this.moves++;
  },

  _swapPlayer: function () {
    // changes the current player
    if (this.state.currentPlayer === 'X') {
      this.setState({currentPlayer: 'O'});
    } else {
      this.setState({currentPlayer: 'X'});
    }
  },


  _checkRow: function(x) {
    var board = this.state.board;

    // checks all spaces in current row
    for (var i = 0; i < board.length; i++) {
      if (board[x][i] !== this.state.currentPlayer) {
        return false;
      }
    }

    return true;
  },

  _checkColumn: function(y) {
    var board = this.state.board;

    // checks all spaces in current column
    for (var j = 0; j < board.length; j++) {
      if (board[j][y] !== this.state.currentPlayer) {
        return false;
      }
    }

    return true;
  },

  _checkDiagonal: function() {
    var board = this.state.board;
    var winner = this.state.currentPlayer;

    // we're only dealing with a 3x3 game
    // so lets check the board explicitly
    if (board[1][1] === winner) {
      // check first diagonal
      if (board[0][0] === winner && board[2][2] === winner) {
        return true;
      }

      // check second diagonal
      if (board[0][2] === winner && board[2][0] === winner) {
        return true;
      }
    } else {
      return false;
    }
  },

  _displayTie: function() {
    this.setState({tie: true});
  },

  restart: function() {
    // resetting defaults
    var board = [
      ['','',''],
      ['','',''],
      ['','','']
    ];

    this.moves = 1;

    this.setState({
      board: board,
      currentPlayer: 'X',
      completed: false,
      tie: false
    });
  },

  render: function() {
    this.gameClasses = 'game';
    this.restartClasses = 'hidden'

    // completed styling
    if (this.state.completed) {
      this.gameClasses = 'game game__success';
      this.restartClasses = 'btn btn-sm btn-info'
    }

    // tie game styling
    if (this.state.tie) {
      this.gameClasses = 'game game__tied';
      this.restartClasses = 'btn btn-sm btn-info'
    }

    // is it possible to send this.state.completed to the Space child
    // without having to pass it as a property on every component?
    return (
      <div className={this.gameClasses} id={this.props.id}>
        <div className="tictactoe">
          <ul className="tictactoe--row">
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 0, 0)} value={this.state.board[0][0]} isCompleted={this.state.completed} />
            </li>
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 0, 1)} value={this.state.board[0][1]} isCompleted={this.state.completed} />
            </li>
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 0, 2)} value={this.state.board[0][2]} isCompleted={this.state.completed} />
            </li>
          </ul>
          <ul className="tictactoe--row">
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 1, 0)} value={this.state.board[1][0]} isCompleted={this.state.completed} />
            </li>
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 1, 1)} value={this.state.board[1][1]} isCompleted={this.state.completed} />
            </li>
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 1, 2)} value={this.state.board[1][2]} isCompleted={this.state.completed} />
            </li>
          </ul>
          <ul className="tictactoe--row">
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 2, 0)} value={this.state.board[2][0]} isCompleted={this.state.completed} />
            </li>
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 2, 1)} value={this.state.board[2][1]} isCompleted={this.state.completed} />
            </li>
            <li className="tictactoe--cell">
              <Space onClick={this.play.bind(null, 2, 2)} value={this.state.board[2][2]} isCompleted={this.state.completed} />
            </li>
          </ul>
        </div>
        <button onClick={this.restart} className={this.restartClasses}>&#8634;</button>
      </div>
    )
  }
});

// child of Game
var Space = React.createClass({
  render: function() {
    this.disabled = false;

    // if the space has been played, disable it
    // if the game is completed, let's disable everything
    if (this.props.value || this.props.isCompleted) {
      this.disabled = true;
    }

    return (
      <button className="tictactoe--space" onClick={this.props.onClick} disabled={this.disabled}>{this.props.value}</button>
    )
  }
});

ReactDOM.render(<TicTacToeBoard/>, document.getElementById('react-container'));
