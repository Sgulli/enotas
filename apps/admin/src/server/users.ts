import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { getPrisma } from "@repo/db";
import * as z from "zod";
import { orNull } from "@repo/shared";
import { auth } from "@repo/auth";
import { randomBytes } from "node:crypto";
import { paginationSchema } from "#/lib/pagination";
import { buildFilterQuery } from "#/lib/utils";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.enum(["admin", "user"]),
  banned: z.boolean().nullable().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.string().nullable().optional(),
});

const updateUserSchema = userSchema.extend({ id: z.string() }).partial();

const getUsersSchema = paginationSchema.extend({
  role: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});

export const getUsers = createServerFn({ method: "GET" })
  .inputValidator(getUsersSchema)
  .handler(async (ctx) => {
    const { role, page, pageSize, sortBy, sortDirection } = ctx.data;
    const offset = (page - 1) * pageSize;
    const headers = getRequestHeaders();

    const query = {
      ...(role ? buildFilterQuery("role", "eq", role) : {}),
      limit: pageSize,
      offset,
      ...(sortBy ? { sortBy, sortDirection } : {}),
    };

    const { users, total } = await auth.api.listUsers({
      query,
      headers,
    });

    return {
      users: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        banExpires: orNull(u.banExpires?.toISOString()),
      })),
      total,
      page,
      pageSize,
    };
  });

export const getUserCount = createServerFn({ method: "GET" })
  .inputValidator(z.object({ role: z.string() }))
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const { role } = ctx.data;
    return prisma.user.count({ where: { role } });
  });

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(userSchema)
  .handler(async (ctx) => {
    const { name, email, role } = ctx.data;
    const password = randomBytes(16).toString("hex");
    const headers = getRequestHeaders();

    const { user } = await auth.api.createUser({
      body: { email, password, name },
      headers,
    });

    await auth.api.setRole({
      body: { userId: user.id, role },
      headers,
    });

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(updateUserSchema)
  .handler(async (ctx) => {
    const { id, ...data } = ctx.data;
    const headers = getRequestHeaders();

    const user = await auth.api.adminUpdateUser({
      body: { userId: id, data },
      headers,
    });

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      banExpires: orNull(user.banExpires?.toISOString()),
    };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .inputValidator(updateUserSchema.pick({ id: true }))
  .handler(async (ctx) => {
    const headers = getRequestHeaders();

    await auth.api.removeUser({
      body: { userId: ctx.data.id },
      headers,
    });

    return { success: true };
  });
