const { VehiculosRepository } = require('../repositories/vehiculos.repository');
const { validarVehiculo } = require('../domain/vehiculos.rules');

const repo = new VehiculosRepository();

function parsePagination(query) {
    const pageRaw = query.page ?? '1';
    const limitRaw = query.limit ?? '10';

    const page = Number(pageRaw);
    const limit = Number(limitRaw);

    if (!Number.isInteger(page) || page < 1) {
        return { error: 'Parámetro "page" inválido (debe ser entero >= 1)' };
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        return { error: 'Parámetro "limit" inválido (debe ser entero entre 1 y 50)' };
    }

    return { page, limit, offset: (page - 1) * limit };
}

async function getAll(req, res) {
    const pagination = parsePagination(req.query);
    if (pagination.error) {
        return res.status(400).json({ error: pagination.error });
    }

    const [data, total] = await Promise.all([
        repo.getAllPaginated(pagination.offset, pagination.limit),
        repo.getCountAll()
    ]);

    return res.json({
        data,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit)
    });
}

async function getAllActive(req, res) {
    const pagination = parsePagination(req.query);
    if (pagination.error) {
        return res.status(400).json({ error: pagination.error });
    }

    const [data, total] = await Promise.all([
        repo.getActivePaginated(pagination.offset, pagination.limit),
        repo.getCountActive()
    ]);

    return res.json({
        data,
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit)
    });
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