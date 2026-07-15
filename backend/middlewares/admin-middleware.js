
const adminMiddleware = (req, res, next) => {
    try {
        const adminRole = req.user.isAdmin; // Assuming the user object has an isAdmin property
        if (!adminRole) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        next(error);
    }
}

export default adminMiddleware;