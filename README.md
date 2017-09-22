#*Oilfield data analytics with Nodejs*

##Setup

Run `npm install` to install all the required packages.

##Dependencies

* Express
* Express body parser
* Cassandra-driver
* kafka-node
* socket.io

##Running

1. Run the server using `node index.js`
2. In any web browser (preferrably a modern browser), navigate to `http://129.207.46.225:8004` and you should see the landing admin page.

##Troubleshooting

1. If chart loads endlessly, it is either a server error or there is too much data to render.
2. Sometimes graph features (such as the mini series on the bottom) doesn't load. Usually refreshing the graph or using the button navigators will fix this. 
3. If there is only clean data is present in the real-time updated graph then there is either no raw data or the graph was refreshed after raw data was already graphed and before the preprocessed data came in.

(The Python code was not used)
