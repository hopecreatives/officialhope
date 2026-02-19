# OfficialHope E-commerce Template

Professional, responsive dark-mode e-commerce template for **OfficialHope** (`officialhope.com`) built with **Next.js App Router + TypeScript + Tailwind CSS**.

## Run locally

```bash
npm install
npm run dev
```

Production build check:

```bash
npm run build
```

Run Sanity Studio (admin dashboard):

```bash
npm run studio:dev
```

You can also start the admin panel from the `sanity` folder now:

```bash
cd sanity
npm run dev
```

## Sanity setup

1. Create a Sanity project/dataset (or use an existing one):
- Go to [Sanity Manage](https://www.sanity.io/manage) and create a project
- Or use CLI: `npx sanity@latest login` then `npx sanity@latest init --cwd sanity`

2. Add environment variables in `/Users/admin/Documents/New project/hopestore/.env.local`:

```bash
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
```

You can start from `.env.example`.

Important:
- `SANITY_PROJECT_ID` must be your real Sanity project id (not `your-project-id`)
- IDs can contain lowercase letters, numbers, and dashes only

3. Start storefront and Studio:
- Storefront: `npm run dev`
- Studio: `npm run studio:dev`

Hosted admin panel:
- `https://officialhope.sanity.studio/`

If Studio shows an old browser build/runtime error, clear its cache and restart:

```bash
rm -rf sanity/.sanity
npm run studio:dev
```

If Studio says `Port 3333 is already in use`, stop the old process and restart:

```bash
pkill -f "sanity dev"
npm run studio:dev
```

4. Optional Studio deployment:

```bash
npm run studio:build
npm run studio:deploy
```

5. Add your first product:
- Open Studio
- Create `Product`
- Fill required fields (`name`, `slug`, `category`, `condition`, `priceRWF`, `images`, etc.)
- Publish
- Storefront updates automatically via ISR revalidation (60 seconds)

Product schema fields:
- `name` (string)
- `slug` (from name)
- `category` (`camera`, `lens`, `lighting`, `gimbal`, `tripod`, `recorder`, `laptop`, `macbook`, `iphone`)
- `brand` (string)
- `condition` (`new`, `used`)
- `priceRWF` (number)
- `inStock` (boolean)
- `featured` (boolean)
- `shortDesc` (string)
- `description` (text)
- `specs` (array of strings)
- `images` (array of images with alt text)

## Key features

- Sticky header with announcement bar, search, category menu, and cart UI.
- Horizontal category navigation with dynamic `/category/[slug]` pages.
- Home page with hero, featured categories, featured products, and trust section.
- Shop page with advanced client-side filtering (brand checkboxes, condition, in-stock, price range), sorting, and pagination UI.
- Dynamic product details page with image gallery, specs table, WhatsApp buy flow, and related products.
- Sanity CMS-backed product source with GROQ queries (`getAllProducts`, `getProductsByCategory`, `getProductBySlug`).
- About and Contact pages.
- Floating WhatsApp support button on all pages.
- SEO-ready metadata + OpenGraph + JSON-LD structured data.

## WhatsApp buy flow

Every product has a WhatsApp purchase action using Rwanda format:

- Local phone: `0782487331`
- WhatsApp base: `https://wa.me/250782487331`

Prefilled message format:

> Hello OfficialHope, I want to buy: {Product Name} - {Price} RWF. Qty: 1. Link: https://officialhope.com/product/{slug}. Delivery location: ____

## Brand and filter maintenance

- Brand/domain text:
  `lib/constants/store.ts` controls `STORE_NAME`, `STORE_DOMAIN`, and `STORE_URL`.  
  Most metadata and visible branding references use these constants.
- Shop/category sorting and filters:
  `components/shop/shop-client.tsx` contains the full client-side filter + sorting logic used by both `/shop` and `/category/[slug]`.
- Add a new brand:
  Add products with the new `brand` value in Sanity; brand options are generated automatically from available products.
- Add a new condition:
  Update allowed condition values in `sanity/schemaTypes/product.ts`, then update condition labels in `lib/constants/catalog.ts` and filter options in `components/shop/shop-client.tsx`.
- Add a new category:
  Update category definitions in `lib/constants/catalog.ts` (`CATEGORIES`, `SANITY_CATEGORY_LABELS`, `CATEGORY_NAV_ITEMS`) and Sanity category enum in `sanity/schemaTypes/product.ts`.  
  Homepage category tiles can also be managed in Studio via the `Category` schema (`sanity/schemaTypes/category.ts`).

## Replace placeholder images

All product image paths are centralized in:

- `lib/data/productImages.ts`

Add/replace files in:

- `public/products/`

Then update the map in `lib/data/productImages.ts`.  
Some key models already include inline comments: `Replace this with official product image`.

Sanity product images are transformed with Sanity image URL builder in:

- `lib/sanityClient.ts`

## Folder structure

```text
app/
  about/page.tsx
  category/[slug]/page.tsx
  contact/page.tsx
  product/[slug]/page.tsx
  shop/page.tsx
  layout.tsx
  page.tsx
  globals.css
sanity/
  sanity.config.ts
  sanity.cli.ts
  schemaTypes/
    index.ts
    product.ts
components/
  contact/contact-form.tsx
  layout/
    announcement-bar.tsx
    category-navigation-bar.tsx
    floating-whatsapp-button.tsx
    site-footer.tsx
    site-header.tsx
  product/
    copy-link-button.tsx
    product-gallery.tsx
  shop/shop-client.tsx
  ui/
    product-card.tsx
    section-heading.tsx
lib/
  constants/
    catalog.ts
    store.ts
  data/
    homeShowcase.ts
    productImages.ts
    products.ts
  sanityClient.ts
  utils/
    format.ts
    whatsapp.ts
public/
  products/
    canon-r6.jpg
    sony-a7iii.jpg
    ...
types/
  product.ts
```
