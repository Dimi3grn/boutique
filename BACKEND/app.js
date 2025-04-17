const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const path = require("path");

app.use(cors({ origin: "*" }));
app.use(express.json());

// Configuration pour servir les fichiers statiques
app.use('/static', express.static(path.join(__dirname, 'public')));

// Vos routes existantes
const watchesRoutes = require("./routes/watches");
app.use("/api", watchesRoutes);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});