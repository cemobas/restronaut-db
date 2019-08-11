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
To import the json collection in sample.json file, run this in a new terminal tab:
```
mongoimport --db restronaut-db restronaut --collection venues --jsonArray data/sample.json
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

We can see the result in a tidy format
```
db.venues.find({"name": "Mezzalians"}).pretty()
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