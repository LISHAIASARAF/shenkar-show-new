'use strict';

angular.module('sbAdminApp')
    .controller('AuthCtrl', function ($scope, $position, $http, Authentication, $state, $cookieStore, $rootScope, $cookies) {
        $scope.userName = '';
        $scope.password = '';
        $scope.dtFrom = '';
        $scope.dtTo = '';

        $scope.oldPassword;
        $scope.newPassword;
        $scope.reNewPassword;

        $scope.login = function () {
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
            $http.post(
                'https://shenkar-show.herokuapp.com/users/auth',
                {
                    userName: $scope.userName,
                    password: $scope.password
                }
            )
                .then(
                    function (res) {
                        if (res.data=='false') {
                            toastr.error('שם משתמש או סיסמא לא נכונים');
                            return false;
                        }
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

        $scope.resetPassword = function () {
            var reset = {
                oldPassword: $scope.oldPassword,
                newPassword: $scope.newPassword,
                reNewPassword: $scope.reNewPassword,
            };

            $http.post(
                'https://shenkar-show.herokuapp.com/updatePassword',
                reset
            ).then(
                function (res) {
                    toastr.info('הסיסמא שונתה בהצלחה');
                },
                function (err) {

                }
            );
        };

    });
