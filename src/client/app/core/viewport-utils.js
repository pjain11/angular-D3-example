(function () {
    'use strict';

    angular
        .module('ngD3Example.core')
        .factory('viewportUtils', viewportUtils);

    /* @ngInject */
    function viewportUtils($window) {
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

        return utils;
    }
})();
