const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors({ origin: "*" })); // Allow all origins for testing
app.use(express.json()); // Add this line to parse JSON data

const sneakersRoutes = require("./routes/sneakers");
app.use("/api", sneakersRoutes); // Add a base route

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
