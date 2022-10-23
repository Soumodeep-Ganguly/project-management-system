const jwt = require("jsonwebtoken");
    
exports.authenticateToken = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[0];

    //console.log(authHeader.split(' '));
    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.token = user
        next(); // pass the execution off to whatever request the client intended
    });
}