(function () {
    'use strict';

    angular
        .module('ngD3Example.widgets')
        .factory('chartUtils', chartUtils);

    /* @ngInject */
    function chartUtils() {

        var chartUtilsFactory = {
            selectOrNew : selectOrNew,
            calculateMaxValue: calculateMaxValue,
            calculateMinValue: calculateMinValue
        };


        function mergeClassNames(origClassString, newClassString) {
            if (!newClassString) {
                return origClassString;
            } else if (!origClassString) {
                return newClassString;
            }

            var origClasses = origClassString.split(' '),
                newClasses = newClassString.split(' ');

            var allClasses = _.union(origClasses, newClasses);
            return allClasses.join(' ');
        }

        function convertClassNameToClassSelector(className) {
            var classSelector = null;

            if (className) {
                classSelector = _.startsWith(className, '.')? className : '.' + className;
                classSelector = classSelector.replace(/\s+/, '.');
            }

            return classSelector;
        }
        /**
         * Perform D3 select operation and return the child element.  Append a new element if it does not already exist
         * @param {Object} parentEl Parent D3 element
         * @param {String} type E.g. g, rect
         * @param {String} [className] Optional css class name used to search for the element
         * @param {Object} [attrConfig] Optional attribute config object to be set to the newly created element
         * @returns {Object} child element
         */
        function selectOrNew(parentEl, type, className, attrConfig) {
            var classSelector = convertClassNameToClassSelector(className);

            var el = parentEl.select(classSelector ? type + classSelector : type);
            if (el.empty()) {
                el = parentEl.append(type);
                if (className) {
                    attrConfig = attrConfig || {};
                    attrConfig.class = attrConfig.class?
                        mergeClassNames(attrConfig.class, className) : className;
                }

                if (attrConfig) {
                    el.attr(attrConfig);
                }
            }

            return el;
        }

        function calculateMaxValue(data, fieldName) {
            var defaultMaxVal = 1;

            var calculatedMaxValue = _.isEmpty(data) ? defaultMaxVal : d3.max(data, function (d) {
                return Number(d[fieldName]);
            });
            calculatedMaxValue = (_.isNull(calculatedMaxValue) || _.isUndefined(calculatedMaxValue)) ? defaultMaxVal : calculatedMaxValue;

            return calculatedMaxValue;
        }

        function calculateMinValue(data, fieldName) {
            var defaultMinValue = 0;
            var calculatedMinValue = _.isEmpty(data) ? defaultMinValue : d3.min(data, function (d) {
                return Number(d[fieldName]);
            });
            calculatedMinValue = (_.isNull(calculatedMinValue) || _.isUndefined(calculatedMinValue) || calculatedMinValue > 0) ? defaultMinValue : calculatedMinValue;
            return calculatedMinValue;
        }

        return chartUtilsFactory
    }
})();
