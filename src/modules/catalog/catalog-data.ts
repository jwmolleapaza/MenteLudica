import { ProductEntity } from '@/types/database';

export interface CatalogProductView extends ProductEntity {
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
  images: {
    url: string;
    alt: string;
    isPrimary?: boolean;
  }[];
  variants: {
    id: string;
    skuVariant: string;
    name: string;
    additionalPrice: number;
  }[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount: number;
}

/**
 * Catálogo Estructurado MenteLúdica (Sección 5 y Sección 7 del Prompt Maestro).
 * Contiene todos los campos obligatorios: SKU, categoría, subcategoría, descripciones,
 * fotografías, precio de venta, precio promocional, costo interno, stock, stock mínimo,
 * marca, edad recomendada, dimensiones, peso, material, características, etiquetas,
 * nota de compatibilidad de bloques (sin atribuir condición oficial LEGO) y variantes.
 */
export const CATALOG_PRODUCTS: CatalogProductView[] = [
  {
    id: 'prod-001',
    sku: 'ML-CON-ARQ-001',
    name: 'Set Arquitectónico Catedral Histórica de Arequipa (1,480 Piezas)',
    slug: 'set-arquitectonico-catedral-historica-arequipa-1480-piezas',
    categoryId: 'cat-construccion',
    categorySlug: 'juegos-de-construccion',
    categoryName: 'Juegos de construcción',
    subcategoryId: 'sub-arquitectura',
    subcategorySlug: 'sets-de-arquitectura',
    subcategoryName: 'Sets de arquitectura',
    shortDescription:
      'Maqueta de microbloques de alta precisión inspirada en la arquitectura neorrenacentista en sillar con base de exhibición.',
    fullDescription:
      'Construye una réplica detallada de exhibición con 1,480 bloques de encaje milimétrico. Diseñada para desarrollar la concentración, la visión espacial y el aprecio por el patrimonio arquitectónico. Incluye manual ilustrado paso a paso por etapas y placa conmemorativa.',
    videoUrl: null,
    salePrice: 189.0,
    promoPrice: 159.0,
    internalCost: 82.0,
    availableStock: 18,
    minStockAlert: 4,
    brand: 'MenteLúdica Studio Bricks',
    recommendedAge: '12+ años y adultos',
    dimensions: '38 x 16 x 22 cm',
    weightGrams: 1150,
    material: 'Polímero ABS de alta densidad libre de BPA',
    features: [
      '1,480 piezas de encaje firme y suave',
      'Manual impreso a todo color con etapas numeradas',
      'Incluye separador ergonómico de piezas',
      'Base rígida de exhibición color piedra volcánica',
    ],
    tags: ['arquitectura', 'bloques', 'coleccionable', 'arequipa', 'regalo'],
    isCustomizable: true,
    compatibilityNote:
      'Producto 100% compatible con sistemas de bloques de construcción de tamaño estándar de otras marcas. No es un producto oficial LEGO.',
    status: 'published',
    relatedProductIds: ['prod-002', 'prod-003', 'prod-006'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 34,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=85',
        alt: 'Set de bloques arquitectónicos de precisión MenteLúdica',
        isPrimary: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1000&q=85',
        alt: 'Detalle de piezas y manual de ensamblaje',
      },
    ],
    variants: [
      {
        id: 'var-001-a',
        skuVariant: 'ML-CON-ARQ-001-STD',
        name: 'Edición Estándar (1,480 piezas)',
        additionalPrice: 0,
      },
      {
        id: 'var-001-b',
        skuVariant: 'ML-CON-ARQ-001-LED',
        name: 'Edición con Kit de Iluminación LED USB (+Placa Grabada)',
        additionalPrice: 35.0,
      },
    ],
  },
  {
    id: 'prod-002',
    sku: 'ML-CON-VEH-002',
    name: 'Superdeportivo Mecánico GT Escala 1:10 con Caja de Cambios (1,260 Piezas)',
    slug: 'superdeportivo-mecanico-gt-escala-1-10-1260-piezas',
    categoryId: 'cat-construccion',
    categorySlug: 'juegos-de-construccion',
    categoryName: 'Juegos de construcción',
    subcategoryId: 'sub-vehiculos',
    subcategorySlug: 'vehiculos-armables',
    subcategoryName: 'Vehículos armables',
    shortDescription:
      'Vehículo de ingeniería armable con transmisión funcional, suspensión independiente y puertas tipo tijera.',
    fullDescription:
      'Un reto STEM apasionante para jóvenes y adultos amantes de la ingeniería automotriz. Incorpora diferencial mecánico, pistones móviles en el motor V8, dirección conectada al volante y alerón ajustable.',
    videoUrl: null,
    salePrice: 215.0,
    promoPrice: 185.0,
    internalCost: 98.0,
    availableStock: 12,
    minStockAlert: 3,
    brand: 'TechnicMind Pro',
    recommendedAge: '10+ años y adultos',
    dimensions: '42 x 19 x 12 cm',
    weightGrams: 1380,
    material: 'ABS de ingeniería de alta resistencia',
    features: [
      '1,260 piezas técnicas con ejes y engranajes',
      'Motor con pistones visibles en movimiento',
      'Suspensión independiente en las 4 ruedas',
      'Bolsas numeradas por etapa de construcción',
    ],
    tags: ['vehiculos', 'ingenieria', 'stem', 'bloques-tecnicos'],
    isCustomizable: false,
    compatibilityNote:
      'Compatible con sistemas de bloques y ejes técnicos de otras marcas líderes. No es un producto oficial LEGO.',
    status: 'published',
    relatedProductIds: ['prod-001', 'prod-005'],
    isFeatured: true,
    isBestseller: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 27,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=85',
        alt: 'Superdeportivo armable de bloques técnicos',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-002-a',
        skuVariant: 'ML-CON-VEH-002-MAN',
        name: 'Versión Mecánica Manual',
        additionalPrice: 0,
      },
      {
        id: 'var-002-b',
        skuVariant: 'ML-CON-VEH-002-RC',
        name: 'Con Módulo Motorizado RC Recargable',
        additionalPrice: 65.0,
      },
    ],
  },
  {
    id: 'prod-003',
    sku: 'ML-ROM-MAD-003',
    name: 'Rompecabezas de Madera Corte Láser – Cóndor Andino Mandalas (320 Piezas Únicas)',
    slug: 'rompecabezas-madera-corte-laser-condor-andino-320-piezas',
    categoryId: 'cat-rompecabezas',
    categorySlug: 'rompecabezas',
    categoryName: 'Rompecabezas',
    subcategoryId: 'sub-rompecabezas-madera',
    subcategorySlug: 'rompecabezas-de-madera',
    subcategoryName: 'Rompecabezas de madera',
    shortDescription:
      'Puzzle artístico en madera de abedul de 5 mm con piezas caprichosas en forma de fauna peruana.',
    fullDescription:
      'Cada pieza de este rompecabezas de madera ha sido cortada con láser de alta precisión e ilustrada con tintas UV resistentes. Incluye 35 piezas especiales con siluetas de animales y símbolos andinos, presentado en estuche de madera ideal para regalo.',
    videoUrl: null,
    salePrice: 119.0,
    promoPrice: 99.0,
    internalCost: 44.0,
    availableStock: 25,
    minStockAlert: 5,
    brand: 'MenteLúdica Atelier',
    recommendedAge: '8+ años y adultos',
    dimensions: '34 x 28 x 0.5 cm',
    weightGrams: 540,
    material: 'Madera de abedul sostenible de 5 mm con impresión UV directa',
    features: [
      '320 piezas irregulares con encaje exacto',
      '35 siluetas temáticas escondidas en el diseño',
      'Caja de madera grabada lista para obsequiar',
      'Incluye soporte para exhibir como cuadro decorativo',
    ],
    tags: ['rompecabezas', 'madera', 'arte-andino', 'regalo-premium'],
    isCustomizable: true,
    compatibilityNote: null,
    status: 'published',
    relatedProductIds: ['prod-004', 'prod-007'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    rating: 5.0,
    reviewsCount: 41,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&w=1000&q=85',
        alt: 'Rompecabezas de madera corte láser MenteLúdica',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-003-a',
        skuVariant: 'ML-ROM-MAD-003-M',
        name: 'Tamaño Mediano A3 (320 piezas)',
        additionalPrice: 0,
      },
      {
        id: 'var-003-b',
        skuVariant: 'ML-ROM-MAD-003-L',
        name: 'Tamaño Gran Formato (500 piezas + Dedicatoria Grabada)',
        additionalPrice: 30.0,
      },
    ],
  },
  {
    id: 'prod-004',
    sku: 'ML-ROM-PER-004',
    name: 'Rompecabezas Fotográfico Personalizado en Acabado Mate Antirreflejo',
    slug: 'rompecabezas-fotografico-personalizado-acabado-mate',
    categoryId: 'cat-rompecabezas',
    categorySlug: 'rompecabezas',
    categoryName: 'Rompecabezas',
    subcategoryId: 'sub-rompecabezas-personalizados',
    subcategorySlug: 'rompecabezas-personalizados',
    subcategoryName: 'Rompecabezas personalizados',
    shortDescription:
      'Convierte tu fotografía familiar, aniversario o diseño especial en un rompecabezas de alta definición con caja personalizada.',
    fullDescription:
      'Fabricado en nuestro taller en Arequipa sobre cartón prensado de 2.2 mm de espesor con laminado mate suave al tacto. Nuestro equipo de diseño optimiza la iluminación de tu fotografía y te envía una previsualización antes de producir.',
    videoUrl: null,
    salePrice: 79.0,
    promoPrice: 69.0,
    internalCost: 26.0,
    availableStock: 50,
    minStockAlert: 10,
    brand: 'MenteLúdica Custom Lab',
    recommendedAge: 'Todas las edades',
    dimensions: '48 x 34 cm (según variante)',
    weightGrams: 490,
    material: 'Cartón rígido europeo de 2.2 mm con laminado antirreflejo',
    features: [
      'Impresión fotográfica HD calibrada',
      'Caja rígida personalizada con la foto de referencia y dedicatoria',
      'Revisión y aprobación digital de diseño incluida',
      'Disponible en 300, 500 y 1000 piezas',
    ],
    tags: ['personalizado', 'rompecabezas', 'fotografia', 'regalo-familiar'],
    isCustomizable: true,
    compatibilityNote: null,
    status: 'published',
    relatedProductIds: ['prod-003', 'prod-007', 'prod-008'],
    isFeatured: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 52,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=85',
        alt: 'Rompecabezas personalizado con fotografía familiar',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-004-a',
        skuVariant: 'ML-ROM-PER-004-300',
        name: '300 Piezas (34 x 24 cm)',
        additionalPrice: 0,
      },
      {
        id: 'var-004-b',
        skuVariant: 'ML-ROM-PER-004-500',
        name: '500 Piezas (48 x 34 cm)',
        additionalPrice: 18.0,
      },
      {
        id: 'var-004-c',
        skuVariant: 'ML-ROM-PER-004-1000',
        name: '1,000 Piezas (68 x 48 cm)',
        additionalPrice: 38.0,
      },
    ],
  },
  {
    id: 'prod-005',
    sku: 'ML-MES-EST-005',
    name: 'Juego de Mesa Rutas de los Andes – Estrategia y Comercio Familiar',
    slug: 'juego-de-mesa-rutas-de-los-andes-estrategia-familiar',
    categoryId: 'cat-juegos-mesa',
    categorySlug: 'juegos-de-mesa',
    categoryName: 'Juegos de mesa',
    subcategoryId: 'sub-juegos-estrategia',
    subcategorySlug: 'juegos-de-estrategia',
    subcategoryName: 'Juegos de estrategia',
    shortDescription:
      'Juego de estrategia moderna para 2 a 5 jugadores donde planificas rutas comerciales, recursos y alianzas.',
    fullDescription:
      'Fácil de aprender en 10 minutos y con gran profundidad estratégica. Ideal para tardes de juego en familia, reuniones de amigos y talleres escolares de toma de decisiones. Partidas dinámicas de 40 a 60 minutos.',
    videoUrl: null,
    salePrice: 149.0,
    promoPrice: 129.0,
    internalCost: 64.0,
    availableStock: 22,
    minStockAlert: 5,
    brand: 'MenteLúdica Games',
    recommendedAge: '8+ años, jóvenes y adultos',
    dimensions: '29.5 x 29.5 x 7 cm',
    weightGrams: 1120,
    material: 'Tablero modular de cartón lino y fichas de madera natural',
    features: [
      'Para 2 a 5 jugadores (modo solitario incluido)',
      '110 cartas ilustradas con acabado lino',
      '65 piezas de madera pintadas con tintes ecológicos',
      'Reglamento claro con ejemplos visuales',
    ],
    tags: ['juegos-de-mesa', 'estrategia', 'familia', 'educativo'],
    isCustomizable: false,
    compatibilityNote: null,
    status: 'published',
    relatedProductIds: ['prod-006', 'prod-001'],
    isFeatured: true,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1000&q=85',
        alt: 'Juego de mesa de estrategia familiar MenteLúdica',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-005-a',
        skuVariant: 'ML-MES-EST-005-BASE',
        name: 'Juego Base Oficial',
        additionalPrice: 0,
      },
      {
        id: 'var-005-b',
        skuVariant: 'ML-MES-EST-005-FUNDAS',
        name: 'Juego Base + Pack de 120 Fundas Protectoras Premium',
        additionalPrice: 19.0,
      },
    ],
  },
  {
    id: 'prod-006',
    sku: 'ML-MES-LOG-006',
    name: 'Torre de Ingenio y Lógica Magnética – 80 Retos Progresivos STEM',
    slug: 'torre-ingenio-logica-magnetica-80-retos-stem',
    categoryId: 'cat-juegos-mesa',
    categorySlug: 'juegos-de-mesa',
    categoryName: 'Juegos de mesa',
    subcategoryId: 'sub-juegos-logica',
    subcategorySlug: 'juegos-de-logica',
    subcategoryName: 'Juegos de lógica',
    shortDescription:
      'Juego de deducción lógica y razonamiento espacial con 80 cartas de desafíos desde nivel principiante hasta maestro.',
    fullDescription:
      'Recomendado por docentes y psicopedagogos para fortalecer la atención sostenida, la memoria de trabajo y la resolución de problemas en niños, adolescentes y adultos.',
    videoUrl: null,
    salePrice: 89.0,
    promoPrice: null,
    internalCost: 39.0,
    availableStock: 30,
    minStockAlert: 6,
    brand: 'SmartPlay Lab',
    recommendedAge: '6+ años a adultos',
    dimensions: '24 x 24 x 6 cm',
    weightGrams: 680,
    material: 'Piezas magnéticas encapsuladas de alta seguridad',
    features: [
      '80 retos divididos en 4 niveles de dificultad',
      'Cuaderno de soluciones verificadas',
      'Formato compacto ideal para viajes y colegios',
    ],
    tags: ['logica', 'stem', 'educativo', 'colegios', 'regalo-infantil'],
    isCustomizable: false,
    compatibilityNote: null,
    status: 'published',
    relatedProductIds: ['prod-005', 'prod-002'],
    isFeatured: false,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewsCount: 19,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=1000&q=85',
        alt: 'Juego de lógica y retos cognitivos STEM',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-006-a',
        skuVariant: 'ML-MES-LOG-006-STD',
        name: 'Edición Individual / Familiar',
        additionalPrice: 0,
      },
      {
        id: 'var-006-b',
        skuVariant: 'ML-MES-LOG-006-AULA',
        name: 'Pack Educativo Aula (3 Unidades con Guía Docente)',
        additionalPrice: 145.0,
      },
    ],
  },
  {
    id: 'prod-007',
    sku: 'ML-SOU-COR-007',
    name: 'Kit Regalo Corporativo Lúdico con Logotipo Grabado en Madera y Acrílico',
    slug: 'kit-regalo-corporativo-ludico-logotipo-grabado',
    categoryId: 'cat-souvenirs',
    categorySlug: 'souvenirs-personalizados',
    categoryName: 'Souvenirs personalizados',
    subcategoryId: 'sub-regalos-corporativos',
    subcategorySlug: 'regalos-corporativos',
    subcategoryName: 'Regalos corporativos',
    shortDescription:
      'Set ejecutivo de escritorio con tangram de madera noble, organizador y porta-celular grabado con el logotipo de tu empresa.',
    fullDescription:
      'Diseñado para empresas e instituciones que buscan un regalo corporativo memorable, útil y diferente. Incluye personalización con logotipo vectorial, tarjeta institucional y empaque de presentación en cartulina ecológica.',
    videoUrl: null,
    salePrice: 68.0,
    promoPrice: 58.0,
    internalCost: 24.0,
    availableStock: 120,
    minStockAlert: 15,
    brand: 'MenteLúdica Corporate',
    recommendedAge: 'Jóvenes y adultos / Empresas',
    dimensions: '22 x 18 x 4.5 cm',
    weightGrams: 460,
    material: 'Madera huayruro / capirona certificada y acrílico satinado',
    features: [
      'Grabado láser de logotipo empresarial de alta nitidez',
      'Incluye Tangram ejecutivo de 7 piezas + libreta de retos creativos',
      'Soporte de escritorio para smartphone y tarjetas',
      'Emisión de Factura Electrónica RUC 20',
    ],
    tags: ['corporativo', 'personalizado', 'logotipo', 'empresas', 'souvenir'],
    isCustomizable: true,
    compatibilityNote: null,
    status: 'published',
    relatedProductIds: ['prod-004', 'prod-008'],
    isFeatured: true,
    isBestseller: false,
    isNew: true,
    rating: 5.0,
    reviewsCount: 23,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
        alt: 'Kit de regalo corporativo lúdico personalizado con logotipo',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-007-a',
        skuVariant: 'ML-SOU-COR-007-UNI',
        name: 'Unidad Personalizada con Nombre / Logo',
        additionalPrice: 0,
      },
      {
        id: 'var-007-b',
        skuVariant: 'ML-SOU-COR-007-PACK10',
        name: 'Pack Corporativo x 10 Unidades (Precio Preferencial)',
        additionalPrice: 440.0,
      },
    ],
  },
  {
    id: 'prod-008',
    sku: 'ML-SOU-EVE-008',
    name: 'Pack de 12 Llaveros y Recuerdos Lúdicos Personalizados con Nombre',
    slug: 'pack-12-llaveros-recuerdos-ludicos-personalizados-nombre',
    categoryId: 'cat-souvenirs',
    categorySlug: 'souvenirs-personalizados',
    categoryName: 'Souvenirs personalizados',
    subcategoryId: 'sub-llaveros-personalizados',
    subcategorySlug: 'llaveros-personalizados',
    subcategoryName: 'Llaveros personalizados',
    shortDescription:
      'Set de 12 recuerdos personalizados en forma de piezas de rompecabezas o bloques con el nombre de cada invitado.',
    fullDescription:
      'Ideales para cumpleaños, promociones escolares, bautizos y eventos especiales en Arequipa y todo el Perú. Cada pieza lleva el nombre individual grabado y tarjeta temática personalizada.',
    videoUrl: null,
    salePrice: 84.0,
    promoPrice: 72.0,
    internalCost: 28.0,
    availableStock: 60,
    minStockAlert: 10,
    brand: 'MenteLúdica Custom Lab',
    recommendedAge: 'Todas las edades',
    dimensions: '6 x 4 cm por llavero (Pack de 12 unidades)',
    weightGrams: 320,
    material: 'Acrílico bicapa y madera natural con herraje metálico inoxidable',
    features: [
      'Incluye 12 unidades con nombres individuales distintos',
      'Diseño previo enviado por WhatsApp o plataforma para aprobación',
      'Empaque individual transparente con tarjeta conmemorativa',
    ],
    tags: ['llaveros', 'cumpleanos', 'eventos', 'personalizado', 'nombres'],
    isCustomizable: true,
    compatibilityNote: null,
    status: 'published',
    relatedProductIds: ['prod-004', 'prod-007'],
    isFeatured: false,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 31,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85',
        alt: 'Recuerdos y llaveros personalizados para cumpleaños y eventos',
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 'var-008-a',
        skuVariant: 'ML-SOU-EVE-008-12',
        name: 'Pack x 12 Unidades Personalizadas',
        additionalPrice: 0,
      },
      {
        id: 'var-008-b',
        skuVariant: 'ML-SOU-EVE-008-24',
        name: 'Pack x 24 Unidades Personalizadas',
        additionalPrice: 62.0,
      },
    ],
  },
];

export function getProductBySlug(slug: string): CatalogProductView | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: CatalogProductView): CatalogProductView[] {
  return CATALOG_PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (product.relatedProductIds.includes(p.id) ||
        p.categoryId === product.categoryId)
  ).slice(0, 4);
}

