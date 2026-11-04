"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { POPULAR_DESTINATIONS } from "@/lib/constants/universities";
import { MapPin, Calendar, Wallet, Users, MessageSquare, AlertCircle, ShieldAlert } from "lucide-react";
import type { Profile } from "@/types";

export default function CreateTourPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState(POPULAR_DESTINATIONS[0]);
  const [customDestination, setCustomDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [budget, setBudget] = useState<number>(3500);
  const [maxMembers, setMaxMembers] = useState<number>(6);
  const [genderPreference, setGenderPreference] = useState<"any" | "male_only" | "female_only">("any");
  const [description, setDescription] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) setProfile(data as Profile);
      } catch (e) {
        console.error("Auth check error", e);
      } finally {
        setLoadingProfile(false);
      }
    }
    checkAuth();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const finalDestination =
      destination === "Other" ? customDestination.trim() : destination;

    if (!finalDestination) {
      setErrorMsg("Please specify a destination.");
      setSubmitting(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in first.");

      const { data, error } = await supabase.from("tours").insert({
        creator_id: user.id,
        title: title.trim(),
        destination: finalDestination,
        departure_date: departureDate,
        return_date: returnDate,
        estimated_budget_bdt: Number(budget),
        max_members: Number(maxMembers),
        gender_preference: genderPreference,
        description: description.trim(),
        whatsapp_group_link: whatsappLink.trim() || null,
        status: "open",
      }).select().single();

      if (error) throw new Error(error.message);

      router.push(`/tours/${data.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish tour.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return <div className="py-20 text-center text-slate-400">Loading your profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Plan a Campus Tour 🗺️
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish your trip details, set budget expectations, and invite verified student tourmates.
          </p>
        </div>

        {profile && !profile.is_verified && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
            <div>
              <strong>Student Verification Pending:</strong> Your student ID or email is awaiting validation. You can prepare this tour, but it will be publicly visible to others once your verification is completed.
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Tour Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3-Day Sajek Valley Cloud Tour over Weekend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Destination Spot *
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {POPULAR_DESTINATIONS.map((d) => (
                  <option key={d} value={d} className="dark:bg-slate-900">
                    {d}
                  </option>
                ))}
                <option value="Other" className="dark:bg-slate-900">Other Destination</option>
              </select>
            </div>

            {destination === "Other" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Specify Custom Spot *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bichanakandi, Sylhet"
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Departure & Return Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Departure Date *
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Return Date *
              </label>
              <input
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Budget & Max Members */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Estimated Budget (BDT) *
              </label>
              <input
                type="number"
                required
                min={500}
                max={50000}
                step={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Max Tourmates *
              </label>
              <input
                type="number"
                required
                min={2}
                max={30}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Group Preference
              </label>
              <select
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="any">Any / Mixed</option>
                <option value="female_only">Female Only 🌸</option>
                <option value="male_only">Male Only</option>
              </select>
            </div>
          </div>

          {/* Description & Itinerary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Tour Plan & Details *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Describe the day-by-day plan, transport (bus/train), stay arrangements, food preferences, and any specific requirements for tourmates."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Private WhatsApp Group Link */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Private WhatsApp Group Invite Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://chat.whatsapp.com/..."
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-400">
              🔒 Privacy Guaranteed: This link is NEVER displayed publicly. It is automatically revealed ONLY to students whose join requests you approve.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl disabled:opacity-50 text-sm"
          >
            {submitting ? "Publishing Tour..." : "Publish Tour Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
