const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

class NhtsaError extends Error {
    constructor(message, status = 502) {
        super(message);
        this.name = 'NhtsaError';
        this.status = status;
    }
}

async function httpGetJson(url) {
    if (typeof fetch !== 'function') {
        throw new NhtsaError('Node.js debe soportar fetch (Node 18+) para consumir NHTSA', 500);
    }

    let res;
    try {
        res = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
    } catch (err) {
        throw new NhtsaError('No se pudo conectar con NHTSA', 502);
    }

    if (!res.ok) {
        throw new NhtsaError(`NHTSA respondió ${res.status}`, 502);
    }

    try {
        return await res.json();
    } catch (err) {
        throw new NhtsaError('Respuesta inválida de NHTSA', 502);
    }
}

function normalizeVin(vin) {
    const v = String(vin ?? '').trim().toUpperCase();
    if (!v) return { error: 'VIN requerido' };
    if (v.length < 5) return { error: 'VIN demasiado corto' };
    return { vin: v };
}

async function decodeVin(vin, modelyear) {
    const n = normalizeVin(vin);
    if (n.error) throw new NhtsaError(n.error, 400);

    const year = modelyear !== undefined ? Number(modelyear) : undefined;
    if (modelyear !== undefined && (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 1)) {
        throw new NhtsaError('modelyear inválido', 400);
    }

    const url = new URL(`${BASE_URL}/vehicles/DecodeVinValues/${encodeURIComponent(n.vin)}`);
    url.searchParams.set('format', 'json');
    if (year !== undefined) url.searchParams.set('modelyear', String(year));

    const json = await httpGetJson(url.toString());
    const results = Array.isArray(json.Results) ? json.Results : [];

    const flat = results[0] ?? null;
    if (!flat) {
        throw new NhtsaError('VIN no encontrado', 404);
    }

    return flat;
}

async function getAllMakes() {
    const url = new URL(`${BASE_URL}/vehicles/GetAllMakes`);
    url.searchParams.set('format', 'json');

    const json = await httpGetJson(url.toString());
    const results = Array.isArray(json.Results) ? json.Results : [];

    return results.map((r) => ({
        makeId: r.Make_ID ?? r.MakeId ?? r.makeId,
        makeName: r.Make_Name ?? r.MakeName ?? r.makeName
    }));
}

async function getModelsForMake(makeName) {
    const make = String(makeName ?? '').trim();
    if (!make) throw new NhtsaError('Marca requerida', 400);

    const url = new URL(`${BASE_URL}/vehicles/GetModelsForMake/${encodeURIComponent(make)}`);
    url.searchParams.set('format', 'json');

    const json = await httpGetJson(url.toString());
    const results = Array.isArray(json.Results) ? json.Results : [];

    return results.map((r) => ({
        makeId: r.Make_ID ?? r.MakeId ?? r.makeId,
        makeName: r.Make_Name ?? r.MakeName ?? r.makeName,
        modelId: r.Model_ID ?? r.ModelId ?? r.modelId,
        modelName: r.Model_Name ?? r.ModelName ?? r.modelName
    }));
}

module.exports = { NhtsaError, decodeVin, getAllMakes, getModelsForMake };
