$(document).ready(function(){
  //ToDo: draw a grid
  //make a new connect4
  const connect4 = new Connect4('#connect4')
//allows you to change the message above game
  connect4.onPlayerMove = function () {
    $('#player').text(connect4.player)
  }
  $('#restart').click(function () {
    connect4.restart()
  })
})
