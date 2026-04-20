import { getPrisma } from "./prisma.js";
import { hashPassword } from "better-auth/crypto";
import { Prisma } from "./generated/prisma/client.js";

const prisma = getPrisma();

async function seed() {
  console.time("seed");

  const passwordHash = await hashPassword("test123!");

  const adminUser = await prisma.user.upsert({
    where: { id: "admin-seed-001" },
    update: {},
    create: {
      id: "admin-seed-001",
      name: "Admin Test",
      email: "test@test.it",
      emailVerified: true,
      role: "admin",
      banned: false,
    },
  });

  await prisma.account.upsert({
    where: { id: "account-seed-001" },
    update: {},
    create: {
      id: "account-seed-001",
      accountId: "test@test.it",
      providerId: "credential",
      userId: adminUser.id,
      password: passwordHash,
    },
  });

  console.log("✅ Seeded admin user:", adminUser.email);

  const categories = await seedCategories();
  await seedProducts(categories);
  await seedOrders(adminUser.id);
  await seedCarts(adminUser.id);

  console.timeEnd("seed");
}

async function seedCategories() {
  const data = [
    { id: "cat-1", name: "Eletrônicos", slug: "eletronicos", description: "Produtos eletrônicos e tecnologia" },
    { id: "cat-2", name: "Livros", slug: "livros", description: "Livros físicos e digitais" },
    { id: "cat-3", name: "Roupas", slug: "roupas", description: "Moda e vestuário" },
    { id: "cat-4", name: "Casa e Jardim", slug: "casa-e-jardim", description: "Artigos para casa e jardim" },
    { id: "cat-5", name: "Esportes", slug: "esportes", description: "Equipamentos e acessórios esportivos" },
  ];

  for (const cat of data) {
    await prisma.categories.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
  }

  console.log(`✅ Seeded ${data.length} categories`);
  return data;
}

async function seedProducts(categories: { id: string }[]) {
  const productData = [
    { id: "prod-1", name: 'Notebook Pro 15"', slug: "notebook-pro-15", description: "Notebook de alto desempenho", price: 4999.99, compareAtPrice: 5499.99, sku: "NB-PRO-15", inventory: 50, categoryId: categories[0]!.id },
    { id: "prod-2", name: "Smartphone X200", slug: "smartphone-x200", description: "Smartphone com câmera de 108MP", price: 2499.0, compareAtPrice: 2799.0, sku: "SM-X200", inventory: 120, categoryId: categories[0]!.id },
    { id: "prod-3", name: "Fone Bluetooth Noise", slug: "fone-bluetooth-noise", description: "Fone de ouvido sem fio com cancelamento de ruído", price: 349.9, sku: "FB-NOISE", inventory: 200, categoryId: categories[0]!.id },
    { id: "prod-4", name: "O Código Limpo", slug: "codigo-limpo", description: "Livro sobre boas práticas de programação", price: 79.9, sku: "LV-CL", inventory: 300, categoryId: categories[1]!.id },
    { id: "prod-5", name: "Camiseta Básica Preta", slug: "camiseta-basica-preta", description: "Camiseta 100% algodão", price: 49.9, sku: "RP-CBP", inventory: 500, categoryId: categories[2]!.id },
    { id: "prod-6", name: "Mochila Esportiva Trail", slug: "mochila-esportiva-trail", description: "Mochila resistente à água para trilhas", price: 189.9, sku: "ES-MTR", inventory: 75, categoryId: categories[4]!.id },
    { id: "prod-7", name: 'Monitor Ultrawide 34"', slug: "monitor-ultrawide-34", description: "Monitor curvo para produtividade", price: 2899.0, compareAtPrice: 3299.0, sku: "MN-UW34", inventory: 30, categoryId: categories[0]!.id },
    { id: "prod-8", name: "Vaso Decorativo Cerâmica", slug: "vaso-decorativo-ceramica", description: "Vaso artesanal para decoração", price: 129.9, sku: "CJ-VDC", inventory: 100, categoryId: categories[3]!.id },
  ];

  for (const p of productData) {
    await prisma.products.upsert({
      where: { id: p.id },
      update: {},
      create: {
        ...p,
        compareAtPrice: p.compareAtPrice ?? null,
      },
    });
  }

  console.log(`✅ Seeded ${productData.length} products`);
}

async function seedOrders(userId: string) {
  const orders = [
    {
      id: "order-1", userId, status: "delivered", total: 5299.89, subtotal: 5079.89, tax: 220.0, shippingCost: 0,
      shippingAddress: { street: "Rua Teste, 123", city: "São Paulo", state: "SP", zip: "01001-000" },
      billingAddress: { street: "Rua Teste, 123", city: "São Paulo", state: "SP", zip: "01001-000" },
      items: [
        { id: "oi-1", productId: "prod-1", quantity: 1, price: 4999.99 },
        { id: "oi-2", productId: "prod-4", quantity: 1, price: 79.9 },
        { id: "oi-3", productId: "prod-5", quantity: 1, price: 49.9 },
      ],
    },
    {
      id: "order-2", userId, status: "shipped", total: 3189.8, subtotal: 3049.8, tax: 140.0, shippingCost: 0,
      shippingAddress: { street: "Av. Brasília, 456", city: "Rio de Janeiro", state: "RJ", zip: "20001-000" },
      billingAddress: { street: "Av. Brasília, 456", city: "Rio de Janeiro", state: "RJ", zip: "20001-000" },
      items: [
        { id: "oi-4", productId: "prod-7", quantity: 1, price: 2899.0 },
        { id: "oi-5", productId: "prod-3", quantity: 1, price: 349.9 },
      ],
    },
    {
      id: "order-3", userId, status: "pending", total: 169.9, subtotal: 169.9, tax: 0, shippingCost: 0,
      shippingAddress: Prisma.JsonNull,
      billingAddress: Prisma.JsonNull,
      items: [{ id: "oi-6", productId: "prod-8", quantity: 1, price: 129.9 }],
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {},
      create: {
        id: order.id, userId, status: order.status, total: order.total, subtotal: order.subtotal,
        tax: order.tax, shippingCost: order.shippingCost,
        shippingAddress: order.shippingAddress, billingAddress: order.billingAddress,
      },
    });

    for (const item of order.items) {
      await prisma.orderItems.upsert({
        where: { id: item.id },
        update: {},
        create: { id: item.id, orderId: order.id, productId: item.productId, quantity: item.quantity, price: item.price },
      });
    }
  }

  console.log(`✅ Seeded ${orders.length} orders`);
}

async function seedCarts(userId: string) {
  const cart = await prisma.cart.upsert({
    where: { id: "cart-1" },
    update: {},
    create: { id: "cart-1", userId },
  });

  const cartItems = [
    { id: "ci-1", cartId: cart.id, productId: "prod-2", quantity: 1 },
    { id: "ci-2", cartId: cart.id, productId: "prod-6", quantity: 2 },
  ];

  for (const item of cartItems) {
    await prisma.cartItems.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  console.log(`✅ Seeded 1 cart with ${cartItems.length} items`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});