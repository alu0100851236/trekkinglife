var myApp = angular.module('myApp', []);

myApp.controller("ctrl_validacion", function($scope){

    $scope.ShowFormSignup=function(){
        $scope.estilos={display:"block"};
        $scope.form2=false;
        $scope.form=true;
    }
    
    $scope.ShowLogin=function(){
        $scope.estilos={display:"block"};
        $scope.form=false;
        $scope.form2=true;
    }
});