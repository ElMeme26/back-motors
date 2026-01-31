const express = require("express")

const app = express()
const PORT = 3000

app.use(express.json())

// Vehículos precargados
let vehiculos = [
    {
        "marca": "Hyundai",
        "modelo": "Grand i10",
        "placas": "6758ET",
        "dueño": "Zaid Castillo Hermosillo",
        "motivo": "Detalle de pintura defensa trasera",
        "estado": "En espera"
    },
    {
        "marca": "Mazda",
        "modelo": "2",
        "placas": "6819PC",
        "dueño": "Carlos Sebastián Coronado Altamirano",
        "motivo": "Parabrisas destrozado",
        "estado": "En espera"
    },
    {
        "marca": "Ford",
        "modelo": "Focus",
        "placas": "8131RT",
        "dueño": "Dael Alexis Espino Frías",
        "motivo": "Desvielacion de motor",
        "estado": "En reparación"
    },
] 

app.get("/vehiculos", (req, res) => {
    res.status(200).json(vehiculos)
})

app.get("/vehiculos/:placas", (req, res) => {
    const placas = req.params.placas
    const vehiculo = vehiculos.find(v => v.placas === placas)

    if (vehiculo) {
        return res.status(200).json(vehiculo)
    }
    
    res.status(404).send("Vehículo no encontrado")
    
})

app.post("/vehiculos", (req, res) => {
    const nuevoVehiculo = req.body

    if (!nuevoVehiculo || Object.keys(nuevoVehiculo).length === 0) {
        return res.status(400).send("No es posible registrar un vehículo sin información")
    }

    // Función para evitar ingresar carros duplicados
    const placas = nuevoVehiculo.placas
    const vehiculoExistente = vehiculos.find(v => v.placas === placas)

    if (vehiculoExistente) {
        return res.status(409).send("No es posible registrar un vehículo con las mismas placas")
    }

    if (Array.isArray(nuevoVehiculo)) {
        nuevoVehiculo.forEach(vehiculo => {
            vehiculos.push(vehiculo)
        })
        return res.status(201).json(nuevoVehiculo)
        
    }

    vehiculos.push(nuevoVehiculo)
    res.status(201).json(nuevoVehiculo)
})

app.put("/vehiculos/:placas", (req, res) => {
    const placas = req.params.placas
    const datosActualizados = req.body

    if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
        return res.status(400).send("No es posible actualizar un vehículo sin información")
    }

    const id = vehiculos.findIndex(v => v.placas === placas)

    if (id === -1) {
        return res.status(404).send("Vehículo no encontrado")
    }

    if (datosActualizados.placas && datosActualizados.placas !== placas) {
        const placasExistentes = vehiculos.some(v => v.placas === datosActualizados.placas)

        if (placasExistentes) {
            return res.status(409).send("No es posible actualizar a unas placas que ya existen")
        }
    }

    vehiculos[id] = { 
        ...vehiculos[id], 
        ...datosActualizados 
    }

    res.status(200).json(vehiculos[id])
})


app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`)
})