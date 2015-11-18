app.directive("dateAsInt", [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr, ngModelController) {
            function toInt(val){
                if (val){
                    return new Date(val).getTime();
                }
            }
            function fromInt(val){
                if (val){
                    return new Date(val);
                }
            }
            ngModelController.$parsers.push(toInt);
            ngModelController.$formatters.push(fromInt);
        }
    }
}]);
