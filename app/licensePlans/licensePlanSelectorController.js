app.controller("licensePlanSelectorController", ['$scope', 'firebase', 'userProvider', function($scope, firebase, userProvider){
    $scope.licensePlans = [];
    firebase.licensePlans.once(firebase.events.valueChanged, function(licensePlans){
        licensePlans.forEach(function(plan){
            var planData = plan.val();
            planData.$id = plan.key();
            $scope.licensePlans.push(planData);
        });
    });
    $scope.selectPlan = function(licensePlan){
        userProvider.userRef.update({licensePlan: licensePlan.$id});
    };
}]);
