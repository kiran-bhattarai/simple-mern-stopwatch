import bcrypt from "bcrypt";

export const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}