import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean old data to prevent duplication
  await prisma.reviewHelpfulVote.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.restaurantImage.deleteMany();
  await prisma.restaurant.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cowork.uz" },
    update: {},
    create: {
      email: "admin@cowork.uz",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user@cowork.uz" },
    update: {},
    create: {
      email: "user@cowork.uz",
      name: "John Doe",
      password: userPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "alice@cowork.uz" },
    update: {},
    create: {
      email: "alice@cowork.uz",
      name: "Alice Smith",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ Users created");

  // Create restaurants with rich images
  const restaurants = [
    {
      name: "Central Asian Plov Center",
      description: "Authentic Uzbek plov cooked in traditional giant kazans with fresh mutton, yellow carrots, barberries, and quail eggs. Family recipes passed down through generations.",
      category: "Uzbek",
      address: "Amir Temur Avenue 107, Tashkent",
      phone: "+998 71 234 5678",
      openingHours: "Mon-Sun: 10:00-22:00",
      priceLevel: "MODERATE",
      latitude: 41.311151,
      longitude: 69.279737,
      avgRating: 4.8,
      reviewCount: 0,
      createdById: user1.id,
      images: [
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Sakura Sushi Bar",
      description: "Fresh Atlantic salmon sushi, tuna sashimi, and artisan maki rolls prepared by master Japanese chefs. Minimalist modern ambiance with traditional flavors.",
      category: "Japanese",
      address: "Mustaqillik Avenue 45, Tashkent",
      phone: "+998 71 345 6789",
      openingHours: "Mon-Sun: 12:00-23:00",
      priceLevel: "EXPENSIVE",
      latitude: 41.315333,
      longitude: 69.249772,
      avgRating: 4.6,
      reviewCount: 0,
      createdById: user2.id,
      images: [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Mama Roma Pizzeria",
      description: "Wood-fired authentic Neapolitan pizza made with Caputo flour, San Marzano tomatoes, and fresh Fior di Latte mozzarella imported directly from Italy.",
      category: "Italian",
      address: "Shota Rustaveli 15, Tashkent",
      phone: "+998 71 456 7890",
      openingHours: "Mon-Sun: 11:00-23:00",
      priceLevel: "MODERATE",
      latitude: 41.322916,
      longitude: 69.288146,
      avgRating: 4.5,
      reviewCount: 0,
      createdById: user1.id,
      images: [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Seoul House Korean BBQ",
      description: "Premium tabletop Korean BBQ with Wagyu beef, marinated galbi, fresh kimchi, and over 10 varieties of authentic banchan side dishes.",
      category: "Korean",
      address: "Buyuk Ipak Yoli 9, Tashkent",
      phone: "+998 71 567 8901",
      openingHours: "Mon-Sun: 12:00-00:00",
      priceLevel: "EXPENSIVE",
      latitude: 41.299496,
      longitude: 69.240074,
      avgRating: 4.7,
      reviewCount: 0,
      createdById: user2.id,
      images: [
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Fast Burger Tashkent",
      description: "Handcrafted smash burgers on brioche buns, loaded seasoned fries, and thick artisanal milkshakes. Fast, juicy, and satisfying lunch break spot.",
      category: "Fast Food",
      address: "Uzbekistan Avenue 78, Tashkent",
      phone: "+998 71 678 9012",
      openingHours: "Mon-Sun: 09:00-22:00",
      priceLevel: "BUDGET",
      latitude: 41.338296,
      longitude: 69.289932,
      avgRating: 4.2,
      reviewCount: 0,
      createdById: user1.id,
      images: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Café Aroma & Bakery",
      description: "Cozy specialty coffee shop with single-origin pour-overs, delicate French croissants, and high-speed Wi-Fi designed for remote work and relaxing mornings.",
      category: "Cafe",
      address: "Mirabad district, Tashkent",
      phone: "+998 71 789 0123",
      openingHours: "Mon-Sun: 08:00-21:00",
      priceLevel: "BUDGET",
      latitude: 41.286151,
      longitude: 69.244537,
      avgRating: 4.4,
      reviewCount: 0,
      createdById: user2.id,
      images: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Dragon Wok Chinese",
      description: "Steaming bamboo dim sum baskets, fiery Sichuan kung pao chicken, and hand-pulled noodles prepared in open flame woks by certified Chinese chefs.",
      category: "Chinese",
      address: "Chilanzar 10, Tashkent",
      phone: "+998 71 890 1234",
      openingHours: "Mon-Sun: 11:00-23:00",
      priceLevel: "MODERATE",
      latitude: 41.276583,
      longitude: 69.202614,
      avgRating: 4.3,
      reviewCount: 0,
      createdById: user1.id,
      images: [
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Steakhouse Prime",
      description: "Dry-aged Black Angus ribeyes and tender filets cooked over natural oak wood charcoal. Extensive vintage wine cellar with sommeliers on hand.",
      category: "Steakhouse",
      address: "Tashkent City, Tashkent",
      phone: "+998 71 901 2345",
      openingHours: "Mon-Sun: 17:00-00:00",
      priceLevel: "LUXURY",
      latitude: 41.326418,
      longitude: 69.282358,
      avgRating: 4.9,
      reviewCount: 0,
      createdById: user2.id,
      images: [
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  for (const item of restaurants) {
    const { images, ...restaurantData } = item;
    await prisma.restaurant.create({
      data: {
        ...restaurantData,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log("✅ Restaurants created with high quality images");

  // Create reviews
  const allRestaurants = await prisma.restaurant.findMany();

  const reviews = [
    {
      restaurantId: allRestaurants[0].id,
      userId: user2.id,
      title: "Absolutely Amazing Plov!",
      rating: 5,
      comment: "Best plov in Tashkent! The meat was so tender and the rice perfectly cooked. Highly recommend!",
    },
    {
      restaurantId: allRestaurants[0].id,
      userId: admin.id,
      title: "Authentic Traditional Experience",
      rating: 5,
      comment: "Authentic taste, generous portions. The traditional setting adds to the experience.",
    },
    {
      restaurantId: allRestaurants[1].id,
      userId: user1.id,
      title: "Fresh and Delicious Sushi",
      rating: 5,
      comment: "Fresh sushi, friendly staff. The salmon sashimi melts in your mouth!",
    },
    {
      restaurantId: allRestaurants[1].id,
      userId: admin.id,
      title: "Good Quality, Bit Expensive",
      rating: 4,
      comment: "Good quality but a bit pricey. Still worth it for special occasions.",
    },
    {
      restaurantId: allRestaurants[2].id,
      userId: user2.id,
      title: "Like Being in Italy!",
      rating: 5,
      comment: "Feels like being in Italy! The Margherita pizza is to die for.",
    },
    {
      restaurantId: allRestaurants[3].id,
      userId: user1.id,
      title: "Best Korean BBQ in Town",
      rating: 5,
      comment: "Amazing Korean BBQ experience. The meat selection is incredible!",
    },
    {
      restaurantId: allRestaurants[4].id,
      userId: user2.id,
      title: "Quick and Tasty",
      rating: 4,
      comment: "Quick service, good value for money. Perfect for a quick lunch.",
    },
    {
      restaurantId: allRestaurants[5].id,
      userId: user1.id,
      title: "Great Coffee and Atmosphere",
      rating: 4,
      comment: "Love the atmosphere! Great place to work remotely.",
    },
    {
      restaurantId: allRestaurants[6].id,
      userId: user2.id,
      title: "Authentic Chinese Cuisine",
      rating: 4,
      comment: "Authentic Chinese flavors. The dumplings are handmade!",
    },
    {
      restaurantId: allRestaurants[7].id,
      userId: user1.id,
      title: "Premium Steak Experience",
      rating: 5,
      comment: "Best steak I've had in Uzbekistan. Premium quality, worth every som!",
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }

  // Update restaurant ratings
  for (const restaurant of allRestaurants) {
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurantId: restaurant.id },
    });

    if (restaurantReviews.length > 0) {
      const avgRating =
        restaurantReviews.reduce((sum, r) => sum + r.rating, 0) /
        restaurantReviews.length;

      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          avgRating,
          reviewCount: restaurantReviews.length,
        },
      });
    }
  }

  console.log("✅ Reviews created");

  // Create favorites
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      restaurantId: allRestaurants[0].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      restaurantId: allRestaurants[7].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      restaurantId: allRestaurants[1].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      restaurantId: allRestaurants[2].id,
    },
  });

  console.log("✅ Favorites created");

  // Create helpful votes
  const allReviews = await prisma.review.findMany();

  await prisma.reviewHelpfulVote.create({
    data: {
      userId: user1.id,
      reviewId: allReviews[0].id,
    },
  });

  await prisma.reviewHelpfulVote.create({
    data: {
      userId: user1.id,
      reviewId: allReviews[4].id,
    },
  });

  await prisma.reviewHelpfulVote.create({
    data: {
      userId: user2.id,
      reviewId: allReviews[2].id,
    },
  });

  await prisma.reviewHelpfulVote.create({
    data: {
      userId: user2.id,
      reviewId: allReviews[9].id,
    },
  });

  await prisma.reviewHelpfulVote.create({
    data: {
      userId: admin.id,
      reviewId: allReviews[0].id,
    },
  });

  for (const review of allReviews) {
    const voteCount = await prisma.reviewHelpfulVote.count({
      where: { reviewId: review.id },
    });

    await prisma.review.update({
      where: { id: review.id },
      data: { helpfulCount: voteCount },
    });
  }

  console.log("✅ Helpful votes created");
  console.log("\n🎉 Seeding complete with rich photos and reviews!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
