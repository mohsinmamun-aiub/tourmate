import Link from "next/link";
import { POPULAR_DESTINATIONS } from "@/lib/constants/universities";
import { Compass, ShieldCheck, Users, Wallet, ArrowRight, MapPin, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
            Exclusively for University & College Students in Bangladesh
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Want to go on a tour? <br />
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Verified Campus Tourmates</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Say goodbye to disorganized Facebook posts and strangers. Connect with verified students from DU, BUET, NSU, BRACU, AIUB, and campuses nationwide for safe, budget-friendly adventures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/tours"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5" />
              Explore Open Tours
            </Link>
            <Link
              href="/tours/create"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              Create a Tour
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-left">
            <div className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl">
              <span className="text-emerald-600 font-bold text-lg block">100%</span>
              <span className="text-xs text-slate-500">Student ID or Edu Mail Verified</span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl">
              <span className="text-emerald-600 font-bold text-lg block">Safe</span>
              <span className="text-xs text-slate-500">Female-Only & Campus Filters</span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl">
              <span className="text-emerald-600 font-bold text-lg block">Budget</span>
              <span className="text-xs text-slate-500">Split Costs Fairly in BDT</span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl">
              <span className="text-emerald-600 font-bold text-lg block">Free</span>
              <span className="text-xs text-slate-500">Zero Commission / Open Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How TourMate BD Works
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Travel made safe and simple in three easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold text-xl">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Student Verification
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sign up with your university institutional email (`.edu.bd`) or upload your Student ID card. Every member is verified to keep the community genuine.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold text-xl">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Discover or Post Tours
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Planning a weekend trip to Sajek or Saint Martin? Set your dates, estimated budget, and member slots. Or browse upcoming student trips matching your holiday.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold text-xl">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Connect & Travel Together
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Send a join request with an intro message. Once approved by the organizer, unlock private group coordination details and plan your journey!
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations in BD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Trending Destinations in Bangladesh
            </h2>
            <p className="text-sm text-slate-500">Popular weekend getaways loved by students</p>
          </div>
          <Link href="/tours" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {POPULAR_DESTINATIONS.map((dest) => (
            <Link
              key={dest}
              href={`/tours?destination=${encodeURIComponent(dest)}`}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:-translate-y-1 shadow-sm group"
            >
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 group-hover:text-emerald-600">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold line-clamp-1">{dest}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-snug">
            Upcoming Semester Break? Don&apos;t Stay Stuck in the Dorm.
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Gather your fellow students, split the boat or cottage rent, and create lifelong memories safely.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 shadow-md transition-all hover:scale-105"
            >
              Verify Your Student Profile Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
