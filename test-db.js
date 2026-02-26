const { pool } = require('./src/db');

(async () => {
    let placas = 'DWC-951-C';

    const r = await pool.query(
        'SELECT id, placas, marca, modelo, anio, dueno, motivo, estado FROM vehiculos WHERE placas = $1;', 
        [placas]
    );

    console.log('resultados:', r.rows);
})();