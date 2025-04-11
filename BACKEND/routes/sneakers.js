const express = require("express");
const router = express.Router();
const controllers = require("../controllers/sneakers");


router.get("/sneakers", controllers.getSneakers);
router.get("/sneakers/:id", controllers.getSneakersById);


module.exports = router;