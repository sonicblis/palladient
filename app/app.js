var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize', 'ui.router', 'ct.ui.router.extras.dsr']);

app.run(['userProvider', function(userProvider){
    userProvider.checkForAuth();
}]);