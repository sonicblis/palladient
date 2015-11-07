app.directive("steppedProcess", [function () {
    var _steps = [];
    return {
        restrict: 'E',
        transclude: true,
        template: "<ng-transclude></ng-transclude>",
        controller: ['$scope', function ($scope) {
            this.steps = _steps;
        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);

app.directive("step", [function () {
    return {
        restrict: 'E',
        require: '^steppedProcess',
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr, steppedProcess) {
            if (steppedProcess.steps.length == 0){
                $el.addClass('active');
            }
            steppedProcess.steps.push($el);
            $el.bind('click', function(){
                steppedProcess.steps.forEach(function(step){
                   step.removeClass('active');
                });
                $el.addClass('active');
            });
        }
    }
}]);