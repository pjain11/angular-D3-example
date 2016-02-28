(function () {
    'use strict';

    angular
        .module('ngD3Example.widgets')
        .directive('barLineChart', barLineChart);

    /* @ngInject */
    function barLineChart (viewportUtils, delayedTaskFactory) {
        var directive = {
            replace: true,
            bindToController: true,
            controller: BarLineChartController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                title: '@',
                barSeriesValueField: '@',
                lineSeriesValueField: '@',
                xAxisValueField: '@',
                chartData: '='

            },
            templateUrl: 'app/widgets/bar-line-chart.html',
            link: function(scope, element, attrs, vm) {
                var delayedDrawChartTask = delayedTaskFactory.create(function () {
                    vm.drawChart();
                });

                function delayedDrawChart() {
                    if (delayedDrawChartTask) {
                        delayedDrawChartTask.delay(50);
                    }
                }

                viewportUtils.watchWindowSize(scope, delayedDrawChart);
                scope.$watchCollection('vm.chartData', vm.drawChart);
            }
        };

        /* @ngInject */
        function BarLineChartController($element, barLineChartFactory, chartUtils) {
            var vm = this,
                chart = barLineChartFactory.create(),
                chartContainerEl = $element.find('.chart-content-container');


            vm.drawChart = function() {

                var parentDom = chartContainerEl[0],
                    el = d3.select(parentDom),
                    chartHeight = parentDom.clientHeight,
                    chartWidth = parentDom.clientWidth,
                    svg = chartUtils.selectOrNew(el, 'svg', 'bar-line-chart');

                svg.attr({
                    width: chartWidth,
                    height: chartHeight
                });

                chart.width(chartWidth)
                    .height(chartHeight)
                    .barSeriesValueField(vm.barSeriesValueField)
                    .lineSeriesValueField(vm.lineSeriesValueField)
                    .xAxisValueField(vm.xAxisValueField);

                d3.select(svg)
                    .datum(vm.chartData)
                    .call(chart);
            }

        }

        return directive;
    }
})();
