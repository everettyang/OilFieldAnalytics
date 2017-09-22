var chart1 = Highcharts.stockChart('streamChart1', {

	rangeSelector: {
		enabled: false
	},

	scrollbar : { enabled: false },

	navigator: { enabled: false },

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
		text: 'Choke'
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
		text: 'Oil'
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
		text: 'Water'
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
		text: 'Gas'
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


var socket = io();
var chart_size = 100
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
	var shift = chart1.series[0].data.length > chart_size;
	if (shift)
		console.log(shift);

	chart1.series[0].addPoint([datetime, dhpt1], redraw, shift);
	chart1.series[2].addPoint([datetime, choke], redraw, shift);
	chart1.series[4].addPoint([datetime, oil], redraw, shift);
	chart1.series[6].addPoint([datetime, water], redraw, shift);
	chart1.series[8].addPoint([datetime, gas], redraw, shift);
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
       var shift = chart1.series[1].data.length > chart_size;

       chart1.series[1].addPoint([datetime, dhpt1], redraw, shift);
       chart1.series[3].addPoint([datetime, choke], redraw, shift);
       chart1.series[5].addPoint([datetime, oil], redraw, shift);
       chart1.series[7].addPoint([datetime, water], redraw, shift);
       chart1.series[9].addPoint([datetime, gas], redraw, shift);

});

socket.on('redraw', function(msg) {  chart1.redraw(); });
