/* Render Flot chart from dataset */
function viivaRenderChart(widget, chart){
    
    var chart_options;
    var colors = ["#6595b4", "#BD362F", "#FF9F01", "#7e9d3a","#E24913"];

    switch (chart.type){
        case "line":
            chart_options = linechart_options;
            chart_options.xaxis = { mode : chart["data-type"], tickLength : 5 };
            chart_options.series.points.show = chart["chart-options"]["data-points"];
            chart_options.series.lines.fill = chart["chart-options"]["shadows"];
	    
            break;
        case "bar":
            chart_options = barchart_options;
            chart_options.xaxis = {};
            // Set ticks
	    ticks = Array();
    
            if (chart["data-type"] == "categories"){
                ticks = Array();
                for (var i=0; i<chart.dataset[0].data.length; i++){
                    ticks.push([i, chart.dataset[0].data[i][0]]);
                }
                chart_options.xaxis.ticks = ticks;
		
	    }
	    
	    dataset = Array();
	    // Reconstruct data format
	    for (var j=0; j<chart.dataset.length; j++){
		var data_temp = Array();
		for (var k=0; k<chart.dataset[j].data.length; k++){
		    //var t = chart.dataset[j].data[k][0] / 1000;
		    //t = moment(t, "X").format("DD.MM");
		    //console.log(t);
		    //data_temp.push([t, chart.dataset[j].data[k][1]]);
		    data_temp.push([k, chart.dataset[j].data[k][1]]);
		}
		dataset.push({ data : data_temp,
			       label : chart.dataset[j].label,
			       bars: { show : true,
					   barWidth : 0.2,
					   order : j+1,
					   align: "center"
				      }
			     });
	    }
	    chart.dataset = dataset;
	    
	    

            
            break;
        case "pie":
            chart_options = piechart_options;
            var dataset = chart.dataset[0].data;
            for (var i=0; i<dataset.length; i++){
                dataset[i] = { label : chart.dataset[0].data[i][0],
                               data : chart.dataset[0].data[i][1]
                };
            }
            chart.dataset = dataset;
            break;
    }

    if (chart.dataset.length < 5){
        chart_options.colors = colors.slice(0, chart.dataset.length);
    } else {
        chart_options.colors = colors;
    }

    // Set tooltip format
    if (chart.type == "line")
        chart_options.tooltipOpts.content = "<b>%x</b> %s <span>%y</span>";
    else if (chart.type == "bar")
	chart_options.tooltipOpts.content = "%s <span>%y</span>";
	
    // Enable or disable tooltips
    chart_options.grid.hoverable = chart["chart-options"]["tooltips-enabled"];

    // Plot the data on the chart
    $.plot(widget.graphChart, chart.dataset, chart_options);  
}
