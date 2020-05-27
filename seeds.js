const mongoose = require('mongoose');
const Campground = require("./models/campground");
const Comment = require("./models/comment");
let data = [
    {
        name: "Cloud's rest",
        image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },

    {
        name: "Desert Meso",
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Canyon floor",
        image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("removed campgrounds");
        // add a few campgrounds
        data.forEach(seed => {
            Campground.create(seed, (err, campground)=>{
                if(err) {
                    console.log(err);
                } else {
                    console.log("added a new campgrounds");
                    // Create a comment
                    Comment.create(
                        {
                            text: "This place is great",
                            author: "Rishi"
                        }, (err, comment) =>{
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a new comment");
                            }
                        }
                    )
                }
            });
        });
    });
}

module.exports = seedDB;