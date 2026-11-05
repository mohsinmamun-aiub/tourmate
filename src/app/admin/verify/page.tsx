"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/constants/admin";
import { ShieldCheck, Check, X, ExternalLink, AlertCircle, ShieldAlert, Lock, LogIn } from "lucide-react";
import type { Profile } from "@/types";

export default function AdminVerifyPage() {
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pendingStudents, setPendingStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const loadPending = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_verified", false)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPendingStudents(data as Profile[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkAdminAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isAdminEmail(user.email)) {
          setIsAdmin(true);
          loadPending();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      } catch {
        setIsAdmin(false);
        setLoading(false);
      }
    }

    checkAdminAuth();
  }, [supabase]);

  const handleApprove = async (id: string) => {
    setActionMsg("");
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", id);

    if (!error) {
      setPendingStudents((prev) => prev.filter((p) => p.id !== id));
      setActionMsg("✅ Student ID verified successfully! Badge granted.");
    } else {
      setActionMsg(`Error: ${error.message}`);
    }
  };

  const handleReject = async (id: string) => {
    setActionMsg("");
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (!error) {
      setPendingStudents((prev) => prev.filter((p) => p.id !== id));
      setActionMsg("❌ Profile rejected and removed.");
    } else {
      setActionMsg(`Error: ${error.message}`);
    }
  };

  const getPublicImageUrl = (path: string | undefined) => {
    if (!path) return null;
    const { data } = supabase.storage.from("id-cards").getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Verifying administrator credentials...</div>;
  }

  // Access Denied screen for non-admins
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Admin Access Required
          </h1>
          <p className="text-xs text-slate-500">
            This verification desk is restricted. Please log in with the Super Administrator account (<strong>mohsin.aiub@gmail.com</strong>).
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-bold shadow-md hover:scale-105 transition-all"
        >
          <LogIn className="w-4 h-4" />
          Log In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Student ID Verification Desk
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as Super Admin: <span className="font-semibold text-purple-600">mohsin.aiub@gmail.com</span>
          </p>
        </div>

        <button
          onClick={loadPending}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors self-start sm:self-auto"
        >
          Refresh Queue
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold">
          {actionMsg}
        </div>
      )}

      {pendingStudents.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            All Caught Up!
          </h3>
          <p className="text-xs text-slate-400">
            There are currently no student ID cards waiting for manual review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingStudents.map((student) => {
            const imageUrl = getPublicImageUrl(student.id_card_url);

            return (
              <div
                key={student.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {student.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {student.university_name} • Student ID: <strong>{student.student_id}</strong>
                  </p>
                  {student.phone_number && (
                    <p className="text-xs text-slate-400 mt-0.5">Phone: {student.phone_number}</p>
                  )}
                </div>

                {/* ID Card Image Preview */}
                <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  {imageUrl ? (
                    <div className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Student ID Preview"
                        className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> View Full Resolution
                      </a>
                    </div>
                  ) : (
                    <div className="h-28 flex items-center justify-center text-xs text-slate-400 gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      No ID image uploaded
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleApprove(student.id)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Approve & Verify
                  </button>
                  <button
                    onClick={() => handleReject(student.id)}
                    className="flex-1 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
