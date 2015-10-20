var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize']);
app.constant('firebase', {
    root: new Firebase("https://palladient.firebaseio.com"),
    licensePlans: new Firebase("https://palladient.firebaseio.com/licenseplans"),
    accounts: new Firebase("https://palladient.firebaseio.com/accounts"),
    events: {valueChanged: 'value', childAdded: 'child_added', childRemoved: 'child_removed'}
});
app.run(['userProvider', function(userProvider){
    userProvider.checkForAuth();
}]);