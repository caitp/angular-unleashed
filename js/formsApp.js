angular.module("formsApp", ["ngMessages"]).
    directive("verifyEmail", function($q, $http, $timeout) {
       return {
           require: 'ngModel',
           link: function(scope, element, attrs, ngModel) {
               ngModel.$asyncValidators['email-in-use'] = function(modelValue, viewValue) {
                   return $http.get('mockdata/emails.json').then(function(response) {
                       return $timeout(function() {
                           var json = response.data;
                           if (viewValue in json) return $q.reject('email exists');
                           return true;
                       }, 2000);
                   }, function() {
                       return true;
                   });
               };
           }
       };
    }).
    controller("formCtrl", function() {});
