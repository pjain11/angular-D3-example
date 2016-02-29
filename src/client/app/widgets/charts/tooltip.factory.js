(function () {
    'use strict';

    angular
        .module('ngD3Example.widgets')
        .factory('tooltipFactory', tooltipFactory);

    /* @ngInject */
    function tooltipFactory() {
        var tooltipFactory = {
            create: function () {
                return new tooltipGenerator();
            }
        };

        function tooltipGenerator() {
            var tooltipFn , highLightFn, highLightOutFn;

            function exports(selection) {

                var tooltipDiv;
                var bodyNode = d3.select('body').node();

                function setupTooltip() {
                    // Clean up lost tooltips
                    d3.select('body').selectAll('div.d3-tooltip').remove();
                    // Append tooltip
                    tooltipDiv = d3.select('body').append('div').attr('class', 'd3-tooltip');
                }

                function positionTooltip() {
                    var absoluteMousePos = d3.mouse(bodyNode);
                    tooltipDiv.style('left', (absoluteMousePos[0] + 5) + 'px')
                        .style('top', (absoluteMousePos[1] - 40) + 'px');
                }

                function updateTooltipText(d, i) {
                    var tooltipText;
                    if(_.isFunction(tooltipFn)) {
                        tooltipText = tooltipFn(d, i);
                    }
                    if (_.isUndefined(tooltipText)) {
                        removeTooltip();
                    } else {
                        if (tooltipDiv) {
                            tooltipDiv.html(tooltipText);
                        }
                    }
                }

                function removeTooltip() {
                    if (tooltipDiv) {
                        tooltipDiv.remove();
                    }
                    if (_.isFunction(highLightOutFn)) {
                        d3.select(this).call(highLightOutFn);
                    }
                }

                function addTooltip(d, i) {
                    setupTooltip();
                    positionTooltip();
                    updateTooltipText(d, i);
                    if(_.isFunction(highLightFn)) {
                        d3.select(this).call(highLightFn);
                    }
                }

                selection.on('mouseover', addTooltip)
                    .on('touchstart', addTooltip)
                    .on('mousemove', positionTooltip)
                    .on('touchmove', positionTooltip)
                    .on('mouseout', removeTooltip)
                    .on('touchend', removeTooltip);
            }

            exports.tooltipFn = function (fnIn) {
                if (!arguments.length) {
                    return tooltipFn;
                }

                tooltipFn = fnIn;
                return this;
            };
            exports.highlightFn = function(fnIn) {
                if (!arguments.length) {
                    return highLightFn;
                }
                highLightFn = fnIn;
                return this;
            };
            exports.highlightOutFn = function(fnIn) {
                if (!arguments.length) {
                    return highLightOutFn;
                }
                highLightOutFn = fnIn;
                return this;
            }

            return exports;

        }
        return tooltipFactory;
    }
})();