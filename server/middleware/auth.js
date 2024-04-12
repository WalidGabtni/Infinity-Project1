import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft()
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Verified Token:', verified);
        req.user = verified;
        next();

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const adminAuth = async (req, res, next) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(403).json({ error: "Access Denied, authentication required" });
        }

        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized, admin access required" });
        }

        // If the user is an admin, proceed to the next middleware
        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};