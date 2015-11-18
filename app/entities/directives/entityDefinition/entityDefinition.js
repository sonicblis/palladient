app.directive("entityDefinition", [function () {
    return {
        restrict: 'E',
        scope: {
            entityDefinition: '=ngModel',
            type: '=typeIndicator',
            edit: '&onEdit'
        },
        templateUrl: 'app/entities/directives/entityDefinition/entityDefinition.html',
        controller: ['$scope', 'studioProvider', 'entityProvider', '$q', function ($scope, studioProvider, entityProvider, $q) {
            $scope.propertyTypes = {};
            $scope.typeNameFromPropertyType = function(property){
                if (!$scope.propertyTypes[property.type]){
                    $scope.propertyTypes[property.type] = {value: ''};
                    if (entityProvider.isEntityTypeProperty(property)) {
                        studioProvider.getEntityDefinitions().then(function(definitions){
                            definitions.$loaded(function (definitions) {
                                var definition = definitions.$getRecord(entityProvider.getIdFromPropertyType(property));
                                $scope.propertyTypes[property.type].value = definition.name;
                            });
                        });
                    }
                    else{
                        $scope.propertyTypes[property.type].value = property.type;
                    }
                }
                return $scope.propertyTypes[property.type];
            };
        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
