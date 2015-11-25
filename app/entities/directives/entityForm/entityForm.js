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
        controller: ['$scope', 'entityProvider', 'userProvider', 'workspaceProvider', 'logProvider', '$q', function ($scope, entityProvider, userProvider, workspaceProvider, logProvider, $q) {
            $scope.availableEntities = {};

            function ensureEntitiesForType(type){
                var deferred = $q.defer();
                if (!$scope.availableEntities[type]){
                    entityProvider.getEntities(type).then(function(entities){
                        logProvider.debug('entityForm', 'getEntities returned', entities);
                        $scope.availableEntities[type] = entities;
                        deferred.resolve(entities);
                    });
                }
                else{
                    deferred.resolve($scope.availableEntities[type]);
                }
                return deferred.promise;
            };

            userProvider.getCurrentUserWorkspace().then(function(workspace){
                workspaceProvider.getEntityDefinitions(workspace.$id).then(function(definitions){
                    $scope.entityDefinitions = definitions;
                });
            });

            $scope.getDisplayProperty = function(entity){
                if (!entity.$dropdownDisplay) {
                    logProvider.info('entityForm', 'getting drop down display for', entity);
                    //get the right definition for the entity
                    var relevantDefinition = $scope.entityDefinitions.find(function (entityDefinition) {
                        return entityDefinition.$id == entity.fromDefinition;
                    });
                    if (relevantDefinition && !relevantDefinition.displayProperty) {
                        logProvider.error('entityForm', 'The type definition has no display properties.  Display properties need to be selected and published for this entity type.', relevantDefinition);
                        return;
                    }
                    //pass back the property value of the entity
                    var propertyValues = [];
                    relevantDefinition.displayProperty.forEach(function (propertyName) {
                        var propertyValue = entity[propertyName];
                        logProvider.info('entityForm', 'adding drop down value for "' + propertyName + '"', propertyValue);

                        if (entityProvider.isValueEntityReference(propertyValue)){
                            logProvider.info('entityForm', 'need to resolve drop down value from entity id', propertyValue);
                            var propertyDefinition = relevantDefinition.properties.find(function(propertyDefinition){ return propertyDefinition.name == propertyName; });
                            ensureEntitiesForType(propertyDefinition.type).then(function(entitiesForType){
                                entitiesForType.$loaded().then(function(){
                                    var entityOfInterest = entitiesForType.$getRecord(entityProvider.getEntityIdFromPropertyValue(propertyValue));
                                    //this is going to jack order if there's more than one resolved property, I think
                                    propertyValues.splice(0, 0, $scope.getDisplayProperty(entityOfInterest));
                                    //need to update the property since we're in a promise resolution and the main thread has returned
                                    entity.$dropdownDisplay = propertyValues.join(' ');
                                });
                            });
                        }
                        else {
                            propertyValues.push(propertyValue);
                        }

                    });

                    entity.$dropdownDisplay = propertyValues.join(' ');
                }
                else{
                    logProvider.info('entityForm', 'drop down display property already calculated as', entity.$dropdownDisplay);
                }
                return entity.$dropdownDisplay;
            };
            $scope.$watch('entityDefinition', function(newVal){
                if (newVal && newVal.properties){
                    newVal.properties.forEach(function(property){
                        if (entityProvider.isEntityTypeProperty(property)){
                            ensureEntitiesForType(property.type);
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
        link: function ($scope, $el, $attr) {

        }
    }
}]);
