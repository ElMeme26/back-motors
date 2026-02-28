function validarVehiculo({ marca, modelo, anio, dueno, placas, motivo}) {

    if (!marca || typeof marca !== 'string') {
        return { ok: false, error: 'Marca inválida' };
    }

    if (!modelo || typeof modelo !== 'string') {
        return { ok: false, error: 'Modelo inválido' };
    }

    if (!dueno || typeof dueno !== 'string') {
        return { ok: false, error: 'Dueño inválido' };
    }

    if (!placas || typeof placas !== 'string') {
        return { ok: false, error: 'Placas inválidas' };
    }

    if (!motivo || typeof motivo !== 'string') {
        return { ok: false, error: 'Motivo inválido' };
    }

    const anioNumber = Number(anio);
    const anioActual = new Date().getFullYear();

    if (!Number.isInteger(anioNumber) || anioNumber < 1900 || anioNumber > anioActual + 1) {
        return { ok: false, error: 'Año inválido'};
    }

    return {
        ok: true,
        data: {
            marca: marca.trim(),
            modelo: modelo.trim(),
            anio: anioNumber,
            dueno: dueno.trim(),
            placas: placas.trim(),
            motivo: motivo.trim()
        }
    }
}

module.exports = { validarVehiculo }