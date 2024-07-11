import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "@/lib/auth";

export interface NextApiRequestWithOrg extends NextApiRequest {
  organizationId?: string;
}

export function withOrganizationAccess(handler: NextApiHandler) {
  return async (req: NextApiRequestWithOrg, res: NextApiResponse) => {
    try {
      const session = await getServerSession();

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const organizationId = session.user.organization?.id;

      if (!organizationId) {
        return res
          .status(403)
          .json({ error: "User not associated with an organization" });
      }

      req.organizationId = organizationId;

      return handler(req, res);
    } catch (error) {
      console.error("Error in organization access middleware:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
