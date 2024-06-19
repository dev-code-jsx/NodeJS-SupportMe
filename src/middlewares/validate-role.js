export const isAdmin = (req, res, next) => {
    const user = req.user;

    if (user.role === "ADMIN_ROLE") return next();

    return res.status(400).json({ msg: "You don't have the necesary permission"})
}

export const isPreceptor = (req, res, next) => {
    const user = req.user;

    if (user.role === "PRECEPTOR_ROLE") return next();

    return res.status(400).json({ msg: "You don't have the necesary permission"})
}

export const isPaciente = (req, res, next) => {
    const user = req.user;

    if (user.role === "PACIENTE_ROLE") return next();

    return res.status(400).json({ msg: "You don't have the necesary permission"})
}
