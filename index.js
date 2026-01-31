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


app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`)
})