app.service("eventProvider", ['firebase', 'userProvider', 'logProvider', '$firebaseArray', '$q', function(firebase, userProvider, logProvider, $firebaseArray, $q){
    this.addEvent = function(event) {
        logProvider.info('eventProvider', 'saving a new event', event);
        userProvider.getCurrentUserWorkspace().then(function(workspace){
            event.workspace = workspace.$id;
            event.startDate = event.startDate.getTime();
            event.endDate = event.endDate.getTime();
            event.creator = userProvider.getCurrentUser().id;
            logProvider.info('eventProvider', 'pushing event to firebase events path', firebase.calendarEvents);
            firebase.calendarEvents.push(event);
        });
    };
    this.getEvents = function(){ //we're gonna get the current user's workspace instead of making them pass it in
        var deferred = $q.defer();
        userProvider.getCurrentUserWorkspace().then(function(workspace){
            var events = $firebaseArray(firebase.calendarEvents.orderByChild('workspace').equalTo(workspace.$id));
            deferred.resolve(events);
        });
        return deferred.promise;
    }
}]);