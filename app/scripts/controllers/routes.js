angular.module('sbAdminApp')
    .controller('RoutesCtrl', function ($scope, $http, $q, $rootScope, $state, $cookies) {

        // var routes = [{
        //     name: "test 2",
        //     institute: 1,
        //     projectIds: [
        //         1,
        //         2,
        //         10,
        //         13,
        //         11
        //     ],
        //     id: 2
        // }];
        //
        // var projs = [{
        //     name: "פרויקט 11",
        //     institute: 1,
        //     imageUrl: [],
        //     id: 1
        // },
        //     {
        //         name: "פרויקט 22",
        //         institute: 1,
        //         imageUrl: [],
        //         id: 2
        //     },
        //     {
        //
        //         name: "פרויקט 33",
        //         institute: 1,
        //         imageUrl: [],
        //         id: 3
        //     },
        //     {
        //         name: "פרויקט 44",
        //         institute: 1,
        //         imageUrl: [],
        //         id: 4
        //     }];

        $scope.selection = [];
        $scope.init = function () {
            // $scope.routes = routes;//res[0].data;
            // $scope.projects = projs;//res[1].data;
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
            $q.all([
                getAllRoutes(),
                getAllProjects()
            ]).then(function (res) {
                $scope.routes = res[0].data;
                $scope.projects = res[1].data;
            });
        };

        function getAllRoutes() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/routes');
            //     .then(function (res) {
            //     $scope.routes = res.data;
            // });
        }

        $scope.isChecked = function (id) {
            var ischecked = $scope.selection.indexOf(id) > -1;
            return ischecked;
        };

        function getAllProjects() {
            return $http.get('https://shenkar-show.herokuapp.com/institute/projects');
        }

        $scope.setEdit = function (id) {
            $scope.selected = null;
            $scope.routes.forEach(function (d) {
                if (d.id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }

            $scope.selection = $scope.selected.projectIds;
        }

        $scope.getProjectsName = function (route) {
            var names = [];
            route.projectIds.forEach(function (p) {
                var name = getProjectName(p);
                names.push(name);
            });
            names = names.join(',');
            return names;
        };

        $scope.toggleSelectionEdit = function toggleSelection(p_id) {
            var idx = $scope.selected.projectIds.indexOf(p_id);
            // Is currently selected
            if (idx > -1) {
                $scope.selected.projectIds.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.selected.projectIds.push(p_id);
            }
        };


        $scope.toggleSelectionNew = function toggleSelection(p_id) {
            if (!$scope.new.projectIds) {
                $scope.new.projectIds = [];
            }

            var idx = $scope.new.projectIds.indexOf(p_id);
            // Is currently selected
            if (idx > -1) {
                $scope.new.projectIds.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.new.projectIds.push(p_id);
            }
        };

        function getProjectName(p_id) {
            var name = '';
            $scope.projects.forEach(function (p) {
                if (p.id == p_id) {
                    name = p.name;
                }
            });

            return name;
        }

        $scope.update = function () {
            $http.post('https://shenkar-show.herokuapp.com/institute/updateRoute', $scope.selected).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        };

        $scope.create = function () {
            $scope.new.departmentId = $scope.new.department;

            $http.post('https://shenkar-show.herokuapp.com/institute/createRoute', $scope.new).then(function (resp) {
                toastr.info('הנתונים נשמרו בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            }, function (err) {

            });
        };

        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/institute/deleteRoute', $scope.selected.id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        };

    });