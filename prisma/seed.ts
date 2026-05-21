import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve("./prisma/dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });


const IMAGES = {
  office: [
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=500&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop",
  ],
  commercial: [
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=500&fit=crop",
    "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600&h=500&fit=crop",
  ],
  industrial: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=500&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=500&fit=crop",
  ],
  allinone: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=500&fit=crop",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=500&fit=crop",
  ],
};

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPass = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vijaycopiersolutions.com" },
    update: {},
    create: { name: "Vijay Admin", email: "admin@vijaycopiersolutions.com", password: adminPass, role: "ADMIN", phone: "+919951487200" },
  });
  console.log("✅ Admin user created:", admin.email);

  // Demo user
  const userPass = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { name: "Demo User", email: "demo@example.com", password: userPass, role: "USER" },
  });
  console.log("✅ Demo user created:", user.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "office" }, update: {}, create: { name: "Office Machines", slug: "office", description: "Compact & efficient", image: IMAGES.office[0] } }),
    prisma.category.upsert({ where: { slug: "commercial" }, update: {}, create: { name: "Commercial Copiers", slug: "commercial", description: "High volume printing", image: IMAGES.commercial[0] } }),
    prisma.category.upsert({ where: { slug: "industrial" }, update: {}, create: { name: "Industrial Printers", slug: "industrial", description: "Large scale printing", image: IMAGES.industrial[0] } }),
    prisma.category.upsert({ where: { slug: "all-in-one" }, update: {}, create: { name: "All-in-One", slug: "all-in-one", description: "Print, scan & fax", image: IMAGES.allinone[0] } }),
  ]);
  console.log("✅ Categories created:", categories.map(c => c.name).join(", "));

  const [office, commercial, industrial, allinone] = categories;

  // Products
  const products = [
    {
      name: "Xerox WorkCentre 3335 Multifunction Printer",
      slug: "xerox-workcentre-3335",
      description: "The Xerox WorkCentre 3335 is a compact monochrome multifunction printer ideal for small offices. With print speeds up to 35 ppm and advanced connectivity options, it delivers professional-quality output every time. Features automatic duplex printing, mobile printing, and a 110-sheet bypass tray.",
      price: 24999, comparePrice: 32000, stock: 15, sku: "XWC3335-001", brand: "Xerox",
      categoryId: office.id, images: JSON.stringify(IMAGES.office), featured: false, isActive: true, rating: 4.3, reviewCount: 28,
      specifications: JSON.stringify({ "Print Speed": "35 ppm", "Resolution": "1200 x 1200 dpi", "Memory": "512 MB", "Paper Capacity": "300 sheets", "Connectivity": "USB 2.0, Ethernet, WiFi", "Dimensions": "41.5 x 43.5 x 37.1 cm", "Weight": "15.8 kg" }),
    },
    {
      name: "Xerox WorkCentre 7845 Color Multifunction",
      slug: "xerox-workcentre-7845",
      description: "The WorkCentre 7845 is a powerful color multifunction system designed for high-volume workgroups. With ConnectKey technology, it integrates seamlessly into your workflow. Featuring 45 ppm color and mono printing, automatic duplex, and advanced security features.",
      price: 189999, comparePrice: 240000, stock: 5, sku: "XWC7845-001", brand: "Xerox",
      categoryId: commercial.id, images: JSON.stringify(IMAGES.commercial), featured: true, isActive: true, rating: 4.7, reviewCount: 63,
      specifications: JSON.stringify({ "Print Speed": "45 ppm (Color & Mono)", "Resolution": "1200 x 2400 dpi", "Memory": "4 GB RAM + 160 GB HDD", "Max Paper Size": "A3 (297 x 420 mm)", "Connectivity": "Ethernet, WiFi, USB 3.0, NFC", "Monthly Duty Cycle": "Up to 200,000 pages", "Weight": "94 kg" }),
    },
    {
      name: "Xerox B230 Compact Laser Printer",
      slug: "xerox-b230-compact",
      description: "The Xerox B230 is an affordable monochrome laser printer perfect for home offices and small businesses. Fast print speeds, wireless connectivity, and a compact footprint make it the ideal choice for everyday printing needs.",
      price: 12499, comparePrice: 16000, stock: 25, sku: "XB230-001", brand: "Xerox",
      categoryId: office.id, images: JSON.stringify([IMAGES.office[1], IMAGES.office[0]]), featured: false, isActive: true, rating: 4.1, reviewCount: 42,
      specifications: JSON.stringify({ "Print Speed": "32 ppm", "Resolution": "600 x 600 dpi", "Memory": "256 MB", "Paper Capacity": "150 sheets", "Connectivity": "USB 2.0, WiFi", "Mobile Printing": "AirPrint, Mopria", "Weight": "5.1 kg" }),
    },
    {
      name: "Xerox PrimeLink C9065 Production Printer",
      slug: "xerox-primelink-c9065",
      description: "The Xerox PrimeLink C9065 is a high-performance production color printer designed for commercial print environments. With automated workflow solutions and exceptional color accuracy, it handles everything from marketing materials to short-run publications.",
      price: 450000, comparePrice: 550000, stock: 3, sku: "XPLC9065-001", brand: "Xerox",
      categoryId: industrial.id, images: JSON.stringify(IMAGES.industrial), featured: true, isActive: true, rating: 4.9, reviewCount: 18,
      specifications: JSON.stringify({ "Print Speed": "65 ppm", "Resolution": "2400 x 2400 dpi", "Memory": "32 GB RAM + 2 TB SSD", "Max Paper Size": "SRA3 (450 x 320 mm)", "Monthly Duty Cycle": "Up to 1,000,000 pages", "Color Management": "PANTONE certified", "Weight": "390 kg" }),
    },
    {
      name: "Xerox WorkCentre 6515 Color Multifunction",
      slug: "xerox-workcentre-6515",
      description: "The WorkCentre 6515 color multifunction printer delivers vibrant, professional-quality color output at an exceptional value. With built-in Wi-Fi, NFC touch-to-pair, automatic two-sided printing, and mobile printing support.",
      price: 38999, comparePrice: 48000, stock: 12, sku: "XWC6515-001", brand: "Xerox",
      categoryId: allinone.id, images: JSON.stringify(IMAGES.allinone), featured: true, isActive: true, rating: 4.5, reviewCount: 89,
      specifications: JSON.stringify({ "Print Speed": "30 ppm Color, 35 ppm Mono", "Scan Resolution": "600 x 600 dpi", "Paper Capacity": "850 sheets max", "Max Paper Size": "Legal (216 x 356 mm)", "Connectivity": "Ethernet, WiFi, USB, NFC", "Functions": "Print, Copy, Scan, Fax, Email", "Weight": "18.6 kg" }),
    },
    {
      name: "Xerox AltaLink C8130 Enterprise Copier",
      slug: "xerox-altalink-c8130",
      description: "The AltaLink C8130 is Xerox's flagship enterprise multifunction device, engineered for large workgroups and demanding environments. With advanced security, ConnectKey apps, and 30 ppm color printing, it transforms how your team works.",
      price: 285000, comparePrice: 320000, stock: 7, sku: "XALC8130-001", brand: "Xerox",
      categoryId: commercial.id, images: JSON.stringify([IMAGES.commercial[1], IMAGES.commercial[0]]), featured: true, isActive: true, rating: 4.8, reviewCount: 34,
      specifications: JSON.stringify({ "Print Speed": "30 ppm Color & Mono", "Resolution": "1200 x 2400 dpi", "Memory": "8 GB RAM + 250 GB SSD", "Paper Capacity": "2,140 sheets", "Max Paper Size": "A3 (297 x 420 mm)", "Security": "McAfee ePolicy Orchestrator", "Weight": "122 kg" }),
    },
    {
      name: "Xerox VersaLink B405 Monochrome MFP",
      slug: "xerox-versalink-b405",
      description: "The VersaLink B405 is a feature-rich monochrome multifunction printer with an intuitive 5-inch touchscreen and ConnectKey technology. Ideal for mid-sized workgroups looking for robust performance and smart workflow tools.",
      price: 52000, comparePrice: 65000, stock: 9, sku: "XVLB405-001", brand: "Xerox",
      categoryId: allinone.id, images: JSON.stringify([IMAGES.allinone[1], IMAGES.allinone[0]]), featured: false, isActive: true, rating: 4.4, reviewCount: 56,
      specifications: JSON.stringify({ "Print Speed": "47 ppm", "Resolution": "1200 x 1200 dpi", "Paper Capacity": "700 sheets", "Scan Speed": "65 ipm", "Connectivity": "Ethernet, WiFi, USB, NFC", "Display": "5-inch Color Touchscreen", "Weight": "27.5 kg" }),
    },
    {
      name: "Xerox DocuPrint P265 dw Laser Printer",
      slug: "xerox-docuprint-p265dw",
      description: "The DocuPrint P265 dw is an economical wireless monochrome laser printer delivering fast, reliable performance for individuals and small workgroups. Auto-duplex printing and WiFi connectivity make it a smart choice for modern offices.",
      price: 9999, comparePrice: 13000, stock: 30, sku: "XDPP265DW-001", brand: "Xerox",
      categoryId: office.id, images: JSON.stringify(IMAGES.office), featured: false, isActive: true, rating: 3.9, reviewCount: 112,
      specifications: JSON.stringify({ "Print Speed": "28 ppm", "Resolution": "1200 x 1200 dpi", "Memory": "128 MB", "Paper Capacity": "251 sheets", "Connectivity": "USB 2.0, WiFi 802.11 b/g/n", "Mobile Printing": "Google Cloud Print, AirPrint", "Weight": "6.7 kg" }),
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`✅ Product: ${p.name}`);
  }

  // Sample reviews
  const dbProducts = await prisma.product.findMany({ take: 4 });
  for (const product of dbProducts) {
    const existing = await prisma.review.findFirst({ where: { userId: user.id, productId: product.id } });
    if (!existing) {
      await prisma.review.create({
        data: { userId: user.id, productId: product.id, rating: 5, title: "Excellent machine!", comment: "Bought this for our office and it has been working flawlessly. Delivery was fast and installation support was excellent. Highly recommended!" },
      });
    }
  }

  // Demo address
  const existingAddr = await prisma.address.findFirst({ where: { userId: user.id } });
  if (!existingAddr) {
    await prisma.address.create({
      data: { userId: user.id, fullName: "Demo User", phone: "+919951487200", street: "Kukatpally Housing Board Colony, Phase 1", city: "Hyderabad", state: "Telangana", zip: "500072", country: "India", isDefault: true },
    });
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin: admin@vijaycopiersolutions.com / admin123");
  console.log("   User:  demo@example.com / user123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
