const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors({ origin: "*" })); // Allow all origins for testing
app.use(express.json()); // Parse JSON data

// Make sure you're importing routes correctly
const watchesRoutes = require("./routes/watches");
// This line should be app.use("/api", watchesRoutes) and not app.use("/api", watchesRoutes.router)
// or some other incorrect format
app.use("/api", watchesRoutes);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});