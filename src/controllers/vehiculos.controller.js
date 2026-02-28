const { VehiculosRepository } = require('../repositories/vehiculos.repository');
const { validarVehiculo } = require('../domain/vehiculos.rules');

const repo = new VehiculosRepository();

async function getAll(req, res) {
    const vehiculos = await repo.getAll();
    return res.json(vehiculos);
}

async function getAllActive(req, res) {
    const vehiculos = await repo.getAllActive();
    return res.json(vehiculos);
}

async function getByPlacas(req, res) {
    const placas = req.params.placas;
    const vehiculo = await repo.getByPlacas(placas);

    if (!vehiculo) {
        return res.status(404).json({error: 'Vehículo no encontrado'});
    }

    return res.json(vehiculo);
}

async function create(req, res) {
    const { marca, modelo, anio, dueno, placas, motivo} = req.body;

    const resultado = validarVehiculo({ marca, modelo, anio, dueno, placas, motivo });

    if (resultado.error) {
        return res.status(400).json(resultado.error);
    }

    const data = resultado.data;

    const nuevo = await repo.create(data.marca, data.modelo, data.anio, data.dueno, data.placas, data.motivo);
    console.log(nuevo);

    return res.status(201).json(nuevo);
}

async function update(req, res) {
    const placasParams = req.params.placas;
    const { marca, modelo, anio, dueno, placas, motivo, estado, activo } = req.body; 

    const payload = {
        marca: marca !== undefined ? marca : undefined,
        modelo: modelo !== undefined ? modelo : undefined,
        anio: anio !== undefined ? anio : undefined,
        dueno: dueno !== undefined ? dueno : undefined,
        placas: placas !== undefined ? placas : undefined,
        motivo: motivo !== undefined ? motivo : undefined,
        estado: estado !== undefined ? estado : undefined,
        activo: activo !== undefined ? activo : undefined
    }

    if (payload.anio !== undefined) {
        const anioNumero = Number(payload.anio);
        const anioActual = new Date().getFullYear();

        if (!Number.isInteger(anioNumero) || anioNumero < 1900 || anioNumero > anioActual + 1) {
            return res.status(400).json({ error: 'Año inválido' });
        }

        payload.anio = anioNumero;
    }

    if (payload.activo !== undefined && typeof payload.activo !== 'boolean') {
        return res.status(400).json({ error: 'Activo inválido' });
    }

    const actualizado = await repo.update(placasParams, payload);

    if (!actualizado) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    return res.json(actualizado);
}

async function remove(req, res) {
    const placasParams = req.params.placas;
    const ok = await repo.delete(placasParams);

    if (!ok) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    return res.status(204).send();
}

module.exports = { getAll, getAllActive, getByPlacas, create, update, remove }