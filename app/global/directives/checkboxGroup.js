app.directive("checkboxGroup", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var scopeProperty = attrs.checkboxGroup;
            var parentScope = false;
            if (scopeProperty.indexOf('$parent') > -1) {
                scopeProperty = scopeProperty.replace('$parent.', '');
                parentScope = true;
            }
            var model;
            if (parentScope)
                model = scope.$parent[scopeProperty] = scope.$parent[scopeProperty] || [];
            else
                model = scope[scopeProperty] = scope[scopeProperty] || [];

            if (model.indexOf(scope.$eval(attrs.checkboxGroupValue)) !== -1) {
                elem[0].checked = true;
            }

            elem.bind('click', function() {
                var index = model.indexOf(scope.$eval(attrs.checkboxGroupValue));
                if (elem[0].checked) {
                    if (index === -1) model.push(scope.$eval(attrs.checkboxGroupValue));
                }
                else {
                    if (index !== -1) model.splice(index, 1);
                }
                scope.$apply();
            });
        }
    }
});