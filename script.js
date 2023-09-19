// Wait for the DOM to be fully loaded before executing code

document.addEventListener("DOMContentLoaded", () => {
  let board = null; // Initialize the chess board
  const game = new Chess(); // Create new Chess.js game instance
  const moveHistory = document.getElementById("move-history"); // Get move history
  let moveCount = 1; // Initialize the move count
  let userColor = "w"; // Initialize the user's color as white

  // Function to make a random move for the computer;
  const makeRandomMove = () => {
    const possibleMove = game.moves();

    if (game.game_over()) {
      alert("Checkmate!");
    } else {
      const randomIdx = Math.floor(Math.random() * possibleMove.length);
      const move = possibleMove[randomIdx];
      game.move(move);
      board.position(game.fen());
      recordMove(move, moveCount);
      // record and display the move with move count
      moveCount++; // Increament the move count
    }
  };
  // Function to record and display a move in the move history

  const recordMove = (move, count) => {
    const formattedMove =
      count % 2 === 1 ? `${Math.ceil(count / 2)}.${move}` : `${move} -`;
    moveHistory.textContent += formattedMove + " ";
    moveHistory.scrollTop = moveHistory.scrollHeight; // Auto-scroll to the lastest move
  };

  // Function to handle the start of a drag position

  const onDragStart = (source, piece) => {
    // Allow the user to drag only their own piece based on color
    return !game.game_over() && piece.search(userColor) === 0;
  };

  // Function to handle a piece drop on the board

  const onDrop = (source, target) => {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (move === null) return "snapback";
    window.setTimeout(makeRandomMove, 250);
    recordMove(move.san, moveCount);
    // Record and display the move with move count
    moveCount++;
  };

  // Function to handle the end of a piece snap animation

  const onSnapEnd = () => {
    board.position(game.fen());
  };
  // Configuration options for the chessboard
  const boardConfig = {
    showNotation: true,
    draggable: true,
    position: "start",
    onDragStart,
    onDrop,
    onSnapEnd,
    moveSpeed: "fast",
    snapBackSpeed: 500,
    snapSpeed: 100,
  };

  // Initialize the chessboard

  board = Chessboard("board", boardConfig);

  document.querySelector(".play-again").addEventListener("click", () => {
    game.reset();
    board.start();
    moveHistory.textContent = "";
    moveCount = 1;
    userColor = "w";
  });

  // Event listener for the "Set position"

  document.querySelector(".set-pos").addEventListener("click", () => {
    const fen = prompt("Enter the FEN notation for the desired position!");
    if (fen !== null) {
      if (game.load(fen)) {
        board.position(fen);
        moveHistory.textContent = "";
        moveCount = 1;
        userColor = "w";
      } else {
        alert("Invalid FEN notation. Please try again.");
      }
    }
  });

  // Event listener to flip the board

  document.querySelector(".flip-board").addEventListener("click", () => {
    board.flip();
    makeRandomMove();
    //Toggle user;s color after flipping board
    userColor = userColor === "w" ? "b" : "w";
  });
});
