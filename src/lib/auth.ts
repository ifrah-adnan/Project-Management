"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import env from "./env";
import { User, Organization } from "@prisma/client";
import { db } from "./db";
import bcrypt from "bcrypt";
import { headers } from "next/headers";

export type SessionUser = Omit<User, "password"> & {
  organization: Pick<Organization, "id" | "name"> | null;
};

export type Session = {
  user: SessionUser;
  expires: Date;
};

const secretKey = env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Session) {
  const { expires } = payload;
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

export async function decrypt(input: string): Promise<Session> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as Session;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{
  error?: string;
  user?: SessionUser;
}> {
  const { email, password } = data;
  const user = await db.user.findUnique({
    where: { email },
    include: {
      organization: {
        select: { id: true, name: true },
      },
    },
  });

  if (!user) return { error: "Invalid email or password" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { error: "Invalid email or password" };

  const sessionUser: SessionUser = {
    ...user,
    organization: user.organization
      ? {
          id: user.organization.id,
          name: user.organization.name,
        }
      : null,
  };

  const expires = new Date(Date.now() + env.EXPIRY_TIME * 1_000);
  const session = await encrypt({ user: sessionUser, expires });

  cookies().set("session", session, { expires, httpOnly: true });
  return { user: sessionUser };
}

export async function logout() {
  // Destroy the session
  cookies().delete("session");
  redirect("/sign-in");
}

export async function getServerSession(): Promise<Session | null> {
  try {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    const decryptedSession = await decrypt(session);
    return decryptedSession;
  } catch {
    return null;
  }
}

export async function getSessionAndOrganizationId(): Promise<{
  organizationId: string;
}> {
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  let organizationId: string | null = null;

  // Check if the user is a SYS_ADMIN
  if (session.user.role === "SYS_ADMIN") {
    // Get the organizationId from the URL query parameter
    const headersList = headers();
    const url = new URL(headersList.get("x-url") || "", "http://localhost");
    organizationId = url.searchParams.get("organizationId");
  } else {
    // For non-SYS_ADMIN users, use the organization from their session
    organizationId = session.user.organization?.id || null;
  }

  if (!organizationId) {
    throw new Error("Unauthorized or user not associated with an organization");
  }

  return { organizationId };
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
export async function setOrganizationId(organizationId: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  // For SYS_ADMIN, we don't update the session, just store the organizationId in a cookie
  if (session.user.role === "SYS_ADMIN") {
    cookies().set("selected-organization-id", organizationId, {
      httpOnly: true,
      maxAge: 3600, // 1 hour, adjust as needed
    });
  } else {
    // For other roles, update the session as before
    session.user.organization = { id: organizationId, name: "" }; // You might want to fetch the org name here

    const expiryTimeInSeconds = process.env.EXPIRY_TIME
      ? parseInt(process.env.EXPIRY_TIME, 10)
      : 3600;
    const expires = new Date(Date.now() + expiryTimeInSeconds * 1000);
    const updatedSession = await encrypt({ user: session.user, expires });

    cookies().set("session", updatedSession, { expires, httpOnly: true });
  }
}
