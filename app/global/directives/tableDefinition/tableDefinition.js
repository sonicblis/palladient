app.directive("tableDefinition", ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            tableDefinition: '=',
            ngModel: '=',
            filterWith: '='
        },
        require: 'ngModel',
        templateUrl: 'app/global/directives/tableDefinition/tableDefinition.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {
            $el.addClass('data-table');
        }
    }
}]);
