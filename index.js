var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Hapi = require('hapi');

/** Initially, the data/sample.json must be imported running
 * the following cmd: 
 * mongoimport --db restronaut-db restronaut --collection venues --jsonArray data/sample.json
  */
var url = 'mongodb://localhost:27017/restronaut-db'

var server = new Hapi.Server();
server.connection({
    port: 8080
});

server.route([
    // Get venue list
    {
        method: 'GET',
        path: '/api/venues',
        config: { json: { space: 2 } }, // To format the json returned by the server
        handler: function (request, reply) {
            var findObject = {};
            for (var key in request.query) {
                findObject[key] = request.query[key]
            }
            collection.find(findObject).toArray(function (error, venues) {
                assert.equal(null, error);
                reply(venues);
            })
        }
    },
    // Add new venue
    {
        method: 'POST',
        path: '/api/venues',
        handler: function (request, reply) {
            collection.insertOne(request.payload, function (error, result) {
                assert.equal(null, error);
                reply(request.payload);
            })
        }
    },
    // Get a single venue
    {
        method: 'GET',
        path: '/api/venues/{name}',
        config: { json: { space: 2 } },
        handler: function (request, reply) {
            collection.findOne({ "name": request.params.name }, function (error, venue) {
                assert.equal(null, error);
                reply(venue);
            })
        }
    },
    // Update a single venue
    {
        method: 'PUT',
        path: '/api/venues/{venueId}', // Follow the instructions on README.md
        handler: function (request, reply) {
            /** With replace option, the unique index (venueId) and updated
             * fields will remain, rest will be erased.
             * http://localhost:8080/api/venues/Mezzalians?replace=true */
            if (request.query.replace == "true") {
                request.payload.venueId = request.params.venueId;
                console.log(request.payload);
                collection.replaceOne({ "venueId": request.params.venueId },
                    request.payload,
                    function (error, results) {
                        collection.findOne({ "venueId": request.params.venueId },
                            function (error, results) {
                                reply(results);
                            })
                    })
            /** Without replace option, only the defined field will be updated.
             * http://localhost:8080/api/venues/Mezzalians */
            } else {
                collection.updateOne({ venueId: request.params.venueId },
                    { $set: request.payload },
                    function (error, results) {
                        collection.findOne({ "venueId": request.params.venueId }, function (error, results) {
                            reply(results);
                        })
                    })
            }
        }
    },
    // Delete a single venue
    {
        method: 'DELETE',
        path: '/api/venues/{name}',
        handler: function (request, reply) {
            collection.deleteOne({ name: request.params.name },
                function (error, results) {
                    reply().code(204);
                })
        }
    },
    // Home page
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply("Hello world from Hapi/Mongo example.")
        }
    }
]);

/** Hapi server starts here */
MongoClient.connect(url, function (err, dbParent) {
    assert.equal(null, err);
    console.log("connected correctly to server");
    const db = dbParent.db('restronaut-db')
    collection = db.collection('venues');
    server.start(function (err) {
        console.log('Hapi is listening to http://localhost:8080')
    });
});