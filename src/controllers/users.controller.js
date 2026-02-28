const bcrypt = require('bcryptjs');
const { sign } = require('../auth');
const { UsersRepository } = require('../repositories/users.repository');
const { validarUsuario } = require('../domain/users.rules');

const repo = new UsersRepository();

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await repo.findByEmail(email);

    if (!user) {
        return res.status(401).json({ error: 'Credenciales incorrectas'});
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
        return res.status(401).json({ error: 'Credenciales incorrectas'});
    }

    const token = sign({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return res.json({ token });
}

async function create(req, res) {
    const { email, password, role } = req.body;

    const resultado = validarUsuario({ email, password })

    if (!resultado.ok) {
        return res.status(400).json({ error: resultado.error });
    }

    const data = resultado.data;

    const passwordHash = await bcrypt.hash(data.password, 8);

    const user = await repo.create({ email: data.email, passwordHash, role });

    return res.status(201).json({ ok: true, user: user });
}

module.exports = { loginUser, create }