const { PrismaClient } = require("@prisma/client");
const fs = require("fs/promises");

const prisma = new PrismaClient();

async function backupData() {
  try {
    console.log("Starting database backup...");

    // Fetch data from all tables
    const organizations = await prisma.organization.findMany();
    const users = await prisma.user.findMany();
    const projects = await prisma.project.findMany();
    const commands = await prisma.command.findMany();
    const commandProjects = await prisma.commandProject.findMany();
    const posts = await prisma.post.findMany();
    const plannings = await prisma.planning.findMany();
    const sprints = await prisma.sprint.findMany();
    const projectOperations = await prisma.projectOperation.findMany();
    const operations = await prisma.operation.findMany();
    const workFlowNodes = await prisma.workFlowNode.findMany();
    const workFlowEdges = await prisma.workFlowEdge.findMany();
    const workFlows = await prisma.workFlow.findMany();
    const operationHistories = await prisma.operationHistory.findMany();
    const expertises = await prisma.expertise.findMany();
    const histories = await prisma.history.findMany();
    const devices = await prisma.device.findMany();
    const operationRecords = await prisma.operationRecord.findMany();

    // Combine all data into a single object
    const backupData = {
      organizations,
      users,
      projects,
      commands,
      commandProjects,
      posts,
      plannings,
      sprints,
      projectOperations,
      operations,
      workFlowNodes,
      workFlowEdges,
      workFlows,
      operationHistories,
      expertises,
      histories,
      devices,
      operationRecords,
    };

    // Create timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `backup-${timestamp}.json`;

    // Write data to a JSON file with timestamp
    await fs.writeFile(fileName, JSON.stringify(backupData, null, 2));

    console.log(`Backup completed successfully. Data saved to ${fileName}`);
  } catch (error) {
    console.error("Error during backup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backupData();
