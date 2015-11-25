app.directive("calendar", ['$compile', 'logProvider', function ($compile, logProvider) {
    var cal_days_labels = ['S','M','T','W','T','F','S'];
    var cal_months_labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currentDate = new Date();
    var today = currentDate.getDate();
    var thisMonth = currentDate.getMonth();
    var thisYear = currentDate.getFullYear();
    var currentDisplayMonth;
    var dayElements = {};

    var makeCalElement = function(displayMonth, displayYear)
    {
        var displayDate = new Date(displayYear + '/' + displayMonth + '/' + today);
        var firstDay = new Date(displayYear, displayMonth, 1);
        var startingDay = firstDay.getDay();
        var prevMonth = (displayMonth == 0) ? 12 : displayMonth - 1;
        var prevYear = (displayMonth == 0) ? displayYear - 1 : displayYear;
        var nextMonth = (displayMonth == 11) ? 0 : displayMonth + 1;
        var nextYear = (displayMonth == 11) ? displayYear + 1 : displayYear;
        var monthLength = cal_days_in_month[displayMonth];
        var dayRendering = 1;
        var monthName = cal_months_labels[displayMonth]

        if (displayMonth == 1) {
            if((displayYear % 4 == 0 && displayYear % 100 != 0) || displayYear % 400 == 0){
                monthLength = 29;
            }
        }

        currentDisplayMonth = displayDate;
        var tableHeaderHtml = '<tr><th colspan="7">';
        tableHeaderHtml += '<span class="prevmonth clickable" ng-click="changeMonth(' + prevMonth + ',' + prevYear + ')"><</span>&nbsp;';
        tableHeaderHtml += monthName + '&nbsp;' + displayYear;
        tableHeaderHtml += '<span class="nextmonth clickable" ng-click="changeMonth(' + nextMonth + ',' + nextYear + ')">&nbsp;></span>';
        tableHeaderHtml += '</th></tr>';
        var dayNameRowHtml = '<tr class="day-names">';
        for(var i = 0; i <= 6; i++ ){
            dayNameRowHtml += '<td>';
            dayNameRowHtml += cal_days_labels[i];
            dayNameRowHtml += '</td>';
        }
        dayNameRowHtml += '</tr>';

        var table = angular.element('<table class="calendar-table"></table>');
        var tableHeader = angular.element(tableHeaderHtml);
        var dayNameRow = angular.element(dayNameRowHtml);
        var tableRows = [];
        dayElements = {};

        //render each day
        for (var i = 0; i < 9; i++) {
            var weekRow = angular.element('<tr></tr>');
            tableRows.push(weekRow);
            for (var j = 0; j <= 6; j++) {
                var dayClass = (dayRendering == today &&
                thisMonth == displayMonth &&
                thisYear == displayYear) ? 'today' : 'day';
                dayClass = (dayRendering < today &&
                thisMonth == displayMonth &&
                thisYear == displayYear) ? 'past' : dayClass;

                var dayHtml = '<td';
                var elementKey = dayRendering;
                var eventable = false;
                if (dayRendering <= monthLength && (i > 0 || j >= startingDay)) {
                    eventable = true;
                    dayHtml += ' class="' + dayClass + '" ';
                    dayHtml += 'ng-click="setSelectedDate(' + (displayMonth+1) + ',' + dayRendering + ',' + displayYear + ');"';
                    dayHtml += 'ng-class="{\'selected-day\':ngModel.getDate() == ' + dayRendering + ' && ngModel.getMonth() == ' + displayMonth + '}" >';
                    dayHtml += '<span class="number">' + dayRendering + '</span>';
                    dayRendering++;
                }
                else{
                    eventable = false;
                    dayHtml+= '>';
                }
                dayHtml += '</td>';
                var dayElement = angular.element(dayHtml);
                logProvider.debug('calendar', 'adding day element for event reception', dayElement);
                dayElements['day' + elementKey] = dayElement;
                weekRow.append(dayElement);
            }

            if (dayRendering > monthLength) break;
        }

        table.append(tableHeader);
        table.append(dayNameRow);
        tableRows.forEach(function(row){
            table.append(row);
        });

        return table;
    };
    return {
        restrict: 'E',
        scope: {
            events: '=',
            ngModel: '=selectedDate'
        },
        link: function ($scope, $el, $attr) {
            if (!$scope.ngModel){
                $scope.ngModel = new Date;
            }
            $scope.$watch('ngModel', function(newValue) {
                if (newValue)
                {
                    if (newValue.getMonth() - 1 != currentDisplayMonth.getMonth() || newValue.getFullYear() != currentDisplayMonth.getFullYear())
                    {
                        $scope.changeMonth(newValue.getMonth(), newValue.getFullYear());
                    }
                }
            });
            $scope.setSelectedDate = function(month, day, year){
                if ((day >= today || month > (thisMonth + 1)) || year > thisYear)
                {
                    $scope.ngModel = new Date(month + "/" + day + "/" + year);
                }
            };
            $scope.changeMonth = function(month, year){
                if (month >= thisMonth || year > thisYear)
                {
                    var compiled = $compile(makeCalElement(month, year))($scope);
                    $el.replaceWith(compiled);
                    $el = compiled;
                }
            }

            //init calendar
            $scope.changeMonth($scope.ngModel.getMonth(), $scope.ngModel.getYear());
        },
        controller: ['$scope', 'logProvider', 'firebase', function ($scope, logProvider, firebase) {
            function eventsAbove(stack, eventRectangle){
                eventRectangle.level = eventRectangle.level || 0;
                var eventsOverlapping = stack.filter(function(existingEventRectangle){
                    logProvider.debug('calendar', 'checking for overlap between', [eventRectangle, existingEventRectangle]);
                    if (existingEventRectangle.level == eventRectangle.level) {
                        var leftIsGreater = eventRectangle.left > existingEventRectangle.left;
                        var leftIsntPast = eventRectangle.left < (existingEventRectangle.width + existingEventRectangle.left);
                        var rightIsLess = eventRectangle.right > existingEventRectangle.right;
                        var rightIsntPast = eventRectangle.right < (existingEventRectangle.width + existingEventRectangle.right);
                        var leftRightAreLess = eventRectangle.left <= existingEventRectangle.left && eventRectangle.right <= existingEventRectangle.right;
                        logProvider.debug('calendar', 'returning based on', [leftIsGreater, leftIsntPast, rightIsLess, rightIsntPast, leftRightAreLess]);
                        var overlap = (leftIsGreater && leftIsntPast) || (rightIsLess && rightIsntPast) || leftRightAreLess;
                        if (overlap){
                            eventRectangle.level++;
                            return overlap;
                        }
                    }
                    else {
                        return false;
                    }
                });
                return eventRectangle.level;
            };
            $scope.renderEvent = function(event){
                var startDate = new Date(event.startDate);
                var endDate = new Date(event.endDate);
                var startHour = startDate.getHours();
                var endHour = endDate.getHours();

                var eventContainer = dayElements['day' + startDate.getDate()];
                eventContainer.eventStack = eventContainer.eventStack || [];
                var containerClientBox = eventContainer[0].getBoundingClientRect();
                var hourChunk = containerClientBox.width / 24;

                logProvider.info('calendar', 'compiling event element for event', event);
                var newScope = $scope.$new(true); //true means isolated from parent
                newScope.event = event;
                var eventElement = angular.element('<calendar-event ng-model="event"></calendar-event>');
                var eventRectangle = {
                    left: event.allDay ? 0 : (startHour * hourChunk),
                    right: event.allDay ? 0 : ((24 - endHour) * hourChunk),
                };
                eventRectangle.width = containerClientBox.width - eventRectangle.left - eventRectangle.right;
                var topMultiplier = eventsAbove(eventContainer.eventStack, eventRectangle);
                eventRectangle.top = (2 + 14 * topMultiplier); //order of operation ftw
                eventRectangle.bottom = (containerClientBox.height - (15 + 14 * topMultiplier));

                logProvider.debug('calendar', 'calculating event rectangle from startHour:' + startHour + ' and endHour:' + endHour + ' using hourChunk:' + hourChunk + ' as', eventRectangle);
                eventElement[0].style.left = eventRectangle.left + 'px';
                eventElement[0].style.right = eventRectangle.right + 'px';
                eventElement[0].style.bottom = eventRectangle.bottom + 'px';
                eventElement[0].style.top = eventRectangle.top + 'px';
                var compiledEvent = $compile(eventElement)(newScope);

                eventContainer.append(compiledEvent);
                eventContainer.eventStack.push(eventRectangle);
                logProvider.info('calendar', 'day has a new event rendered', eventContainer.contains);
            };
            var unwatchEvents = $scope.$watch('events', function(newVal){
                if (newVal){
                    logProvider.info('calendar', 'calendar events value changed', $scope.events);
                    if (newVal.$watch){
                        logProvider.info('calendar', 'subscribing to firebase array of events');
                        $scope.events.$watch(function(args){
                            if (args.event == firebase.events.childAdded){
                                var event = $scope.events.$getRecord(args.key);
                                logProvider.info('calendar', 'event added to watched events collection', event);
                                $scope.renderEvent(event);
                            }
                        });
                        logProvider.info('calendar', 'unwatching calendar events directly');
                        unwatchEvents();
                    }
                    else{
                        logProvider.warn('calendar', 'events assigned to calendar that isn\'t a firebase array', $scope.events);
                    }
                }
            });
        }]
    }
}]);
