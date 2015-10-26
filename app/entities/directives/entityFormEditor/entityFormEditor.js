app.directive("entityFormEditor", [function () {
    return {
        restrict: 'E',
        scope: {
            properties: '=ngModel'
        },
        templateUrl: 'app/entities/directives/entityFormEditor/entityFormEditor.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
