"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/constants/admin";
import { Compass, PlusCircle, User, ShieldCheck, LogOut, ShieldAlert, Shield } from "lucide-react";
import type { Profile } from "@/types";

export default function Navbar() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email ?? null);
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (data) setProfile(data as Profile);
        }
      } catch (e) {
        console.error("Auth error", e);
      } finally {
        setLoading(false);
      }
    }
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUserEmail(null);
    window.location.href = "/";
  };

  const isAdmin = isAdminEmail(userEmail);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            🎒
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              TourMate <span className="text-emerald-600">BD</span>
            </span>
            <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Campus Travel Network
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/tours" className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
            <Compass className="w-4 h-4" />
            Explore Tours
          </Link>
          <Link href="/tours/create" className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
            <PlusCircle className="w-4 h-4" />
            Plan a Tour
          </Link>
          {profile && (
            <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
              <User className="w-4 h-4" />
              My Trips
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin/verify"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-xl text-xs font-bold border border-purple-300 dark:border-purple-800 hover:bg-purple-200 transition-all shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Desk
            </Link>
          )}
        </nav>

        {/* Auth / Profile Area */}
        <div className="flex items-center gap-3">
          {!loading && profile ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {profile.full_name}
                </span>
                <span className="text-xs text-slate-500">
                  {isAdmin ? "Super Administrator" : profile.university_name}
                </span>
              </div>

              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300">
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </span>
              ) : profile.is_verified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  ID Pending
                </span>
              )}

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all hover:shadow-emerald-500/25 hover:shadow-md"
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
