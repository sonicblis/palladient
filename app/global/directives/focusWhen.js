app.directive('focusWhen', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusWhen);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });

            element.bind('blur', function() {
                if (model.assign) {
                    scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
});