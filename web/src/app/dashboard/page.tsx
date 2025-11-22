"use client";

import { useEffect, useMemo, useState } from "react";
import { createStore, loadStores } from "@/lib/storage";
import type { Plan } from "@/lib/types";

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u0600-\u06FF]/g, "") // drop Arabic letters for URL safety
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function Dashboard() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState<Plan>("free");
  const [stores, setStores] = useState(loadStores());

  useEffect(() => {
    setStores(loadStores());
  }, []);

  const autoSlug = useMemo(() => (slug ? slug : slugify(name)), [name, slug]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !autoSlug) return;
    const store = createStore(name, autoSlug, plan);
    setStores(loadStores());
    setName("");
    setSlug("");
    setPlan("free");
    window.location.href = `/dashboard/${store.slug}`;
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-bold">???? ??????</div>
          <nav className="flex items-center gap-6 text-sm">
            <a className="hover:underline" href="/">????????</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">????? ???? ????</h1>
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 rounded-2xl border p-6 max-w-2xl">
          <label className="grid gap-2">
            <span className="text-sm text-black/70 dark:text-white/70">??? ??????</span>
            <input
              className="rounded-xl border px-4 py-3 bg-white dark:bg-black"
              placeholder="????: ???? ??????"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-black/70 dark:text-white/70">?????? (???????)</span>
            <input
              className="rounded-xl border px-4 py-3 bg-white dark:bg-black"
              placeholder="????: flowers"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <span className="text-xs text-black/60 dark:text-white/60">???? ??????: /{autoSlug || "store"}</span>
          </label>

          <fieldset className="grid gap-3">
            <legend className="text-sm text-black/70 dark:text-white/70">?????</legend>
            <div className="grid sm:grid-cols-3 gap-3">
              <label className={`rounded-xl border p-4 cursor-pointer ${plan === "free" ? "ring-2 ring-black dark:ring-white" : ""}`}>
                <input type="radio" name="plan" className="hidden" value="free" checked={plan === "free"} onChange={() => setPlan("free")} />
                <div className="font-semibold">?????</div>
                <div className="text-sm text-black/60 dark:text-white/60">0 ??</div>
              </label>
              <label className={`rounded-xl border p-4 cursor-pointer ${plan === "pro" ? "ring-2 ring-black dark:ring-white" : ""}`}>
                <input type="radio" name="plan" className="hidden" value="pro" checked={plan === "pro"} onChange={() => setPlan("pro")} />
                <div className="font-semibold">???????</div>
                <div className="text-sm text-black/60 dark:text-white/60">1,990 ??/???</div>
              </label>
              <label className={`rounded-xl border p-4 cursor-pointer ${plan === "enterprise" ? "ring-2 ring-black dark:ring-white" : ""}`}>
                <input type="radio" name="plan" className="hidden" value="enterprise" checked={plan === "enterprise"} onChange={() => setPlan("enterprise")} />
                <div className="font-semibold">?????</div>
                <div className="text-sm text-black/60 dark:text-white/60">??? ?????</div>
              </label>
            </div>
          </fieldset>

          <div className="flex gap-3">
            <button type="submit" className="rounded-xl bg-black text-white px-6 py-3 dark:bg-white dark:text-black">
              ????? ??????
            </button>
            <a href="/" className="rounded-xl border px-6 py-3">????</a>
          </div>
        </form>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">??????</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((s) => (
              <a key={s.id} href={`/dashboard/${s.slug}`} className="rounded-xl border p-4 hover:bg-black/5 dark:hover:bg-white/5">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-black/60 dark:text-white/60">/{s.slug} ? ?????: {s.plan}</div>
              </a>
            ))}
            {stores.length === 0 && (
              <div className="text-black/60 dark:text-white/60">?? ???? ????? ???.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

