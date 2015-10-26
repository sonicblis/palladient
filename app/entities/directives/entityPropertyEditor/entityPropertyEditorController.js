app.directive("entityPropertyEditor", ['studioProvider', function (studioProvider) {
    return {
        restrict: 'E',
        scope: {
            properties: '=ngModel'
        },
        templateUrl: 'app/entities/directives/entityPropertyEditor/entityPropertyEditor.html',
        controller: ['$scope', function ($scope) {
            $scope.properties = $scope.properties || [{}
                    //for testing
                    //{name: 'Text Field', type: 'string'},
                    //{name: 'Text Area', type: 'text'},
                    //{name: 'Boolean', type: 'bool'},
                    //{name: 'Date Field', type: 'datetime'},
                    //{name: 'Int Field', type: 'int'}
                ];
            $scope.types = [
                {display: 'Text', value: 'string'},
                {display: 'Big Text', value: 'text'},
                {display: 'Number', value: 'int'},
                {display: 'Date', value: 'datetime'},
                {display: 'Yes/No', value: 'bool'}
            ];
            $scope.addAnotherIfTab = function($event){
                if ($event.which == 9) { //tab
                    $scope.addAnother();
                }
            };
            $scope.addAnother = function(){
                $scope.properties.push({});
            };
            studioProvider.getEntityDefinitions().then(function(definitions){
                $scope.entityDefinitions = definitions;
                $scope.$watchCollection('entityDefinitions', function(newVal){
                    newVal.forEach(function(definition){
                        var existingTypeOption = $scope.types.find(function(type){
                            return type.value == 'typeDefinition:' + definition.$id;
                        });
                        if (!existingTypeOption){
                            $scope.types.push({display: definition.name, value: 'typeDefinition:' + definition.$id});
                        }
                    });
                });
            });
        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);