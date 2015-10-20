app.filter('unlimitedFromZero', function(){
    return function(val){
        if (val === 0){
            return 'unlimited';
        }
        else {
            return val;
        }
    };
});