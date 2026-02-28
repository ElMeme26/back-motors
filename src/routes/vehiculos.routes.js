const express = require('express');
const controller = require('../controllers/vehiculos.controller');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware, requireRole } = require('../auth');

const router = express.Router();

router.get('/', asyncHandler(controller.getAllActive));
router.get('all', asyncHandler(controller.getAll));
router.get('/:placas', asyncHandler(controller.getByPlacas));
router.post('/', authMiddleware, requireRole('admin'), asyncHandler(controller.create));
router.put('/:placas', asyncHandler(controller.update));
router.delete('/:placas', asyncHandler(controller.remove));

module.exports = { router }