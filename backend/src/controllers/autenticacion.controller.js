const { authenticateUser } = require('../services/autenticacion.service');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const token = await authenticateUser(email, password);
    res.json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

module.exports = { login };
