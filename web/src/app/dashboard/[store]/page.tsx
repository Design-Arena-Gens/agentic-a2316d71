"use client";

import { useEffect, useState } from "react";
import { addProduct, deleteProduct, getStoreBySlug, updateStorePlan } from "@/lib/storage";
import type { Plan } from "@/lib/types";

interface Props {
  params: { store: string };
}

export default function StoreDashboard({ params }: Props) {
  const slug = params.store;
  const [storeName, setStoreName] = useState<string>("");
  const [plan, setPlan] = useState<Plan>("free");
  const [products, setProducts] = useState(() => getStoreBySlug(slug)?.products ?? []);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const store = getStoreBySlug(slug);
    if (store) {
      setStoreName(store.name);
      setPlan(store.plan);
      setProducts(store.products);
    }
  }, [slug]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(price.replace(/,/g, ""));
    if (!name || isNaN(priceNum)) return;
    addProduct(slug, { name, priceDzd: priceNum, description: description || undefined });
    const store = getStoreBySlug(slug);
    setProducts(store?.products ?? []);
    setName("");
    setPrice("");
    setDescription("");
  }

  function handleDelete(id: string) {
    deleteProduct(slug, id);
    const store = getStoreBySlug(slug);
    setProducts(store?.products ?? []);
  }

  function changePlan(p: Plan) {
    updateStorePlan(slug, p);
    setPlan(p);
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-bold">????? ??????</div>
          <nav className="flex items-center gap-6 text-sm">
            <a className="hover:underline" href="/dashboard">???? ???????</a>
            <a className="hover:underline font-semibold" href={`/${slug}`}>????? ??????</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm text-black/60 dark:text-white/60">??????</div>
                <div className="text-xl font-semibold">{storeName} <span className="text-black/60 dark:text-white/60">/{slug}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">?????:</span>
                <select value={plan} onChange={(e) => changePlan(e.target.value as Plan)} className="rounded-lg border bg-white dark:bg-black px-3 py-2">
                  <option value="free">?????</option>
                  <option value="pro">???????</option>
                  <option value="enterprise">?????</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold mb-4">????? ????</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                className="rounded-xl border px-4 py-3 bg-white dark:bg-black"
                placeholder="??? ??????"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="rounded-xl border px-4 py-3 bg-white dark:bg-black"
                placeholder="????? (??)"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                className="rounded-xl border px-4 py-3 bg-white dark:bg:black"
                placeholder="??? (???????)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="sm:col-span-3">
                <button type="submit" className="rounded-xl bg-black text-white px-6 py-3 dark:bg-white dark:text-black">
                  ?????
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold mb-4">????????</h2>
            {products.length === 0 ? (
              <div className="text-black/60 dark:text-white/60">?? ???? ?????? ???.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="rounded-xl border p-4">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-black/60 dark:text-white/60">{p.priceDzd.toLocaleString()} ??</div>
                    {p.description && <div className="text-sm mt-1">{p.description}</div>}
                    <div className="mt-3">
                      <button onClick={() => handleDelete(p.id)} className="text-sm rounded-lg border px-3 py-2">
                        ???
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

