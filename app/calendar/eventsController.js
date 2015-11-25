app.controller("eventsController", ['$scope', 'logProvider', 'workspaceProvider', 'userProvider', 'entityProvider', 'eventProvider', function($scope, logProvider, workspaceProvider, userProvider, entityProvider, eventProvider){
    $scope.entityDefinitions = [];
    $scope.entities = [];
    $scope.event = {};
    $scope.events = [];
    $scope.eventsForDate = new Date();
    $scope.ui = {addingEvent: false};

    $scope.newEvent = function(){
        return {
            startDate: $scope.eventsForDate,
            endDate: $scope.eventsForDate,
            allDay: true
        };
    };
    $scope.resetEvent = function(){
        $scope.event = $scope.newEvent();
    };
    $scope.schedulableOnly = function(){
        return function(item){
            return !!item.supportsScheduling;
        }
    };
    $scope.selectedDefinitionChanged = function(){
        entityProvider.getEntities($scope.event.entityDefinition).then(function(entities){
            $scope.entities = entities;
        });
    };
    $scope.getEntityDisplayName = function(entity){
        return entityProvider.getEntityDisplayName(entity);
    };
    $scope.resetEditor = function(){
        $scope.$broadcast(broadcastMessages.resetEditor);
        $scope.resetEvent();
        $scope.ui.addingEvent = false
    };
    $scope.saveEvent = function(){
        eventProvider.addEvent($scope.event);
        $scope.resetEditor();
    };

    //init
    $scope.resetEvent();
    $scope.$watch('eventsForDate', function(newVal){
        if (newVal){
            $scope.event.startDate = newVal;
        }
    });
    $scope.$watch('event.startDate', function(newVal, oldVal){
        if (newVal){
            if (newVal.getTime() > $scope.event.endDate.getTime()){
                logProvider.info('eventsController', 'updating end time to equal start time', $scope.event);
                $scope.event.endDate = angular.copy($scope.event.startDate);
            }
        }
    });
    userProvider.getCurrentUserWorkspace().then(function(workspace){
        workspaceProvider.getEntityDefinitions(workspace.$id).then(function(entityDefinitions){
            $scope.entityDefinitions = entityDefinitions;
        });
    });
    eventProvider.getEvents().then(function(events){
        $scope.events = events;
    });
}]);