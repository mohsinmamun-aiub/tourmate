"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { POPULAR_DESTINATIONS } from "@/lib/constants/universities";
import { MapPin, Calendar, Users, Wallet, Plus, Filter, ShieldCheck } from "lucide-react";
import type { Tour } from "@/types";

// Starter sample tours so the user sees a rich UI even before populating their database
const SAMPLE_TOURS: Tour[] = [
  {
    id: "sample-1",
    creator_id: "demo-1",
    title: "Sajek Valley Cloud Chasing & Helipad Camping ☁️",
    destination: "Sajek Valley",
    departure_date: "2026-11-20",
    return_date: "2026-11-23",
    estimated_budget_bdt: 4500,
    max_members: 6,
    gender_preference: "any",
    description: "Planning a 3-day weekend trip to Sajek Valley. We will take a Chander Gari from Khagrachhari, stay in a wooden cottage with mountain view, and catch sunrise at the helipad.",
    status: "open",
    created_at: new Date().toISOString(),
    profiles: {
      id: "demo-1",
      full_name: "Mahir Faysal",
      university_name: "BUET",
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "sample-2",
    creator_id: "demo-2",
    title: "Saint Martin Island Coral Beach & BBQ Night 🌊",
    destination: "Saint Martin's Island",
    departure_date: "2026-12-05",
    return_date: "2026-12-09",
    estimated_budget_bdt: 6200,
    max_members: 8,
    gender_preference: "any",
    description: "Ship ride from Teknaf, staying at western beach cottages. Cycling around Chera Dwip, live fish BBQ on the beach, and stargazing at night.",
    status: "open",
    created_at: new Date().toISOString(),
    profiles: {
      id: "demo-2",
      full_name: "Anika Tabassum",
      university_name: "University of Dhaka (DU)",
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "sample-3",
    creator_id: "demo-3",
    title: "Girls-Only Hiking & Tea Garden Exploration in Srimangal 🍃",
    destination: "Srimangal & Sylhet",
    departure_date: "2026-11-27",
    return_date: "2026-11-29",
    estimated_budget_bdt: 3200,
    max_members: 5,
    gender_preference: "female_only",
    description: "Safe girls-only weekend getaway! Visiting Lawachara National park, Seven Layer tea cabin, and bicycling through lush tea estates.",
    status: "open",
    created_at: new Date().toISOString(),
    profiles: {
      id: "demo-3",
      full_name: "Sumaiya Rahman",
      university_name: "BRAC University",
      is_verified: true,
      created_at: new Date().toISOString(),
    },
  },
];

export default function ToursPage() {
  const supabase = createClient();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [maxBudget, setMaxBudget] = useState<number>(10000);

  useEffect(() => {
    async function fetchTours() {
      try {
        const { data, error } = await supabase
          .from("tours")
          .select(`
            *,
            profiles:creator_id (
              id,
              full_name,
              university_name,
              is_verified
            )
          `)
          .eq("status", "open")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          // If no database tours yet, display the sample tours
          setTours(SAMPLE_TOURS);
        } else {
          setTours(data as Tour[]);
        }
      } catch {
        setTours(SAMPLE_TOURS);
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, [supabase]);

  const filteredTours = tours.filter((tour) => {
    const matchesDest =
      selectedDestination === "all" ||
      tour.destination.toLowerCase().includes(selectedDestination.toLowerCase());
    const matchesGender =
      genderFilter === "all" || tour.gender_preference === genderFilter;
    const matchesBudget = tour.estimated_budget_bdt <= maxBudget;

    return matchesDest && matchesGender && matchesBudget;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Upcoming Student Tours 🎒
          </h1>
          <p className="text-sm text-slate-500">
            Find peer travelers from verified Bangladeshi universities
          </p>
        </div>

        <Link
          href="/tours/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all hover:scale-105 self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          Plan a New Tour
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Destination Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Destination
          </label>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
          >
            <option value="all">All Destinations</option>
            {POPULAR_DESTINATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Group Preference
          </label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
          >
            <option value="all">All Tour Groups</option>
            <option value="any">Any / Mixed Group</option>
            <option value="female_only">Girls-Only Trips 🌸</option>
            <option value="male_only">Boys-Only Trips</option>
          </select>
        </div>

        {/* Budget Filter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Max Budget
            </label>
            <span className="text-xs font-bold text-emerald-600">
              ৳ {maxBudget.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={15000}
            step={500}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading tours...</div>
      ) : filteredTours.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Filter className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
            No tours found matching your filters
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your budget or destination, or be the first to create this trip!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {tour.profiles?.university_name || "Verified Student"}
                  </span>

                  {tour.gender_preference === "female_only" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
                      Girls Only 🌸
                    </span>
                  )}
                  {tour.gender_preference === "male_only" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      Boys Only
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {tour.title}
                </h3>

                {/* Destination & Dates */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {tour.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {tour.departure_date} to {tour.return_date}
                    </span>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* Footer info: Budget & Members */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-base">
                    <Wallet className="w-4 h-4" />
                    <span>৳ {tour.estimated_budget_bdt.toLocaleString()}</span>
                    <span className="text-[11px] font-normal text-slate-400">/person</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>Max {tour.max_members} mates</span>
                  </div>
                </div>

                <Link
                  href={`/tours/${tour.id}`}
                  className="block w-full py-2.5 text-center text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 rounded-xl transition-all"
                >
                  View Details & Request to Join
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
