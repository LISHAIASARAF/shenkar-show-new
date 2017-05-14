'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProjectsCtrl', function ($scope, $position, $http, $q) {
        $scope.departments = []
        $scope.new = {
            manager: '1'
        }
        $scope.init = function () {
            getProjects();
            getDepartments();
            getInstitutes();
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
            $http.get('scripts/allProjects').then(function (resp) {
                $scope.projects = resp.data;
            });
        }

        function getLocations() {
            $http.get('https://shenkar-show.herokuapp.com/locations').then(function (resp) {
                $scope.locations = resp.data;
            });
        }

        function getInstitutes() {
            $http.get('scripts/institutes.json').then(function (resp) {
                $scope.institutes = resp.data;
            });
        }

        function getDepartments() {
            return $http.get('scripts/departments.json').then(function (resp) {
                $scope.departments = resp.data;
            });
        }

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
            $scope.projects.forEach(function (d) {
                if (d._id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        }

        $scope.update = function () {
            $http.put('https://shenkar-show.herokuapp.com/projects/update', $scope.selected).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        }

        $scope.create = function () {

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
