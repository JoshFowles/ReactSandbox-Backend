var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");

var app = Express();
app.use(cors());

var CONNECTION_STRING = "mongodb://localhost:27017/Gremlins-DB";
var DATABASENAME = "Gremlins-DB";
var database;

const PORT = 5001;

async function connectToDatabase() {
    try {
        console.log("Gotta Go Fast! 😈")
        const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Successful");

        // Start the server only after successful connection to the database
        startServer();
    } catch (error) {
        console.error("Mongo DB Connection Failed", error);
        process.exit(1); // Exit process with failure
    }
}

function startServer() {
    app.get('/api/Gremlins-DB/Gremlins', async (request, response) => {
        try {
            if (!database) {
                throw new Error("Database not connected");
            }
            const gremlins = await database.collection("Gremlins").find({}).toArray();
            response.send(gremlins);
        } catch (error) {
            response.status(500).send("Error fetching gremlins: " + error.message);
        }
    });

    app.get('/api/Gremlins-DB/User', async (request, response) => {
        try {
            if (!database) {
                throw new Error("Database not connected");
            }
            const user = await database.collection("User").find({}).toArray();
            response.send(user);
        } catch (error) {
            response.status(500).send("Error fetching Users: " + error.message);
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Connect to the database and then start the server
connectToDatabase();
