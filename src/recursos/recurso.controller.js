import Recurso from '../recursos/recurso.model.js';

export const recursosPost = async (req, res) => {
    const { titlulo, tipo, contenido } = req.body;
    const recurso = new Recurso({ titulo, tipo, contenido });

    await recurso.save();

    res.status(201).json({ recurso });
};

