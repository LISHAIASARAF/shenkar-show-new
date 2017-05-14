'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('UsersCtrl', function ($scope, $position, $http, $q, $rootScope, $state) {
        $scope.roles = ['department manager', 'institute manager', 'student'];
        $scope.init = function () {
            getAllData();
        };

        if (!$rootScope.user) {
            $state.go('login');
        } else {
            $scope.me = $rootScope.user;
        }

        $scope.new = {
            institute: $rootScope.user.institute

        };

        function getDepartments() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/departments');
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

        function getProjects() {
            return $http.get('https://shenkar-show.herokuapp.com/department/projects');
        }

        function getAllData() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $q.all([
                getDepartments(),
                getUsers(),
                getProjects()
            ]).then(function (res) {
                $scope.departments = res[0].data;
                $scope.users = res[1].data;
                $scope.projects = res[2].data;
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
        };

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
        };

        $scope.update = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $scope.selected.department = $scope.selected.department.id;
            $scope.selected.institute = $scope.selected.institute.id;
            $http.post('https://shenkar-show.herokuapp.com/institute/updateUser', $scope.selected).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            }, function () {
                toastr.error('בעיה בשמירת הנתונים');

            });
        };

        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.delete('https://shenkar-show.herokuapp.com/users/' + $scope.selected._id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        };

        $scope.create = function () {
            $http.post('https://shenkar-show.herokuapp.com/institute/createUser', $scope.new).then(function (resp) {
                if (resp.data.indexOf('user already exists') > -1) {
                    toastr.error('המשתמש כבר קיים');
                }
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            }, function () {
                toastr.error('בעיה בשמירת הנתונים');

            });

        }

    });
