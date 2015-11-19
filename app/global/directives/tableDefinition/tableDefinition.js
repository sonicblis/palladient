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
            $scope.getValue = function(data, propertyIdentifier){
                var propertyChain = propertyIdentifier.split('.');
                var value = data;
                propertyChain.forEach(function(p){
                    value = value[p];
                });
                return value;
            }
        }],
        link: function ($scope, $el, $attr) {
            $el.addClass('data-table');
        }
    }
}]);
