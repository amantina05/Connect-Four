//declares a class called connect which we can use in our main file
//$ lets you know its a jquery object

class Connect4 {
  constructor (selector) {
    this.ROWS = 6
    this.COLS = 7
    this.player = 'red'
    this.selector = selector
    this.isGameOver = false
    this.onPlayerMove = function () {}
    this.createGrid()
    this.setupEventListeners()
  }
  //method
  createGrid(){
    //grab the dom element
    const $board = $(this.selector)
    //starts the board over
    $board.empty()
    this.isGameOver = false
    this.player = 'red'
    for (let row = 0; row < this.ROWS; row++){
      // for each row create a new div
      const $row = $('<div>')
        .addClass('row')
        for (let col = 0; col < this.COLS; col++){
          const $col = $('<div>')
          .addClass('col empty')
          //add diff attributes to the columns & rows
          .attr('data-col', col)
          .attr('data-row', row)
          //append that col
          $row.append($col)
        }
        $board.append($row)
    }
  }
  //so as you hover over the cells in the grid you want to be able to drop different colors
  setupEventListeners() {
    //place an indicator on where the piece is going to drop
    const $board = $(this.selector)
    const that = this

    function findLastEmptyCell(col){
      //grab all of the cells that we collected
      const cells = $(`.col[data-col='${col}']`)
      //loop over backwards, get the jquery representation of the cell were at
        for (let i = cells.length - 1; i >= 0; i--){
          const $cell = $(cells[i])
          if ($cell.hasClass('empty')){
            return $cell
          }
        }
        return null;
    }

    //this a jquery listener/method
      //pass in event you wnat to listen to then the selector you want to listen for and then the function
    $board.on('mouseenter', '.col.empty', function (){
      if (that.isGameOver) return
      const col = $(this).data('col')
      //as we hover over a cell we want to get the last empty cell thats in that col
      const $lastEmptyCell = findLastEmptyCell(col)
      $lastEmptyCell.addClass(`next-${that.player}`)
    })
    //adding a new call back func
    //removes all of the classes that have next red to them
      //rather than just keeping all of the next available reds
    $board.on('mouseleave', '.col', function (){
      $('.col').removeClass(`next-${that.player}`)
    })
    //placing a piece on an empty cell
    $board.on('click', '.col.empty', function () {
      if (that.isGameOver) return
      const col = $(this).data('col')
      const $lastEmptyCell = findLastEmptyCell(col)
      $lastEmptyCell.removeClass(`empty next- ${that.player}`)
      $lastEmptyCell.addClass(that.player)
      $lastEmptyCell.data('player', that.player)

      const winner = that.checkForWinner($lastEmptyCell.data('row'), $lastEmptyCell.data('col'))
      if (winner){
        that.isGameOver = true
        alert(`Game Over! Player ${that.player} has won!`)
        //removes the pointer cursor when game over
        $('.col.empty').removeClass('empty')
        return
      }


      //after drop cell, switch player
      that.player = (that.player === 'red') ? 'yellow' : 'red'
      that.onPlayerMove()
      $(this).trigger('mouseenter')
    })
  }
  checkForWinner(row, col){
    //checks to see if that last piece placed wins
    //checks if there are 4 in a row
    const that = this

    function $getCell(i, j){
      //returns the row that is equal to i and the column equal to j
      return $(`.col[data-row='${i}'][data-col='${j}']`)
    }

    function checkDirection(direction){
      //checks if the color we hit matches the color were looking for
      let total = 0;
      let i = row + direction.i
      let j = col + direction.j
      let $next = $getCell(i, j)
      while (i >= 0 &&
            i < that.ROWS &&
            j >= 0 &&
            j < that.COLS &&
            $next.data('player') === that.player){
              total++
              i += direction.i
              j += direction.j
              $next = $getCell(i, j)
            }
            return total
    }
    function checkWin(directionA, directionB){
      //keep track of total
      const total = 1 +
        checkDirection(directionA) +
        checkDirection(directionB)
      if (total >= 4){
        return that.player
      } else {
        return null
      }
    }

    //check diagonals
    function checkDiagonalsBLtoTr () {
      return checkWin({i: 1, j: -1}, {i: 1, j: 1})
    }
    function checkDiagonalsTrtoBL () {
      return checkWin({i: 1, j: 1}, {i: -1, j: -1})
    }
    function checkVerticals() {
      return checkWin({i: -1, j: 0}, {i: 1, j: 0})
    }

    //other direction
    function checkHorizontals() {
      return checkWin({i: 0, j: -1}, {i: 0, j: 1})
    }

    return checkVerticals() || checkHorizontals() || checkDiagonalsBLtoTr() || checkDiagonalsTrtoBL()
  }

  restart () {
    this.createGrid()
    this.onPlayerMove()
  }
}
