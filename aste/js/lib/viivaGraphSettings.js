/* Default settings for different (Flot) graph types for MyDigi Analytics
**/

/* Chart colors default */
var $chart_border_color = "#efefef";
var $chart_grid_color = "#DDD";
var $chart_main = "#E24913"; /* red */
var $chart_second = "#6595b4";
var $chart_third = "#FF9F01"; /* blue */
var $chart_fourth = "#7e9d3a"; /* orange */
var $chart_fifth = "#BD362F"; /* green */
var $chart_mono = "#000"; /* dark red  */

/* Linechart defaults */
var linechart_options = {
    series : {
	    lines : {
		    show : true,
		    lineWidth : 1,
		    fill : true,
		    fillColor : {
			    colors : [{
				    opacity : 0.1
			    }, {
				    opacity : 0.15
			    }]
		    }
	    },
	    points: { show: true },
	    shadowSize : 0
    },
    selection : {
	    mode : "x"
    },
    grid : {
	    hoverable : true,
	    clickable : true,
	    tickColor : $chart_border_color,
	    borderWidth : 0,
	    borderColor : $chart_border_color,
    },
    tooltip : true,
    tooltipOpts : {
	    content : "(<b>%x</b>) <span>$%y</span>",
	    dateFormat : "%0d.%0m.%y",
	    defaultTheme : false
    },
    colors : [$chart_second],

};

/* Barchart defaults */
var barchart_options = {
    /*
	bars : {
		show : true,
		barWidth : 0.5,
		order : 1,
		align: "center"
	},*/
	colors : [$chart_second, $chart_fourth, "#666", "#BBB"],
	grid : {
		show : true,
		hoverable : true,
		clickable : true,
		tickColor : $chart_border_color,
		borderWidth : 0,
		borderColor : $chart_border_color,
	},
	legend : true,
	tooltip : true,
	tooltipOpts : {
		content : "<b>%x</b> = <span>%y</span>",
		defaultTheme : false
	}
};

/* Piechart defaults */
var piechart_options = {
    series : {
	    pie : {
		    show : true,
		    innerRadius : 0.5,
		    radius : 1,
		    label : {
			    show : false,
			    radius : 2 / 3,
			    formatter : function(label, series) {
				    return '<div style="font-size:11px;text-align:center;padding:4px;color:white;">' + label + '<br>' + Math.round(series.percent) + '%</div>';
			    },
			    threshold : 0.1
		    }
	    }
    },
    legend : {
	    show : true,
	    noColumns : 1, // number of colums in legend table
	    labelFormatter : null, // fn: string -> string
	    labelBoxBorderColor : "#000", // border color for the little label boxes
	    container : null, // container (as jQuery object) to put legend in, null means default on top of graph
	    position : "ne", // position of default legend container within plot
	    margin : [5, 10], // distance from grid edge to default legend container within plot
	    backgroundColor : "#efefef", // null means auto-detect
	    backgroundOpacity : 1 // set to 0 to avoid background
    },
    grid : {
	    hoverable : true,
	    clickable : true
    },

};

