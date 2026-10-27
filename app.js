const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const routes = require("./routes/leaveRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", routes);

app.listen(5050, () =>
    console.log("Server running on port 5050")
);