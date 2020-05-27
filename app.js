const   express    = require('express'),
        app        = express(),
        bodyParser = require('body-parser')
        mongoose   = require('mongoose');
        passport   = require("passport"),
        localStartegy = require("passport-local"),
        Campground = require('./models/campground');
        Comment    = require("./models/comment");
        User       = require("./models/user"),
        seedDB     = require("./seeds");
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Rishi is a fullstack web developer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE FOR CURRENTUSER
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

mongoose.connect("mongodb://localhost/yelp_camp_v6", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
//         description: "This is a huge granite hill"
//     }, (err, campground) => {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(campground);
//         }
//     });

// let campgrounds = [
//     {name: "Salman Creek", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"},
//     {name: "Mountain Goats's rest", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"},
//     {name: "Salman Creek", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"},
//     {name: "Granite Hill", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"},
//     {name: "Mountain Goats's rest", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60"}
// ]

app.get("/", (req, res) => {
    res.render('landing');
});

app.get("/campgrounds", (req, res) => {
    // Get all the campgrounds from the DB
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });

});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res) => {
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

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campgrounds: foundCampground});
        }
    });
});

// =============================
// Comments route
// =============================
app.get("/campgrounds/:id/comments/new",isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });   
});

app.post("/campgrounds/:id/comments", isLoggedIn,(req, res) => {
    // Lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//AUTH ROUTE
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () =>{
            res.redirect("/campgrounds");
        });
    });
});

// Show login Form
app.get("/login", (req, res) => {
    res.render("login");
});

// HANDLING LOGIN LOGIC
// app.post("/login", middleware, callback)
app.post("/login",passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"  
    }),(req, res) => {
});

// LOGOUT ROUTE
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("Server is started");
});