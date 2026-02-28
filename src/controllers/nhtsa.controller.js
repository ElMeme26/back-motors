const { NhtsaError, decodeVin, getAllMakes, getModelsForMake } = require('../services/nhtsa.service');

async function vinDecode(req, res) {
    try {
        const vin = req.params.vin;
        const modelyear = req.query.modelyear;
        const data = await decodeVin(vin, modelyear);

        return res.json({ ok: true, data });
    } catch (err) {
        if (err instanceof NhtsaError) {
            return res.status(err.status).json({ ok: false, error: err.message });
        }

        return res.status(500).json({ ok: false, error: 'Error interno' });
    }
}

async function makes(req, res) {
    try {
        const data = await getAllMakes();
        return res.json({ ok: true, data });
    } catch (err) {
        if (err instanceof NhtsaError) {
            return res.status(err.status).json({ ok: false, error: err.message });
        }

        return res.status(500).json({ ok: false, error: 'Error interno' });
    }
}

async function models(req, res) {
    try {
        const marca = req.params.marca;
        const data = await getModelsForMake(marca);
        return res.json({ ok: true, data });
    } catch (err) {
        if (err instanceof NhtsaError) {
            return res.status(err.status).json({ ok: false, error: err.message });
        }

        return res.status(500).json({ ok: false, error: 'Error interno' });
    }
}

module.exports = { vinDecode, makes, models };
