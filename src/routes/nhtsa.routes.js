const express = require('express');
const controller = require('../controllers/nhtsa.controller');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/vin/:vin', asyncHandler(controller.vinDecode));
router.get('/marcas', asyncHandler(controller.makes));
router.get('/modelos/:marca', asyncHandler(controller.models));

module.exports = { router };
