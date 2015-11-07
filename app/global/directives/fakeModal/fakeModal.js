app.directive("fakeModal", ['$document', function ($document) {
    return {
        restrict: 'A',
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {
            $el.addClass('modal-content');
            var modalBackdrop = $document.find('fake-modal');
            if (modalBackdrop.length == 0) {
                modalBackdrop = angular.element('<fake-modal></fake-modal>');
                $document.find('body').append(modalBackdrop);
            }
            $scope.$watch($attr.ngShow, function(newVal){
                if (newVal) {
                    modalBackdrop.show();
                }
                else {
                    modalBackdrop.hide();
                }
            });
        }
    }
}]);