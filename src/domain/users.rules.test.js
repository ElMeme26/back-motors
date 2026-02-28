const { validarUsuario } = require('./users.rules');

test('Rechaza email vacío', () => {
    const r = validarUsuario({
        email: '',
        password: 123456
    });

    expect(r.ok).toBe(false);
});

test('Rechaza email no string', () => {
    const r = validarUsuario({
        email: 1234,
        password: 123456
    });

    expect(r.ok).toBe(false);
});

test('Rechaza email sin @', () => {
    const r = validarUsuario({
        email: 'admintest.com',
        password: 123456
    });

    expect(r.ok).toBe(false);
});

test('Rechaza password vacío', () => {
    const r = validarUsuario({
        email: 'admin@test.com',
        password: ''
    });

    expect(r.ok).toBe(false);
});

test('Rechaza password número', () => {
    const r = validarUsuario({
        email: 'admin@test.com',
        password: 123
    });

    expect(r.ok).toBe(false);
});

test('Rechaza password con menos de 6 caracteres', () => {
    const r = validarUsuario({
        email: 'admin@test.com',
        password: '123'
    });

    expect(r.ok).toBe(false);
});

test('Rechaza password vacío', () => {
    const r = validarUsuario({
        email: 'admin@test.com',
        password: ''
    });

    expect(r.ok).toBe(false);
});

test('Acepta un usuario válido', () => {
    const r = validarUsuario({
        email: 'admin@test.com',
        password: '123456'
    });

    expect(r.ok).toBe(true);
});