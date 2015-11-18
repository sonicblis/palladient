app.directive("tableDefinition", ['$parse', 'entityProvider', function ($parse, entityProvider) {
    return {
        restrict: 'A',
        scope: {
            tableDefinition: '=',
            ngModel: '=',
            filterWith: '=',
            disableEdit: '=',
            edit: '&onEdit'
        },
        require: 'ngModel',
        templateUrl: 'app/global/directives/tableDefinition/tableDefinition.html',
        controller: ['$scope', function ($scope) {
            $scope.getTemplate = function(propertyType){
                if (!propertyType || entityProvider.isEntityTypeProperty({type: propertyType})){
                    return undefined;
                }
                else{
                    return propertyType;
                }
            };
        }],
        link: function ($scope, $el, $attr) {
            $el.addClass('data-table');
        }
    }
}]);
