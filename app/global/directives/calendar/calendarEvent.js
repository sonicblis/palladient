app.directive("calendarEvent", [function () {
    return {
        restrict: 'E',
        scope: {
            event: '=ngModel'
        },
        templateUrl: 'app/global/directives/calendar/calendarEvent.html',
        controller: ['$scope', 'logProvider', function ($scope, logProvider) {

        }],
        link: function ($scope, $el, $attr) {

        }
    }
}]);
