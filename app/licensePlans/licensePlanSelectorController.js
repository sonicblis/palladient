app.controller("licensePlanSelectorController", ['$scope', 'licensePlanProvider', function($scope, licensePlanProvider){
    $scope.licensePlans = licensePlanProvider.getLicensePlans();
    $scope.selectPlan = function(licensePlan){
        licensePlanProvider.enrollUserInLicensePlan(licensePlan);
    };
}]);
