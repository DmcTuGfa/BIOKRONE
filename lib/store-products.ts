export interface StoreProduct {
  id: string
  name: string
  slug: string
  presentation: string
  category: "FUNGICIDAS" | "BIOINSECTICIDAS" | "BIOFORTIFICANTES"
  description: string
  price: number        // centavos MXN para Stripe
  priceDisplay: string // para mostrar
  image: string
  inStock: boolean
  stripePriceId?: string
}

// Precios tomados de PRECIOS_WEB.xlsx (precio público por unidad)
export const storeProducts: StoreProduct[] = [

  // ── FUNGICIDAS ──────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Baktillis",
    slug: "baktillis",
    presentation: "Suspensión concentrada 1L",
    category: "FUNGICIDAS",
    description: "Fungicida microbiológico a base de Bacillus subtilis de amplio espectro.",
    price: 36000,          // $360 MXN
    priceDisplay: "$360.00",
    image: "/images/products/baktillis.png",
    inStock: true,
  },
  {
    id: "2",
    name: "NatuControl",
    slug: "natucontrol",
    presentation: "Polvo humectable 400g",
    category: "FUNGICIDAS",
    description: "Fungicida biológico a base de Trichoderma harzianum.",
    price: 58000,          // $580 MXN
    priceDisplay: "$580.00",
    image: "/images/products/natucontrol-new.png",
    inStock: true,
  },
  {
    id: "3",
    name: "Alteza",
    slug: "alteza",
    presentation: "Polvo humectable 500g",
    category: "FUNGICIDAS",
    description: "Inoculante bioprotector radicular con consorcio de microorganismos benéficos.",
    price: 75000,          // $750 MXN
    priceDisplay: "$750.00",
    image: "/images/products/alteza.png",
    inStock: true,
  },
  {
    id: "4",
    name: "Nemagyne",
    slug: "nemagyne",
    presentation: "Concentrado emulsionable 1L",
    category: "FUNGICIDAS",
    description: "Coadyuvante nematicida con biopolímeros y extractos botánicos.",
    price: 55000,          // $550 MXN
    priceDisplay: "$550.00",
    image: "/images/products/nemagyne.png",
    inStock: true,
  },
  {
    id: "5",
    name: "Nemakron",
    slug: "nemakron",
    presentation: "Polvo humectable 1kg",
    category: "FUNGICIDAS",
    description: "Fungicida nematicida biológico con consorcio de hongos entomopatógenos.",
    price: 0,              // Sin precio en lista — consultar
    priceDisplay: "Consultar",
    image: "/images/products/nemakron.png",
    inStock: true,
  },
  {
    id: "6",
    name: "Bac Ilia",
    slug: "bac-ilia",
    presentation: "Suspensión concentrada 1L",
    category: "FUNGICIDAS",
    description: "Fungicida microbiológico a base de Bacillus subtilis.",
    price: 0,              // Precio de Procobi — consultar
    priceDisplay: "Consultar",
    image: "/images/products/bac-ilia.png",
    inStock: true,
  },

  // ── BIOINSECTICIDAS ─────────────────────────────────────────────────────────
  {
    id: "7",
    name: "Aba Krone",
    slug: "aba-krone",
    presentation: "Concentrado emulsionable 1L",
    category: "BIOINSECTICIDAS",
    description: "Insecticida a base de Abamectina 1.8% para control de ácaros y trips.",
    price: 50000,          // $500 MXN
    priceDisplay: "$500.00",
    image: "/images/products/abakrone.png",
    inStock: true,
  },
  {
    id: "8",
    name: "Ajick",
    slug: "ajick",
    presentation: "Solución acuosa 1L",
    category: "BIOINSECTICIDAS",
    description: "Repelente botánico a base de extracto de ajo (Allium sativum).",
    price: 24000,          // $240 MXN
    priceDisplay: "$240.00",
    image: "/images/products/ajick-new.png",
    inStock: true,
  },
  {
    id: "9",
    name: "AK-Neem",
    slug: "ak-neem",
    presentation: "Concentrado emulsionable 1L",
    category: "BIOINSECTICIDAS",
    description: "Insecticida botánico con Alicina y Capsaicina de amplio espectro.",
    price: 0,              // Producto nuevo — consultar
    priceDisplay: "Consultar",
    image: "/images/products/ak-neem.png",
    inStock: true,
  },
  {
    id: "10",
    name: "Azaním",
    slug: "azanim",
    presentation: "Concentrado emulsionable 1L",
    category: "BIOINSECTICIDAS",
    description: "Insecticida botánico a base de Azadiractina 3% (Neem).",
    price: 63000,          // $630 MXN
    priceDisplay: "$630.00",
    image: "/images/products/azanim-new.png",
    inStock: true,
  },

  // ── BIOFORTIFICANTES ────────────────────────────────────────────────────────
  {
    id: "11",
    name: "Glumix",
    slug: "glumix",
    presentation: "Polvo inoculante 1kg",
    category: "BIOFORTIFICANTES",
    description: "Inoculante a base de hongos endomicorrízicos VAM.",
    price: 33000,          // $330 MXN
    priceDisplay: "$330.00",
    image: "/images/products/glumix-new.png",
    inStock: true,
  },
  {
    id: "12",
    name: "Glumix Irrigation",
    slug: "glumix-irrigation",
    presentation: "Sólido granulado 1kg",
    category: "BIOFORTIFICANTES",
    description: "Bioactivador radicular con micorrizas, ácidos húmicos y fúlvicos.",
    price: 80000,          // $800 MXN
    priceDisplay: "$800.00",
    image: "/images/products/glumix-irrigation.png",
    inStock: true,
  },
  {
    id: "13",
    name: "AZSeed",
    slug: "azseed",
    presentation: "Polvo humectable 100g",
    category: "BIOFORTIFICANTES",
    description: "Inoculante de semillas con bacterias fijadoras de nitrógeno.",
    price: 21000,          // $210 MXN (AZ SEED TS 100g)
    priceDisplay: "$210.00",
    image: "/images/products/azseed-new.png",
    inStock: true,
  },
  {
    id: "14",
    name: "Amikrone 1L",
    slug: "amikrone-1l",
    presentation: "Líquido concentrado 1L",
    category: "BIOFORTIFICANTES",
    description: "Fertilizante orgánico líquido a base de L-Aminoácidos libres.",
    price: 31000,          // $310 MXN
    priceDisplay: "$310.00",
    image: "/images/products/amikrone.png",
    inStock: true,
  },
  {
    id: "15",
    name: "Amikrone 500mL",
    slug: "amikrone-500ml",
    presentation: "Líquido concentrado 500mL",
    category: "BIOFORTIFICANTES",
    description: "Presentación de 500mL del fertilizante orgánico L-Aminoácidos.",
    price: 16800,          // $168 MXN
    priceDisplay: "$168.00",
    image: "/images/products/amikrone-500ml.png",
    inStock: true,
  },
  {
    id: "16",
    name: "BioElicitor",
    slug: "bioelicitor",
    presentation: "Líquido concentrado 1L",
    category: "BIOFORTIFICANTES",
    description: "Fertilizante orgánico a base de extracto de algas marinas con citocininas.",
    price: 32200,          // $322 MXN
    priceDisplay: "$322.00",
    image: "/images/products/bio-elicitor.png",
    inStock: true,
  },
]
