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
        $rootScope.swiggle = {
            stroke: '#fff',
            fill: '#fff',
            strokeWidth: '1'
        };
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
    }).controller("artCtrl", function($scope, $element, $interval) {
      var self = this;
      this.strokeWidth = 1;
      this.fillColour = "#000";
      this.strokeColour = "#888";
      this.nodes = 1;
      this.points = 2;
      var cachedNodes = [];

      function getSvgRoot() {
        return $element[0].querySelector('svg');
      }

      this.makeNodes = function(nodes) {
        cachedNodes.length = nodes;
        return cachedNodes;
      }

      this.radius = 100;

      function moveTo(x, y) {
        if (x !== x || y !== y) return '';
        return 'M ' + x + ',' + y;
      }

      function lineTo(x, y) {
        if (x !== x || y !== y) return '';
        return 'L ' + x + ',' + y;
      }

      var DEGREES_TO_RADIANS = Math.PI / 180;
      var TO_RADIANS = function(degrees) { return degrees * DEGREES_TO_RADIANS; }
      var counter = 0;

      $interval(function() {
        counter += .25;
      }, 1000 / 60);

      this.makePath = function(index, count) {
        var svg = getSvgRoot();
        var rect = svg.getBoundingClientRect && svg.getBoundingClientRect();
        var w = svg.offsetWidth || rect.width;
        var h = svg.offsetHeight || rect.height;
        var mx = w / 2;
        var my = h / 2;
        var deg = TO_RADIANS((360 / count) * (index+1) + counter);
        var rx = mx + (self.radius * Math.sin(deg));
        var ry = my + (self.radius * Math.cos(deg));
        deg += TO_RADIANS(60);
        var rx2 = rx + (25 * Math.sin(deg));
        var ry2 = ry + (25 * Math.cos(deg));
        deg -= TO_RADIANS(120);
        var rx3 = rx + (25 * Math.sin(deg));
        var ry3 = ry + (25 * Math.cos(deg));
        return [moveTo(mx, my), lineTo(rx, ry),
                moveTo(rx2, ry2), lineTo(rx, ry),
                moveTo(rx3, ry3), lineTo(rx, ry)].join(' ');
      }

      function mixColour(colour, index) {
        return colour;
      }

      this.mixFill = function(index) {
        return mixColour(self.fillColour, index);        
      }

      this.mixStroke = function(index) {
        return mixColour(self.strokeColour, index);
      }
    });
