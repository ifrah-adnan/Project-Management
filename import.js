const { PrismaClient } = require("@prisma/client");
const fs = require("fs/promises");
const crypto = require("crypto");

const prisma = new PrismaClient();
function generateRandomCode(length = 8) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}

async function importData() {
  try {
    console.log("Reading JSON file...");
    const jsonData = await fs.readFile("backup.json", "utf8");
    const data = JSON.parse(jsonData);

    console.log("Importing data into the database...");

    // Import Organizations
    if (data.organizations) {
      for (const org of data.organizations) {
        await prisma.organization.create({ data: org });
      }
      console.log("Organizations imported successfully.");
    }

    // Import Users
    if (data.users) {
      for (const user of data.users) {
        await prisma.user.create({ data: user });
      }
      console.log("Users imported successfully.");
    }

    // Import WorkFlows (before Projects)
    if (data.workFlows) {
      for (const workflow of data.workFlows) {
        await prisma.workFlow.create({ data: workflow });
      }
      console.log("WorkFlows imported successfully.");
    }

    // Import Projects
    if (data.projects) {
      for (const project of data.projects) {
        if (project.workFlowId === null || project.workFlowId === undefined) {
          delete project.workFlowId;
        }
        // Generate a random code if it doesn't exist
        if (!project.code) {
          project.code = generateRandomCode();
        }
        await prisma.project.create({ data: project });
      }
      console.log("Projects imported successfully.");
    }

    // Import Commands
    if (data.commands) {
      for (const command of data.commands) {
        await prisma.command.create({ data: command });
      }
      console.log("Commands imported successfully.");
    }

    // Import CommandProjects
    if (data.commandProjects) {
      for (const cp of data.commandProjects) {
        await prisma.commandProject.create({ data: cp });
      }
      console.log("CommandProjects imported successfully.");
    }

    // Import Posts
    if (data.posts) {
      for (const post of data.posts) {
        await prisma.post.create({ data: post });
      }
      console.log("Posts imported successfully.");
    }

    // Import Plannings
    if (data.plannings) {
      for (const planning of data.plannings) {
        await prisma.planning.create({ data: planning });
      }
      console.log("Plannings imported successfully.");
    }

    // Import Sprints
    if (data.sprints) {
      for (const sprint of data.sprints) {
        await prisma.sprint.create({ data: sprint });
      }
      console.log("Sprints imported successfully.");
    }

    // Import Operations (moved before ProjectOperations)
    if (data.operations) {
      for (const operation of data.operations) {
        await prisma.operation.create({ data: operation });
      }
      console.log("Operations imported successfully.");
    }

    // Import ProjectOperations
    if (data.projectOperations) {
      for (const po of data.projectOperations) {
        await prisma.projectOperation.create({ data: po });
      }
      console.log("ProjectOperations imported successfully.");
    }

    // Import WorkFlowNodes
    if (data.workFlowNodes) {
      for (const node of data.workFlowNodes) {
        await prisma.workFlowNode.create({ data: node });
      }
      console.log("WorkFlowNodes imported successfully.");
    }

    // Import WorkFlowEdges
    if (data.workFlowEdges) {
      for (const edge of data.workFlowEdges) {
        await prisma.workFlowEdge.create({ data: edge });
      }
      console.log("WorkFlowEdges imported successfully.");
    }

    // Import OperationHistories
    if (data.operationHistories) {
      for (const history of data.operationHistories) {
        await prisma.operationHistory.create({ data: history });
      }
      console.log("OperationHistories imported successfully.");
    }

    // Import Expertises
    if (data.expertises) {
      for (const expertise of data.expertises) {
        await prisma.expertise.create({ data: expertise });
      }
      console.log("Expertises imported successfully.");
    }

    // Import Histories
    if (data.histories) {
      for (const history of data.histories) {
        await prisma.history.create({ data: history });
      }
      console.log("Histories imported successfully.");
    }

    // Import Devices
    if (data.devices) {
      for (const device of data.devices) {
        await prisma.device.create({ data: device });
      }
      console.log("Devices imported successfully.");
    }

    // Import OperationRecords
    if (data.operationRecords) {
      for (const record of data.operationRecords) {
        await prisma.operationRecord.create({ data: record });
      }
      console.log("OperationRecords imported successfully.");
    }

    console.log("Data import completed successfully.");
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
