var app = angular.module('palladient', ['firebase', 'ui.sortable', 'ngSanitize']);
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
app.run(['userProvider', function(userProvider){
    userProvider.checkForAuth();
}]);