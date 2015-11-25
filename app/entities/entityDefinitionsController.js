app.controller("entityDefinitionsController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.tableDefinition = [
        new columnDefinition('Name', 'name')
    ];
    $scope.schedulingOptions = [
        {name: 'Single Event', value: 'single'},
        {name: 'Multiple Events', value: 'multiple'},
        {name: 'Overlapping Events', value: 'overlapping'}
    ];
    $scope.publisher = {selectedWorkspace: null};
    $scope.ui = {interestingType: ''};
    $scope.studio = studioProvider.getStudio();
    $scope.view = 'list';
    $scope.entityDefinition = {properties: [{}]};

    $scope.resetEditors = function(){
        $scope.$broadcast(broadcastMessages.resetEditor);
    };
    $scope.showEntityEditor = function(){
        $scope.addingEntity = true;
        $scope.resetEditors();
    };
    $scope.saveEntityDefinition = function(){
        studioProvider.saveEntityDefinition($scope.entityDefinition);
        $scope.addingEntity = false;
        $scope.entityDefinition = {properties: [{}]};
    };
    $scope.prepareForPublish = function(){
        $scope.resetEditors();
        $scope.publisher.entityDefinitions = $scope.entityDefinitions.filter(function(entityDefinition){
            return entityDefinition.$selected;
        });
        $scope.publishing = true;
    };
    $scope.publishEntitiesToWorkspace = function(){
        studioProvider.publishEntities($scope.publisher)
        $scope.publishing = false;
    };
    $scope.cancel = function(){
        $scope.entityDefinition = {};
        $scope.publishing = false;
        $scope.addingEntity = false;
    };
    $scope.editDefinition = function(item){
        $scope.entityDefinition = item;
        $scope.ui.schedulingEnabled = !!$scope.entityDefinition.supportsScheduling;
        $scope.showEntityEditor();
    };
    $scope.deleteSelected = function(){
        var selectedDefinitions = $scope.entityDefinitions.filter(function(definition){
            return definition.$selected
        });
        selectedDefinitions.forEach(function(definition){
            $scope.entityDefinitions.$remove(definition)
        });
    };
    $scope.disableScheduling = function(){
        $scope.entityDefinition.supportsScheduling = null;
        $scope.entityDefinition.eventTypeName = null
    };
    $scope.enableScheduling = function(){
        if (!$scope.supportsScheduling) {
            $scope.entityDefinition.supportsScheduling = $scope.schedulingOptions[0].value;
        }
        if (!$scope.entityDefinition.eventTypeName) {
            $scope.entityDefinition.eventTypeName = $scope.entityDefinition.name;
        }
    };

    //init
    studioProvider.getWorkspaces().then(function(workspaces){
        $scope.workspaces = workspaces;
    });
    studioProvider.getEntityDefinitions().then(function(definitions){
        $scope.entityDefinitions = definitions;
    });
}]);
