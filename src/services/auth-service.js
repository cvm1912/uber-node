const authRepository = require('../repositories/auth-repository');
const { comparePassword } = require('../utils/password-helper');
const { generateToken } = require('../utils/jwt-helper');

const register = async ({ name, email, password, role, location }) => {
    const user = await authRepository.createUser({ name, email, password, role, location });
    return { id: user._id, name: user.name, email: user.email, role: user.role };
};

const login = async ({ email, password }) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return { token: generateToken(user), id: user._id, name: user.name, email: user.email, role: user.role };
};

module.exports = { register, login };
