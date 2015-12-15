var columnDefinition = function(headerText, propertyName, templateOption){
    this.headerText = headerText;
    this.propertyName = propertyName;
    this.templateOption = templateOption;
};
var templateOptions = {
    date: 'date'
};
var broadcastMessages = {
    resetEditor: 'reset-editor'
};
var option = function(display, value, parent){
    this.display = display;
    this.value = value;
    this.parent = parent;
};