(function() {
  'use strict';

  angular
    .module('regXpress')
    .controller('gameRoomController', gameRoomController)

  const questionsURL = 'https://regxpress.herokuapp.com/questions'
  const roomURL = 'https://regxpress.herokuapp.com/rooms/'


  // function gameRoomController($stateParams, $http) {
  function gameRoomController(ServerService, $scope, $http) {

    const vm = this;
    vm.serverService = ServerService;
    vm.messageInfo = undefined;
    vm.playerMessage = {};
    vm.showPlayer = {};

    vm.questionIndex = 0;



    vm.flag = false;

    vm.$onInit = function() {

      // $http.get(roomURL + $stateParams.id)
      //   .then(result => {
      //     console.log(result);
      //   })
      //
      //
      // vm.users = [{
      //     username: "StankyBob"
      //   },
      //   {
      //     username: "FartHammer5000"
      //   },
      //   {
      //     username: "FatFeetFreddyMac"
      //   }
      // ]
      //
      $http.get(questionsURL)
        .then(results => {
          console.log("Questions ----- " , results);
          vm.questions = results.data
          vm.serverService.questions = results.data;
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
        console.log("You solved the regex")
        vm.questionIndex ++;
      }
      console.log("Username ", username);
      var messageInfo = {
        socketId: "",
        user: username,
        room: vm.serverService.room.name,
        // msg: $event.keyCode
        msg: txt

      }

      // console.log("Key is up... ", $event.keyCode);
      socket.emit('on message', messageInfo);




      $scope.$applyAsync(function() {
        $scope.connected = 'TRUE';
      });

    }

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
