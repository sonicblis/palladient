app.service("entityProvider", ['firebase', '$firebaseArray', 'studioProvider', '$q', '$timeout', function(firebase, $firebaseArray, studioProvider, $q, $timeout){
    var _this = this;
    var entityDefinitions;
    studioProvider.getEntityDefinitions().then(function(definitions){
        entityDefinitions = definitions;
    });
    var typeDefinitionIdentifier = 'typeDefinition:';
    var childEntities = {};
    function resolveChildEntityDisplayNames(entity) {
        entityDefinitions.$loaded(function (definitions) {
            var selectedEntityDefinition = definitions.$getRecord(entity.fromDefinition);
            selectedEntityDefinition.properties.forEach(function (property) {
                if (_this.isEntityTypeProperty(property)) {
                    var propertyDefinition = definitions.$getRecord(_this.getIdFromPropertyType(property));
                    if (!childEntities[property.type]) {
                        childEntities[property.type] = _this.getEntities(property.type);
                    }
                    childEntities[property.type].$loaded(function (childEntities) {
                        var relevantEntity = childEntities.$getRecord(entity[property.name]);
                        if (relevantEntity) {
                            var fieldValues = [];
                            propertyDefinition.displayProperty.forEach(function (field) {
                                fieldValues.push(relevantEntity[field]);
                            });
                            entity['_' + property.name] = fieldValues.join(' ');
                        }
                    });
                }
            });
        });
    }
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
    this.getEntities = function(entityDefinitionId, resolveChildren){
        entityDefinitionId = entityDefinitionId.replace('typeDefinition:','');
        var ref = firebase.entities.orderByChild('fromDefinition').equalTo(entityDefinitionId);
        if (resolveChildren)
            return new $firebaseResolvingArray(ref);
        else
            return new $firebaseArray(ref)
    };
    this.saveInstance = function(instance){
        if (instance.$id){
            firebase.entities.child(instance.$id).update(firebase.cleanAngularObject(instance));
        }
        else {
            firebase.entities.push(instance);
        }
    };
    this.isEntityTypeProperty = function(property){
        return property.type.indexOf(typeDefinitionIdentifier) > -1;
    };

    this.getIdFromPropertyType = function(property) {
        return property.type.replace(typeDefinitionIdentifier, '');
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
}]);