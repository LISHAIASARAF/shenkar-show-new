'use strict';

angular.module('sbAdminApp')
    .controller('UsersCtrl', function ($scope, $position, $http, $q, $rootScope, $state, $cookies) {
        $scope.roles = ['department manager', 'institute manager', 'student'];
        $scope.init = function () {
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
            getAllData();
        };

        if (!$rootScope.user) {
            $state.go('login');
        } else {
            $scope.me = $rootScope.user;
            if ($scope.me.role == 'student') {
                alert('אין לך הרשאה');
                $state.go('dashboard.home');
            }

            if ($scope.me.role == 'admin') {
                $scope.roles = ['institute manager'];
            } else if ($scope.me.role == 'institute manager') {
                $scope.roles = ['department manager'];
            } else if ($scope.me.role == 'department manager') {
                $scope.roles = ['student'];
            }
        }

        if ($rootScope.user.institute) {
            $scope.new = {
                institute: $rootScope.user.institute
            };
        }
        else {
            $scope.new = {};
        }

        function getDepartments() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/departments');
        }

        function getUsers() {
            if ($scope.me.role == 'admin') {
                return $http.get('https://shenkar-show.herokuapp.com/admin/users');
            }
            else if ($scope.me.role == 'department manager') {
                return $http.get('https://shenkar-show.herokuapp.com/department/users');
            } else if ($scope.me.role == 'institute manager' || $scope.me.role == 'admin') {
                return $http.get('https://shenkar-show.herokuapp.com/institute/users');
            }
        }


        function getProjects() {
            return $http.get('https://shenkar-show.herokuapp.com/department/projects');
        }

        function getInstitutes() {
            return $http.get('https://shenkar-show.herokuapp.com/admin/institutes')
        }

        function getAllData() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $q.all([
                getDepartments(),
                getUsers(),
                getProjects(),
                getInstitutes()
            ]).then(function (res) {
                $scope.departments = res[0].data;
                $scope.users = res[1].data;
                $scope.projects = res[2].data;
                $scope.institutes = res[3].data;
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
                if (d.id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        };

        $scope.update = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            if($scope.selected.department){
                $scope.selected.department = $scope.selected.department.id;
            }

            $scope.selected.institute = $scope.selected.institute.id;

            var url = '';

            if ($scope.me.role == 'admin') {
                url = 'https://shenkar-show.herokuapp.com/admin/updateUser';
            }
            else if ($scope.me.role == 'department manager') {
                url = 'https://shenkar-show.herokuapp.com/department/updateUser';
            } else if ($scope.me.role == 'institute manager') {
                url = 'https://shenkar-show.herokuapp.com/institute/updateUser';
            }

            $http.post(url, $scope.selected).then(function (resp) {
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
            if ($scope.me.role == 'admin') {
                createInstituteManager();
            }
            else if ($scope.me.role == 'department manager') {
                createStudent();
            } else if ($scope.me.role == 'institute manager') {
                createDepartmentManager()
            }
        };


        function createInstituteManager() {
            $http.post('https://shenkar-show.herokuapp.com/admin/createUser ', $scope.new).then(function (resp) {
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

        function createDepartmentManager() {
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

        function createStudent() {
            $http.post('https://shenkar-show.herokuapp.com/department/createUser', $scope.new).then(function (resp) {
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
