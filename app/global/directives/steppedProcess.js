app.directive("steppedProcess", ['logProvider', function (logProvider) {
    return {
        restrict: 'E',
        transclude: true,
        template: "<ng-transclude></ng-transclude>",
        controller: ['$scope', function ($scope) {
            this.steps = [];
        }],
        link: function ($scope, $el, $attr, controller) {
            $scope.$on(broadcastMessages.resetEditor, function(){
                logProvider.info('steppedProcess', 'reset broadcast');
                if (controller.steps && controller.steps.length > 0){
                    logProvider.info('steppedProcess', 'resetting step to first one', controller.steps);
                    controller.steps.forEach(function(step){
                        logProvider.info('steppedProcess', 'removing active class from step', step);
                        step.removeClass('active');
                    });
                    logProvider.info('steppedProcess', 'adding active class to first step', controller.steps[0]);
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
            $el.find('header').bind('click', function(){
                steppedProcess.steps.forEach(function(step){
                   step.removeClass('active');
                });
                $el.addClass('active');
            });
        }
    }
}]);