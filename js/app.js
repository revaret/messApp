 // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app=angular.module('starter', ['ionic', 'firebase','starter.controllers', 'starter.services','angular-storage'])



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

  });
})

app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
     resolve: {
    // controller will not be loaded until $requireAuth resolves
    // Auth refers to our $firebaseAuth wrapper in the example above
    "currentAuth": ["Auth", function(Auth) {
      // $requireAuth returns a promise so the resolve waits for it to complete
      // If the promise is rejected, it will throw a $stateChangeError (see above)
      return Auth.$requireAuth();
    }]
  },
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',

      }
    }
  })

   .state('tab.friends', {
    url: '/friends',
     resolve: {
    // controller will not be loaded until $requireAuth resolves
    // Auth refers to our $firebaseAuth wrapper in the example above
    "currentAuth": ["Auth", function(Auth) {
      // $requireAuth returns a promise so the resolve waits for it to complete
      // If the promise is rejected, it will throw a $stateChangeError (see above)
      return Auth.$requireAuth();
    }]
  },
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl',

      }
    }
  })
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.login', {
    url: '/login',
    views: {
      'login': {
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('tab.register', {
    url: '/register',
    views: {
      'register': {
        templateUrl: 'templates/register.html',
        controller: 'AuthCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

.state('tab.navigate', {
    url: '/navigate',
    views: {
      'tab-account': {
        controller: 'navigateCtrl'
      }
    }
  })

  ;
 

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/navigate');

})
app.constant('FirebaseUrl', 'https://jamshichat.firebaseio.com/')

app.factory("Auth", function($firebaseAuth) {
  url='https://jamshidmessapp.firebaseio.com/';
  var ref = new Firebase(url);
  return $firebaseAuth(ref);
});

app.controller('DashCtrl',function($scope,Auth,$firebaseArray){
  var expenseRef = new Firebase('https://jamshidmessapp.firebaseio.com/expenses');
  $scope.expenses = $firebaseArray(expenseRef);
  $scope.user =Auth.$getAuth();
  
  $scope.addExpense = function (e) {
    email = $scope.user.password.email
    $scope.expenses.$add({
      by:email,
      label:$scope.label,
      date:Date.now(),
      cost:$scope.cost});
    $scope.label = "";
    $scope.cost = 0;
  };
 
   $scope.getTotal = function () {
    var i, rtnTotal = 0;
    for (i=0; i<$scope.expenses.length;i =i+1)
    {
      if ($scope.expenses[i].by == $scope.user.password.email) {
        rtnTotal = rtnTotal + $scope.expenses[i].cost
      }
      
    }
    return rtnTotal;
   }
});

app.controller('FriendsCtrl',function($scope,$firebaseArray){
  var expenseRef = new Firebase('https://jamshidmessapp.firebaseio.com/expenses');
  $scope.expenses = $firebaseArray(expenseRef);
  $scope.getTotal = function () {
    var i, rtnTotal = 0;
    for (i=0; i<$scope.expenses.length;i =i+1)
    {
      rtnTotal = rtnTotal + $scope.expenses[i].cost
      console.log("cost", $scope.expenses[i])
      console.log("rtn total",rtnTotal)
    }
    return rtnTotal;
   }

});

app.controller('AuthCtrl',function($scope,Auth,$ionicPopup,$location,store){
 
 Auth.$onAuth(function(authData) {
    $scope.authData = authData;

    if (authData) {
    console.log(authData);
    console.log("user info");
    console.log(authData.password)
    $location.path("/tab/dash");
    }
  });
  

  $scope.showAlert = function(msg) {
   var alertPopup = $ionicPopup.alert({
     title: 'Attention',
     template: msg
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 }

 $scope.register = function(username,password) {
  username = username + '@gmail.com'
  console.log(username)
  console.log("password ",password)
  Auth.$createUser({email:username,password:password})
  .then (function(authData){
    console.log(authData)
    return Auth.$authWithPassword({
      email:username,
      password:password
    }).then (function (authData) {
       $location.path("/tab/dash");
    })
  },function(error){
    $scope.showAlert(error);
  });
}
  $scope.login = function(username,password){
    username = username + '@gmail.com'
    Auth.$authWithPassword({
    email:username,
    password:password
  })
    .then(function(authData){
     
      $location.path("/tab/dash");
      store.set('authflag',true)
    },function(error){
    $scope.showAlert(error);
    });
  }
  $scope.regnav= function(){
    $location.path("/tab/register");
  }
   $scope.logout = function() {
    Auth.$unauth();
    console.log("logged Out")
    store.set('authflag',false)
  };

});


