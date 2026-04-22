const User = require("../../models/User");
const { hashPassword } = require("../../helpers/password");

const SEED = {
  name: "vamsi",
  email: "vamsidulam11@gmail.com",
  phone: "+919949471552",
  role: "admin",
  password: "Vamsidulam@2005121",
};

async function seedAdmin() {
  const email = SEED.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    return { alreadyExisted: true, user: existing };
  }

  const hashed = await hashPassword(SEED.password);
  const user = await User.create({
    name: SEED.name,
    email,
    phone: SEED.phone,
    role: SEED.role,
    password: hashed,
    createdBy: null,
    updatedBy: null,
  });

  return { alreadyExisted: false, user };
}

module.exports = seedAdmin;
