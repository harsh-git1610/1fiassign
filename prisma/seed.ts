import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getEmiPlans(price: number) {
  return [
    { tenureMonths: 3, monthlyAmount: Math.round(price / 3), interestRate: 0.0, cashback: 3000 },
    { tenureMonths: 6, monthlyAmount: Math.round(price / 6), interestRate: 0.0, cashback: 2000 },
    { tenureMonths: 12, monthlyAmount: Math.round(price / 12), interestRate: 0.0, cashback: 1500 },
    { tenureMonths: 24, monthlyAmount: Math.round((price * 1.105) / 24), interestRate: 10.5, cashback: null },
    { tenureMonths: 36, monthlyAmount: Math.round((price * 1.105) / 36), interestRate: 10.5, cashback: null },
  ];
}

async function main() {
  console.log("Starting database seeding...");

  // Clean existing records to allow re-seeding safely
  await prisma.emiPlan.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  // 1. iPhone 17 Pro
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 17 Pro",
      slug: "iphone-17-pro",
      brand: "Apple",
      description: "The next-generation iPhone 17 Pro featuring an advanced A19 Pro chip, refined titanium design, and a pro-grade camera system.",
    }
  });

  const iphoneStorages = [
    { storage: "256GB", extraPrice: 0 },
    { storage: "512GB", extraPrice: 20000 },
  ];
  const iphoneColors = [
    { color: "Cosmic Orange", img: "/products/iphone1.png , /products/iphone2.avif , /products/iphone3.avif , /products/iphone4.avif , /products/iphone5.avif" },
    { color: "Deep Blue", img: "/products/iphone_b1.avif , /products/iphone_b2.avif , /products/iphone_b3.avif , /products/iphone_b4.avif , /products/iphone_b5.avif" },
  ];

  for (const s of iphoneStorages) {
    for (const c of iphoneColors) {
      const price = 129900 + s.extraPrice;
      await prisma.variant.create({
        data: {
          productId: iphone.id,
          storage: s.storage,
          color: c.color,
          mrp: price + 5000,
          price: price,
          imageUrl: c.img,
          emiPlans: { create: getEmiPlans(price) },
        },
      });
    }
  }

  // 2. Samsung Galaxy S24 Ultra
  const samsung = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      brand: "Samsung",
      description: "The pinnacle of Galaxy with Galaxy AI, titanium frame, built-in S Pen, and stunning 200MP camera capabilities.",
    }
  });

  const samStorages = [
    { storage: "256GB", extraPrice: 0 },
    { storage: "512GB", extraPrice: 10000 },
  ];
  const samColors = [
    { color: "Titanium Black", img: "/products/s24_1.webp , /products/s24_2.webp , /products/s24_3.webp , /products/s24_4.webp , /products/s24_5.webp" },
    { color: "Titanium Violet", img: "/products/s24v_1.webp , /products/s24v_2.webp , /products/s24v_3.webp , /products/s24v_4.webp , /products/s24v_5.webp" },
  ];

  for (const s of samStorages) {
    for (const c of samColors) {
      const price = 124999 + s.extraPrice;
      await prisma.variant.create({
        data: {
          productId: samsung.id,
          storage: s.storage,
          color: c.color,
          mrp: price + 10000,
          price: price,
          imageUrl: c.img,
          emiPlans: { create: getEmiPlans(price) },
        },
      });
    }
  }

  // 3. Google Pixel 11
  const pixel = await prisma.product.create({
    data: {
      name: "Google Pixel 11",
      slug: "google-pixel-11",
      brand: "Google",
      description: "The next-generation Google Pixel 11 powered by Tensor G6, advanced Gemini on-device AI, revolutionary camera capabilities, and refined premium design.",
    }
  });

  const pixStorages = [
    { storage: "128GB", extraPrice: 0 },
    { storage: "256GB", extraPrice: 10000 },
  ];
  const pixColors = [
    { color: "Frost", img: "/products/gp1.webp , /products/gp2.webp , /products/gp3.webp , /products/gp4.webp , /products/gp5.webp" },
    { color: "Obsidian", img: "/products/gpb1.webp , /products/gpb2.webp , /products/gpb3.webp , /products/gpb4.webp , /products/gpb5.webp" },
  ];

  for (const s of pixStorages) {
    for (const c of pixColors) {
      const price = 99999 + s.extraPrice;
      await prisma.variant.create({
        data: {
          productId: pixel.id,
          storage: s.storage,
          color: c.color,
          mrp: price + 10000,
          price: price,
          imageUrl: c.img,
          emiPlans: { create: getEmiPlans(price) },
        },
      });
    }
  }

  // 4. iPhone 16
  const iphone16 = await prisma.product.create({
    data: {
      name: "iPhone 16",
      slug: "iphone-16",
      brand: "Apple",
      description: "iPhone 16 features the A18 chip, Camera Control button, 48MP Fusion camera, and Action button — all in a beautiful aluminium design with iOS 18.",
    }
  });

  const i16Storages = [
    { storage: "128GB", extraPrice: 0 },
    { storage: "256GB", extraPrice: 10000 },
  ];
  const i16Colors = [
    { color: "Black", img: "/products/ip_1.webp , /products/ip2.webp , /products/ip3.webp , /products/ip4.webp , /products/ip5.webp" },
    { color: "Ultramarine", img: "/products/ipb1.webp , /products/ipb2.webp , /products/ipb3.webp , /products/ipb4.webp , /products/ipb5.webp" },
  ];

  for (const s of i16Storages) {
    for (const c of i16Colors) {
      const price = 79900 + s.extraPrice;
      await prisma.variant.create({
        data: {
          productId: iphone16.id,
          storage: s.storage,
          color: c.color,
          mrp: price + 5000,
          price,
          imageUrl: c.img,
          emiPlans: { create: getEmiPlans(price) },
        },
      });
    }
  }

  console.log(
    `Seeded products successfully:\n- ${iphone.name}\n- ${samsung.name}\n- ${pixel.name}\n- ${iphone16.name}`
  );
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

