app.directive("steppedProcess", [function () {
    return {
        restrict: 'E',
        transclude: true,
        template: "<ng-transclude></ng-transclude>",
        controller: ['$scope', function ($scope) {
            this.steps = [];
        }],
        link: function ($scope, $el, $attr, controller) {
            $scope.$on('reset', function(){
                if (controller.steps && controller.steps.length > 0){
                    controller.steps.forEach(function(step){
                        step.removeClass('active');
                    });
                    controller.steps[0].addClass('active');
                }
            });
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