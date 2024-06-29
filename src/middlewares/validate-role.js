export const isAdmin = (req, res, next) => {
    const user = req.user;

    if (user.role === "ADMIN_ROLE") return next();

    return res.status(400).json({ msg: `necesitas tener role admin`})
}

export const isPreceptor = (req, res, next) => {
    const user = req.user;

    if (user.role === "PRECEPTOR_ROLE") return next();

    return res.status(400).json({ msg: `necesitas tener role preceptor`})
}

export const isPaciente = (req, res, next) => {
    const user = req.user;

    if (user.role === "PACIENTE_ROLE") return next();

    return res.status(400).json({ msg: `You don't have autoritation, your role must be PACIENTE_ROLE`})
}

export const isAdminOrPreceptor = (req, res, next) => {
    const user = req.user;

    console.log("User Role:", user.role); // Añade este log para verificar el rol del usuario

    if (user.role === "ADMIN_ROLE" || user.role === "PRECEPTOR_ROLE") {
        return next();
    }

    return res.status(400).json({ msg: 'Necesitas tener rol de admin o preceptor' });
}

export const isPreceptorOrPaciente = (req, res, next) => {
    const user = req.user;

    console.log("User Role:", user.role); // Añade este log para verificar el rol del usuario

    if (user.role === "PACIENTE_ROLE" || user.role === "PRECEPTOR_ROLE") {
        return next();
    }

    return res.status(400).json({ msg: 'Necesitas tener rol de paciente o preceptor' });
}