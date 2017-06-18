angular.module('sbAdminApp')
    .controller('LocationsCtrl', function ($scope, $position, $http, $cookies, $rootScope, $state) {
        $scope.init = function () {
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
            $http.get('https://shenkar-show.herokuapp.com/institute/locations').then(function (res) {
                $scope.locations = res.data;
            });
        };

        $scope.setEdit = function (id) {
            $scope.selected = null;

            $scope.locations.forEach(function (l) {
                if (l.id == id) {
                    $scope.selected = angular.copy(l);
                }
            });
        };

        $scope.update = function () {

            $scope.selected.institute = $rootScope.user.institute;
            $http.post('https://shenkar-show.herokuapp.com/institute/updateLocation').then(function () {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('.modal').modal('hide');
            });
        }

        $scope.create = function () {

            $scope.new.institute = $rootScope.user.institute;

            $http.post('https://shenkar-show.herokuapp.com/institute/createLocation').then(function () {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('.modal').modal('hide');
            });
        }
    });