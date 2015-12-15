var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize', 'ui.router', 'ct.ui.router.extras.dsr', 'ui.bootstrap', 'colorpicker.module', 'ngIdle']);
app.config(['IdleProvider', function(IdleProvider) {
    // configure Idle settings
    IdleProvider.idle(20 * 60); // in seconds
    IdleProvider.timeout(60); // in seconds
}]);
app.run(['userProvider', 'logProvider', '$rootScope', 'Idle', function(userProvider, logProvider, $rootScope, Idle){
    logProvider.setLoggingLevels({
        warn: true,   //use for performance concerns and service method abuse situations
        error: true,  //use for service methods where misuse might be hard to diagnose
        debug: false, //use for loops and huge console output
        info: true    //use for standard application flow (not in loops)
    });
    userProvider.checkForAuth();
}]);