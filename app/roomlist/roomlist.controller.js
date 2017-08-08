(function() {
  angular
    .module('regXpress')
    .controller('RoomListController', RoomListController)

  const roomsURL = 'https://regxpress.herokuapp.com/rooms'
  // const socket = io.connect('http://localhost:3000');

  function RoomListController($http, $state, ServerService, $scope) {
    const vm = this
    vm.users = [];
    vm.message = "";
    vm.serverService = ServerService;
    vm.numPlayers = 0;

    vm.roomsUsers = {};


    vm.changeState = function() {
      $state.go('gameroom');
    }

    vm.$onInit = function() {

      $http.get(roomsURL)
        .then(results => {
          // console.log(results);
          vm.rooms = results.data
          socket.emit("get updates", info);

        })

      var info = {};


      socket.on("get updates", function(roomsInfo) {

        for (var i = 0; i < roomsInfo.rooms.length; i++) {

          vm.roomsUsers[roomsInfo.rooms[i].name] = roomsInfo.rooms[i].users.length;

          if (!roomsInfo.rooms[i]) {
            vm.roomsUsers[roomsInfo.rooms[i].name] = 0;
          }
        }

        $scope.$applyAsync(function() {
          $scope.connected = 'TRUE';
        });


      });


    }

    vm.getInfo = function(room) {

      var stuff = {
        name: room.name,
        users: [],
        max_numplayers: room.max_numplayers
      }

    }

    vm.joinRoom = function(room) {

      var roomObj = {
        name: room.name,
        users: [],
        numPlayersJoined: 0,
        max_numplayers: room.max_numplayers
      }

      var info = {
        user: vm.username,
        room: roomObj
      }


      vm.serverService.room = roomObj;

      socket.emit("room", info);


      socket.on("room", function(_info) {
        console.log("Info -----------> ", _info);
        console.log("Room -----------> ", _info.room);
        console.log("Users -----------> ", _info.room.users);

        vm.users = _info.room.users;

        vm.room = _info.room;

        console.log("VMS ", vm.users);

        vm.serverService.users = vm.users;
        let lastUserIndex = vm.users.length - 1;
        vm.serverService.message = `${vm.users[lastUserIndex].name} Joined the room`;
        vm.serverService.getUsers = getUsers

        // vm.serverService.message = "waiting for other players to join";

        // console.log(vm.serverService.getUsers().length, " joined the room");

        if (vm.serverService.getUsers().length >= vm.serverService.room.max_numplayers) {
          console.log("The game should start now");

          let info = {
            numPlayers: vm.serverService.room.max_numplayers,
            room: vm.serverService.room
          }
          socket.emit("game ready", info);

          // socket.emit("start game", info);


          $scope.$applyAsync(function() {
            $scope.connected = 'TRUE';
          });

        }

        socket.emit("get updates", info);


        $scope.$applyAsync(function() {
          $scope.connected = 'TRUE';
        });

        vm.serverService.userName = vm.username;
        vm.serverService.hideUser = {};

        // testing users
        for (var i = 0; i < vm.users.length; i++) {
          console.log("This is user ", vm.serverService.users[i]);
          console.log("Owner is ", vm.serverService.userName)

          if(vm.serverService.users[i].name == vm.serverService.userName) {
            vm.serverService.hideUser[vm.serverService.userName] = true;
          } else {
            vm.serverService.hideUser[vm.serverService.users[i]] = false;

          }

        }

        //

      });

      socket.on("start game", function(_info) {

        console.log("NumPlayers ", _info.numPlayers);
        console.log("To room ", _info.room);
        // for (var i = 0; i < _info.numPlayers; i++) {
        $state.go('gameroom');
        // }

      });

      // socket.on("game ready", function(_info) {
      //
      //   console.log("NumPlayers ", _info.numPlayers);
      //   console.log("To room ", _info.room);
      //   // for (var i = 0; i < _info.numPlayers; i++) {
      //     // $state.go('gameroom');
      //   // }
      //
      // });

      socket.on("count down", function(count) {
        console.log("Time to start ", count);
        // vm.serverService.message = `Time to start ${count}`;
        vm.serverService.message = "Time to start " + count + " seconds";

        if (count <= 0) {
          count = 0;
          vm.serverService.message = "Game is started";
        }


        $scope.$applyAsync(function() {
          $scope.connected = 'TRUE';
        });
      });


      socket.on("error room", function(_info) {
        console.log("Room is full");
        vm.serverService.message = "Room is full";

        $scope.$applyAsync(function() {
          $scope.connected = 'TRUE';
        });

      });
    }

    getUsers = function() {
      return vm.users;
    }
  }
})();
