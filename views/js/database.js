var chart;
var well_id;

/**
 * Request data from the server, add it to the graph
 */
var redraw = false;

//sets the title
$.ajax({ 
	url: 'http://129.207.46.225:8004/well',
	success: function(data) {  console.log(data); well_id = data.toString(); },
	cache: false });

function requestData1() {
    //raw data retrieved
    $.ajax({
        url: 'http://129.207.46.225:8004/raw',
        success: function(points) {

	//sets title when the chart is loaded

	console.log(points);

	for (i = 0; i < points.length; ++i)
	{

			var datetime_str = points[i][0]
			dhpt1 = parseInt(points[i][1])
			oil = parseInt(points[i][2])
			choke = parseInt(points[i][3])
			water = parseInt(points[i][4])
			gas = parseInt(points[i][5])

			var datetime = Date.UTC(parseInt(datetime_str.substring(0,4)), //year
					parseInt(datetime_str.substring(5,7)) - 1, //month
					parseInt(datetime_str.substring(8, 10)), //day
					parseInt(datetime_str.substring(11, 13)), //hour
					parseInt(datetime_str.substring(14, 16))); //minute

			chart.series[0].addPoint([datetime, dhpt1], redraw, false);
			chart.series[2].addPoint([datetime, choke], redraw, false);
			chart.series[4].addPoint([datetime, oil], redraw, false);
			chart.series[6].addPoint([datetime, water], redraw, false);
			chart.series[8].addPoint([datetime, gas], redraw, false);
	}
	},
        cache: false
    });
}

function requestData() {
    //get and graph data
    requestData1();
    $.ajax({
        url: 'http://129.207.46.225:8004/clean',
        success: function(points) {

	for (i = 0; i < points.length; ++i)
	{
		var datetime_str = points[i][0]
		dhpt1 = parseInt(points[i][1])
		oil = parseInt(points[i][2])
		choke = parseInt(points[i][3])
		water = parseInt(points[i][4])
		gas = parseInt(points[i][5])

		var datetime = Date.UTC(parseInt(datetime_str.substring(0,4)), //year
				parseInt(datetime_str.substring(5,7)) - 1, //month
				parseInt(datetime_str.substring(8, 10)), //day
				parseInt(datetime_str.substring(11, 13)), //hour
				parseInt(datetime_str.substring(14, 16))); //minute

		chart.series[1].addPoint([datetime, dhpt1], redraw, false);
		chart.series[3].addPoint([datetime, choke], redraw, false);
		chart.series[5].addPoint([datetime, oil], redraw, false);
		chart.series[7].addPoint([datetime, water], redraw, false);
		chart.series[9].addPoint([datetime, gas], redraw, false);
	}

	chart.redraw();
        chart.setTitle({ text: "Well: " + well_id });

	},
        cache: false
    });
}

$(document).ready(function() {

	//defines chart
	chart = Highcharts.stockChart('container', {
	rangeSelector: {
		selected: 0,
		buttons: [ {

			type: 'hour',
			count: '1',
			text: '1hr',

			}, {

			type: 'hour',
			count: '6',
			text: '6hr',

			}, {

			type: 'day',
			count: '1',
			text: '1d',

			}, {

			type: 'day',
			count: '7',
			text: '1wk',

			},
			{

			type: 'month',
			count: '1',
			text: '1m',

			},
			{

			type: 'all',
			text: 'All'

			}



		],
		inputEnabled: false
	},

	chart: {
	    events: {
		load: requestData
	    },
	    height: "50%" 
	},
	title: {
	    text: 'Loading data from the database...'

	},

	xAxis: {
	    type: 'datetime',
	    tickPixelInterval: 50,
	    minRange: 10,
	    allowDecimals: false
	},

	yAxis: [{
	    labels: {
		align: 'left',
		x: -3
	    },
	    title: {
		text: 'dhpt1'
	    },
	    height: '18%',
	    lineWidth: 2
	}, {
	    labels: {
		align: 'left',
		x: -3
	    },
	    title: {
		text: 'Choke'
	    },
	    top: '20%',
	    height: '18%',
	    offset: 0,
	    lineWidth: 2
	}, {
	    labels: {
		align: 'left',
		x: -3
	    },
	    title: {
		text: 'Oil Production'
	    },
	    top: '40%',
	    height: '18%',
	    offset: 0,
	    lineWidth: 2
	}, {
	    labels: {
		align: 'left',
		x: -3
	    },
	    title: {
		text: 'Water Production'
	    },
	    top: '60%',
	    height: '18%',
	    offset: 0,
	    lineWidth: 2
	}, {
	    labels: {
		align: 'left',
		x: -3
	    },
	    title: {
		text: 'Gas Production'
	    },
	    top: '80%',
	    height: '18%',
	    offset: 0,
	    lineWidth: 2
	}],

	series: [{
	    type: 'line',
	    name: 'Raw dhpt1',
	    data: []
		}, 
		{
		type: 'line',
		name: 'Clean dhpt1',
		data: [],
		},
		{
		type: 'line',
		name: 'Raw Choke',
		data: [],
		yAxis: 1
		},
		{
		type: 'line',
		name: 'Clean Choke',
		data: [],
		yAxis: 1
		},
		{
		type: 'line',
		name: 'Raw Oil Production',
		data: [],
		yAxis: 2
		},
		{
		type: 'line',
		name: 'Clean Oil Production',
		data: [],
		yAxis: 2
		},
		{
		type: 'line',
		name: 'Raw Water Production',
		data: [],
		yAxis: 3
		},
		{
		type: 'line',
		name: 'Clean Water Production',
		data: [],
		yAxis: 3
		},
		{
		type: 'line',
		name: 'Raw Gas Production',
		data: [],
		yAxis: 4
		},
		{
		type: 'line',
		name: 'Clean Gas Production',
		data: [],
		yAxis: 4
		}
		]
	});
});
