const User = require('../model/User');
const { hashPassword } = require('../utils/password-helper');

const createUser = async ({ name, email, password, role, location }) => {
    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword, role, location });
    return user.save();
};

const findByEmail = async (email) => {
    const user = await User.findOne({ email: email });
    return user;
};


const getUser = async () =>{
    const users = await User.find({})
    return users;
}


const getUserById = async (id) => {
    const user = await User.findById(id);
    return user;
};

module.exports = { createUser, findByEmail };



