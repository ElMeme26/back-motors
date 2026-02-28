const { validarVehiculo } = require('./vehiculos.rules');

test('Rechaza marca vacía', () => {
    const r = validarVehiculo({
        marca: '',
        modelo: 'Ibiza',
        anio: 2019,
        dueno: 'Leo',
        placas: 'DWC-951-C',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(false);
});

test('Rechaza modelo vacío', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: '',
        anio: 2019,
        dueno: 'Leo',
        placas: 'DWC-951-C',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(false);
});

test('Rechaza dueño vacío', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: 'Ibiza',
        anio: 2019,
        dueno: '',
        placas: 'DWC-951-C',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(false);
});

test('Rechaza placas vacías', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: 'Ibiza',
        anio: 2019,
        dueno: 'Leo',
        placas: '',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(false);
});

test('Rechaza motivo vacío', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: 'Ibiza',
        anio: 2019,
        dueno: 'Leo',
        placas: 'DWC-951-C',
        motivo: ''
    });

    expect(r.ok).toBe(false);
});

test('Rechaza año no numérico', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: 'Ibiza',
        anio: 'hola profe',
        dueno: 'Leo',
        placas: 'DWC-951-C',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(false);
});

test('Rechaza año fuera de rango', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: 'Ibiza',
        anio: 1717,
        dueno: 'Leo',
        placas: 'DWC-951-C',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(false);
});

test('Acepta un vehículo válido y convierte el año', () => {
    const r = validarVehiculo({
        marca: 'Seat',
        modelo: 'Ibiza',
        anio: '2019',
        dueno: 'Leo',
        placas: 'DWC-951-C',
        motivo: 'Servicio'
    });

    expect(r.ok).toBe(true);
    expect(r.data.anio).toBe(2019);
});
