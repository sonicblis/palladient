app.controller("businessController", ['$scope', 'logProvider', 'workspaceProvider', 'userProvider', 'entityProvider', 'studioProvider', 'firebase', function($scope, logProvider, workspaceProvider, userProvider, entityProvider, studioProvider, firebase){
    $scope.entityDefinitions = [];
    $scope.users = [];
    $scope.entityChain = [];
    $scope.tableDefinition = [
        new columnDefinition('Rule', 'name'),
        new columnDefinition('Trigger', 'type')
    ];
    $scope.conditionWhens = [
        new option('Always','always'),
        new option('Only When','onlyIf')
    ];
    $scope.conditionTypes = [
        new option('Event Time', 'timeContext'),
    ];
    $scope.expressions = [
        new option('Equals', '==', ['string','datetime','bool','timeContext']),
        new option('Less than', '<', ['int','datetime','timeContext']),
        new option('Greater than', '>', ['int','datetime','timeContext']),
        new option('Not equal to', '!=', ['string','datetime']),
        new option('Is Empty', '!'),
        new option('Is Anything', '!!'),
        new option('Starts with', '^', ['string','datetime']),
        new option('Ends with', '$', ['string','datetime']),
        new option('Contains', '*', ['string','text'])
    ];
    $scope.valueTypes = [
        new option('User Provided Value Of', 'constant', ['text','string','timeContext']),
        new option('The True/False Value', 'bool', ['bool']),
        new option('The Weekday', 'day', ['datetime','timeContext']),
        new option('The Month Of', 'month', ['datetime','timeContext']),
        new option('Now Minus Days', 'constantDaysAgo', ['datetime','timeContext']),
        new option('Now Minus Weeks', 'constantWeeksAgo', ['datetime','timeContext']),
        new option('Now Minus Months', 'constantMonthsAgo', ['datetime','timeContext']),
    ];
    $scope.valueOptions = [
        new option('January',0,'month'),
        new option('February',1,'month'),
        new option('March',2,'month'),
        new option('April',3,'month'),
        new option('May',4,'month'),
        new option('June',5,'month'),
        new option('July',6,'month'),
        new option('August',7,'month'),
        new option('September',8,'month'),
        new option('October',9,'month'),
        new option('November',10,'month'),
        new option('December',11,'month'),
        new option('Sunday',0,'day'),
        new option('Monday',1,'day'),
        new option('Tuesday',2,'day'),
        new option('Wednesday',3,'day'),
        new option('Thursday',4,'day'),
        new option('Friday',5,'day'),
        new option('Saturday',6,'day'),
        new option('True', true, 'bool'),
        new option('False', false, 'bool')
    ];
    $scope.actionOptions = [
        new option('Assign To', 'assign'),
        new option('Get Approval From One', 'approvalOne'),
        new option('Get Approval From All', 'approvalAll'),
        new option('Create A', 'create'),
        new option('Send an Email to', 'notify')
    ];
    $scope.actionTargetTypes = [
        new option('User', 'user', ['assign','approvalOne','notify']),
        new option('In Group', 'group', ['assign','approvalOne','approvalAll','notify']),
        new option('Tagged As', 'tag', ['assign','approvalOne','approvalAll','notify'])
    ];
    $scope.actionTargets = [
        //users, groups, and tags;
    ];
    $scope.actionModelOutput = [

    ];

    $scope.rule = {conditions: [{}], actions: [{}]};
    $scope.selectedEntityDefinition = {};

    //this.  this does magic and makes everything context sensitive.  amazing.
    $scope.filterOptions = function(){//unlimited args could be passed in, they are accessed from the arguments "collection"
        var args = arguments,
            allowed = true;
        return function(item){
            if (arguments.length > 0 && item.parent) {
                for (var type in args) {
                    if (typeof type !== 'undefined') {
                        logProvider.debug('businessController', 'checking if a condition option should be filtered', [item.display, item.parent, args[type]]);
                        if (typeof item.parent === 'string') {
                            allowed = item.parent === args[type];
                        }
                        else { //assuming array
                            allowed = item.parent.indexOf(args[type]) > -1;
                        }
                    }
                    if (allowed){
                        //if one of the filter arguments has allowed it, let it go.  If not, see
                        //if one of the next ones does.  This effectively makes the filter arguments
                        //or statements instead of and statements meaning any filter that allows it
                        //will allow it to show.
                        return true;
                    }
                }
                return allowed;
            }
            else {
                return allowed;
            }
        }
    }

    $scope.entityDefinitionSelected = function(selectedDefinition){
        if (selectedDefinition){
            if ($scope.conditionTypes[0].value == 'property'){
                $scope.conditionTypes.splice(0,1);
                $scope.conditionTypes.pop(); // remove the previous entity option
            }
            $scope.entityChain = [selectedDefinition];
            $scope.conditionTypes.splice(0,0, {display: selectedDefinition.name + ' Property', value: 'property'})
            $scope.conditionTypes.push({display: 'Previous ' + selectedDefinition.name, value: 'previousProperty'});
            $scope.rule.entityDefinition = selectedDefinition.$id;
            $scope.entityDefinitionName = selectedDefinition.name;
            $scope.rule.type = 'entity';
        }
    };
    $scope.eventTypeChanged = function(){
        var eventDescription = $scope.entityDefinitionName + ' ' + $scope.rule.event.replace('Any Exist', 'Created') + ' ';
        $scope.conditionOptions = [
            new option(eventDescription + 'At Time', 'now', 'timeContext'),
            new option(eventDescription + 'On Date', 'date', 'timeContext'),
            new option(eventDescription + 'In Month', 'month', 'timeContext'),
            new option(eventDescription + 'In Year', 'year', 'timeContext'),
            new option(eventDescription + 'On Day of the Week', 'dayOfWeek', 'timeContext')
        ];
    }
    $scope.propertySelected = function(property, condition){
        //if it's an entity definition property, get the entity definition of the property type
        if (entityProvider.isEntityTypeProperty(property)){
            var entityId = entityProvider.getIdFromPropertyType(property);
            var entityDefinition = $scope.entityDefinitions.find(function(definition){return definition.$id == entityId;});
            $scope.entityChain.push(entityDefinition);
        }
        else{
            condition.left.value = property;
        }
    };

    $scope.saveBusinessRule = function(){
        studioProvider.getStudio().then(function(studio){
            if ($scope.rule.$id) {
                firebase.businessRules.child($scope.rule.$id).set(firebase.cleanAngularObject($scope.rule));
            }
            else {
                $scope.rule.studio = studio.$id;
                firebase.businessRules.push(firebase.cleanAngularObject($scope.rule));
            }
            $scope.cancel();
        });
    };
    $scope.cancel = function(){
        $scope.rule = {conditions: [{}], actions: [{}]};
        $scope.addingRule = false;
    };
    $scope.edit = function(item){
        $scope.rule = item;
        $scope.addingRule = true;
    };

    userProvider.getCurrentUserWorkspace().then(function(workspace){
        workspaceProvider.getEntityDefinitions(workspace.$id).then(function(definitions){
            $scope.entityDefinitions = definitions;
        })
    });
    userProvider.getStudioUsers().$watch(function(args){
        if (args.event == firebase.events.childAdded){
            firebase.accounts.child(args.key).once(firebase.events.valueChanged, function(snapshot){
                $scope.users.push(snapshot.val());
            })
        }
    });
    studioProvider.getBusinessRules().then(function(rules){
        $scope.businessRules = rules;
    });
}]);
