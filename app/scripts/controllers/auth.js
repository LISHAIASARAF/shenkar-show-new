'use strict';

angular.module('sbAdminApp')
    .controller('AuthCtrl', function ($scope, $position, $http, Authentication, $state, $cookieStore, $rootScope) {
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

                        console.log(res);
                        console.log(res.data.id);
                        $rootScope.user = res.data;
                        $cookieStore.put("shenkarShowUserId", res.data.id);
                        Authentication.setUser(res.data);
                        $state.go('dashboard.home')
                    },
                    function (err) {

                    }
                );

        }

    });
