const ServiceCategory = require("../../models/ServiceCategory");

const DEFAULTS = [
  {
    name: "Interior",
    description:
      "Inside your home — living rooms, bedrooms, kitchens, and more.",
  },
  {
    name: "Exterior",
    description: "Outside walls, façades, and weather-proof finishes.",
  },
];

async function seedServiceCategories() {
  const created = [];
  const skipped = [];

  for (const entry of DEFAULTS) {
    const existing = await ServiceCategory.findOne({
      name: new RegExp(`^${entry.name}$`, "i"),
    });
    if (existing) {
      skipped.push(existing);
      continue;
    }
    const cat = await ServiceCategory.create({
      name: entry.name,
      description: entry.description,
      image: "",
      isActive: true,
    });
    created.push(cat);
  }

  return { created, skipped };
}

module.exports = seedServiceCategories;
