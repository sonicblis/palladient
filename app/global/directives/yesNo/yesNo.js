app.directive("yesNo", [function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            onNo: '&',
            onYes: '&'
        },
        templateUrl: 'app/global/directives/yesNo/yesNo.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
