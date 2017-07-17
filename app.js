var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.name = 'World';

  $scope.sampleObject = [{
    name: "Graph1",
    key: "Graph1"
  }, ];
});

app.directive('myGraph', function($window) {
  return {
    restrict: 'EA',
    scope: {
      'graphName': '='
    },
    template: '<div class="lineChart">{{graphName}}</div>',
    link: function(scope, elem, attrs) {
      var d3 = $window.d3;

      var data = [];
      
      // Parse the date / time
      var parseDate = d3.time.format("%S s").parse;

      function randomPoints() {
        var count;
        var dataset = [];
        var rand = Math.random;
        
        for(count = 0; count < 10; count++){
          dataset.push({x:(new Date(2017,0,count)), y: rand() * 10});
        }
        
        return dataset;

        //return {x: rand() * 10, y: rand() * 10};
      }

      data = randomPoints();

      // Set the dimensions of the canvas / graph
      scope.margin = {
          top: 30,
          right: 20,
          bottom: 30,
          left: 50
        },
        scope.width = 600 - scope.margin.left - scope.margin.right,
        scope.height = 270 - scope.margin.top - scope.margin.bottom;

      var svg = d3.select(".lineChart")
        .append("svg").attr("width", scope.width + scope.margin.left + scope.margin.right)
        .attr("height", scope.height + scope.margin.top + scope.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + scope.margin.left + "," + scope.margin.top + ")");

      // Set the ranges
      scope.xScale = d3.time.scale().range([0, scope.width]);
      scope.yScale = d3.scale.linear().range([scope.height, 0]);

      // Define the axes
      scope.xAxis = d3.svg.axis().scale(scope.xScale)
        .orient("bottom").ticks(5);

      scope.yAxis = d3.svg.axis().scale(scope.yScale)
        .orient("left").ticks(5);

      // Define the line
      scope.valueline = d3.svg.line()
        .x(function(d) {
          return scope.xScale(d.x);
        })
        .y(function(d) {
          return scope.yScale(d.y);
        });

      // Scale the range of the data
      scope.xScale.domain(d3.extent(data, function(d) {
        return d.x;
      }));
      scope.yScale.domain([0, d3.max(data, function(d) {
        return d.y;
      })]);

      // Add the valueline path.
      svg.append("path") // Add the valueline path.
        .attr("class", "line")
        .attr("d", scope.valueline(data));

      // Add the X Axis
      svg.append("g") // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + scope.height + ")")
        .call(scope.xAxis);

      // Add the Y Axis
      svg.append("g") // Add the Y Axis
        .attr("class", "y axis")
        .call(scope.yAxis);

      // svg.selectAll('dot').data(data).enter().append('circle').attr('r', 2).attr('cx', function(d) {
      //   return scope.xScale(d.x);
      // }).attr('cy', function(d) {
      //   return scope.yScale(d.y);
      // }).attr('stroke', 'blue');

      setInterval(function() {
        data = [];
        var dataSet = randomPoints();
        updateData(dataSet);
      }, 3000);

      function updateData(dataSet) {
        
        d3.selectAll(".dot").remove();

        data = dataSet;

        // Scale the range of the data again
        scope.xScale.domain(d3.extent(data, function(d) {
          return d.x;
        }));
        scope.yScale.domain([0, d3.max(data, function(d) {
          return d.y;
        })]);

        // Select the section we want to apply our changes to
        var svg = d3.selectAll(".lineChart").transition();
        
        // Make the changes
        svg.select(".line") // change the line
          .duration(750)
          .attr("d", scope.valueline(data));
        svg.select(".x.axis") // change the x axis
          .duration(750)
          .call(scope.xAxis);
        svg.select(".y.axis") // change the y axis
          .duration(750)
          .call(scope.yAxis);
      }
    }
  }

});