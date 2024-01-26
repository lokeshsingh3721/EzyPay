const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const routeRouter = require("./routes/index");
const dbConnect = require("../db");

const PORT = 3000;

// middlewares
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// redirecting /api/v1 routes
app.use("/api/v1", routeRouter);

// connecting to the database
dbConnect();

app.listen(PORT, () => {
  console.log("app is listening to the port " + PORT);
});
