(function() {
  'use strict';

  angular
    .module('regXpress')
    .controller('gameRoomController', gameRoomController)

  const questionsURL = 'https://regxpress.herokuapp.com/questions'
  const roomURL = 'https://regxpress.herokuapp.com/rooms/'


  // function gameRoomController($stateParams, $http) {
  function gameRoomController(ServerService, $scope, $http, $state) {

    const vm = this;
    vm.serverService = ServerService;
    vm.messageInfo = undefined;
    vm.playerMessage = {};
    vm.showPlayer = {};

    vm.inputText = "";

    vm.questionIndex = 0;

    vm.userStatus = {};



    vm.flag = false;

    vm.$onInit = function() {

      $http.get(questionsURL)
        .then(results => {
          console.log("Questions ----- ", results);
          vm.questions = results.data
          vm.serverService.questions = results.data;
          console.log("VM questionsssssssssss ", vm.serverService.questions)
        })


      // console.log(vm.serverService.getUsers().length - 1, " joined the room");
      //
      //
      // if (vm.serverService.getUsers().length - 1 >= vm.serverService.room.max_numplayers) {
      //   console.log("The game should start now");
      //
      //   let info = {
      //     numPlayers: vm.serverService.room.max_numplayers,
      //     room: vm.serverService.room
      //   }
      //   socket.emit("start game", info);
      //
      //   $scope.$applyAsync(function() {
      //     $scope.connected = 'TRUE';
      //   });
      //
      // }



      // socket.on("start game", function(_info) {
      //
      //   console.log("NumPlayers ", _info.numPlayers);
      //   console.log("To room ", _info.room);
      //   for (var i = 0; i < _info.numPlayers; i++) {
      //     // console.log("USER ", info.room.users[i].name)
      //     // addNewPlayer(serverInfo.room.users[i].name);
      //
      //     vm.serverService.message = "The game will start in 10 seconds";
      //
      //   }
      //
      //
      //
      //   $scope.$applyAsync(function() {
      //     $scope.connected = 'TRUE';
      //   });
      //
      // });


    }

    vm.onKeyup = function($event, txt, username) {

      console.log("Current room ", vm.serverService.room.name);
      if (txt == "[a-b]*" || txt == "pass") {
        // console.log("You solved the regex")
        // vm.questionIndex ++;
      }
      console.log("Username ", username);
      var messageInfo = {
        socketId: "",
        user: username,
        room: vm.serverService.room.name,
        // msg: $event.keyCode
        msg: vm.inputText

      }

      // console.log("Key is up... ", $event.keyCode);
      socket.emit('on message', messageInfo);

      $scope.$applyAsync(function() {
        $scope.connected = 'TRUE';
      });

    }



    vm.submitAnswer = function(username) {

      console.log("INPUT TEXT -------- ", vm.inputText);

      // if (vm.inputText == "[a-b]*" || vm.inputText == "pass") {
      // if ( == vm.inputText vm.serverService.questions[vm.questionIndex].answer || vm.inputText == "pass") {
      if (vm.inputText == vm.serverService.questions[vm.questionIndex].answer || vm.inputText == "pass") {

        console.log("You solved the regex")

        // if (vm.questionIndex == vm.serverService.getQuestions().length - 1) {
        if (vm.questionIndex == vm.serverService.questions.length - 1) {

          console.log("Win");


          let info = {
            username: username,
            room: vm.serverService.room.name,
            msg: "Whatever"
          }

          socket.emit('user win', info);
          $state.go('win');



        } else {

          vm.questionIndex++;


          var messageInfo = {
            username: username,
            questionIndex: vm.questionIndex,
            room: vm.serverService.room.name,
            msg: "Whatever"
          }

          socket.emit('user pass', messageInfo);

          $scope.$applyAsync(function() {
            $scope.connected = 'TRUE';
          });
        }

      }

      vm.inputText = "";
      // var messageInfo = {
      //   socketId: "",
      //   user: username,
      //   room: vm.serverService.room.name,
      //   // msg: $event.keyCode
      //   msg: txt
      //
      // }

      // console.log("Key is up... ", $event.keyCode);
      // socket.emit('on message', messageInfo);



      //
      // $scope.$applyAsync(function() {
      //   $scope.connected = 'TRUE';
      // });

    }






    socket.on("user pass", function(_info) {
      console.log("User ", _info.username, " passed question ", _info.questionIndex);
      //
      // vm.userStatus[_info.username] = _info.username;
      // vm.userStatus[_info.questionIndex] = _info.questionIndex;

      vm.userStatus[_info.username] = " passed question " + _info.questionIndex;


      $scope.$applyAsync(function() {
        $scope.connected = 'TRUE';
      });
    });



    socket.on("user win", function(_info) {
      // console.log("User ", _info.username, " passed question ", _info.questionIndex);

      console.log("User ", _info.username, " won");

      vm.userStatus[_info.username] = "Completed all the questions";


      $scope.$applyAsync(function() {
        $scope.connected = 'TRUE';
      });
    });



    socket.on("on message", function(_messageInfo) {
      vm.messageInfo = _messageInfo;

      vm.playerMessage[_messageInfo.user] = _messageInfo.msg;

      vm.flag = vm.serverService.userName == _messageInfo.user;
      //
      // console.log("User names zzzz " , vm.serverService.userName)
      // console.log("User names22 zzzz " , _messageInfo.user)

      // console.log(" ", vm.playerMessage[_messageInfo.user]);
      $scope.$applyAsync(function() {
        $scope.connected = 'TRUE';
      });

      console.log("Message Info: ", _messageInfo);
    });



  }


}());
