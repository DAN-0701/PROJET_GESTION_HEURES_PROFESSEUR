import express from "express";

export const  logout=(req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Erreur déconnexion" });
    }

    res.clearCookie("connect.sid"); // cookie express-session
    res.status(200).json({ message: "Déconnexion réussie" });
  });
};