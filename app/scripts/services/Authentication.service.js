// Authentication service for user variables
angular.module('sbAdminApp').factory('Authentication', ['$window',
    function ($window) {
        var auth = {};

        auth.init = function() {
            if ($window.sessionStorage.user) {
                if ($window.sessionStorage.user)
                    this.user = JSON.parse($window.sessionStorage.user);
            }
            return this;
        };

        auth.setUser = function (user) {
            $window.sessionStorage.user = JSON.stringify(user);
            this.user = user;
        };


        auth.clear = function () {
            $window.sessionStorage.clear();
        };

        auth.isAuthenticated = function () {
            return !!this.user;
        };

        return auth.init();
    }
]);
