app.directive("calendar", ['$compile', function ($compile) {
    var cal_days_labels = ['S','M','T','W','T','F','S'];
    var cal_months_labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currentDate = new Date();
    var today = currentDate.getDate();
    var thisMonth = currentDate.getMonth();
    var thisYear = currentDate.getFullYear();
    var currentDisplayMonth;

    var getCalHMTL = function(displayMonth, displayYear)
    {
        var displayDate = new Date(displayYear + '/' + displayMonth + '/' + today);
        currentDisplayMonth = displayDate;
        var firstDay = new Date(displayYear, displayMonth, 1);
        var startingDay = firstDay.getDay();
        var prevMonth = (displayMonth == 0) ? 12 : displayMonth - 1;
        var prevYear = (displayMonth == 0) ? displayYear - 1 : displayYear;
        var nextMonth = (displayMonth == 11) ? 0 : displayMonth + 1;
        var nextYear = (displayMonth == 11) ? displayYear + 1 : displayYear;

        var monthLength = cal_days_in_month[displayMonth];

        if (displayMonth == 1) {
            if((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
                monthLength = 29;
            }
        }

        var monthName = cal_months_labels[displayMonth]
        var html = '<table class="calendar-table">';
        html += '<tr><th colspan="7">';
        html += '<span class="prevmonth clickable" ng-click="ChangeMonth(' + prevMonth + ',' + prevYear + ')"><</span>&nbsp;';
        html += monthName + '&nbsp;' + displayYear;
        html += '<span class="nextmonth clickable" ng-click="ChangeMonth(' + nextMonth + ',' + nextYear + ')">&nbsp;></span>';
        html += '</th></tr>';
        html += '<tr class="day-names">';
        for(var i = 0; i <= 6; i++ ){
            html += '<td>';
            html += cal_days_labels[i];
            html += '</td>';
        }
        html += '</tr><tr>';

        //render each day
        var dayRendering = 1;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j <= 6; j++) {
                var dayClass = (dayRendering == today &&
                thisMonth == displayMonth &&
                thisYear == displayYear) ? 'today' : 'day';
                dayClass = (dayRendering < today &&
                thisMonth == displayMonth &&
                thisYear == displayYear) ? 'past' : dayClass;
                html += '<td';
                if (dayRendering <= monthLength && (i > 0 || j >= startingDay)) {
                    html += ' class="' + dayClass + '" ';
                    html += 'ng-click="SetSelectedDate(' + (displayMonth+1) + ',' + dayRendering + ',' + displayYear + ');"';
                    html += 'ng-class="{\'selected-day\':ngModel.getDate() == ' + dayRendering + ' && ngModel.getMonth() == ' + displayMonth + '}" >';
                    html += '<span class="number">' + dayRendering + '</span>';
                    dayRendering++;
                }
                else html+= '>';
                html += '</td>';
            }

            if (dayRendering > monthLength) break;
            else html += '</tr><tr>';
        }
        html += '</tr></table>';
        return html;
    };
    return {
        restrict: 'E',
        scope: {
            events: '=',
            ngModel: '=selectedDate'
        },
        template: getCalHMTL(new Date().getMonth(), new Date().getFullYear()),
        controller: ['$scope', function ($scope) {

        }],
        link: function ($scope, $el, $attr) {
            if (!$scope.ngModel){
                $scope.ngModel = new Date;
            }
            $scope.$watch('ngModel', function(newValue) {
                if (newValue)
                {
                    if (newValue.getMonth() - 1 != currentDisplayMonth.getMonth() || newValue.getFullYear() != currentDisplayMonth.getFullYear())
                    {
                        $scope.ChangeMonth(newValue.getMonth(), newValue.getFullYear());
                    }
                }
            });
            $scope.SetSelectedDate = function(month, day, year)
            {
                if ((day >= today || month > (thisMonth + 1)) || year > thisYear)
                {
                    $scope.ngModel = new Date(month + "/" + day + "/" + year);
                }
            };
            $scope.ChangeMonth = function(month, year){
                if (month >= thisMonth || year > thisYear)
                {
                    var compiled = $compile(getCalHMTL(month, year))($scope);
                    $el.replaceWith(compiled);
                    $el = compiled;
                }
            }
        }
    }
}]);
