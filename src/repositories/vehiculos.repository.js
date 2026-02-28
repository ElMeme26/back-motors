const { pool } = require('../db');

class VehiculosRepository {

    async getCountAll() {
        const result = await pool.query(
            'SELECT COUNT(*)::int AS total FROM vehiculos;'
        );

        return result.rows[0]?.total ?? 0;
    }

    async getCountActive() {
        const result = await pool.query(
            'SELECT COUNT(*)::int AS total FROM vehiculos WHERE activo = true;'
        );

        return result.rows[0]?.total ?? 0;
    }

    async getAllPaginated(offset, limit) {
        const result = await pool.query(
            'SELECT id, marca, modelo, anio, dueno, placas, motivo, estado, fecha_ingreso FROM vehiculos ORDER BY fecha_ingreso DESC LIMIT $1 OFFSET $2;',
            [limit, offset]
        );

        return result.rows;
    }

    async getActivePaginated(offset, limit) {
        const result = await pool.query(
            'SELECT id, marca, modelo, anio, dueno, placas, motivo, estado, fecha_ingreso FROM vehiculos WHERE activo = true ORDER BY fecha_ingreso DESC LIMIT $1 OFFSET $2;',
            [limit, offset]
        );

        return result.rows;
    }

    async getAll() {
        const result = await pool.query(
            'SELECT id, marca, modelo, anio, dueno, placas, motivo, estado, fecha_ingreso FROM vehiculos;'
        );

        return result.rows;
    }

    async getAllActive() {
        const result = await pool.query(
            'SELECT id, marca, modelo, anio, dueno, placas,motivo, estado, fecha_ingreso FROM vehiculos WHERE activo = true;'
        );

        return result.rows;
    }

    async getByPlacas(placas) {
        const result = await pool.query(
            'SELECT id, marca, modelo, anio, dueno, placas, motivo, estado, fecha_ingreso, fecha_salida FROM vehiculos WHERE placas = $1;', [placas]
        );

        return result.rows[0] || null;
    }

    async create(marca, modelo, anio, dueno, placas, motivo) {
        const result = await pool.query(
            'INSERT INTO vehiculos (marca, modelo, anio, dueno, placas, motivo) values ($1, $2, $3, $4, $5, $6) returning id, marca, modelo, anio, dueno, placas, motivo, estado, fecha_ingreso;', [marca, modelo, anio, dueno, placas, motivo]
        );

        return result.rows[0];
    }

    async update(placasOriginal, data) {
        const result = await pool.query(
            'UPDATE vehiculos SET marca = coalesce($1, marca), modelo = coalesce($2, modelo), anio = coalesce($3, anio), placas = coalesce($4, placas), dueno = coalesce($5, dueno), estado = coalesce($6, estado), motivo = coalesce($7, motivo), activo = coalesce($8, activo) WHERE placas = $9 returning id, marca, modelo, anio, placas, dueno, estado, motivo, activo, fecha_ingreso;',
            [
                data.marca ?? null,
                data.modelo ?? null,
                data.anio ?? null,
                data.placas ?? null,
                data.dueno ?? null,
                data.estado ?? null,
                data.motivo ?? null,
                data.activo ?? null,
                placasOriginal
            ]
        );

        return result.rows[0] || null;
    }

    async delete(placas) {
        const result = await pool.query(
            'DELETE FROM vehiculos WHERE placas = $1 returning id;', [placas]
        );

        return result.rows[0] || null;
    }
}

module.exports = { VehiculosRepository }