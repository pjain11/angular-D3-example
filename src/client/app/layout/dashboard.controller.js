(function () {
    'use strict';

    angular
        .module('ngD3Example.layout')
        .controller('DashboardController', DashboardController);

    /* @ngInject */
    function DashboardController($rootScope) {

        var vm = this;
        loadData();

        function loadData() {
            // Note: Make service call for data
            var data = [{revenue: 30000, unitsSold: 100, label: 'CategoryA'},
                {revenue: 50000, unitsSold: 10, label: 'Category B'},
                {revenue: 60000, unitsSold: 30, label: 'Category C'},
                {revenue: 70000, unitsSold: 40, label: 'Category D'},
                {revenue: 20000, unitsSold: 20, label: 'Category E'}];

            vm.data = data;
        }

    }
})();
