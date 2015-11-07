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
        .state('design.entity',{
            url: "/entity",
            templateUrl: "app/entities/entities.html"
        })
        .state('design.packages', {
            url: "/packages",
            templateUrl: "app/entities/packages.html"
        })
        .state('design.workspaces', {
            url: "/workspaces",
            templateUrl: "app/workspaces/workspaces.html"
        })
        .state('configure', {
            url: "/configure",
            templateUrl: "app/workspaces/configure.html",
            deepStateRedirect: {
                default: { state: 'configure.workspaces' }
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