var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize', 'ui.router', 'ct.ui.router.extras.dsr']);
app.constant('firebase', {
    root: new Firebase("https://palladient.firebaseio.com"),
    licensePlans: new Firebase("https://palladient.firebaseio.com/licenseplans"),
    accounts: new Firebase("https://palladient.firebaseio.com/accounts"),
    studios: new Firebase("https://palladient.firebaseio.com/studios"),
    entityDefinitions: new Firebase("https://palladient.firebaseio.com/entityDefinitions"),
    events: {valueChanged: 'value', childAdded: 'child_added', childRemoved: 'child_removed'},
    stringify: function(firebaseObj){
        var path = firebaseObj.toString().replace(firebaseObj.root(), ''); //trims the root url from the path
        for (var i in arguments){
            if (arguments[i] != firebaseObj){
                path += '/' + arguments[i];
            }
        }
        return decodeURIComponent(path);
    }
});
app.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
    $urlRouterProvider.otherwise("/configure");
    $stateProvider
        .state('design', {
            url: "/design",
            templateUrl: "app/studios/studio.html"
        })
        .state('configure', {
            url: "/configure",
            templateUrl: "app/workspaces/configure.html",
            deepStateRedirect: {
                default: { state: 'configure.workspaces'}
            }
        })
        .state('configure.workspaces', {
            url: "/workspaces",
            templateUrl: "app/workspaces/workspaceList.html"
        })
        .state('configure.users', {
            url: "/users",
            templateUrl: "app/users/userList.html"
        });
}]);
app.run(['userProvider', function(userProvider){
    userProvider.checkForAuth();
}]);