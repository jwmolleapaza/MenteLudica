import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  CATALOG_PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
} from '@/modules/catalog/catalog-data';
import { ProductDetailClient } from '@/components/catalog/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATALOG_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name} (${product.sku})`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | MenteLúdica Perú`,
      description: product.shortDescription,
      images: product.images.map((i) => i.url),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = getRelatedProducts(product);

  // Datos estructurados Schema.org Product para SEO rico en Google Perú (Sección 15)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    image: product.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: product.promoPrice ?? product.salePrice,
      availability:
        product.availableStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        similarProducts={similarProducts}
      />
    </>
  );
}

