app.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
    $urlRouterProvider.otherwise("/configure");
    $stateProvider
        .state('design', {
            url: "/design",
            templateUrl: "app/studios/studio.html",
            deepStateRedirect: {
                default: { state: 'design.entity' }
            }
        })
        .state('design.entity',{
            url: "/entity",
            templateUrl: "app/entities/entityDefinitions.html"
        })
        .state('design.packages', {
            url: "/packages",
            templateUrl: "app/entities/packages.html"
        })
        .state('design.workspaces', {
            url: "/workspaces",
            templateUrl: "app/workspaces/workspaces.html"
        })
        .state('design.business', {
            url: "/business",
            templateUrl: "app/business/business.html"
        })
        .state('configure', {
            url: "/configure",
            templateUrl: "app/configure/configure.html",
            deepStateRedirect: {
                default: { state: 'configure.entities' }
            }
        })
        .state('configure.entities', {
            url: "/items",
            templateUrl: "app/entities/entityManager/entityManager.html"
        })
        .state('configure.users', {
            url: "/users",
            templateUrl: "app/users/userList.html"
        })
        .state('work', {
            url: "/work",
            templateUrl: "app/workspaces/workspace.html"
        })
        .state('configure.events', {
            url: "/events",
            templateUrl: "app/calendar/events.html"
        })
    ;
}]);