app.directive("dropDown", ['$document', function ($document) {
    return {
        restrict: 'A',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {
            var alignment = $attr.dropDownAlign || 'left';
            var optionsElement = $el.find('drop-down-options');
            optionsElement.attr('style', 'position: absolute; display: none;');

            $el.bind('click', function($event){
                $el.attr('style','position: relative;');
                var clientRect = $el[0].getBoundingClientRect();
                if (alignment == 'left') {
                    optionsElement.attr('style', 'position: absolute; top: ' + (clientRect.height - 1) + 'px; left: -1px');
                }
                else{
                    optionsElement.attr('style', 'position: absolute; top: ' + (clientRect.height) + 'px; right: 0px');
                }
                optionsElement.show();
                $event.stopPropagation();
            });
            optionsElement.bind('click', function($event){
                $event.stopPropagation();
                optionsElement.hide();
            });
            $document.bind('click', function(){
                optionsElement.hide();
            });
        }
    }
}]);
