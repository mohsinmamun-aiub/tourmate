"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SAMPLE_TOURS } from "@/lib/constants/sampleTours";
import { MapPin, Calendar, Users, Wallet, ShieldCheck, MessageCircle, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Tour, TourRequest } from "@/types";

function TourDetailsContent() {
  const params = useParams();
  const tourId = params?.id as string;
  const supabase = createClient();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Join Request state
  const [myRequest, setMyRequest] = useState<TourRequest | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [joinStatusMsg, setJoinStatusMsg] = useState("");

  useEffect(() => {
    if (!tourId) return;

    async function loadTourAndUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);

          // Check if already requested in Supabase
          if (!tourId.startsWith("sample-")) {
            const { data: req } = await supabase
              .from("tour_requests")
              .select("*")
              .eq("tour_id", tourId)
              .eq("applicant_id", user.id)
              .maybeSingle();

            if (req) setMyRequest(req as TourRequest);
          }
        }

        let foundTour: Tour | null = null;

        // 1. Try finding in Supabase
        if (!tourId.startsWith("sample-")) {
          const { data: tourData } = await supabase
            .from("tours")
            .select(`
              *,
              profiles:creator_id (
                id,
                full_name,
                university_name,
                department,
                is_verified
              )
            `)
            .eq("id", tourId)
            .maybeSingle();

          if (tourData) foundTour = tourData as Tour;
        }

        // 2. If not found in Supabase (or is a sample tour), load from SAMPLE_TOURS
        if (!foundTour) {
          const sample = SAMPLE_TOURS.find((s) => s.id === tourId);
          if (sample) foundTour = sample;
        }

        setTour(foundTour);
      } catch (e) {
        console.error("Error loading tour", e);
        const sample = SAMPLE_TOURS.find((s) => s.id === tourId);
        if (sample) setTour(sample);
      } finally {
        setLoading(false);
      }
    }

    loadTourAndUser();
  }, [supabase, tourId]);

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingJoin(true);
    setJoinStatusMsg("");

    // If it's a sample starter tour, simulate request smoothly
    if (tourId.startsWith("sample-")) {
      setTimeout(() => {
        setMyRequest({
          id: "req-demo",
          tour_id: tourId,
          applicant_id: "demo-user",
          status: "pending",
          message: joinMessage,
          created_at: new Date().toISOString(),
        });
        setJoinStatusMsg("🎉 Join request sent! In real trips, the organizer receives this in their dashboard.");
        setSubmittingJoin(false);
      }, 600);
      return;
    }

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tour_requests")
        .insert({
          tour_id: tourId,
          applicant_id: currentUser.id,
          message: joinMessage.trim() || "Hi! I'd like to join your tour.",
          status: "pending",
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      setMyRequest(data as TourRequest);
      setJoinStatusMsg("Your request was sent to the organizer!");
    } catch (err: any) {
      setJoinStatusMsg(`Error: ${err.message}`);
    } finally {
      setSubmittingJoin(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading tour details...</div>;
  }

  if (!tour) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Tour not found</h2>
        <p className="text-sm text-slate-500">This tour may have expired or been removed.</p>
        <Link href="/tours" className="inline-block text-emerald-600 font-bold hover:underline">
          ← Back to All Tours
        </Link>
      </div>
    );
  }

  const isCreator = currentUser?.id === tour.creator_id;
  const isAccepted = myRequest?.status === "accepted";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <Link href="/tours" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4" />
        Back to All Tours
      </Link>

      {/* Main Tour Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        {/* Title & Badges */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Organizer: {tour.profiles?.university_name || "Verified Student"}
            </span>

            {tour.gender_preference !== "any" && (
              <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {tour.gender_preference.replace("_", " ")}
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              {tour.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
            {tour.title}
          </h1>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Destination</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{tour.destination}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{tour.departure_date}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Budget</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 text-sm mt-0.5">
                <Wallet className="w-4 h-4 shrink-0" />
                <span>৳ {tour.estimated_budget_bdt.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Capacity</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Max {tour.max_members} mates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Organizer Profile Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center">
              {tour.profiles?.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {tour.profiles?.full_name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">
                {tour.profiles?.university_name} {tour.profiles?.department ? `• ${tour.profiles.department}` : ""}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            Tour Host
          </span>
        </div>

        {/* Tour Description & Itinerary */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Trip Plan & Itinerary
          </h3>
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/40 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {tour.description}
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Campus Safety Advisory:</strong>
            <p className="text-amber-800 dark:text-amber-300">
              Always hold an initial meetup inside a university campus or well-lit public space before the tour. Do not transfer advance trip money without mutual confirmation and identity cross-check.
            </p>
          </div>
        </div>

        {/* Unlocked WhatsApp link for accepted members */}
        {(isAccepted || tourId.startsWith("sample-")) && tour.whatsapp_group_link && (
          <div className="p-6 rounded-2xl bg-emerald-600 text-white space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <h4 className="font-bold text-lg">Accepted Tourmates Coordination</h4>
            </div>
            <p className="text-xs text-emerald-100">
              Once an organizer approves your request, the private group coordination link unlocks below:
            </p>
            <a
              href={tour.whatsapp_group_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Open WhatsApp Coordination Group
            </a>
          </div>
        )}

        {/* Action Area */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          {isCreator ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">You are the creator of this tour.</span>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-all"
              >
                Manage Requests in Dashboard
              </Link>
            </div>
          ) : myRequest ? (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Your Request Status</span>
                <span className="text-sm font-bold text-emerald-600 capitalize">
                  {myRequest.status}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {myRequest.status === "pending" ? "Awaiting organizer approval" : "Response received"}
              </span>
            </div>
          ) : (
            <form onSubmit={handleJoinRequest} className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Interested in this Tour? Send a Join Request
              </h4>
              <textarea
                rows={3}
                placeholder="Introduce yourself (e.g. your university, department, travel experience, and why you want to join this trip)..."
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={submittingJoin}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
              >
                {submittingJoin ? "Sending Request..." : "Request to Join Tour"}
              </button>
              {joinStatusMsg && (
                <p className="text-xs text-center font-semibold text-emerald-600">{joinStatusMsg}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TourDetailsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading tour...</div>}>
      <TourDetailsContent />
    </Suspense>
  );
}
