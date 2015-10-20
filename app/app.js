var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize']);
app.run(['userProvider', function(userProvider){
    userProvider.auth();
}]);