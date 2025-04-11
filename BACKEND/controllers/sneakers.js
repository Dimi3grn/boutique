const data = require('../data.json'); // Fixed variable name

exports.getSneakersById = (req, res) => {
    const id = parseInt(req.params.id);
    const sneakers = data.sneakers;
    
    const sneaker = sneakers.find((sneaker) => sneaker.id === id);
    
    if (!sneaker) {
        return res.status(404).json({ message: "Sneaker not found" });
    }

    res.status(200).json({
        message: "Sneaker found",
        sneaker
    });
};

exports.getSneakers = (req, res) => {
    const sneakers = data.sneakers; // Fixed typo: changed sneaker to sneakers
    res.status(200).json({
        message: "Sneakers found",
        sneakers // Fixed variable name
    });
};
