const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log("Starting database clearing process...");

    // Clear all tables in reverse order of their dependencies
    await prisma.operationRecord.deleteMany();
    await prisma.device.deleteMany();
    await prisma.history.deleteMany();
    await prisma.operationHistory.deleteMany();
    await prisma.workFlowEdge.deleteMany();
    await prisma.workFlowNode.deleteMany();
    await prisma.workFlow.deleteMany();
    await prisma.projectOperation.deleteMany();
    await prisma.planning.deleteMany();
    await prisma.sprint.deleteMany();
    await prisma.commandProject.deleteMany();
    await prisma.post.deleteMany();
    await prisma.expertise.deleteMany();
    await prisma.operation.deleteMany();
    await prisma.command.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    console.log("All data has been cleared from the database.");
  } catch (error) {
    console.error("Error clearing the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
