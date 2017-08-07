(function() {

  angular
    .module('regXpress')
    .config(config)

  function config($stateProvider, $locationProvider, $urlServiceProvider) {
    $locationProvider.html5Mode(true)

    $stateProvider
      .state('home', {
        url: '/',
        component: 'landingpage'
      }).state('roomlist', {
        url: '/rooms',
        component: 'roomlist'
      }).state('gameroom', {
        // url: '/room/:id',
        url: '/room',

        component: 'gameRoom'
      }).state('win', {
        // url: '/room/:id',
        url: '/win',

        component: 'win'
      })

    $urlServiceProvider.rules.otherwise({
      state: 'home'
    })
  }

}());
