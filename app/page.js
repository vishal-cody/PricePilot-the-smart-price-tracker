import { createClient } from "@/utils/supabase/server";
import { getProducts } from "./actions";
import AddProductForm from "@/components/AddProductForm";
import ProductCard from "@/components/ProductCard";
import {
  Bell,
  ChartLine,
  SearchCheck,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import AuthButton from "@/components/AuthButton";

export default async function Home() {
  const hasSupabaseConfig =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  if (hasSupabaseConfig) {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  }

  const products = user ? await getProducts() : [];

  const features = [
    {
      icon: SearchCheck,
      title: "Paste once, keep watching",
      description:
        "Drop in a product link and keep it on your list instead of checking the same page again and again.",
    },
    {
      icon: ChartLine,
      title: "A small price diary",
      description:
        "Each check adds to the history, so you can see whether today is actually a good deal.",
    },
    {
      icon: Bell,
      title: "No-pressure alerts",
      description:
        "When the price drops, you get a simple heads-up and can decide from there.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-slate-950">
                PricePilot
              </p>
              <p className="text-xs font-medium text-slate-500">
                Built for smarter shopping
              </p>
            </div>
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      <section className="px-4 py-14 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              A practical watchlist for things you actually want
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Save the product now. Buy when the price feels right.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              PricePilot is a simple place to keep products you are thinking
              about buying. It checks prices, remembers the history, and lets
              you come back with a clearer answer than maybe later.
            </p>

            <div className="mt-9">
              <AddProductForm user={user} />
            </div>

            {!hasSupabaseConfig && (
              <p className="mt-4 max-w-2xl rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Local preview mode: add your Supabase keys in `.env.local` to
                turn this preview into a real saved watchlist.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Your list at a glance
                </p>
                <p className="text-2xl font-bold text-slate-950">
                  {user ? products.length : 0} active items
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                <ChartLine className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-700">
                  Price checks
                </span>
                <span className="text-sm font-semibold text-slate-950">
                  Once a day
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-700">
                  Store coverage
                </span>
                <span className="text-sm font-semibold text-slate-950">
                  Any product URL
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-slate-50 p-4">
                <span className="text-sm font-medium text-slate-700">
                  Reminder style
                </span>
                <span className="text-sm font-semibold text-slate-950">
                  Email alert
                </span>
              </div>
            </div>
          </div>
        </div>

        {products.length === 0 && (
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-semibold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {user && products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Saved for later
              </p>
              <h2 className="text-2xl font-bold text-slate-950">
                Products you are watching
              </h2>
            </div>
            <span className="text-sm text-slate-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {user && products.length === 0 && (
        <section className="mx-auto max-w-2xl px-4 pb-20 text-center">
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12">
            <TrendingDown className="mx-auto mb-4 h-16 w-16 text-slate-400" />
            <h2 className="mb-2 text-xl font-semibold text-slate-950">
              Nothing saved yet
            </h2>
            <p className="text-slate-600">
              Paste the first product you keep checking manually. PricePilot
              will take it from there.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-medium text-emerald-700">
            Why I built this
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            For the products that sit in your tabs for weeks.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            This project is meant to solve a familiar problem: you find
            something useful, decide the price is not quite right, and then
            forget to check again. PricePilot keeps that small decision
            organized so you can buy with a little more patience and a little
            less guesswork.
          </p>
        </div>
      </section>
    </main>
  );
}
