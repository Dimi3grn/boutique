const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// CORS configuration spécifique pour 127.0.0.1:5000
app.use(cors({ 
    origin: "http://127.0.0.1:5500",  // Adresse spécifiée
    credentials: true  // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());

// Configuration pour servir les fichiers statiques
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
const watchesRoutes = require("./routes/watches");
const authRoutes = require("./routes/auth");
const favoritesRoutes = require("./routes/favorites");
const cartRoutes = require("./routes/cart"); // New cart routes

app.use("/api", watchesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/cart", cartRoutes); // Add cart routes

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});