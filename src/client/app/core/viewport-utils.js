(function () {
    'use strict';

    angular
        .module('ngD3Example.core')
        .factory('viewportUtils', viewportUtils);

    /* @ngInject */
    function viewportUtils($window, $mdMedia, $rootScope) {
        var utils = {
            watchWindowSize: watchWindowSize
        }

        function onWindowResize(listener) {
            var winEl = angular.element($window);
            winEl.bind('resize', listener);

            return function () {
                winEl.unbind('resize', listener);
            };
        }

        function watchWindowSize(scope, listener) {
            var unRegisterFxn = onWindowResize(listener);

            scope.$on('$destroy', unRegisterFxn);
        }
        // Wrapper around ng materials breakpoints https://material.angularjs.org/HEAD/api/service/$mdMedia
        // In this way we can use media query  breakpoints on angular templates if necessary.
        // Also this way we can expose application specific media query points by hiding implementation details
        // in service class.

        $rootScope.viewportXs = $mdMedia('xs');
        $rootScope.$watch(function() { return $mdMedia('xs'); }, function(val) {
            $rootScope.viewportXs = val;
        });

        $rootScope.viewportGtXs = $mdMedia('gt-xs');
        $rootScope.$watch(function() { return $mdMedia('gt-xs'); }, function(val) {
            $rootScope.viewportGtXs = val;
        });

        $rootScope.viewportSm = $mdMedia('sm');
        $rootScope.$watch(function() { return $mdMedia('sm'); }, function(val) {
            $rootScope.viewportSm = val;
        });

        $rootScope.viewportGtSm = $mdMedia('gt-sm');
        $rootScope.$watch(function() { return $mdMedia('gt-sm'); }, function(val) {
            $rootScope.viewportGtSm = val;
        });

        $rootScope.viewportMd = $mdMedia('md');
        $rootScope.$watch(function() { return $mdMedia('md'); }, function(val) {
            $rootScope.viewportMd = val;
        });

        $rootScope.viewportGtMd = $mdMedia('gt-md');
        $rootScope.$watch(function() { return $mdMedia('gt-md'); }, function(val) {
            $rootScope.viewportGtMd = val;
        });

        $rootScope.viewportLarge = $mdMedia('lg');
        $rootScope.$watch(function() { return $mdMedia('lg'); }, function(val) {
            $rootScope.viewportLarge = val;
        });

        $rootScope.viewportGtLg = $mdMedia('gt-lg');
        $rootScope.$watch(function() { return $mdMedia('gt-lg'); }, function(val) {
            $rootScope.viewportGtLg = val;
        });

        return utils;
    }
})();
