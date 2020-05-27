const express = require('express');
const router = express.Router();
const Campground = require("../models/campgrounds");

// Index route- show all campgrounds
app.get("/", (req, res) => {
    // Get all the campgrounds from the DB
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });

});

app.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campgrounds: foundCampground});
        }
    });
});

module.exports = router;