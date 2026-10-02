const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("./models/Admin");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "raunakkchy@gmail.com";
    const existing = await Admin.findOne({ email });
    if (!existing) {
      await Admin.create({
        name: "College Admin",
        email,
        password: await bcrypt.hash("Raunak@777", 10),
        role: "admin"
      });
      console.log("Default admin created");
    } else {
      console.log("Default admin already exists");
    }
  } catch (e) {
    console.error(e.message);
  } finally {
    await mongoose.disconnect();
  }
})();
