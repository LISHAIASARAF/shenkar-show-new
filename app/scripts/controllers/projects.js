'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProjectsCtrl', function ($scope, $position, $http, $rootScope, $state, $cookies, $stateParams) {
            $scope.departments = []

            $scope.init = function () {
                if (!$rootScope.user) {
                    $state.go('login');
                } else {
                    $scope.me = $rootScope.user;
                    if ($scope.me.role != 'department manager' && $scope.me.role != 'student') {
                        alert('אין לך הרשאה');
                        $state.go('dashboard.home');
                    }
                }
                $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
                getProjects();
                getLocations();

                $scope.new = {
                    department: $rootScope.user.department
                };

            };

            function getProjects() {
                var url = '';
                if ($rootScope.user.role == 'department manager') {
                    url = 'https://shenkar-show.herokuapp.com/department/projects';
                } else if ($rootScope.user.role == 'student') {
                    url = 'https://shenkar-show.herokuapp.com/student/project'
                }
                $http.get(url).then(function (resp) {
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
                var url = '';
                if ($rootScope.user.role == 'department manager') {
                    url = 'https://shenkar-show.herokuapp.com/department/updateProject';
                } else if ($rootScope.user.role == 'student') {
                    url = 'https://shenkar-show.herokuapp.com/student/updateProject';
                }


                var payload = new FormData();
                payload.append("name", $scope.selected.name);
                payload.append("description", $scope.selected.description);
                payload.append("location", $scope.selected.location.id);
                payload.append("studentEmails", $scope.selected.studentEmails);

                payload.append("imageUrl1", $scope.selected.imageUrl1);
                payload.append("imageUrl2", $scope.selected.imageUrl2);
                payload.append("imageUrl3", $scope.selected.imageUrl3);
                payload.append("imageUrl4", $scope.selected.imageUrl4);
                payload.append("imageUrl5", $scope.selected.imageUrl5);
                payload.append("videoUrl", $scope.selected.videoUrl);
                payload.append("soundUrl", $scope.selected.soundUrl);
                payload.append("institute", $rootScope.user.institute);
                payload.append("departmentId", $rootScope.user.department);
                payload.append("department", $rootScope.user.department);
                payload.append("id", $scope.selected.id);

                return $http({
                    url: url,
                    method: 'POST',
                    data: payload,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).then(function (resp) {
                    toastr.info(' נתונים נשמרו בהצלחה');
                    $scope.init();
                    $('.modal').modal('hide');
                });

                $scope.selected.departmentId = $rootScope.user.department;
                $scope.selected.location = $scope.selected.location.id;

                $http.post('https://shenkar-show.herokuapp.com/department/updateProject', $scope.selected).then(function (resp) {
                    toastr.info('הנתונים נשמרו בהצלחה');
                    $scope.init();
                    $('#edit').modal('hide');

                });
            };

            $scope.getProject = function () {
                var id = $stateParams.id;
                $http.get('https://shenkar-show.herokuapp.com/guest/project/id/' + id).then(function (res) {
                    $scope.project = res.data;

                    var url = 'https://www.youtube.com/embed/' + $scope.project.videoUrl;

                    $("iframe").attr("src", url);

                });
            }
            $scope.create = function () {
                // imageUrl: [String],
                //     videoUrl: String,
                //     soundUrl: String,

                var payload = new FormData();
                payload.append("name", $scope.new.name);
                payload.append("description", $scope.new.description);
                payload.append("location", $scope.new.location);
                payload.append("studentEmails", $scope.new.studentEmails);

                payload.append("imageUrl1", $scope.new.imageUrl1);
                payload.append("imageUrl2", $scope.new.imageUrl2);
                payload.append("imageUrl3", $scope.new.imageUrl3);
                payload.append("imageUrl4", $scope.new.imageUrl4);
                payload.append("imageUrl5", $scope.new.imageUrl5);
                payload.append("videoUrl", $scope.new.videoUrl);
                payload.append("soundUrl", $scope.new.soundUrl);
                payload.append("institute", $rootScope.user.institute);
                payload.append("departmentId", $rootScope.user.department);
                payload.append("department", $rootScope.user.department);


                return $http({
                    url: 'https://shenkar-show.herokuapp.com/department/createProject',
                    method: 'POST',
                    data: payload,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).then(function (resp) {
                    toastr.info(' נתונים נשמרו בהצלחה');
                    $scope.init();
                    $('.modal').modal('hide');
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
                $http.post('https://shenkar-show.herokuapp.com/department/deleteProject', {
                    id: $scope.selected.id,
                    department: $rootScope.user.department,
                    institute: $rootScope.user.institute
                }).then(function (resp) {
                    toastr.info('נמחק בהצלחה');
                    $scope.init();

                });
            }

        }
    );
