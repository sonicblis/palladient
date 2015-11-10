app.directive("listViewEditor", [function () {
    return {
        restrict: 'E',
        scope: {
            properties: '=',
            entityTableDefinition: '=ngModel'
        },
        templateUrl: 'app/entities/directives/listViewEditor/listViewEditor.html',
        controller: ['$scope', function ($scope) {
            $scope.setDefaultHeader = function(propertyDefinition){
                propertyDefinition.headerText = propertyDefinition.name;
            };
        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
