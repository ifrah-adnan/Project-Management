const { PrismaClient } = require("@prisma/client");
const fs = require("fs/promises");

const prisma = new PrismaClient();

const fileName = process.argv[2] || "backup.json";

async function importData(filename) {
  try {
    console.log(`Starting data import from ${filename}...`);

    // Check if file exists
    try {
      await fs.access(filename);
    } catch (error) {
      console.error(`Error: File ${filename} not found`);
      process.exit(1);
    }

    // Read the backup file
    const data = JSON.parse(await fs.readFile(filename, "utf8"));
    // Import data in the correct order to respect foreign key constraints
    console.log("Importing organizations...");
    for (const org of data.organizations) {
      await prisma.organization.create({
        data: {
          id: org.id,
          name: org.name,
          description: org.description,
          imagePath: org.imagePath,
          address: org.address,
          latitude: org.latitude,
          longitude: org.longitude,
          createdAt: new Date(org.createdAt),
          updatedAt: new Date(org.updatedAt),
        },
      });
    }

    console.log("Importing users...");
    for (const user of data.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          password: user.password,
          image: user.image,
          phone: user.phone,
          attributes: user.attributes,
          organizationId: user.organizationId,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    }

    console.log("Importing expertises...");
    for (const expertise of data.expertises) {
      await prisma.expertise.create({
        data: {
          id: expertise.id,
          name: expertise.name,
          description: expertise.description,
          code: expertise.code,
          organizationId: expertise.organizationId,
          createdAt: new Date(expertise.createdAt),
          updatedAt: new Date(expertise.updatedAt),
        },
      });
    }

    console.log("Importing operations...");
    for (const operation of data.operations) {
      await prisma.operation.create({
        data: {
          id: operation.id,
          name: operation.name,
          code: operation.code,
          icon: operation.icon,
          organizationId: operation.organizationId,
          description: operation.description,
          isFinal: operation.isFinal,
          expertiseId: operation.expertiseId,
          createdAt: new Date(operation.createdAt),
          updatedAt: new Date(operation.updatedAt),
        },
      });
    }

    console.log("Importing workflows...");
    for (const workflow of data.workFlows) {
      await prisma.workFlow.create({
        data: {
          id: workflow.id,
          createdAt: new Date(workflow.createdAt),
          updatedAt: new Date(workflow.updatedAt),
        },
      });
    }

    console.log("Importing projects...");
    for (const project of data.projects) {
      await prisma.project.create({
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          code: project.code,
          status: project.status,
          organizationId: project.organizationId,
          workFlowId: project.workFlowId,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        },
      });
    }

    console.log("Importing workflow nodes...");
    for (const node of data.workFlowNodes) {
      await prisma.workFlowNode.create({
        data: {
          id: node.id,
          workFlowId: node.workFlowId,
          operationId: node.operationId,
          data: node.data,
          createdAt: new Date(node.createdAt),
          updatedAt: new Date(node.updatedAt),
        },
      });
    }

    console.log("Importing workflow edges...");
    for (const edge of data.workFlowEdges) {
      await prisma.workFlowEdge.create({
        data: {
          id: edge.id,
          sourceId: edge.sourceId,
          targetId: edge.targetId,
          workFlowId: edge.workFlowId,
          data: edge.data,
          count: edge.count,
          createdAt: new Date(edge.createdAt),
          updatedAt: new Date(edge.updatedAt),
        },
      });
    }

    console.log("Importing commands...");
    for (const command of data.commands) {
      await prisma.command.create({
        data: {
          id: command.id,
          userId: command.userId,
          reference: command.reference,
          clientId: command.clientId,
          organizationId: command.organizationId,
          createdAt: new Date(command.createdAt),
          updatedAt: new Date(command.updatedAt),
        },
      });
    }

    console.log("Importing command projects...");
    for (const cp of data.commandProjects) {
      await prisma.commandProject.create({
        data: {
          id: cp.id,
          userId: cp.userId,
          commandId: cp.commandId,
          projectId: cp.projectId,
          organizationId: cp.organizationId,
          target: cp.target,
          done: cp.done,
          startDate: cp.startDate ? new Date(cp.startDate) : null,
          endDate: new Date(cp.endDate),
          status: cp.status,
          createdAt: new Date(cp.createdAt),
          updatedAt: new Date(cp.updatedAt),
        },
      });
    }

    console.log("Importing posts...");
    for (const post of data.posts) {
      await prisma.post.create({
        data: {
          id: post.id,
          userId: post.userId,
          name: post.name,
          description: post.description,
          operationId: post.operationId,
          organizationId: post.organizationId,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        },
      });
    }

    console.log("Importing plannings...");
    for (const planning of data.plannings) {
      await prisma.planning.create({
        data: {
          id: planning.id,
          operatorId: planning.operatorId,
          postId: planning.postId,
          operationId: planning.operationId,
          commandProjectId: planning.commandProjectId,
          startDate: new Date(planning.startDate),
          endDate: new Date(planning.endDate),
          createdAt: new Date(planning.createdAt),
          updatedAt: new Date(planning.updatedAt),
        },
      });
    }

    console.log("Importing remaining data...");
    // Import the rest of the data in the correct order
    for (const device of data.devices) {
      await prisma.device.create({
        data: {
          id: device.id,
          userId: device.userId,
          deviceId: device.deviceId,
          planningId: device.planningId,
          postId: device.postId,
          count: device.count,
          organizationId: device.organizationId,
          createdAt: new Date(device.createdAt),
        },
      });
    }

    console.log("Import completed successfully!");
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importData(fileName);
