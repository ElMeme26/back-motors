function validarUsuario({ email, password }) {

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return { ok: false, error: 'Email inválido' };
    }

    if (!password || typeof password !== 'string') {
        return { ok: false, error: 'Contraseña inválida' };
    }

    if (password.length < 6) {
        return { ok: false, error: 'La contraseña debe tener un mínimo de 6 caracteres' };
    }

    return {
        ok: true,
        data: {
            email: email.trim(),
            password: password.trim()
        }
    }
}

module.exports = { validarUsuario }