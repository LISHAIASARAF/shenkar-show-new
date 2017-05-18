'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('DepartmentsCtrl', function ($scope, $position, $http, $cookies, $rootScope, $state) {
        $scope.departments = [];
        if (!$rootScope.user) {
            $state.go('login');
        } else {
            $scope.me = $rootScope.user;
            if ($scope.me.role != 'institute manager') {
                alert('אין לך הרשאה');
                $state.go('home');
            }
        }
        $scope.new = {
            institute: $rootScope.user.institute
        };

        $scope.init = function () {
            getDepartmentsMangers();
        };

        function getDepartmentsMangers() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
            $http.get('https://shenkar-show.herokuapp.com/institute/users').then(function (resp) {
                $scope.users = resp.data;
                $http.get('https://shenkar-show.herokuapp.com/institute/departments').then(function (resp) {
                    $scope.departments = resp.data;

                });
            });
            // $http.get('scripts/users.json').then(function (resp) {
            //     $scope.users = resp.data;
            //     $http.get('scripts/departments.json').then(function (resp) {
            //
            //
            //         $scope.departments = resp.data;
            //
            //     });
            // });

        }


        $scope.getManagerName = function (id) {
            var name = '';
            $scope.users.forEach(function (u) {
                if (u._id == id) {
                    name = u.name;
                }
            });

            return name;
        }

        $scope.setEdit = function (id) {
            $scope.selected = null;
            $scope.departments.forEach(function (d) {
                if (d.id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        }

        $scope.update = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            var payload = new FormData();
            payload.append("name", $scope.selected.name);
            payload.append("locationDescription", $scope.selected.locationDescription);
            payload.append("imageUrl", $scope.selected.imageUrl);
            payload.append("largeImageUrl", $scope.selected.largeImageUrl);
            payload.append("institute", $rootScope.user.institute);
            payload.append("id", $scope.selected.id);

            return $http({
                url: 'https://shenkar-show.herokuapp.com/institute/updateDepartment',
                method: 'POST',
                data: payload,
                headers: { 'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#edit').modal('hide');
            });
        };

        $scope.create = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            var payload = new FormData();
            payload.append("name", $scope.new.name);
            payload.append("locationDescription", $scope.new.locationDescription);
            payload.append("imageUrl", $scope.new.imageUrl);
            payload.append("largeImageUrl", $scope.new.largeImageUrl);
            payload.append("institute", $rootScope.user.institute);

            return $http({
                url: 'https://shenkar-show.herokuapp.com/institute/createDepartment',
                method: 'POST',
                data: payload,
                headers: { 'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            }, function (err) {

            });

        };
        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.delete('https://shenkar-show.herokuapp.com/department/' + $scope.selected.id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }

    }).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
