const roleMiddleware = (roles) => {
    return (req, res, next) => {
      try {
        if (!req.user || !req.user.role) {
          return res.status(403).json({success:false,message: "Access denied" });
        }
  
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({success:false, message: "Not authorized" });
        }
  
        return next();
      } catch (error) {
        return res.status(500).json({success:false, message: "Server error" });
      }
    };
  };
  
  module.exports = roleMiddleware;