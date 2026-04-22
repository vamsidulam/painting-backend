require("dotenv").config();

const { connectDb, disconnectDb } = require("../db");
const User = require("../models/User");
const { hashPassword } = require("../helpers/password");

const SEED = {
  name: "vamsi",
  email: "vamsidulam11@gmail.com",
  phone: "+919949471552",
  role: "admin",
  password: "Vamsidulam@2005121",
};

async function main() {
  await connectDb();

  const email = SEED.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(
      `Admin already exists for ${email} (id: ${existing._id}). Nothing to do.`,
    );
    return;
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

  console.log(`Seeded admin: ${user.email} (id: ${user._id})`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDb();
  });
