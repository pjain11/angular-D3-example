(function () {
    'use strict';

    angular
        .module('ngD3Example.widgets')
        .factory('barLineChartFactory', barLineChartFactory);

    /* @ngInject */
    function barLineChartFactory(chartUtils, tooltipFactory, $rootScope) {
        var chartFactory = {
            create: function () {
                return new LineBarChart();
            }
        };

        function LineBarChart() {
            var barRectCls = 'bar-rect',
                barRectSelectedCls = 'bar-rect-selected',
                dotRadius = 4,
                dotHighlightRadius = 8,
                lineSeriesDotsCls = 'line-dot',
                lineDotSelectedCls = 'line-dot-selected',
                marginLeft = 70, // space for drawing Y left axis
                marginRight = 70, // Space for drawing Y right axis
                marginTop = 20,
                marginBottom = 50; // space for drawing x-axis w labels in bottom

            var props = {
                width: undefined,
                height: undefined,
                barSeriesValueField: 'valueLeft',
                lineSeriesValueField: 'valueRight',
                xAxisValueField: 'label'
            }

            function exports(selection) {
                selection.each(function(data) {
                    marginLeft = $rootScope.viewportXs ? 5 : 70;
                    marginRight = $rootScope.viewportXs ? 5 : 70;

                    var containerEl = this,
                        chartPlotWidth = props.width - (marginLeft + marginRight),
                        chartPlotHeight = props.height - (marginTop + marginBottom);

                    var chartGrp = chartUtils.selectOrNew(containerEl, 'g', 'line-bar-grp')
                        .attr('transform', 'translate(' + marginLeft + ',' +  marginTop + ')');

                    //X-axis ==========================================
                    // space reserved for margin is used for drawing Y Axis on Left and Right side and remaining space is
                    // used for drawing chart series or x-axis.
                    // space for drawing is
                    var xScale = d3.scale.ordinal()
                        .rangeRoundBands([0, chartPlotWidth], .05)
                        .domain(data.map(function(d) { return d[props.xAxisValueField]; }));

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom')
                        .innerTickSize(-chartPlotHeight)
                        .outerTickSize(0)
                        .tickPadding(10);

                    var xAxisGrp = chartUtils.selectOrNew(chartGrp, 'g', 'x axis');
                    xAxisGrp.attr('transform', 'translate(' + 0 + ',' +  chartPlotHeight + ')')
                        .call(xAxis);

                    xAxisGrp.selectAll('text')
                        .style('text-anchor', 'middle')
                        .attr("dy", ".15em");

                    //~ ------- Drawing series -------------------------


                    var barWidth = xScale.rangeBand(),
                        calculatedMaxValueLeftAxis = chartUtils.calculateMaxValue(data, props.barSeriesValueField),
                        calculatedMaxValueRightAxis = chartUtils.calculateMaxValue(data, props.lineSeriesValueField),
                        calculatedMinValueLeftAxis = chartUtils.calculateMinValue(data, props.barSeriesValueField),
                        calculatedMinValueRightAxis = chartUtils.calculateMinValue(data, props.lineSeriesValueField);

                    // Y-Axis Left For Bar Series ==========================================
                    var rawYScale = d3.scale.linear()
                        .range([chartPlotHeight, 0])
                        .domain([calculatedMinValueLeftAxis, calculatedMaxValueLeftAxis]);

                    var yScale = function (val) {
                        //Fall back to 0 to prevent those NaN errors when we don't have data
                        return rawYScale(val || 0) || 0;
                    };

                    var yAxisLeftOrient = $rootScope.viewportXs ? 'right' : 'left';

                    var yAxisLeft = d3.svg.axis()
                        .scale(rawYScale)
                        .orient(yAxisLeftOrient)
                        .ticks(5)
                        .outerTickSize(0)
                        .tickPadding(5);

                    drawBarSeries(xScale, yScale, barWidth, data, chartGrp);

                    var yAxisLeftGrp = chartUtils.selectOrNew(chartGrp, 'g', 'y-left').classed('axis', true);
                    yAxisLeftGrp.call(yAxisLeft);


                    // Y-Axis Right for Line Series ============================================
                    var yScaleRight = d3.scale.linear()
                        .range([chartPlotHeight, 0])
                        .domain([calculatedMinValueRightAxis, calculatedMaxValueRightAxis]);

                    drawLineSeries(xScale, yScaleRight, data, chartGrp);

                    var yAxisRightOrient = $rootScope.viewportXs ? 'left' : 'right';

                    var yAxisRight = d3.svg.axis()
                        .scale(yScaleRight)
                        .orient(yAxisRightOrient)
                        .ticks(5);

                    var yAxisRightGrp = chartUtils.selectOrNew(chartGrp, 'g', 'y-right').classed('axis', true);
                    yAxisRightGrp
                        .attr('transform', 'translate(' + (chartPlotWidth) + ',' + 0 + ')')
                        .call(yAxisRight);

                });
            }

            function drawLineSeries(xScale, yScale, data, chartGrp) {
                var tip = tooltipFactory.create()
                    .tooltipFn(function(d, i) {
                        var value = d[props.lineSeriesValueField],
                            label = d[props.xAxisValueField];
                        return label + ' : ' + value;

                    })
                    .highlightFn(function() {
                        this.attr('r', dotHighlightRadius)
                            .classed(lineDotSelectedCls, true)
                            .transition()
                            .duration(1000);
                    })
                    .highlightOutFn(function() {
                        this.attr('r', dotRadius)
                            .classed(lineDotSelectedCls, false)
                            .transition()
                            .duration(1000);
                    });

                var xPositionFn = function(d, i) {
                    return xScale(d[props.xAxisValueField]) + (xScale.rangeBand() / 2);
                };
                var yPositionFn = function(d) {
                    if (isNaN(yScale(d[props.lineSeriesValueField]))) {
                        return yScale(0);
                    }
                    return yScale(d[props.lineSeriesValueField]);
                };

                var lineFn = d3.svg.line()
                    .x(xPositionFn)
                    .y(yPositionFn);


                var linesGrp = chartUtils.selectOrNew(chartGrp, 'g', 'lines-grp');
                //~ Lines ---------------
                var seriesLines = linesGrp.selectAll('path.line')
                    .data(data);

                //New cycle
                seriesLines.enter().append('path')
                    .classed('line', true);

                //remove cycle
                seriesLines.exit().remove();
                //Update Cycle
                linesGrp.selectAll('path.line')
                    .attr('d', lineFn(data))
                    .style('fill', 'none');

                //~ Dots on plotted point ----------
                var lineDotsGrp = chartUtils.selectOrNew(chartGrp, 'g', 'line-dots-grp');
                var seriesDots = lineDotsGrp.selectAll('circle')
                    .data(data || []);
                //New cycle
                seriesDots.enter().append('circle').call(tip);
                //Remove cycle
                seriesDots.exit().remove();
                // Update cycle
                lineDotsGrp.selectAll('circle')
                    .classed(lineSeriesDotsCls, true)
                    .attr('r', dotRadius)
                    .attr('cx', xPositionFn)
                    .attr('cy', yPositionFn);

            }

            function drawBarSeries(xScale, yScale, barWidth, data, chartGrp) {
                var tip = tooltipFactory.create()
                    .tooltipFn(function(d) {
                        var value = d[props.barSeriesValueField],
                            label = d[props.xAxisValueField];
                        return label + ' : ' + value;
                    })
                    .highlightFn(function() {
                        this.classed(barRectSelectedCls, true)
                            .transition()
                            .duration(1000);
                    })
                    .highlightOutFn(function() {
                        this.classed(barRectSelectedCls, false)
                            .transition()
                            .duration(1000);
                    });

                var barChartGrp = chartUtils.selectOrNew(chartGrp, 'g', 'bar-chart-grp')
                // Bar Grps - attach data
                var barGrps = barChartGrp.selectAll('g.bar-grp')
                    .data(data || []);

                // New Cycle -----------------------
                var newBarGrps = barGrps.enter().append('g')
                    .attr('class', 'bar-grp');
                newBarGrps.append('rect')
                    .attr('class', barRectCls)
                    .call(tip);


                // Remove cycle ------------------------
                barGrps.exit().remove();

                // Update cycle -------------------
                barGrps.attr('transform', function (d, i) {
                    return 'translate(' + (xScale(d[props.xAxisValueField])) + ',' + 0 + ')'
                });

                // Updating each bar
                var rectBar = barGrps.select('rect')
                    .classed(barRectCls, true)
                    .attr('width', barWidth);

                rectBar.attr('y', function(d) {
                    return yScale(d[props.barSeriesValueField]);
                })
                .attr('height', function(d) { return Math.max(1, yScale(0) - yScale(d[props.barSeriesValueField])); });
            }

            exports.width = function (w) {
                if (!arguments.length) {
                    return props.width;
                }
                props.width = w;
                return this;
            };
            exports.height = function(h) {
                if (!arguments.length) {
                    return props.height;
                }
                props.height = h;
                return this;
            };
            exports.barSeriesValueField = function(valueField) {
                if (!arguments.length) {
                    return props.barSeriesValueField;
                }
                props.barSeriesValueField = valueField;
                return this;
            };
            exports.lineSeriesValueField = function(valueField) {
                if (!arguments.length) {
                    return props.lineSeriesValueField;
                }
                props.lineSeriesValueField = valueField;
                return this;
            };
            exports.xAxisValueField = function(valueField) {
                if (!arguments.length) {
                    return props.xAxisValueField;
                }
                props.xAxisValueField = valueField;
                return this;
            };
            return exports;
        }
        return chartFactory;
    }
})();