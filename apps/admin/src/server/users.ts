import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@repo/db";
import * as z from "zod";
import { orNull } from "@repo/shared";
const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.string().nullable().optional(),
  banned: z.boolean().nullable().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.string().nullable().optional(),
});

const updateUserSchema = userSchema.extend({ id: z.string() }).partial();

export const getUsers = createServerFn({ method: "GET" })
  .inputValidator(z.object({ role: z.string() }))
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const { role } = ctx.data;
    const users = await prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: "desc" },
    });
    return users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      banExpires: orNull(u.banExpires?.toISOString()),
    }));
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
    const prisma = getPrisma();
    const { name, email, role, banned, banReason } = ctx.data;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role,
        banned: banned ?? false,
        banReason: banReason ?? null,
      },
    });

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      banExpires: orNull(user.banExpires?.toISOString()),
    };
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(updateUserSchema)
  .handler(async (ctx) => {
    const prisma = getPrisma();
    const { id, ...data } = ctx.data;

    const user = await prisma.user.update({
      where: { id },
      data,
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
    const prisma = getPrisma();
    await prisma.user.delete({ where: { id: ctx.data.id } });
    return { success: true };
  });
