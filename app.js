const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ encoding: "utf8" });
const app = express();
const uuid = require("shortid")
const PORT = process.env.PORT || 3000;

const logger = require("./server/utility/logger");
const constants = require("./server/utility/constants");

const mongo_connection = require("./server/helper/mongo-connection");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader(constants.corr_id, req.get(constants.corr_id) ? req.get(constants.corr_id) : uuid.generate());
    next();
})

mongo_connection.establish_connection().then((connection) => {
    logger.info(`Database connection obj: ${connection}`);
}).catch((err) => {
    //logger.error(`Database connection error: ${err.message}`);
})

require("./server/core/routes/index")(app);

app.use(function (req, res, next) {
    let err = new Error(constants.not_found_message);
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).jsonp({ message: error.message });
});

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
})

module.exports = app;

