"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Check, X, Users, Calendar, MapPin, Plus } from "lucide-react";
import type { Tour, TourRequest, Profile } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hostedTours, setHostedTours] = useState<Tour[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<TourRequest[]>([]);
  const [myApplications, setMyApplications] = useState<TourRequest[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // 1. Load Profile
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (p) setProfile(p as Profile);

        // 2. Load Hosted Tours
        const { data: tours } = await supabase
          .from("tours")
          .select("*")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false });

        if (tours) setHostedTours(tours as Tour[]);

        // 3. Load Incoming Requests for user's tours
        const tourIds = tours?.map((t) => t.id) || [];
        if (tourIds.length > 0) {
          const { data: reqs } = await supabase
            .from("tour_requests")
            .select(`
              *,
              profiles:applicant_id (
                id,
                full_name,
                university_name,
                department,
                is_verified,
                phone_number
              ),
              tours:tour_id (
                title
              )
            `)
            .in("tour_id", tourIds)
            .order("created_at", { ascending: false });

          if (reqs) setIncomingRequests(reqs as TourRequest[]);
        }

        // 4. Load My Applications to other tours
        const { data: apps } = await supabase
          .from("tour_requests")
          .select(`
            *,
            tours:tour_id (
              id,
              title,
              destination,
              departure_date,
              return_date,
              estimated_budget_bdt
            )
          `)
          .eq("applicant_id", user.id)
          .order("created_at", { ascending: false });

        if (apps) setMyApplications(apps as TourRequest[]);
      } catch (e) {
        console.error("Dashboard load error", e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [supabase, router]);

  const updateRequestStatus = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      const { error } = await supabase
        .from("tour_requests")
        .update({ status })
        .eq("id", requestId);

      if (!error) {
        setIncomingRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading your travel dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Hello, {profile?.full_name || "Campus Traveler"} 👋
            </h1>
            {profile?.is_verified && (
              <span className="p-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {profile?.university_name} {profile?.department ? `• ${profile.department}` : ""}
          </p>
        </div>

        <Link
          href="/tours/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Plan New Tour
        </Link>
      </div>

      {/* Incoming Requests on My Hosted Tours */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Incoming Join Requests ({incomingRequests.filter((r) => r.status === "pending").length} pending)
        </h2>

        {incomingRequests.length === 0 ? (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
            No incoming join requests yet. When students apply to your tours, they will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {req.profiles?.full_name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {req.profiles?.university_name}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                      req.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : req.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="font-bold block text-slate-500 text-[10px] uppercase">Message:</span>
                  &quot;{req.message}&quot;
                </div>

                <p className="text-[11px] text-slate-400">
                  Applying for: <strong>{req.tours?.title}</strong>
                </p>

                {req.status === "pending" && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => updateRequestStatus(req.id, "accepted")}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, "rejected")}
                      className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tours I Have Created */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          My Hosted Tours ({hostedTours.length})
        </h2>

        {hostedTours.length === 0 ? (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
            You haven&apos;t posted any tours yet. Click &quot;Plan New Tour&quot; above to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostedTours.map((t) => (
              <div
                key={t.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-600" />{t.destination}</span>
                    <span>৳ {t.estimated_budget_bdt}</span>
                  </div>
                </div>

                <Link
                  href={`/tours/${t.id}`}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tours I Have Applied To */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Tours I Applied To ({myApplications.length})
        </h2>

        {myApplications.length === 0 ? (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
            You haven&apos;t requested to join any tours yet. Browse tours to find your adventure!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {app.tours?.title}
                  </h4>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      app.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : app.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Status: {app.status}
                  </span>
                </div>

                <Link
                  href={`/tours/${app.tours?.id}`}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
