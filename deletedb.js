const { PrismaClient } = require("@prisma/client");

async function cleanDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log("Starting database cleanup...");

    // Delete records in correct order to respect foreign key constraints
    await prisma.operationRecord.deleteMany({});
    console.log("Deleted operationRecords");

    await prisma.history.deleteMany({});
    console.log("Deleted histories");

    await prisma.operationHistory.deleteMany({});
    console.log("Deleted operationHistories");

    await prisma.device.deleteMany({});
    console.log("Deleted devices");

    await prisma.workFlowEdge.deleteMany({});
    console.log("Deleted workFlowEdges");

    await prisma.workFlowGroup.deleteMany({});
    console.log("Deleted workFlowGroups");

    await prisma.workFlowNode.deleteMany({});
    console.log("Deleted workFlowNodes");

    await prisma.planning.deleteMany({});
    console.log("Deleted plannings");

    await prisma.projectOperation.deleteMany({});
    console.log("Deleted projectOperations");

    await prisma.userExpertise.deleteMany({});
    console.log("Deleted userExpertises");

    await prisma.sprint.deleteMany({});
    console.log("Deleted sprints");

    await prisma.commandProject.deleteMany({});
    console.log("Deleted commandProjects");

    await prisma.post.deleteMany({});
    console.log("Deleted posts");

    await prisma.workFlow.deleteMany({});
    console.log("Deleted workflows");

    await prisma.command.deleteMany({});
    console.log("Deleted commands");

    await prisma.project.deleteMany({});
    console.log("Deleted projects");

    await prisma.operation.deleteMany({});
    console.log("Deleted operations");

    await prisma.expertise.deleteMany({});
    console.log("Deleted expertises");

    await prisma.user.deleteMany({});
    console.log("Deleted users");

    await prisma.organization.deleteMany({});
    console.log("Deleted organizations");

    console.log("Database cleanup completed successfully!");
  } catch (error) {
    console.error("Error during database cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the cleanup
cleanDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
