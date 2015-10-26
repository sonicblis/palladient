app.filter('trimAfterColon', function(){
    return function(val){
        if (val){
            if (typeof(val) == 'string'){
                if (val.indexOf(':') > -1){
                    return val.substring(0, val.indexOf(':'));
                }
            }
        }
        return val;
    }
});
