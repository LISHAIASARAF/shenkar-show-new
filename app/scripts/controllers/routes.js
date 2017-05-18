angular.module('sbAdminApp')
    .controller('RoutesCtrl', function ($scope, $http, $q, $rootScope, $state, $cookies) {

        $scope.selection=[];
        $scope.init = function () {
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
        }

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

            $scope.selection=$scope.selected.projectIds;
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

        function getProjectName(p_id) {
            var name = '';
            $scope.projects.forEach(function (p) {
                if (p.id == p_id) {
                    name = p.name;
                }
            });

            return name;
        }

    });