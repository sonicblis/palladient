app.service("userProvider", ['$rootScope', '$firebaseObject', 'firebase', function($rootScope, $firebaseObject, firebase) {
    //local
    var _this = this;
    var userInfo = function(authData){
        this.name = authData.google.displayName;
        this.id = authData.uid;
        this.icon = authData.google.profileImageURL;
        this.authenticated = true;
        this.lastLoggedIn = Firebase.ServerValue.TIMESTAMP;
    }

    $rootScope.logout = function(){
        _this.logout();
    }
    $rootScope.login = function(){
        _this.login();
    }

    function loadUser(user){
        //hook up the current user's ref
       _this.userRef = firebase.accounts.child(user.uid);
        $rootScope.user = $firebaseObject(_this.userRef);

        //update the user's info
        var _userInfo = new userInfo(user);
        _this.userRef.update(_userInfo, function(){
            //placeholder for callback once user update is complete
        });
    }

    //exposed
    this.logout = function(){
        firebase.root.unauth();
        _this.userRef.update({logout: Firebase.ServerValue.TIMESTAMP});
        $rootScope.user = {authenticated: false};
    };
    this.login = function(){
        firebase.root.authWithOAuthPopup("google", function (error, auth) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                loadUser(auth);
            }
        });
    };
    this.checkForAuth = function(){
        var auth = firebase.root.getAuth();
        if (auth) {
            loadUser(auth);
        }
    };
    this.userRef = null;
}]);