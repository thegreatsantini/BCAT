var keystone = require('keystone');
var User = keystone.list('User').model;

exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;

    locals.success = false;

    locals.stuff = req.body;
    console.log(req.body);

    var newUser = new User({
        name: {first: req.body.first, last: req.body.last},
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        location: {
            street1: req.body.st_address,
            postcode: req.body.zip,
            state: req.body.state,
            suburb: req.body.city,
            country: 'USA'
        },
        isAdmin: false
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            locals.success = true;
        }

        view.render('signup');
    });
};