const socket = io.connect('http://localhost:3000');
// const socket = io.connect('https://regxpress.herokuapp.com');



(function() {

  angular
    .module("regXpress")
    .factory("ServerService", ServerService);


    var numPlayers = 0;

    var users = [];

    var message = "";

    var username = "";

    var room = undefined;

    // for testing purposes----
    // var questions = ["question1", "question2", "question3", "question4"];
    var questions = [];

    var questionIndex = 0;
    // ------------------------

  function ServerService() {

    var playerMessage = {
      content:""
    }

    return {

      joinRoom(room, username) {

      },

      playerMessage () {
        return playerMessage;
      },

      startGame() {
        socket.emit("start game", numPlayers);
        message = "starting the game...";

      },

      getUsers() {
        console.log("Users ", this.users);
        return users;
      },

      getQuestion(index) {
        index ++;
        return questions[index];
      },

      getRoom() {
        return room;
      },

      getQuestions() {
        return questions;
      }

    }

  }



})();
