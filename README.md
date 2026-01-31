
# back-motors

Sistema back-end de gestión de ingresos vehiculares enfocado en la digitalización de órdenes de servicio para talleres mecánicos y de pintura.

## Problema que resuelve

Resuelve la pérdida de información y la ineficiencia operativa en talleres que dependen de registros en papeles. Si un cliente pierde su orden de ingreso, el taller no tiene una forma rápida de buscar la información del vehículo, causando conflictos, tiempos de espera largos y pésima atención al cliente.

## A quien va dirigido?
A dueños y recepcionistas de talleres pequeños.

## Enfoque del sistema 

El sistema se enfoca en que, con una petición GET, el taller pueda recuperar instantáneamente la información de los vehículos, su estado actual y el motivo de ingreso, eliminando la necesidad de tener un medio físico que compruebe la veracidad.

## MVP

El sistema debe ser capaz de manejar las ordenes se ingreso digitales sobre un vehículo, debe registrar coches cuando llegan al taller, mostrar la información todos los vehículos, actualizar el estado de los vehículos y darlos de baja ya cuando salen del taller.

## Funcionalidades

1. Registro de ingreso: capturar datos clave: marca, modelo, descripción del daño, fecha y estatus

2. Consulta de inventario: mostrar una lista de todos los carros que se encuentran actualmente en el taller

3. Actualización del estado: cambiar el estatus de la reparación de un vehículo

4. Entrega del vehículo: eliminar el registro del vehículo una vez que el cliente recoge su auto

# ¿Qué funcionalidades quedarán fuera por ahora?

1. Base de datos persistente
2. Front-end