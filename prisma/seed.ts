import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean existing records to allow re-seeding safely
  await prisma.emiPlan.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  // 1. iPhone 17 Pro (Apple)
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 17 Pro",
      slug: "iphone-17-pro",
      brand: "Apple",
      description:
        "The next-generation iPhone 17 Pro featuring an advanced A19 Pro chip, refined titanium design, and a pro-grade camera system.",
      variants: {
        create: [
          {
            storage: "256GB",
            color: "Natural Titanium",
            mrp: 134900,
            price: 129900,
            imageUrl:
              "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  monthlyAmount: 43300,
                  interestRate: 0.0,
                  cashback: 3000,
                },
                {
                  tenureMonths: 6,
                  monthlyAmount: 21650,
                  interestRate: 0.0,
                  cashback: 2000,
                },
                {
                  tenureMonths: 12,
                  monthlyAmount: 10825,
                  interestRate: 0.0,
                  cashback: 1500,
                },
                {
                  tenureMonths: 24,
                  monthlyAmount: 6023,
                  interestRate: 10.5,
                  cashback: null,
                },
                {
                  tenureMonths: 36,
                  monthlyAmount: 4220,
                  interestRate: 10.5,
                  cashback: null,
                },
              ],
            },
          },
          {
            storage: "512GB",
            color: "Deep Blue",
            mrp: 154900,
            price: 149900,
            imageUrl:
              "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  monthlyAmount: 49967,
                  interestRate: 0.0,
                  cashback: 3500,
                },
                {
                  tenureMonths: 6,
                  monthlyAmount: 24983,
                  interestRate: 0.0,
                  cashback: 2500,
                },
                {
                  tenureMonths: 12,
                  monthlyAmount: 12492,
                  interestRate: 0.0,
                  cashback: 2000,
                },
                {
                  tenureMonths: 24,
                  monthlyAmount: 6951,
                  interestRate: 10.5,
                  cashback: null,
                },
                {
                  tenureMonths: 36,
                  monthlyAmount: 4869,
                  interestRate: 10.5,
                  cashback: null,
                },
                {
                  tenureMonths: 48,
                  monthlyAmount: 3835,
                  interestRate: 10.5,
                  cashback: null,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Samsung Galaxy S24 Ultra (Samsung)
  const samsung = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      brand: "Samsung",
      description:
        "The pinnacle of Galaxy with Galaxy AI, titanium frame, built-in S Pen, and stunning 200MP camera capabilities.",
      variants: {
        create: [
          {
            storage: "256GB",
            color: "Titanium Gray",
            mrp: 134999,
            price: 124999,
            imageUrl:
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  monthlyAmount: 41666,
                  interestRate: 0.0,
                  cashback: 4000,
                },
                {
                  tenureMonths: 6,
                  monthlyAmount: 20833,
                  interestRate: 0.0,
                  cashback: 3000,
                },
                {
                  tenureMonths: 12,
                  monthlyAmount: 10417,
                  interestRate: 0.0,
                  cashback: 2000,
                },
                {
                  tenureMonths: 24,
                  monthlyAmount: 5795,
                  interestRate: 10.5,
                  cashback: 1000,
                },
                {
                  tenureMonths: 36,
                  monthlyAmount: 4061,
                  interestRate: 10.5,
                  cashback: null,
                },
              ],
            },
          },
          {
            storage: "512GB",
            color: "Titanium Black",
            mrp: 144999,
            price: 134999,
            imageUrl:
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  monthlyAmount: 44999,
                  interestRate: 0.0,
                  cashback: 4000,
                },
                {
                  tenureMonths: 6,
                  monthlyAmount: 22499,
                  interestRate: 0.0,
                  cashback: 3000,
                },
                {
                  tenureMonths: 12,
                  monthlyAmount: 11250,
                  interestRate: 0.0,
                  cashback: 2500,
                },
                {
                  tenureMonths: 24,
                  monthlyAmount: 6259,
                  interestRate: 10.5,
                  cashback: 1000,
                },
                {
                  tenureMonths: 36,
                  monthlyAmount: 4386,
                  interestRate: 10.5,
                  cashback: null,
                },
                {
                  tenureMonths: 48,
                  monthlyAmount: 3453,
                  interestRate: 10.5,
                  cashback: null,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. Google Pixel 9 Pro (Google)
  const pixel = await prisma.product.create({
    data: {
      name: "Google Pixel 9 Pro",
      slug: "google-pixel-9-pro",
      brand: "Google",
      description:
        "Engineered by Google with Gemini onboard, cutting-edge camera sensors, and elegant pro-level styling.",
      variants: {
        create: [
          {
            storage: "128GB",
            color: "Obsidian",
            mrp: 109999,
            price: 99999,
            imageUrl:
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  monthlyAmount: 33333,
                  interestRate: 0.0,
                  cashback: 3000,
                },
                {
                  tenureMonths: 6,
                  monthlyAmount: 16667,
                  interestRate: 0.0,
                  cashback: 2000,
                },
                {
                  tenureMonths: 12,
                  monthlyAmount: 8333,
                  interestRate: 0.0,
                  cashback: 1500,
                },
                {
                  tenureMonths: 24,
                  monthlyAmount: 4636,
                  interestRate: 10.5,
                  cashback: 500,
                },
                {
                  tenureMonths: 36,
                  monthlyAmount: 3249,
                  interestRate: 10.5,
                  cashback: null,
                },
              ],
            },
          },
          {
            storage: "256GB",
            color: "Porcelain",
            mrp: 119999,
            price: 109999,
            imageUrl:
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
            emiPlans: {
              create: [
                {
                  tenureMonths: 3,
                  monthlyAmount: 36666,
                  interestRate: 0.0,
                  cashback: 3500,
                },
                {
                  tenureMonths: 6,
                  monthlyAmount: 18333,
                  interestRate: 0.0,
                  cashback: 2500,
                },
                {
                  tenureMonths: 12,
                  monthlyAmount: 9167,
                  interestRate: 0.0,
                  cashback: 2000,
                },
                {
                  tenureMonths: 24,
                  monthlyAmount: 5100,
                  interestRate: 10.5,
                  cashback: 500,
                },
                {
                  tenureMonths: 36,
                  monthlyAmount: 3574,
                  interestRate: 10.5,
                  cashback: null,
                },
                {
                  tenureMonths: 48,
                  monthlyAmount: 2814,
                  interestRate: 10.5,
                  cashback: null,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(
    `Seeded products successfully:\n- ${iphone.name}\n- ${samsung.name}\n- ${pixel.name}`
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
