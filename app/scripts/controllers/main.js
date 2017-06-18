'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('MainCtrl', function ($scope, $position, $http, $rootScope, $state, $cookies) {

        $scope.init = function () {
            if (!$rootScope.user) {
                $state.go('login');
            } else {


                $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
                $scope.me = $rootScope.user;


                if ($scope.me.role == 'student') {
                    $state.go('dashboard.projects');
                }
                else {
                    if ($scope.me.role == 'admin') {
                        getInstituteManagers();
                        getInstitutes();
                    }
                    else if ($scope.me.role == 'institute manager') {
                        getDepartments();
                        getDepartmentManagers();

                    }
                    else if ($scope.me.role == 'department manager') {
                        getProjects();
                        getStudents();

                    }
                }
            }
        };


        function getInstitutes() {
            return $http.get('https://shenkar-show.herokuapp.com/admin/institutes').then(function (res) {
                $scope.institutes = res.data;
            })
        }

        function getInstituteManagers() {
            return $http.get('https://shenkar-show.herokuapp.com/admin/users').then(function (res) {
                $scope.instituteManagers = res.data;
            })
        }

        function getDepartmentManagers() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/users').then(function (res) {
                $scope.departmentManagers = res.data;
            })
        }

        function getStudents() {
            return $http.get('https://shenkar-show.herokuapp.com/department/users').then(function (res) {
                $scope.students = res.data;
            })
        }

        function getDepartments() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/departments').then(function (resp) {
                $scope.departments = resp.data;
            });
        }

        function getProjects() {
            return $http.get('https://shenkar-show.herokuapp.com/instituteProjects').then(function (res) {
                $scope.projects = res.data;
            })
        }
    });
