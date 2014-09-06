document.createElement("not-an-svg");
angular.module("svgApp", []).
    directive("notAnSvg", function() {
        return {
            templateNamespace: "svg",
            template: "<svg></svg>",
            replace: true,
            transclude: true,
            link: function(scope, element, attrs, _, transclude) {
                transclude(scope, function(clone) {
                    element.append(clone);
                });
            }
        };
    }).
    directive("swiggle", function() {
        var kTypes = {
            'Move-To': 'm',
            'Line-To': 'l',
            'Curve-To': 'q',
            'Arc-To': 'a',
            'Close-Path': 'z'
        }
        return {
            restrict: "E",
            templateNamespace: 'svg',
            template: '<path></path>',
            replace: true,
            link: function(scope, element, attrs) {
                scope.$watchCollection(attrs.nPath, function(value) {
                    // Watch for changes to path values, and re-generate path
                    switch (typeof value) {
                    case 'string':
                        element.attr('d', value);
                        break;
                        /* fall through */
                    case 'object':
                        if (Object.prototype.toString.call(value) !== '[object Array]') value = [];
                        element.attr('d', value.map(function(point) {
                            if (typeof point === 'object') {
                                var value = [];
                                if ('type' in point) value.push(kTypes[point.type]);
                                if ('x' in point) value.push(point.x);
                                if ('y' in point) value.push(point.y);
                                return value.join(' ');
                            } else if (typeof point === 'string') {
                                return point;
                            } else {
                                return '';
                            }
                        }).join(' '));
                        break;
                    }
                });
            }
        };
    }).
    run(function($rootScope) {
        $rootScope.swiggle = {};
        $rootScope.addPoint = function() {
            $rootScope.swiggle = $rootScope.swiggle || {};
            $rootScope.swiggle.path = $rootScope.swiggle.path || [];
            $rootScope.swiggle.path.push(angular.copy($rootScope.swiggle.newPoint));
        }
        $rootScope.clear = function() {
            $rootScope.swiggle = $rootScope.swiggle || {};
            $rootScope.swiggle.path = [];
        }
        $rootScope.removePoint = function() {
            $rootScope.swiggle = $rootScope.swiggle || {};
            $rootScope.swiggle.path = $rootScope.swiggle.path || [];
            $rootScope.swiggle.path.shift();
        }
        $rootScope.types = [
            'Move-To',
            'Line-To',
            'Curve-To',
            'Arc-To',
            'Close-Path'
        ];
    });
