app.directive("searchBox", [function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: '='
        },
        templateUrl: 'app/global/directives/searchBox/searchBox.html'
    }
}]);
