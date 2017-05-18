'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProjectsCtrl', function ($scope, $position, $http, $rootScope, $state) {
        $scope.departments = []

        $scope.new = {
            department: $rootScope.user.department
        };

        $scope.init = function () {
            getProjects();
            getLocations();
        };

        if (!$rootScope.user) {
            $state.go('login');
        } else {
            $scope.me = $rootScope.user;
            if ($scope.me.role != 'department manager' || $scope.me.role != 'student') {
                alert('אין לך הרשאה');
                $state.go('dashboard.home');
            }
        }


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
            var payload = new FormData();
            payload.append("name", $scope.selected.name);
            payload.append("description", $scope.selected.description);
            payload.append("location", $scope.selected.location);
            payload.append("studentEmails", $scope.selected.studentEmails);
            payload.append("studentNames", $scope.selected.studentNames);
            payload.append("imageUrl", $scope.selected.imageUrl);
            payload.append("videoUrl", $scope.selected.videoUrl);
            payload.append("soundUrl", $scope.selected.soundUrl);
            payload.append("institute", $rootScope.user.institute);
            payload.append("id", $scope.selected.id);


            return $http({
                url: 'https://shenkar-show.herokuapp.com/projects/create',
                method: 'POST',
                data: payload,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (resp) {
                toastr.info(' נתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');
            });
            $scope.selected.departmentId = $rootScope.user.department;
            $scope.selected.location = $scope.selected.location.id;

            $http.post('https://shenkar-show.herokuapp.com/projects/update', $scope.selected).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        };

        $scope.create = function () {
            // imageUrl: [String],
            //     videoUrl: String,
            //     soundUrl: String,

            var payload = new FormData();
            payload.append("name", $scope.new.name);
            payload.append("description", $scope.new.description);
            payload.append("location", $scope.new.location);
            payload.append("studentEmails", $scope.new.studentEmails);
            payload.append("studentNames", $scope.new.studentNames);
            payload.append("imageUrl", $scope.new.imageUrl);
            payload.append("videoUrl", $scope.new.videoUrl);
            payload.append("soundUrl", $scope.new.soundUrl);


            return $http({
                url: 'https://shenkar-show.herokuapp.com/projects/create',
                method: 'POST',
                data: payload,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (resp) {
                toastr.info(' נתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');
            });


            // $scope.new.departmentId = $scope.new.department;
            //
            // $http.post('https://shenkar-show.herokuapp.com/projects/create', $scope.new).then(function (resp) {
            //     toastr.info('הנתונים נשמרו בהצלחה');
            //     $scope.init();
            //     $('#new').modal('hide');
            //
            // }, function (err) {
            //
            // });
        }
        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/projects/delete', $scope.selected).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }

    });
