app.directive("entityForm", [function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        scope: {
            entityDefinition: '=entityDefinition',
            ngModel: '=',
            onCancel: '&',
            onSave: '&'
        },
        templateUrl: 'app/entities/directives/entityForm/entityForm.html',
        controller: ['$scope', 'entityProvider', 'studioProvider', function ($scope, entityProvider, studioProvider) {
            $scope.availableEntities = {};
            studioProvider.getEntityDefinitions().then(function(definitions){
                $scope.entityDefinitions = definitions;
            });
            $scope.getDisplayProperty = function(entity){
                //get the right definition for the entity
                var relevantDefinition = $scope.entityDefinitions.find(function(entityDefinition){
                    if (entityDefinition.$id == entity.fromDefinition){
                        return entityDefinition;
                    }
                });

                //pass back the property value of the entity
                var propertyValues = [];
                relevantDefinition.displayProperty.forEach(function(propertyName){
                    propertyValues.push(entity[propertyName]);
                });

                return propertyValues.join(' ');
            };
            $scope.$watch('entityDefinition', function(newVal){
                if (newVal && newVal.properties){
                    newVal.properties.forEach(function(property){
                        if (property.type.indexOf('typeDefinition:') > -1){
                            $scope.availableEntities[property.type] = entityProvider.getEntities(property.type);
                        }
                    });
                }
            });
            $scope.save = function(){
                $scope.onSave();
                $scope.ngModel = {};
            };
            $scope.cancel = function(){
                $scope.onCancel();
                $scope.ngModel = {};
            }
        }],
        link: function ($scope, $el, $attr, ngModel) {
            ngModel.$parsers.push(
                function(val){
                    return val;
                }
            );
        }
    }
}]);
