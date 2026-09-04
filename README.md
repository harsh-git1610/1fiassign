# 1Fi SDE1 Assignment - E-commerce EMI Product Page

A full-stack web application built for the 1Fi SDE1 Assignment. It dynamically displays products with their variants (storage/color) and fetches associated EMI plans from a PostgreSQL database.

Explainer Video : [https://drive.google.com/file/d/1RJi8Cpz5BvGneH32bUcx6j8_26vAGBtO/view]

## 🛠️ Tech Stack Used

- **Frontend:** React 19, Next.js 16 (App Router), Tailwind CSS v4
- **Backend:** Next.js Route Handlers (Node.js)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma

---

## 🚀 Setup and Run Instructions

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v20 or higher recommended)
- npm or yarn

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/harsh-git1610/1fiassign
cd 1fiassign
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
```

### 4. Database Setup
Push the schema to your database and seed it with the mock data:
```bash
npx prisma db push
npx prisma db seed
```
*(This will populate the database with the iPhone 17 Pro, Samsung Galaxy S24 Ultra, and Google Pixel 11, along with their variants and EMI plans).*

### 5. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints and Example Responses

### `GET /api/products`
Retrieves a list of all products with their starting price and thumbnail image. Used to populate the home page grid.

**Example Response:**
```json
[
  {
    "id": "cm0m7xxxx0000",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "thumbnail": "/products/iphone1.png",
    "startingPrice": 129900
  }
]
```

### `GET /api/products/[slug]`
Retrieves full details for a specific product, including all its variants (colors and storage options) and their associated EMI plans.

**Example Response:**
```json
{
  "id": "cm0m7xxxx0000",
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "description": "The next-generation iPhone...",
  "variants": [
    {
      "id": "cm0m7yyyy0000",
      "storage": "256GB",
      "color": "Cosmic Orange",
      "mrp": 134900,
      "price": 129900,
      "imageUrl": "/products/iphone1.png , /products/iphone2.avif",
      "emiPlans": [
        {
          "id": "cm0m7zzzz0000",
          "tenureMonths": 3,
          "monthlyAmount": 43300,
          "interestRate": 0,
          "cashback": 3000
        }
      ]
    }
  ]
}
```

---

## 🗄️ Schema Used

The database is built using Prisma with the following schema:

```prisma
model Product {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  brand       String
  description String?
  createdAt   DateTime  @default(now())
  variants    Variant[]
}

model Variant {
  id        String    @id @default(cuid())
  productId String
  storage   String?
  color     String?
  mrp       Int
  price     Int
  imageUrl  String
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  emiPlans  EmiPlan[]
}

model EmiPlan {
  id            String  @id @default(cuid())
  variantId     String
  monthlyAmount Int
  tenureMonths  Int
  interestRate  Float
  cashback      Int?
  variant       Variant @relation(fields: [variantId], references: [id], onDelete: Cascade)
}
```
