// controllers/authMiddleware.js

export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non connecté" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.session.user?.role !== "administrateur") {
    return res.status(403).json({ message: "Accès interdit : réservé aux admins" });
  }
  next();
};

export const isProf = (req, res, next) => {
  if (req.session.user?.role !== "professeur") {
    return res.status(403).json({ message: "Accès interdit : réservé aux profs" });
  }
  next();
};

export const isRh = (req, res, next) => {
  if (req.session.user?.role !== "ressource humaine") {
    return res.status(403).json({ message: "Accès interdit : réservé aux RH" });
  }
  next();
};

export const isAdminOrRh = (req, res, next) => {
  const role = req.session.user?.role;
  if (role !== "administrateur" && role !== "ressource humaine") {
    return res.status(403).json({ message: "Accès interdit" });
  }
  next();
};
export const authroute=(req,res)=>{
res.status(200).json({
    authenticated: true,
    role: req.session.user.role
  })
}
