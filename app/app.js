var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize', 'ui.router', 'ct.ui.router.extras.dsr']);

app.run(['userProvider', 'logProvider', function(userProvider, logProvider){
    logProvider.setLoggingLevels({
        warn: true,
        error: true,
        debug: true,
        info: true
    });
    userProvider.checkForAuth();
}]);