# PricePilot

PricePilot is a small price-watching app for products you are interested in but do not want to buy immediately.

The idea is simple: save a product link once, let the app keep track of the price, and come back when the deal actually looks worth it. It is useful for those items that usually sit in browser tabs, notes apps, or forgotten wishlists.

## What It Does

- Saves product links to a personal watchlist
- Extracts product name, image, price, and currency with Firecrawl
- Stores each user's products securely with Supabase
- Keeps a price history for every tracked item
- Shows price changes in a simple chart
- Sends an email when a product drops in price
- Includes a local preview mode so the homepage still opens before API keys are added

## Why I Made It

Online prices move constantly, and manually checking the same product every few days gets annoying. PricePilot turns that habit into a simple dashboard: add the item, let the app check it, and make the decision later with better context.

## Built With

- Next.js 16
- React 19
- Supabase Auth and Database
- Firecrawl
- Resend
- Tailwind CSS
- Recharts

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The homepage can open without API keys. Sign-in, product saving, scraping, and email alerts need the environment variables below.

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

FIRECRAWL_API_KEY=your_firecrawl_api_key

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

CRON_SECRET=your_generated_cron_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a cron secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Supabase Setup

Create a Supabase project, then run this SQL in the Supabase SQL editor:

```sql
create extension if not exists "uuid-ossp";

create table products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text not null,
  current_price numeric(10,2) not null,
  currency text not null default 'USD',
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table price_history (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  price numeric(10,2) not null,
  currency text not null,
  checked_at timestamp with time zone default now()
);

alter table products
add constraint products_user_url_unique unique (user_id, url);

alter table products enable row level security;
alter table price_history enable row level security;

create policy "Users can view their own products"
  on products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on products for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on products for delete
  using (auth.uid() = user_id);

create policy "Users can view price history for their products"
  on price_history for select
  using (
    exists (
      select 1 from products
      where products.id = price_history.product_id
      and products.user_id = auth.uid()
    )
  );

create index products_user_id_idx on products(user_id);
create index price_history_product_id_idx on price_history(product_id);
create index price_history_checked_at_idx on price_history(checked_at desc);
```

## Google Sign-In

In Supabase, enable the Google auth provider and add this redirect URL in your Google Cloud OAuth settings:

```text
https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
```

For local testing, keep `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

## Notes

This project is designed as a practical full-stack app rather than a landing page. The first screen is the product watchlist experience, and the backend pieces are split into small files so they are easier to understand and customize.
