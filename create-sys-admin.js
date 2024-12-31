const { PrismaClient } = require("@prisma/client");

const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function createSysAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "SYS_ADMIN" },
    });

    if (existingAdmin) {
      console.log("SYS_ADMIN already exists. Skipping creation.");
      return;
    }

    const hashedPassword = await bcrypt.hash("20242024", 10);
    const newAdmin = await prisma.user.create({
      data: {
        email: "sysadmin@gmail.com",
        name: "System Administrator",
        role: "SYS_ADMIN",
        password: hashedPassword,
        attributes: {},
      },
    });

    console.log("SYS_ADMIN created successfully:", newAdmin.email);
  } catch (error) {
    console.error("Error creating SYS_ADMIN:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSysAdmin();
