import { Product, Coupon } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Sheba Fine Flakes Gourmet Poultry & Beef Wet Cat Food",
    slug: "sheba-sachets-deli-with-beef-in-sauce",
    category: "Dogs & Cats Food",
    categorySlug: "dogs-foods",
    subCategory: "canned-dog-food",
    price: 1850,
    originalPrice: 2200,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 48,
    inStock: true,
    stockCount: 35,
    petType: "cat",
    featured: true,
    isBestSeller: true,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Premium succulent meat cuts tenderly cooked in a mouth-watering gravy sauce. Specially formulated with essential taurine, vitamins, and minerals to maintain optimal adult cat vitality and coat luster.",
    features: [
      "Rich in premium animal protein and essential moisture",
      "Fortified with Taurine, Zinc & Vitamin E",
      "No artificial flavors, colors, or chemical preservatives",
      "Easy-to-serve mess-free foil pouches"
    ],
    ingredientsOrMaterials: ["Tender Poultry cuts", "Beef cuts", "Natural mineral gravy", "Taurine supplement", "Vitamin blend (A, D3, E)"],
    usageInstructions: "Feed 3-4 pouches daily for an average adult cat (~4kg). Always provide clean drinking water.",
    weightOrVolume: "12 x 85g Pouches (1.02kg)",
    brand: "Sheba Deluxe",
    sku: "SHB-CAT-85G-12",
    variants: {
      type: "flavor",
      options: [
        { label: "Beef & Poultry Gravy (12x85g)", value: "beef-poultry", priceModifier: 0 },
        { label: "Salmon & Tuna Jelly (12x85g)", value: "salmon-tuna", priceModifier: 150 },
        { label: "Chicken & Turkey Gravy (12x85g)", value: "chicken-turkey", priceModifier: 0 }
      ]
    }
  },
  {
    id: "prod-2",
    name: "Happy Dog Nature Life Supreme Dry Dog Kibble",
    slug: "happy-dog-brown-nature-life-pets-food",
    category: "Dogs & Cats Food",
    categorySlug: "dogs-foods",
    subCategory: "dry-dog-food",
    price: 4950,
    originalPrice: 5600,
    discountPercent: 12,
    rating: 4.8,
    reviewsCount: 39,
    inStock: true,
    stockCount: 20,
    petType: "dog",
    featured: true,
    isBestSeller: true,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Complete and balanced dry food for active dogs with natural protein, omega-3 & omega-6 fatty acids for a glossy coat and strong joint support.",
    features: [
      "26% crude protein for lean muscle maintenance",
      "Enriched with New Zealand green-lipped mussels for joint health",
      "Gluten-free carbohydrates (sweet potato and brown rice)",
      "High digestibility with probiotic fibers"
    ],
    ingredientsOrMaterials: ["Dehydrated poultry meat", "Whole grain brown rice", "Poultry fat", "Flaxseed", "Dried herbs & beet pulp"],
    usageInstructions: "Feed according to dog weight chart. Split into 2 daily meals. Keep fresh water available.",
    weightOrVolume: "4.0 kg",
    brand: "Happy Dog Natur",
    sku: "HAP-DOG-4KG",
    variants: {
      type: "weight",
      options: [
        { label: "1.5 kg Pack", value: "1.5kg", priceModifier: -2200 },
        { label: "4.0 kg Pack", value: "4kg", priceModifier: 0 },
        { label: "10.0 kg Economy Bag", value: "10kg", priceModifier: 5800 }
      ]
    }
  },
  {
    id: "prod-3",
    name: "Whiskas Delicate Duck & Salmon Pouch Feast",
    slug: "whiskas-can-with-duck-pet-complete-wet-cat-food",
    category: "Dogs & Cats Food",
    categorySlug: "dogs-foods",
    subCategory: "canned-dog-food",
    price: 1550,
    originalPrice: 1800,
    discountPercent: 14,
    rating: 4.7,
    reviewsCount: 62,
    inStock: true,
    stockCount: 50,
    petType: "cat",
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tender chunks of real duck & ocean salmon gently simmered in savory broth. 100% complete meal satisfying every feline's instinctual cravings.",
    features: [
      "Optimal balance of vitamins & minerals for urinary tract health",
      "Zinc and essential fatty acids for glossy fur",
      "Easy-tear multipack pouches",
      "Vet approved formula"
    ],
    ingredientsOrMaterials: ["Duck meat", "Salmon fillet", "Mineral broth", "Vegetable protein extracts"],
    usageInstructions: "For adult cats (3-5 kg), provide 3 to 4 pouches daily.",
    weightOrVolume: "12 x 85g Pack",
    brand: "Whiskas",
    sku: "WHS-DUCK-12PK"
  },
  {
    id: "prod-4",
    name: "CoCo Orthopedic Memory Foam Lounge Dog Bed",
    slug: "coco-orthopedic-memory-foam-dog-bed",
    category: "Pet Beds & Loungers",
    categorySlug: "pet-beds-chairs",
    subCategory: "dog-beds",
    price: 7850,
    originalPrice: 9500,
    discountPercent: 17,
    rating: 4.9,
    reviewsCount: 54,
    inStock: true,
    stockCount: 15,
    petType: "dog",
    featured: true,
    isBestSeller: true,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ergonomic medical-grade memory foam mattress with wrap-around bolstered neck pillows. Provides therapeutic relief for aging joints, arthritis, and deep restful sleep for dogs of all sizes.",
    features: [
      "High-density orthopedic memory foam core (doesn't flatten)",
      "Removable, water-resistant & machine-washable suede velvet cover",
      "Non-skid silicone dot bottom prevents sliding on hardwood/tiles",
      "3.5-inch thick supportive cushion"
    ],
    ingredientsOrMaterials: ["High-resilience orthopedic foam", "Micro-suede fabric", "Waterproof inner liner", "YKK heavy-duty zippers"],
    usageInstructions: "Unzip cover for machine washing in cold water. Air dry recommended.",
    brand: "CoCo Comfort",
    sku: "BED-MEM-001",
    variants: {
      type: "size",
      options: [
        { label: "Medium (75 x 55 x 15 cm)", value: "M", priceModifier: 0 },
        { label: "Large (90 x 70 x 18 cm)", value: "L", priceModifier: 1800 },
        { label: "Extra Large (110 x 85 x 20 cm)", value: "XL", priceModifier: 3400 }
      ]
    }
  },
  {
    id: "prod-5",
    name: "CoCo Calming Fluffy Faux Fur Donut Cat & Puppy Nest",
    slug: "coco-calming-fluffy-donut-pet-bed",
    category: "Pet Beds & Loungers",
    categorySlug: "pet-beds-chairs",
    subCategory: "cat-bed-mats",
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    stockCount: 42,
    petType: "all",
    featured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Ultra-soft shag faux fur bed designed with a deep donut rim that creates a snug sense of security and eases pet anxiety. Filled with breathable premium cloud cotton.",
    features: [
      "Ultra-soft 4cm synthetic shag fur mimics mother's warm coat",
      "Self-warming insulation retains natural body heat",
      "Deep crevices allow pets to burrow and nest comfortably",
      "Machine washable on gentle cycle"
    ],
    ingredientsOrMaterials: ["Plush vegan fur", "Polypropylene cotton fill", "Waterproof dust-resistant bottom"],
    brand: "CoCo Nest",
    sku: "BED-DONUT-02",
    variants: {
      type: "color",
      options: [
        { label: "Cloud White", value: "white", priceModifier: 0 },
        { label: "Cozy Charcoal Grey", value: "charcoal", priceModifier: 0 },
        { label: "Warm Beige Oatmeal", value: "oatmeal", priceModifier: 0 }
      ]
    }
  },
  {
    id: "prod-6",
    name: "Waterproof Winter Puffer Dog Coat with Built-in Harness Ring",
    slug: "waterproof-winter-puffer-dog-vest",
    category: "Pet Clothes & Apparel",
    categorySlug: "pet-clothes",
    subCategory: "cold-weather-coats",
    price: 2650,
    originalPrice: 3200,
    discountPercent: 17,
    rating: 4.8,
    reviewsCount: 31,
    inStock: true,
    stockCount: 24,
    petType: "dog",
    featured: true,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Windproof and water-resistant quilted winter jacket with fleece lining and integrated leash harness D-rings for effortless outdoor walks in chilly weather.",
    features: [
      "Waterproof ripstop polyester shell with warm thermal inner fleece",
      "Sturdy alloy D-rings on back for safe leash attachment",
      "Smooth step-in zipper closure along back spine",
      "Reflective piping stripes for evening visibility"
    ],
    ingredientsOrMaterials: ["Waterproof nylon fabric", "Warm polar fleece", "Zinc-alloy leash rings"],
    brand: "Candy Couture",
    sku: "APP-PUFF-01",
    variants: {
      type: "size",
      options: [
        { label: "Small (Chest 36cm / Neck 28cm)", value: "S", priceModifier: 0 },
        { label: "Medium (Chest 44cm / Neck 34cm)", value: "M", priceModifier: 200 },
        { label: "Large (Chest 52cm / Neck 40cm)", value: "L", priceModifier: 400 },
        { label: "XL (Chest 62cm / Neck 46cm)", value: "XL", priceModifier: 600 }
      ]
    }
  },
  {
    id: "prod-7",
    name: "Cozy Knit Cable Sweater for Small & Medium Pets",
    slug: "cozy-knit-cable-sweater-pet",
    category: "Pet Clothes & Apparel",
    categorySlug: "pet-clothes",
    subCategory: "sweaters",
    price: 1650,
    originalPrice: 1950,
    discountPercent: 15,
    rating: 4.9,
    reviewsCount: 45,
    inStock: true,
    stockCount: 18,
    petType: "all",
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Charming classic cable-knit pet sweater made with ultra-soft acrylic yarn. Breathable, stretchy, and itch-free for dogs and cats during autumn and winter.",
    features: [
      "High elastic ribbed turtleneck and leg openings for snug fit",
      "Convenient leash hole slot behind neck",
      "Non-restrictive belly cut allows easy bathroom breaks",
      "Gentle on sensitive fur"
    ],
    ingredientsOrMaterials: ["100% Premium soft acrylic yarn"],
    brand: "Candy Couture",
    sku: "APP-SWT-02",
    variants: {
      type: "color",
      options: [
        { label: "Mustard Yellow", value: "yellow", priceModifier: 0 },
        { label: "Navy Blue", value: "navy", priceModifier: 0 },
        { label: "Dusty Rose Pink", value: "pink", priceModifier: 0 }
      ]
    }
  },
  {
    id: "prod-8",
    name: "Ergonomic Elevated Ceramic Double Pet Bowl with Solid Bamboo Stand",
    slug: "raised-ceramic-dual-pet-bowl-bamboo",
    category: "Food Bowls & Feeders",
    categorySlug: "pet-food-bowls",
    subCategory: "raised-cat-bowls",
    price: 3650,
    originalPrice: 4400,
    discountPercent: 17,
    rating: 5.0,
    reviewsCount: 57,
    inStock: true,
    stockCount: 22,
    petType: "all",
    featured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tilted 15-degree raised feeding station with two food-grade heavy ceramic bowls set into a natural water-repellent bamboo stand. Protects pets' spine and improves digestion.",
    features: [
      "15-degree ergonomic tilt reduces neck and joint strain",
      "Lead-free, cadmium-free microwave and dishwasher safe ceramic",
      "Natural varnished bamboo wood stand with non-slip silicone feet",
      "Prevents messy spills and bowl tipping"
    ],
    ingredientsOrMaterials: ["Heavy glazed stoneware ceramic", "Natural sustainable bamboo stand", "Food-grade silicone pads"],
    weightOrVolume: "2 x 400ml Bowls",
    brand: "CoCo Diner",
    sku: "BWL-ELEV-CER",
    variants: {
      type: "color",
      options: [
        { label: "Matte White Bowls + Natural Wood", value: "white-wood", priceModifier: 0 },
        { label: "Sage Green Bowls + Natural Wood", value: "green-wood", priceModifier: 0 },
        { label: "Pastel Pink Bowls + Natural Wood", value: "pink-wood", priceModifier: 0 }
      ]
    }
  },
  {
    id: "prod-9",
    name: "Ultra-Quiet Flowing LED Pet Water Fountain (2.5L)",
    slug: "quiet-led-pet-water-fountain-2-5l",
    category: "Food Bowls & Feeders",
    categorySlug: "pet-food-bowls",
    subCategory: "fountains",
    price: 4850,
    originalPrice: 5800,
    discountPercent: 16,
    rating: 4.8,
    reviewsCount: 42,
    inStock: true,
    stockCount: 16,
    petType: "all",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Circulating filtration drinking fountain with multi-stage carbon filter, gentle waterfall nozzle, and whisper-quiet submersible pump under 25dB. Encourages cats & dogs to stay hydrated.",
    features: [
      "Quadruple filtration system (carbon, ion-exchange resin & sponge)",
      "Smart LED water level window with auto-shutoff when low",
      "BPA-free food-grade hygiene plastic",
      "USB powered with low energy consumption (1.5W)"
    ],
    ingredientsOrMaterials: ["BPA-free ABS plastic", "Coconut shell activated carbon filter", "Silent low-voltage pump"],
    weightOrVolume: "2.5 Liters capacity",
    brand: "CoCo Aqua",
    sku: "FOUNT-LED-25L"
  },
  {
    id: "prod-10",
    name: "Interactive Maze Slow Feeder Anti-Choking Dog Bowl",
    slug: "slow-feeder-anti-choking-dog-bowl",
    category: "Food Bowls & Feeders",
    categorySlug: "pet-food-bowls",
    subCategory: "basic-dog-bowls",
    price: 1450,
    originalPrice: 1800,
    discountPercent: 19,
    rating: 4.7,
    reviewsCount: 29,
    inStock: true,
    stockCount: 30,
    petType: "dog",
    images: [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Engaging labyrinth puzzle bowl that slows mealtime eating speed by up to 10x, helping prevent bloating, regurgitation, obesity, and canine indigestion.",
    features: [
      "Smooth rounded maze ridges to protect delicate pet tongues",
      "Rubberized anti-skid base grips floors securely",
      "Holds up to 2 cups of dry kibble or wet food",
      "Top-rack dishwasher safe"
    ],
    ingredientsOrMaterials: ["Heavy-duty food-safe Polypropylene (PP)"],
    brand: "CoCo Diner",
    sku: "BWL-SLOW-01"
  },
  {
    id: "prod-11",
    name: "Mr. Fresh Expert Pet Habituation & Odor Eliminator Spray",
    slug: "mr-fresh-expert-dog-location-habituation-spray",
    category: "Grooming & Supplies",
    categorySlug: "pet-supplies",
    subCategory: "grooming-supplies",
    price: 1850,
    originalPrice: 2100,
    discountPercent: 12,
    rating: 4.6,
    reviewsCount: 23,
    inStock: true,
    stockCount: 25,
    petType: "all",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Veterinary-formulated natural citrus habituation spray to deter unwanted scratching, chewing, and territory marking on furniture, carpets, and doors safely.",
    features: [
      "Natural plant-based bitter apple and citrus extract formula",
      "100% non-toxic, safe around puppies, kittens, and human fabrics",
      "Leaves zero residue or permanent stains",
      "Long-lasting scent deterrence"
    ],
    ingredientsOrMaterials: ["Distilled water", "Purified citrus oil", "Bitter apple extract", "Natural odor neutralizers"],
    weightOrVolume: "250 ml Spray Bottle",
    brand: "Mr. Fresh",
    sku: "MRF-SPRAY-250ML"
  },
  {
    id: "prod-12",
    name: "CoCo Professional Self-Cleaning Slicker Deshedding Brush",
    slug: "coco-self-cleaning-slicker-brush",
    category: "Grooming & Supplies",
    categorySlug: "pet-supplies",
    subCategory: "grooming-supplies",
    price: 1750,
    originalPrice: 2200,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 76,
    inStock: true,
    stockCount: 40,
    petType: "all",
    featured: true,
    isBestSeller: true,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
    ],
    description: "One-click retracting deshedding brush with massage bead coated bristles. Removes up to 95% of loose undercoat, knots, and dander without scratching pet skin.",
    features: [
      "One-click hair release button for instant clean up",
      "Fine stainless steel curved bristles with rounded safety tips",
      "Ergonomic anti-slip silicone handle for comfortable grooming",
      "Suitable for short, medium, and long coat fur"
    ],
    ingredientsOrMaterials: ["Stainless steel bristles", "ABS plastic body", "Silicone comfort grip"],
    brand: "CoCo Groom",
    sku: "GRM-BRUSH-01"
  },
  {
    id: "prod-13",
    name: "CoCo Multi-Level Deluxe Sisal Cat Tree with Condo & Hammock",
    slug: "coco-deluxe-cat-tree-scratcher-condo",
    category: "Grooming & Supplies",
    categorySlug: "pet-supplies",
    subCategory: "cat-trees",
    price: 12500,
    originalPrice: 14900,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 34,
    inStock: true,
    stockCount: 8,
    petType: "cat",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
    ],
    description: "48-inch luxury multi-platform cat activity tower featuring 100% natural sisal scratching pillars, a cozy private cave condo, plush lounging perch, and dangling pom-poms.",
    features: [
      "Sturdy heavy-duty base plate with anti-toppling wall strap",
      "Durable natural sisal posts protect home furniture from scratching",
      "Ultra-soft faux fleece lined private sleeping cave",
      "High vantage point top perch with bolstered rim"
    ],
    ingredientsOrMaterials: ["CARB-certified engineered wood", "Natural Mexican sisal rope", "Plush velvet fleece"],
    weightOrVolume: "Height: 120 cm (48 in) | Weight: 9.5 kg",
    brand: "CoCo Feline",
    sku: "CAT-TREE-120CM"
  },
  {
    id: "prod-14",
    name: "Petstages Fresh Breath Dental Mint Stick Toy",
    slug: "petstages-fresh-breath-mint-stick-cat-toy",
    category: "Interactive Pet Toys",
    categorySlug: "pet-toys",
    subCategory: "chew-toys",
    price: 1150,
    originalPrice: 1400,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 46,
    inStock: true,
    stockCount: 38,
    petType: "cat",
    featured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Dental mesh stick toy infused with aromatic real dried mint and catnip. Cleans tartar and plaque as cats chew while satisfying natural hunting instincts.",
    features: [
      "Durable nylon mesh netting gently scrapes tartar from cat teeth",
      "Filled with premium organic catnip & dried spearmint",
      "Crinkle paper interior sparks curiosity and active batting",
      "Lightweight and easy for kittens and cats to toss"
    ],
    ingredientsOrMaterials: ["Dental grade mesh fabric", "Organic dried mint & catnip blend"],
    brand: "Petstages",
    sku: "TOY-MINT-01"
  },
  {
    id: "prod-15",
    name: "Heavy Duty Braided Cotton Tug Rope & Ball Toy Set (3 Pack)",
    slug: "heavy-duty-braided-cotton-rope-dog-toy-set",
    category: "Interactive Pet Toys",
    categorySlug: "pet-toys",
    subCategory: "rope-toys",
    price: 1950,
    originalPrice: 2400,
    discountPercent: 19,
    rating: 4.8,
    reviewsCount: 38,
    inStock: true,
    stockCount: 28,
    petType: "dog",
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tightly wound multi-knot 100% natural cotton rope toys for interactive tug-of-war, aggressive chewers, and gentle teeth flossing.",
    features: [
      "100% safe non-toxic washable dyed cotton fibers",
      "Cleans gums and massages teeth during rigorous chewing",
      "Includes 1 figure-8 tug, 1 knotted rope ball, and 1 double-knot stick",
      "Ideal for medium to large aggressive chewers"
    ],
    ingredientsOrMaterials: ["100% Pure braided natural cotton"],
    brand: "Candy Play",
    sku: "TOY-ROPE-3PK"
  },
  {
    id: "prod-16",
    name: "CoCo Reflective No-Pull Step-In Dog Harness & Leash Set",
    slug: "coco-reflective-no-pull-dog-harness-leash",
    category: "Grooming & Supplies",
    categorySlug: "pet-supplies",
    subCategory: "cat-collars",
    price: 3250,
    originalPrice: 3900,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 52,
    inStock: true,
    stockCount: 20,
    petType: "dog",
    featured: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Padded breathable mesh harness with dual leash attachment rings (chest front no-pull & back walk) with a matching 5-foot shock-absorbing padded handle leash.",
    features: [
      "Distributes pulling pressure evenly across chest to prevent choking",
      "High-luminescence 3M reflective threads for night safety",
      "Quick-release lockable security buckles",
      "Includes padded comfort leash"
    ],
    ingredientsOrMaterials: ["Breathable air-mesh", "Heavy duty nylon webbing", "Reinforced zinc alloy D-rings"],
    brand: "CoCo Leash",
    sku: "HARN-REF-01",
    variants: {
      type: "size",
      options: [
        { label: "Small (Chest 38-50 cm)", value: "S", priceModifier: 0 },
        { label: "Medium (Chest 50-65 cm)", value: "M", priceModifier: 300 },
        { label: "Large (Chest 65-82 cm)", value: "L", priceModifier: 600 }
      ]
    }
  }
];

export const COUPONS: Coupon[] = [
  {
    code: "COCOFIRST",
    discountPercent: 15,
    description: "15% off on your first order!",
    minSpend: 2000,
  },
  {
    code: "PETLOVE",
    discountPercent: 10,
    description: "10% off storewide on all pet items",
    minSpend: 1500,
  },
  {
    code: "COCO25",
    discountPercent: 25,
    description: "Mega 25% discount for orders above Rs. 7,000",
    minSpend: 7000,
  }
];

export const TESTIMONIALS = [
  {
    id: "rev-1",
    author: "Zainab Malik",
    city: "Lahore",
    petName: "Milo (Golden Retriever)",
    rating: 5,
    date: "14 Aug 2026",
    title: "Outstanding Orthopedic Bed!",
    comment: "The memory foam bed is pure luxury! Milo had trouble sleeping on normal rugs due to hip stiffness, but he now spends hours sleeping peacefully in his CoCo bed. Delivery took only 24 hours in Lahore!",
    verifiedBuyer: true,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "rev-2",
    author: "Bilal Farooq",
    city: "Islamabad",
    petName: "Luna & Bella (Persian Cats)",
    rating: 5,
    date: "20 Aug 2026",
    title: "Cat Tree & Sheba Food Delivered Fast",
    comment: "Extremely pleased with the WhatsApp order service. I sent my cart summary and the team confirmed and dispatched immediately. The cat tree is sturdy and high quality. Will definitely order regularly!",
    verifiedBuyer: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "rev-3",
    author: "Ayesha Khan",
    city: "Karachi",
    petName: "Coco (Shih Tzu)",
    rating: 5,
    date: "02 Aug 2026",
    title: "Adorable Puffer Jacket & Fast Shipping",
    comment: "The winter puffer vest with the harness rings fits Coco like a glove! Super warm, high-quality zippers and water-resistant. Best pet boutique in Pakistan!",
    verifiedBuyer: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  }
];
