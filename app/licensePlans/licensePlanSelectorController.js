app.controller("licensePlanSelectorController", ['$scope', 'firebase', 'userProvider', '$rootScope', function($scope, firebase, userProvider, $rootScope){
    $scope.licensePlans = [];
    firebase.licensePlans.once(firebase.events.valueChanged, function(licensePlans){
        licensePlans.forEach(function(plan){
            var planData = plan.val();
            planData.$id = plan.key();
            $scope.licensePlans.push(planData);
        });
    });
    $scope.selectPlan = function(licensePlan){
        var newStudioKey = firebase.studios.push().key();
        var updates = {};
        updates[firebase.stringify(userProvider.userRef, 'studio')] = newStudioKey;
        updates[firebase.stringify(firebase.studios, newStudioKey)] = {
            name: $rootScope.user.name + '\'s Studio',
            licensePlan: licensePlan.$id,
            owner: $rootScope.user.$id
        };
        firebase.root.update(updates);
    };
}]);
