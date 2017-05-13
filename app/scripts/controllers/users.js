'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('UsersCtrl', function ($scope, $position, $http, $q) {
        $scope.roles = ['department manager', 'institute manager', 'student'];
        $scope.init = function () {
            getAllData();

        };

        $scope.new = {
            role: '1',
            department: '1'
        }

        function getDepartments() {
            return $http.get('scripts/departments.json');
        }

        function getUsers() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/users');
        }

        function getRoles() {
            return $http.get('scripts/roles.json');
        }

        function getInstitues() {
            $http.get('scripts/institutes.json').then(function (resp) {
                $scope.institutes = resp.data;
            });
        }

        function getAllData() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $q.all([
                // getDepartments(),
                // getRoles(),
                getUsers(),
                // getInstitues()
            ]).then(function (res) {
                //  $scope.departments = res[0].data;
                //$scope.roles = res[1].data;
                $scope.users = res[0].data;

            });
            // $http.get('scripts/departments.json').then(function (resp) {
            //     $scope.departments = resp.data;
            //
            // });
            // $http.get('scripts/users.json').then(function (resp) {
            //     $scope.users = resp.data;
            //
            // });

        }

        $scope.getRoleName = function (id) {
            var name = '';
            $scope.roles.forEach(function (r) {
                if (r._id == id) {
                    name = r.name;
                }
            });

            return name;
        };
        $scope.getDepartmentName = function (id) {
            var name = '';
            $scope.departments.forEach(function (d) {
                if (d._id == id) {
                    name = d.name;
                }
            });

            return name;
        };
        $scope.getInstituteName = function (id) {
            var name = '';
            $scope.institutes.forEach(function (d) {
                if (d._id == id) {
                    name = d.name;
                }
            });

            return name;
        }

        $scope.setEdit = function (id) {
            $scope.selected = null;
            $scope.users.forEach(function (d) {
                if (d._id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        }

        $scope.update = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.put('https://shenkar-show.herokuapp.com/users', $scope.selected).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            }, function () {
                toastr.error('בעיה בשמירת הנתונים');

            });
        }
        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.delete('https://shenkar-show.herokuapp.com/users/' + $scope.selected._id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }
        $scope.create = function () {
            $http.post('https://shenkar-show.herokuapp.com/users', $scope.new).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            }, function () {
                toastr.error('בעיה בשמירת הנתונים');

            });

        }

    });
