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
          // console.log("Rooms coming from the server ", roomsInfo.rooms[0].users.length);


          for (var i = 0; i < roomsInfo.rooms.length; i++) {
          // for (var i = 0; i < vm.rooms.length; i++) {

            vm.roomsUsers[roomsInfo.rooms[i].name] = roomsInfo.rooms[i].users.length;

            if(!roomsInfo.rooms[i] ) {
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

      console.log("Joining Room");
      // vm.serverService.joinRoom(room, vm.username)

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

      // console.log(info);

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
        vm.serverService.message = `User ${vm.users[lastUserIndex].name} Joined the room`;
        vm.serverService.getUsers = getUsers

        // vm.showPlayer[vm.userToCompare] = (vm.serverService.userName == vm.userToCompare)




        vm.serverService.message = "waiting for other players to join";

        console.log(vm.serverService.getUsers().length, " joined the room");
        //
        //
        if (vm.serverService.getUsers().length >= vm.serverService.room.max_numplayers) {
          console.log("The game should start now");

          let info = {
            numPlayers: vm.serverService.room.max_numplayers,
            room: vm.serverService.room
          }
          socket.emit("start game", info);

          $scope.$applyAsync(function() {
            $scope.connected = 'TRUE';
          });

        }

        socket.emit("get updates", info);


        $scope.$applyAsync(function() {
          $scope.connected = 'TRUE';
        });

        vm.serverService.userName = vm.username;
        // $window.location.href = '/room';

      });


      socket.on("start game", function(_info) {

        console.log("NumPlayers ", _info.numPlayers);
        console.log("To room ", _info.room);
        for (var i = 0; i < _info.numPlayers; i++) {
          // console.log("USER ", info.room.users[i].name)
          // addNewPlayer(serverInfo.room.users[i].name);

          $state.go('gameroom');

          vm.serverService.message = "The game will start in 10 seconds";

        }


      });

      socket.on("count down", function(count) {
        console.log("Time to start ", count);
        vm.serverService.message = `Time to start ${count / 1000}`;


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




      // $state.go('gameroom');



      // vm.username = ''

    }

    getUsers = function() {
      // console.log("Users ======= ", vm.users);
      return vm.users;
    }
  }
})();
