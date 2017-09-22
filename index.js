//import all the required modules
var express = require('express')
var cassandra = require('cassandra-driver');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kafka = require('kafka-node');

const client = new cassandra.Client({ contactPoints: ['129.207.46.225'], keyspace: 'oilfieldanalytics' });

//sets the views directory as the root for static files to be served from. 
app.use(express.static(__dirname + "/views", {
	extensions: ['html']
}));

//body parser used to parse form data into the body of request objects used in middleware functions
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Zookeeper address for each broker
var ZOOKEEPER_SERVERS = `129.207.46.82:2181,
			 129.207.46.83:2181,
			 129.207.46.84:2181,
			 129.207.46.85:2181,
			 129.207.46.86:2181,
			 129.207.46.87:2181,
			 129.207.46.225:2181`;

var kafkaClient = new kafka.Client(ZOOKEEPER_SERVERS);

var offset = new kafka.Offset(kafkaClient);

var redraw_timer;

var topics = ['spark_raw_pdgdata', 'spark_proc_pdgdata'];

var start_time;
var end_time;
var well_id;

offset.fetchLatestOffsets(topics, function (error, offsets) {

	var consumer = new kafka.Consumer(kafkaClient, 
					//sets offset to start from
					[{topic: topics[0], offset: offsets[topics[0]][0] - 1}, 
					{topic: topics[1], offset: offsets[topics[1]][0] - 1}], 
					{autoCommit: true, fromOffset: true});


	//listens for kafka messages
	consumer.on('message', function(message){

		clearTimeout(redraw_timer);

		if (message.topic === topics[0])
		{
			io.emit('raw_data', JSON.stringify(message));
		}
		else
		{
			io.emit('proc_data', JSON.stringify(message));
		}

		//if there is one millisecond without data, Redraw
		redraw_timer = setTimeout(function () { io.emit("redraw", 
							{ message: "redraw chart" }), 
								1 });

		});

});

var port = 8004;
var ip = "129.207.46.225";

http.listen(port, ip, function () {
  console.log('Listening on port ' + ip + ':' + port + '...');
});

/*------------------------------------------- Routes are defined below. Middleware functions are used to handle requests. ----------------------------------------------------*/

app.post('/process', function(req, res) {

	//assigns form data to variables to be used by later middleware functions

	start_time = new Date( req.body.startdate );
	end_time = new Date( req.body.enddate );
	well_id = req.body.wellid;

	res.sendFile(__dirname + "/views/databaseGraph.html");
});

app.get('/raw', function(req, res) {

	//queries and sends raw data as response
	var data = []
	const query = `SELECT * FROM raw_measurements_by_well WHERE well_id= ?
			and time >= ?
			and time <= ? ALLOW FILTERING;`

	client.execute(query, [well_id, start_time, end_time], function ( err, result ) {

		for (i in result.rows) {
			var time = result.rows[i].time;

			//console.log(time.toDateString());

			data.push( [ time,
				result.rows[i].dhpt1,
				result.rows[i].choke_size,
				result.rows[i].oil_production,
				result.rows[i].water_production,
				result.rows[i].gas_production ] );
		}

	res.send(data);

	});


});

app.get('/clean', function(req, res) {

	//queries and sends clean data
	var data = []
	const query = `SELECT * FROM preprocessed_measurements_by_well WHERE well_id= ?
			and time >= ?
			and time <= ? ALLOW FILTERING;`
	client.execute(query, [well_id, start_time, end_time], function ( err, result ) {

		for (i in result.rows) {
			var time = result.rows[i].time;

			data.push( [ result.rows[i].time,
				result.rows[i].dhpt1,
				result.rows[i].choke_size,
				result.rows[i].oil_production,
				result.rows[i].water_production,
				result.rows[i].gas_production ] );
		}

	res.send(data);

	});

});

app.get('/well', function (req, res) { res.send(well_id); });
