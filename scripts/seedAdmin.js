require("dotenv").config();

const { connectDb, disconnectDb } = require("../db");
const { seedAdmin } = require("../services/seed");

async function main() {
  await connectDb();
  const { alreadyExisted, user } = await seedAdmin();
  if (alreadyExisted) {
    console.log(
      `Admin already exists for ${user.email} (id: ${user._id}). Nothing to do.`,
    );
  } else {
    console.log(`Seeded admin: ${user.email} (id: ${user._id})`);
  }
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDb();
  });
