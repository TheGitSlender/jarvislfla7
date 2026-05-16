"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile, fetchFarmers } from "@/lib/api";

const REGIONS = [
  "Béni Mellal-Khénifra",
  "Marrakech-Safi",
  "Souss-Massa",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Casablanca-Settat",
  "Oriental",
  "Drâa-Tafilalet",
  "Tanger-Tétouan-Al Hoceïma",
  "Guelmim-Oued Noun",
];

const CROPS = ["tomatoes", "wheat", "olives", "barley", "potatoes", "onions", "citrus", "peppers"];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    region: REGIONS[0],
    land_size_ha: 1.0,
    soil_type: "loam",
    water_source: "rain_fed",
    has_irrigation: false,
    known_problems: "",
    selectedCrops: [] as string[],
  });

  function toggle(crop: string) {
    setForm((f) => ({
      ...f,
      selectedCrops: f.selectedCrops.includes(crop)
        ? f.selectedCrops.filter((c) => c !== crop)
        : [...f.selectedCrops, crop],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const profile = {
        name: form.name,
        region: form.region,
        land_size_ha: form.land_size_ha,
        soil_type: form.soil_type,
        water_source: form.water_source,
        has_irrigation: form.has_irrigation,
        current_crops: form.selectedCrops.map((c) => ({ crop: c })),
        known_problems: form.known_problems
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        language: "darija",
      };
      const { farmer_id } = await createProfile(profile);
      router.push(`/chat?farmer_id=${farmer_id}`);
    } catch (err) {
      console.error(err);
      alert("خطأ في إنشاء الملف. تحقق من الاتصال.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDemo() {
    setDemoLoading(true);
    try {
      const farmers = await fetchFarmers();
      if (farmers.length > 0) {
        router.push(`/chat?farmer_id=${farmers[0].id}`);
      }
    } catch {
      alert("تعذر تحميل البيانات التجريبية.");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-stone-50">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl font-bold text-green-800">JarvisLfla7</h1>
          <p className="text-stone-600 mt-1">مستشارك الزراعي الذكي</p>
          <p className="text-sm text-stone-400 mt-1">Your AI agronomist — in Darija</p>
        </div>

        {/* Demo shortcut */}
        <button
          onClick={loadDemo}
          disabled={demoLoading}
          className="w-full mb-6 py-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-medium hover:bg-amber-200 transition disabled:opacity-50"
        >
          {demoLoading ? "جاري التحميل..." : "⚡ تجربة سريعة — Karim (عرض توضيحي)"}
        </button>

        <div className="text-center text-stone-400 text-sm mb-4">— أو سجل مزرعتك —</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <input
              className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="اسمك الكامل"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">المنطقة</label>
              <select
                className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">المساحة (هكتار)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.land_size_ha}
                onChange={(e) => setForm({ ...form, land_size_ha: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">نوع التربة</label>
              <select
                className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.soil_type}
                onChange={(e) => setForm({ ...form, soil_type: e.target.value })}
              >
                <option value="loam">ليمونية (loam)</option>
                <option value="clay">طينية (argile)</option>
                <option value="sandy">رملية (sable)</option>
                <option value="rocky">صخرية (rocailleux)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">مصدر المياه</label>
              <select
                className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.water_source}
                onChange={(e) => setForm({ ...form, water_source: e.target.value })}
              >
                <option value="rain_fed">بور (pluie)</option>
                <option value="drip">تنقيط (goutte-à-goutte)</option>
                <option value="well">بئر (puits)</option>
                <option value="canal">قناة (canal)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">المحاصيل الحالية</label>
            <div className="flex flex-wrap gap-2">
              {CROPS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggle(c)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    form.selectedCrops.includes(c)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-stone-600 border-stone-300 hover:border-green-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">مشاكل معروفة (اختياري)</label>
            <input
              className="w-full border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="مثال: mildiou, Tuta absoluta"
              value={form.known_problems}
              onChange={(e) => setForm({ ...form, known_problems: e.target.value })}
            />
            <p className="text-xs text-stone-400 mt-1">افصل بين المشاكل بفاصلة</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "ابدأ المحادثة ←"}
          </button>
        </form>
      </div>
    </main>
  );
}
