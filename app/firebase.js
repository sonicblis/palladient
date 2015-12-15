var baseUrl = "https://palladient.firebaseio.com";

app.constant('firebase', {
    root: new Firebase(baseUrl),
    licensePlans: new Firebase(baseUrl + "/licenseplans"),
    accounts: new Firebase(baseUrl + "/accounts"),
    businessRules: new Firebase(baseUrl + "/businessRules"),
    studios: new Firebase(baseUrl + "/studios"),
    calendarEvents: new Firebase(baseUrl + "/events"),
    workspaces: new Firebase(baseUrl + "/workspaces"),
    workspaceAccounts: new Firebase(baseUrl + "/workspaceAccounts"),
    workspaceEntityDefinitions: new Firebase(baseUrl + "/workspaceEntityDefinitions"),
    workspaceEntities: new Firebase(baseUrl + "/workspacesEntities"),
    packages: new Firebase(baseUrl + "/packages"),
    entityDefinitions: new Firebase(baseUrl + "/entityDefinitions"),
    entities: new Firebase(baseUrl + "/entities"),
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
    },
    cleanAngularObject: function(object){
        if (angular){
            var tempObj = angular.fromJson(angular.toJson(object)); //cleans off all $$hashkey values from child collections
            for (n in tempObj){
                if (n.substring(0,1) == '$'){
                    delete tempObj[n];
                }
            }
            return tempObj;
        }
        else{
            console.error("Angular is not available to use to clean the angular object.  This method doesn't need to be called in this context.");
        }
    }
});