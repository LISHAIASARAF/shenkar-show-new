angular.module('sbAdminApp')
    .controller('RoutesCtrl', function ($scope, $http, $q, $rootScope, $state) {

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

        function getAllProjects() {
            return $http.get('https://shenkar-show.herokuapp.com/department/projects');
        }

        $scope.getProjectsName = function (route) {
            var names = [];
            route.projects.forEach(function (p) {
                var name = getProjectName(p);
                names.push(name);
            });

            return names;
        };

        $scope.toggleSelectionEdit = function toggleSelection(p_id) {
            var idx = $scope.selected.projects.indexOf(p_id);
            // Is currently selected
            if (idx > -1) {
                $scope.selected.projects.splice(idx, 1);
            }
            // Is newly selected
            else {
                $scope.selected.projects.push(p_id);
            }
        };

        function getProjectName(p_id) {
            $scope.projects.forEach(function (p) {
                if (p.id == p_id) {
                    return p.name;
                }
            });
        }

    });