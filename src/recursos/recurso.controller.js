import Recurso from '../recursos/recurso.model.js';

export const recursosPost = async (req, res) => {
    const { titlulo, tipo, contenido } = req.body;
    const recurso = new Recurso({ titulo, tipo, contenido });

    await recurso.save();

    res.status(201).json({ recurso });
};


export const recursoGet = async (req, res) => {
    const { limite = 5, desde = 0 } = req.query;

    const [total, recurso] = await Promise.all([
        Recurso.countDocuments(),
        Recurso.find()
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({ total, recurso });
};

export const getRecursoById = async (req, res) => {
    const { id } = req.params;
    const recurso = await Recurso.findById(id);

    res.status(200).json({ recurso });
}

export const recursoPut = async (req, res) => {
    const { id }  = req.params;
    const { _id, ...resto} = req.body;
    const recurso = await Recurso.findByIdAndUpdate(id, resto, { new: true});
    res.status(200).json({ recurso });
};

