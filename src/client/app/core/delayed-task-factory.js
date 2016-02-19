(function () {
    'use strict';

    // Define module and dependencies.
    angular
        .module('ngD3Example.core')
        .factory('delayedTaskFactory', delayedTaskFactory);

    /* @ngInject */
    function delayedTaskFactory($timeout) {
        function DelayedTask(fn) {
            this.fn = fn;
            this.promise = null;
        }

        DelayedTask.prototype.delay = function(delayInMillis, fnArgs) {
            var me = this;
            if (me.promise) {
                me.cancel();
            }

            this.promise = $timeout(function() {
                me.promise = null;
                me.fn.apply(me, fnArgs);
            }, delayInMillis);
        };

        DelayedTask.prototype.cancel = function() {
            var me = this;
            $timeout.cancel(me.promise);
            me.promise = null;
        };

        return {
            create: function(fn) {
                return new DelayedTask(fn);
            }
        };
    }
})();
