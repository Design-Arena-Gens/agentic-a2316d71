"use client";

import { useEffect, useState } from "react";
import { getStoreBySlug } from "@/lib/storage";
import type { Store } from "@/lib/types";

interface Props {
  params: { store: string };
}

export default function Storefront({ params }: Props) {
  const slug = params.store;
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const s = getStoreBySlug(slug);
    setStore(s ?? null);
  }, [slug]);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">?????? ??? ?????</div>
          <a href="/dashboard" className="text-sm underline">????? ????</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-bold">{store.name}</div>
          <nav className="flex items-center gap-6 text-sm">
            <a className="hover:underline" href={`/dashboard/${store.slug}`}>???????</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        {store.products.length === 0 ? (
          <div className="text-black/60 dark:text-white/60">?? ???? ?????? ???.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.products.map((p) => (
              <div key={p.id} className="rounded-2xl border p-6">
                <div className="text-lg font-semibold">{p.name}</div>
                <div className="text-sm text-black/60 dark:text-white/60 mt-1">{p.priceDzd.toLocaleString()} ??</div>
                {p.description && <div className="text-sm mt-2">{p.description}</div>}
                <button className="mt-4 rounded-xl bg-black text-white px-5 py-2 dark:bg-white dark:text-black">
                  ??? ??? ?????
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

