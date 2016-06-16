/* D3 Charts 
   API ref: https://github.com/mbostock/d3/wiki/API-Reference
*/ 

function ViivaD3Chart(options, data){

    var formatYAxis = d3.format('.0f');

    /* adapt size to container */
    var margin = {top: 35, right: 35, bottom: 70, left: 55},
        width = parseInt(d3.select(options.container).style('width')) * 0.96,
        width = width - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(momentFormat);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatYAxis);
        
    var line = d3.svg.line()
       // .interpolate("basis")
        .x(function (d) {
        return x(d.Date);
    })
        .y(function (d) {
        return y(d.Value);
    });

    var svg = d3.select(options.container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(data.map(function (d) { return d.Package; }));

    data.forEach(function (kv) {
        kv.Data.forEach(function (d) {
            d.Date = parseDate(d.Date);
        });
    });

    var packages = data;

    var minX = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Date; }) });
    var maxX = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Date; }) });
    var minY = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return parseInt(d.Value); }) });
    var maxY = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return parseInt(d.Value); }) });

    x.domain([minX, maxX]);
    y.domain([0, maxY]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
      //      .style("text-anchor", "end")
            .attr("dy", "10px")
            .attr("dx", "40px")
            .attr("transform", function(d){

                return "rotate(45)";
            });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

        var yAxisGrid = yAxis.ticks(options.ticks)
        .tickSize(width, 0)
        .tickFormat("")
        .orient("right");

    var xAxisGrid = xAxis.ticks(options.ticks)
        .tickSize(-height, 0)
        .tickFormat("")
        .orient("top");

    svg.append("g")
        .classed('y', true)
        .classed('grid', true)
        .call(yAxisGrid);

    svg.append("g")
        .classed('x', true)
        .classed('grid', true)
        .call(xAxisGrid);

    var Package = svg.selectAll(".Package")
        .data(packages)
        .enter().append("g")
        .attr("class", "Package");


    Package.append("path")
        .attr("class", "line")
        .attr("data-legend",function(d) { return d.Package})
        .attr("d", function (d) {
        return line(d.Data);
    })
        .style("stroke", function (d) {
        return color(d.Package);
    });

     // data points 

     var lines = svg.selectAll('.Package');
     lines.selectAll('circle')
    .data(function(d){ return d.Data; })
    .enter().append('circle')
    .attr('cx', function (d) { return x(d.Date); })
    .attr('cy', function (d) { return y(d.Value); })
    .attr('r', 3)
    .on('mouseover', showToolTip);

    legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate("+(width-100)+",30)")
    .style("font-size","12px")
    .call(d3.legend);

    }

    var momentFormat = function(date) {
    return moment(date).format("YYYY.MM.DD");   
    };

    var showToolTip = function(d){

        console.log(d);
    }