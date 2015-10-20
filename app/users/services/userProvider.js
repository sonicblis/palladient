app.service("userProvider", ['$rootScope', '$firebaseObject', '$firebaseArray', '$injector', function($rootScope, $firebaseObject, $firebaseArray, $injector){
    //local
    var _this = this;
    var currentUser = {authenticated: false};
    var ref = new Firebase("https://palladient.firebaseio.com");
    var user = function(authData){
        this.name = authData.google.displayName;
        this.id = authData.google.id;
        this.icon = authData.google.profileImageURL;
        this.authenticated = true;
    }
    function loadUserData(auth){
        currentUser = $firebaseObject(ref.child('users').child(auth.google.id));
        _this.workspaces = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaces'));
        _this.workspaceData = $firebaseArray(ref.child('users').child(auth.google.id).child('workspaceData'));
        if (sessionStorage.loadedWorkspace)
        {
            var objectiveProvider = $injector.get("objectiveProvider");
            objectiveProvider.loadWorkspaceObjective(sessionStorage.loadedWorkspace);
        }
        $rootScope.user = currentUser;
    };
    function addUser(user){
        _this.accounts.$loaded().then(function(){
            var existingUser = _this.users.find(function(existingUser){
                return existingUser.id == user.id
            });
            if (!existingUser) {
                _this.users[id] = user;
                _this.users.$save();
            }
        });
    };

    //exposed
    this.auth = function(){
        var auth = ref.getAuth();
        if (auth) {
            loadUserData(auth);
        }
        else{
            ref.authWithOAuthPopup("google", function (error, auth) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    loadUserData(auth);
                    addUser(new user(auth));
                }
            });
        }
    };

}]);
