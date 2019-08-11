# restronaut-db
An app to display best cullinary deals in the city and special booking occasions

## 1. MongoDB Environment
Some scripts are needed to be run to setup the MongoDB database. And some more to test mongo features.

### 1.1 Starting Mongo env
Start mongo daemon on localhost
```
mongod
```

Open another terminal and start mongo command screen
```
mongo
```

### 1.2 Setup server
To import the json collections, run this in a new terminal tab:
```
mongoimport --db restronaut-db --collection venues --jsonArray data/venues.json && mongoimport --db restronaut-db --collection offers --jsonArray data/offers.json
```

Later on mongodb screen jump to "restronaut-db":
```
use restronaut-db
```

### 1.3 Add a unique index
Add index on "venueId" running this:
```
db.venues.createIndex({"venueId":1},{unique:true})
```

Try to POST a venue with an existing venueId and see this error in server:
```
"AssertionError [ERR_ASSERTION]: null == { Error: E11000 duplicate key error collection: restronaut-db.venues index: venueId_1 dup key: { : "Mezzalians" }"
```

### 1.4 Browse the data
A simple data fetch
```
db.venues.find({"name": "Mezzalians"})
```

A simple data filter
```
db.venues.find({"name": "Mezzalians"})
```

Filter the data by range
```
db.venues.find({name: {$gte: "N"}})
```

We can see the results in a tidy format.
```
db.venues.find({"name": "Mezzalians"}).pretty()
```

Regex search example (cmds are equal)
```
db.venues.find({name: {$regex:/zz/}})
db.venues.find({name: /zz/})
```

View regex'ed results with chosen fields
```
db.venues.find({name: /zz/},{venueId:1,address:1,_id:0})
```

### 1.5 Projections to see specific fields
We can customize the result not to see whole data, such as:
```
db.venues.find({}, {name:1, address:1, _id:0}).pretty()
```

To sort the result by name in descending form:
```
db.venues.find({}, {name:1, address:1, _id:0}).pretty().sort({name: -1})
```

To limit the results:
```
db.venues.find({}, {name:1, address:1, _id:0}).pretty().sort({name: -1}).limit(1)
```

You can skip the first X results (skipping 4 in this example):
```
db.venues.find({}, {name:1, address:1, _id:0}).pretty().sort({name: -1}).limit(1).skip(4)
```

### 1.6 Indexes
You can view indexes with
```
db.venues.getIndexes()
```

Add a text index in offers on tags
```
db.offers.createIndex({tags:"text"})
```

Then search tags using the index, such as
```
db.offers.find({$text:{$search:"wrap"}}).pretty()
db.offers.find({$text:{$search:"burger"}}).pretty()
```

Mongo indexes offer relevance feature. You can add relevance score (and sorting) like
```
db.offers.find({$text:{$search:"burger"}}, {score: {$meta:"textScore"}, _id:0}).pretty().sort({score: {$meta:"textScore"}})
```

### 1.7 Additional features
You can code on mongo shell. Try this:
```
var venueObj = db.venues.findOne({name: /zz/},{venueId:1,_id:0})
venueObj.clients = []
venueObj.clients.push("Cem")
venueObj
```

You can count (example refers to a text index added in 1.6)
```
> db.offers.count({$text:{$search:"burger"}})
5
> db.offers.count({$text:{$search:"falafel"}})
1
```

Following aggregates venue count in offers
```
> db.offers.aggregate([{$group: {_id: '$venueId', count: {$sum:1}}}])
{ "_id" : "McDonald's 1", "count" : 2 }
{ "_id" : "Zdrowe Love", "count" : 1 }
{ "_id" : "McDonald's 2", "count" : 2 }
{ "_id" : "Mezzalians", "count" : 1 }
{ "_id" : "Folk Burger Street", "count" : 2 }
```

Same result above can be achieved by storing the result using $out.
```
> db.offers.aggregate([{$group: {_id: '$venueId', count: {$sum:1}}}, {$out: 'venuesOfferCount'}])
> db.venuesOfferCount.find()
...
```

## 2 Hapi server
Hapi server is built within index.js.

### 2.1 Start the restronaut-db server
Reach to the project folder in terminal and run this cmd to start the server:
```
node index
```

### 2.2 Ping the routes
Open a new terminal tab and curl the get venues route
```
curl  "http://localhost:8080/api/venues/Zdrowe%20Love"
```

## Reminders
* Try Postman to trigger other crud operations.
* Whenever you want to reset db to starting position, drop venues collection (db.venues.drop()) on mongo cmd screen and import as defined in 1.2.