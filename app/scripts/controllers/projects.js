'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProjectsCtrl', function ($scope, $position, $http, $rootScope) {
        $scope.departments = []

        $scope.new = {
            department: $rootScope.user.department
        };

        $scope.init = function () {
            getProjects();
            getLocations();

        };


        // {
        //
        //     _id : {type: Number, required:true, index:1, unique:true, autoIncrement:true},
        //     departmentId: {type: Number, ref: 'department'},
        //     name: String,
        //         description: String,
        //     imageUrl: [String],
        //     videoUrl: String,
        //     soundUrl: String,
        //     location: {type: Number, ref: 'location'},
        //     institute: {type: Number, ref: 'institute'},
        //     studentNames: [String],
        //         studentEmails: [String]
        // },
        function getProjects() {
            $http.get('https://shenkar-show.herokuapp.com/department/projects').then(function (resp) {
                $scope.projects = resp.data;
            });
        }

        function getLocations() {
            $http.get('https://shenkar-show.herokuapp.com/department/locations').then(function (resp) {
                $scope.locations = resp.data;
            });
        }

        // function getInstitutes() {
        //     $http.get('scripts/institutes.json').then(function (resp) {
        //         $scope.institutes = resp.data;
        //     });
        // }

        function getDepartments() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/departments').then(function (resp) {
                $scope.departments = resp.data;
            });
        }


        $scope.setEdit = function (id) {
            $scope.selected = null;

            $scope.projects.forEach(function (d) {
                if (d.id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }

        };

        $scope.update = function () {
            $scope.selected.departmentId = $rootScope.user.department;
            $scope.selected.location = $scope.selected.location.id;

            $http.post('https://shenkar-show.herokuapp.com/projects/update', $scope.selected).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        };

        $scope.create = function () {
            $scope.new.departmentId = $scope.new.department;

            $http.post('https://shenkar-show.herokuapp.com/projects/create', $scope.new).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            }, function (err) {

            });
        }
        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/projects/delete', $scope.selected).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }

    });
