var baseUrl = "https://palladient.firebaseio.com";

app.constant('firebase', {
    root: new Firebase(baseUrl),
    licensePlans: new Firebase(baseUrl + "/licenseplans"),
    accounts: new Firebase(baseUrl + "/accounts"),
    studios: new Firebase(baseUrl + "/studios"),
    workspaces: new Firebase(baseUrl + "/workspaces"),
    workspaceEntityDefinitions: new Firebase(baseUrl + "/workspacesEntityDefinitions"),
    workspaceEntities: new Firebase(baseUrl + "/workspacesEntities"),
    packages: new Firebase(baseUrl + "/packages"),
    entityDefinitions: new Firebase(baseUrl + "/entityDefinitions"),
    events: {valueChanged: 'value', childAdded: 'child_added', childRemoved: 'child_removed'},
    getCurrentTime: function() { return Firebase.ServerValue.TIMESTAMP; },
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