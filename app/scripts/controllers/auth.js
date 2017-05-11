'use strict';

angular.module('sbAdminApp', ['ngCookies'])
    .controller('AuthCtrl', function ($scope, $position, $http, Authentication, $state, $cookieStore) {
        $scope.userName = '';
        $scope.password = '';
        $scope.dtFrom = '';
        $scope.dtTo = '';

        $scope.login = function () {

            $http.post(
                'https://shenkar-show.herokuapp.com/users/auth',
                {
                    userName: $scope.userName,
                    password: $scope.password
                }
            )
                .then(
                    function (res) {
                        var a = res.data;
                        $cookieStore.put("shenkarShowUserId", res.id);
                        Authentication.setUser(res.data);
                        $state.go('dashboard.departments')
                    },
                    function (err) {

                    }
                );

        }

    });
