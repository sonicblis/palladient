var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize', 'ui.router', 'ct.ui.router.extras.dsr', 'ui.bootstrap']);

app.run(['userProvider', 'logProvider', function(userProvider, logProvider){
    logProvider.setLoggingLevels({
        warn: true,
        error: true,
        debug: false,
        info: true
    });
    userProvider.checkForAuth();
}]);