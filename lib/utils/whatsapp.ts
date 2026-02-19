import { STORE_NAME, STORE_PHONE_INTL, STORE_URL } from "@/lib/constants/store";
import { formatPriceRWF } from "@/lib/utils/format";
import type { Product } from "@/types/product";

export const getProductPageUrl = (slug: string, baseUrl = STORE_URL) =>
  `${baseUrl}/product/${slug}`;

export const createWhatsAppUrl = (message: string) =>
  `https://wa.me/${STORE_PHONE_INTL}?text=${encodeURIComponent(message)}`;

export const createBuyMessage = (
  product: Pick<Product, "name" | "priceRWF" | "slug">,
  quantity = 1,
) =>
  `Hello ${STORE_NAME}, I want to buy: ${product.name} - ${formatPriceRWF(product.priceRWF)}. Qty: ${quantity}. Link: ${getProductPageUrl(product.slug)}. Delivery location: ____`;

export const createProductWhatsAppBuyLink = (
  product: Pick<Product, "name" | "priceRWF" | "slug">,
  quantity = 1,
) => createWhatsAppUrl(createBuyMessage(product, quantity));

export const createProductQuestionLink = (
  product: Pick<Product, "name" | "slug">,
) => {
  const message = `Hello ${STORE_NAME}, I have a question about ${product.name}. Link: ${getProductPageUrl(product.slug)}.`;
  return createWhatsAppUrl(message);
};

export const createSupportWhatsAppLink = () =>
  createWhatsAppUrl(
    `Hello ${STORE_NAME}, I need help choosing camera gear and electronics products.`,
  );
