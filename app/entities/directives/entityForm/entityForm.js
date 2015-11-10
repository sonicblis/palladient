app.directive("entityForm", [function () {
    return {
        restrict: 'E',
        scope: {
            entityDefinition: '=entityDefinition',
            ngModel: '=',
            cancel: '&onCancel',
            save: '&onSave'
        },
        templateUrl: 'app/entities/directives/entityForm/entityForm.html',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
