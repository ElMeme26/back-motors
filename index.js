const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { pool } = require('./src/db');
const { authMiddleware } = require('./src/auth');
const { router: vehiculosRouter } = require('./src/routes/vehiculos.routes');
const { router: usersRouter } = require('./src/routes/users.routes');
const { router: nhtsaRouter } = require('./src/routes/nhtsa.routes');
const { errorHandler } = require('./src/middlewares/error.middleware');

const PORT = process.env.PORT || 3000;
const app = express();

const allowed = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONT_URL
].filter(Boolean);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 solicitudes por IP
    message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.'
});

app.use(limiter);

app.use(cors({
    origin: function (origin, cb) {
        if (!origin) {
            return cb(null, true);
        }

        if (allowed.includes(origin)) {
            return cb(null, true);
        }

        return cb(new Error('CORS bloqueado ' + origin));
    }
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('API OK');
});

app.use('/vehiculos', vehiculosRouter);

app.use('/users', usersRouter);

app.use('/api-externa', nhtsaRouter);

app.get('/privado', authMiddleware, (req, res) => {
    return res.json({
        ok: true,
        user: req.user
    });
});

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        return res.json({ ok: true });
    } catch (err) {
        return res.status(500).json({ ok: false });
    }
});

app.get('/health/db', async (req, res) => {
    try {
        const r = await pool.query('select 1 as ok');
        return res.json({ok:true, db:r.rows[0].ok});
    } catch (err) {
        console.log('DB Error', err.message);
        return res.status(500).json({ok:false, error:'DB no disponible'});
    }
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
});