app.service("entityProvider", ['firebase', '$firebaseArray', 'studioProvider', '$q', '$timeout', 'logProvider', '$rootScope', function(firebase, $firebaseArray, studioProvider, $q, $timeout, logProvider, $rootScope){
    var _this = this;
    var entityDefinitions;
    var typeDefinitionIdentifier = 'typeDefinition:';
    var entityIdentifier = 'entity:';
    var childEntities = {};
    var $firebaseResolvingArray = $firebaseArray.$extend({
        $$added: function(entitySnapshot){
            var entity = entitySnapshot.val();
            entity.$id = entitySnapshot.key();
            resolveChildEntityDisplayNames(entity);
            return entity;
        },
        $$updated: function(entitySnapshot){
            var entity = this.$list.$getRecord(entitySnapshot.key());
            resolveChildEntityDisplayNames(entity);
        }
    });

    //this magic function recursively resolves all entity display names
    function resolveChildEntityDisplayNames(entity) {
        entityDefinitions.$loaded(function (definitions) {
            var selectedEntityDefinition = definitions.$getRecord(entity.fromDefinition);
            var entityProperties = selectedEntityDefinition.properties.filter(function(propertyDefinition){return _this.isEntityTypeProperty(propertyDefinition);});
            entityProperties.forEach(function (propertyDefinition) {
                //get the type definition for this property so we know what properties to display
                var deferred = $q.defer();
                var typeDefinition = definitions.$getRecord(_this.getIdFromPropertyType(propertyDefinition));

                //load all entities of this type so we can get the one that is linked
                //could be a performance gain getting only the one that is relevant
                if (!childEntities[propertyDefinition.type]) {
                    _this.getEntities(propertyDefinition.type).then(function(entities){
                        childEntities[propertyDefinition.type] = entities;
                        deferred.resolve();
                    });
                }
                else{
                    deferred.resolve();
                }

                deferred.promise.then(function(){
                    childEntities[propertyDefinition.type].$loaded(function (childEntities) {
                        //get the specific entity that this item has as a property
                        var entityId = _this.getEntityIdFromPropertyValue(entity[propertyDefinition.name]);
                        var relevantEntity = childEntities.$getRecord(entityId);
                        if (relevantEntity) {
                            //concatenate all of the display field values of the child object into one string to replace the entity ID with
                            //we're setting a shadow property (prepended with an underscore) for the display name so that we don't have to
                            //manipulate the object to prep it for saving or anything like that.  entity.Owner: -K3VK5DusX56Gx4pQR7_
                            var fieldValues = [];
                            if (!relevantEntity.$resolved) {
                                logProvider.info('entityProvider', 'resolving child entity names', relevantEntity);
                                resolveChildEntityDisplayNames(relevantEntity);
                            }
                            typeDefinition.displayProperty.forEach(function (propertyName) {
                                logProvider.info('entityProvider', 'getting value for property', propertyName);
                                var propertyValue = relevantEntity['_' + propertyName] || relevantEntity[propertyName];
                                logProvider.info('entityProvider', 'adding "' + propertyName + '" to display values: "' + propertyValue + '"');
                                fieldValues.push(propertyValue);
                            });
                            entity['_' + propertyDefinition.name] = fieldValues.join(' ');
                        }
                        else{
                            logProvider.error('entityProvider', 'no entity could be found as a child of ' + propertyDefinition.name, entity);
                        }
                    });
                })
            });
        });
        entity.$resolved = true;
    }
    function ensureEntitiesForType(type){
        var deferred = $q.defer();
        if (!childEntities[type]){
            _this.getEntities(type).then(function(entities){
                logProvider.debug('entityForm', 'getEntities returned', entities);
                childEntities[type] = entities;
                deferred.resolve(entities);
            });
        }
        else{
            deferred.resolve(childEntities[type]);
        }
        return deferred.promise;
    };

    this.getEntities = function(entityDefinitionId, resolveChildren){
        var deferred = $q.defer();
        if (!entityDefinitionId){
            logProvider.error('entityProvider', 'no entity definition id was provided');
            return;
        }
        entityDefinitionId = entityDefinitionId.replace('typeDefinition:','');
        logProvider.info('entityProvider', 'getting entities for request', $rootScope.user.$workspace.$id + entityDefinitionId);
        var ref = firebase.entities.orderByChild('compositeKeyWorkspaceFromDefinition').equalTo($rootScope.user.$workspace.$id + entityDefinitionId);
        if (resolveChildren) {
            logProvider.warn('entityProvider', 'resolving children for entity list');
            deferred.resolve(new $firebaseResolvingArray(ref));
        }
        else {
            deferred.resolve($firebaseArray(ref));
        }
        return deferred.promise;
    };
    this.saveInstance = function(instance){
        instance.workspace = $rootScope.user.$workspace.$id;
        instance.compositeKeyWorkspaceFromDefinition = instance.workspace + instance.fromDefinition;
        if (instance.$id){
            logProvider.info('entityProvider', 'updating instance', instance);
            firebase.entities.child(instance.$id).update(firebase.cleanAngularObject(instance));
        }
        else {
            logProvider.info('entityProvider', 'creating instance', instance);
            firebase.entities.push(instance);
        }
    };
    this.isEntityTypeProperty = function(property){
        if (typeof property !== 'object'){
            logProvider.error('entityProvider', 'an object must be provided to isEntityTypeProperty. What was provided was a ' + typeof property);
            return;
        }
        if (property && !property.type){
            logProvider.error('entityProvider', 'the type wasn\'t available on the property passed in', property);
            return;
        }
        return property.type.indexOf(typeDefinitionIdentifier) > -1;
    };
    this.getIdFromPropertyType = function(property) {
        return property.type.replace(typeDefinitionIdentifier, '');
    };
    this.isValueEntityReference = function(propertyValue){
        logProvider.info('entityProvider', 'checking for entity property', propertyValue);
        if (typeof propertyValue === 'string') {
            return propertyValue.indexOf(entityIdentifier) > -1;
        }
        return false;
    };
    this.getEntityIdFromPropertyValue =  function(propertyValue){
        return propertyValue.replace(entityIdentifier,'');
    };
    this.getDefaultTableDefinition = function(entityDefinition){
        var columnDefinitions = [];
        entityDefinition.properties.forEach(function(property){
            if (property.primaryListProperty) {
                var propertyName = _this.isEntityTypeProperty(property) ? '_' + property.name : property.name;
                columnDefinitions.push(new columnDefinition(property.headerText, propertyName, property.type + 'Display'));
            }
        });
        return columnDefinitions;
    };
    this.getEntityDisplayName = function(entity){
        if (!entity.$dropdownDisplay) {
            logProvider.info('entityForm', 'getting drop down display for', entity);
            //get the right definition for the entity
            var relevantDefinition = entityDefinitions.find(function (entityDefinition) {
                return entityDefinition.$id == entity.fromDefinition;
            });
            if (relevantDefinition && !relevantDefinition.displayProperty) {
                logProvider.error('entityForm', 'The type definition has no display properties.  Display properties need to be selected and published for this entity type.', relevantDefinition);
                return;
            }
            //pass back the property value of the entity
            var propertyValues = [];
            relevantDefinition.displayProperty.forEach(function (propertyName) {
                var propertyValue = entity[propertyName];
                logProvider.info('entityForm', 'adding drop down value for "' + propertyName + '"', propertyValue);

                if (_this.isValueEntityReference(propertyValue)){
                    logProvider.info('entityForm', 'need to resolve drop down value from entity id', propertyValue);
                    var propertyDefinition = relevantDefinition.properties.find(function(propertyDefinition){ return propertyDefinition.name == propertyName; });
                    ensureEntitiesForType(propertyDefinition.type).then(function(entitiesForType){
                        entitiesForType.$loaded().then(function(){
                            var entityOfInterest = entitiesForType.$getRecord(_this.getEntityIdFromPropertyValue(propertyValue));
                            //this is going to jack order if there's more than one resolved property, I think
                            propertyValues.splice(0, 0, _this.getEntityDisplayName(entityOfInterest));
                            //need to update the property since we're in a promise resolution and the main thread has returned
                            entity.$dropdownDisplay = propertyValues.join(' ');
                        });
                    });
                }
                else {
                    propertyValues.push(propertyValue);
                }

            });
            entity.$dropdownDisplay = propertyValues.join(' ');
        }
        else{
            logProvider.info('entityForm', 'drop down display property already calculated as', entity.$dropdownDisplay);
        }
        return entity.$dropdownDisplay;
    };

    //init
    studioProvider.getEntityDefinitions().then(function(definitions){
        entityDefinitions = definitions;
    });
}]);