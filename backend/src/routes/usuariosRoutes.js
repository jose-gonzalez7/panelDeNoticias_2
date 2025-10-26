const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../Middleware/verificarToken");
const usuarioController = require("../controllers/usuarioController");

router.get("/", verifyToken, usuarioController.getAllUsers);
router.get("/admin", verifyToken, requireRole("administrador"), usuarioController.getAllUsersAdmin);

module.exports = router;