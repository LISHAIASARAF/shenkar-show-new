'use strict';

angular.module('sbAdminApp')
	.directive('timeline',function() {
    return {
        templateUrl:'scripts/directives/timeline/timeline.html',
        restrict: 'E',
        replace: true,
        scope: {
            'projects': '=',
        }
    }
  });
