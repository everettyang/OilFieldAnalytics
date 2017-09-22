//construct chart

var chart = Highcharts.stockChart('streamChart', {

	rangeSelector: {
		buttons:[{
			count: 1,
			type: 'hour',
			text: '1h'},

			{
			count: 6,
			type: 'hour',
			text: '6h'
			},

			{
			count: 12,
			type: 'hour',
			text: '12h'
			},

			{
			count: 1,
			type: 'day',
			text: '1d'
			},

			{
			count: 3,
			type: 'day',
			text: '3d'
			},

			{
			type: 'all',
			text: 'All'
			}],
		selected: 6
	},

	chart: {
	    height: "50%"
	},
	title: {
	    text: 'Live data from Well: SA002'
	},

	xAxis: {
	    type: 'datetime',
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
	    top: '0%',
	    height: '18%',
	    offset: 0,
	    lineWidth: 2
	}, {
	    labels: {
		align: 'left',
		x: -3
	    },
	    title: {
		text: 'Choke Size'
	    },
	    top: '20%',
	    offset: 0,
	    height: '18%',
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
	    data: [],
		yAxis: 0
		}, 
		{
		type: 'line',
		name: 'Clean dhpt1',
		data: [],
		yAxis: 0
		},
		{
		type: 'line',
		name: 'Raw Choke Size',
		data: [],
		yAxis: 1
		},
		{
		type: 'line',
		name: 'Clean Choke Size',
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

/** Connects to socketio server located in index.js and plots raw and preprocessed kafka data as it comes in **/

var socket = io();
var chart_size = 2000
var redraw = false;

socket.on('raw_data', function(msg){

	//takes json msg and converts to javascript object
	var value = JSON.parse(JSON.parse(msg).value)

	var time = value.time
	var dhpt1 = value.dhpt1
	var choke = value.choke_size
	var oil = value.oil_production
	var water = value.water_production
	var gas = value.gas_production

	//takes time string, cuts and stitches together pieces of it to form datetime type
	var datetime = Date.UTC(parseInt(time.substring(0,4)), 
				parseInt(time.substring(5,7)) - 1,
				parseInt(time.substring(8, 10)),
				parseInt(time.substring(11, 13)),
				parseInt(time.substring(14, 16)));

	console.log("raw x value: " + datetime)

	//the chart only holds chart_size amount of points 
	var shift = chart.series[0].data.length > chart_size;

	chart.series[0].addPoint([datetime, dhpt1], redraw, shift);
	chart.series[2].addPoint([datetime, choke], redraw, shift);
	chart.series[4].addPoint([datetime, oil], redraw, shift);
	chart.series[6].addPoint([datetime, water], redraw, shift);
	chart.series[8].addPoint([datetime, gas], redraw, shift);

});

socket.on('proc_data', function(msg){

       var value = JSON.parse(JSON.parse(msg).value)
       var time = value.time
       var dhpt1 = value.dhpt1
       var choke = value.choke_size
       var oil = value.oil_production
       var water = value.water_production
       var gas = value.gas_production

       var datetime = Date.UTC(parseInt(time.substring(0,4)), 
       			parseInt(time.substring(5,7)) - 1,
       			parseInt(time.substring(8, 10)),
       			parseInt(time.substring(11, 13)),
       			parseInt(time.substring(14, 16)));

       console.log("processed x value: " + datetime)

       var shift = chart.series[1].data.length > chart_size;

       chart.series[1].addPoint([datetime, dhpt1], redraw, shift);
       chart.series[3].addPoint([datetime, choke], redraw, shift);
       chart.series[5].addPoint([datetime, oil], redraw, shift);
       chart.series[7].addPoint([datetime, water], redraw, shift);
       chart.series[9].addPoint([datetime, gas], redraw, shift);

});

socket.on('redraw', function(msg) { chart.redraw(); });
