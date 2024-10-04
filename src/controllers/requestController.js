const { Request } = require('../models');

// Obtener todas las solicitudes (GET)
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.findAll();
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las solicitudes' });
    }
};

// Crear una nueva solicitud (POST)
exports.createRequest = async (req, res) => {
    try {
        const newRequest = await Request.create(req.body);
        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        console.error('Error al crear la solicitud:', error);

        // Manejar errores de validación de Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ success: false, message: 'Error de validación', errors: messages });
        }

        // Otro tipo de error
        res.status(500).json({ success: false, message: 'Error al crear la solicitud' });
    }
};

// Editar una solicitud (PUT)
exports.updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Request.update(req.body, { where: { id } });

        if (updated) {
            const updatedRequest = await Request.findOne({ where: { id } });
            res.status(200).json({ success: true, data: updatedRequest });
        } else {
            res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar la solicitud' });
    }
};
