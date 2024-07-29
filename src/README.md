# Current Plan

# Building an E-Commerce Application with Stripe

## Grid layout of products (7/26/24 - Current)

### Get products from Stripe

- First BFF Route and Controller -> products: Contollers server as a data access layer, format the data here for our components to consume it.

- [Stripe - All Products](https://docs.stripe.com/api/products/retrieve)

### Create Module: ProductsGrid

    - Custom Hook: useProducts
        - fetches data from BFF route /products
        - implement useCallback()

- Success and Error pages (used in module StripeCh)
  - src/pages/[product]/succcess
  - src/pages/[product]/cancel

Need Products inteface first, what data does the endpoint give us? Then create style StripeCheckout().

**_ We have a few sets of states for a product grid _**

1. ProductsGrid: n x n grid of rectangles containing a product image, title, description
   1. onClick: handleOpenModal(ProductCheckoutModal)

ProductCheckoutModal

- onSuccess:

# Next js introduction

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
