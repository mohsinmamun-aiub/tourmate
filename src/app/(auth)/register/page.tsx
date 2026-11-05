"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BD_UNIVERSITIES, isEduEmail } from "@/lib/constants/universities";
import { UserCheck, UploadCloud, AlertCircle, CheckCircle2, Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState(BD_UNIVERSITIES[0].name);
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const hasEduDomain = isEduEmail(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Sign up user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Failed to create user account");
      }

      // Check if user already registered previously
      if (authData.user.identities && authData.user.identities.length === 0) {
        throw new Error("This email is already registered! Please log in instead.");
      }

      let idCardUrl = "";

      // 2. If student ID photo is provided, upload to Supabase storage
      if (idFile) {
        const fileExt = idFile.name.split(".").pop();
        const filePath = `${authData.user.id}/student-id-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("id-cards")
          .upload(filePath, idFile);

        if (!uploadError) {
          idCardUrl = filePath;
        }
      }

      // 3. Insert or update profile into the database (upsert prevents duplicate key errors)
      const isAutoVerified = hasEduDomain;
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: authData.user.id,
          full_name: fullName.trim(),
          university_name: university,
          department: department.trim() || null,
          student_id: studentId.trim(),
          is_verified: isAutoVerified,
          verification_method: isAutoVerified ? "edu_email" : "id_card",
          id_card_url: idCardUrl || null,
          gender,
          phone_number: phoneNumber.trim() || null,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        throw new Error(`Profile setup error: ${profileError.message}`);
      }

      if (isAutoVerified) {
        setSuccessMsg(
          "Account created with Instant University Verification! Check your inbox to confirm your email."
        );
      } else {
        setSuccessMsg(
          "Registration complete! Your student ID card has been submitted. Our team will verify it shortly."
        );
      }

      setTimeout(() => {
        router.push("/tours");
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Student Verification & Signup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            To ensure genuine safety, TourMate BD requires institutional student confirmation for all members.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                University / College *
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {BD_UNIVERSITIES.map((u) => (
                  <option key={u.name} value={u.name} className="dark:bg-slate-900">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Student ID Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 21101045"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Department / Major
              </label>
              <input
                type="text"
                placeholder="e.g. CSE, EEE, BBA"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email with Verification Logic */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="student@g.bracu.ac.bd or personal@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {hasEduDomain ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Instant Verification:</strong> We detected an institutional domain! Your account will be verified automatically.
                </span>
              </div>
            ) : email.includes("@") ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Personal email detected:</strong> Please upload a photo of your Student ID card below for rapid approval.
                </span>
              </div>
            ) : null}
          </div>

          {/* ID Card Upload if not edu email */}
          {!hasEduDomain && (
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Upload Student ID Card Photo (Front) *
              </label>
              <input
                type="file"
                accept="image/*"
                required={!hasEduDomain}
                onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300"
              />
              <p className="text-[11px] text-slate-400">
                Clear picture showing your name, photo, and student ID. Only used for verification.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="male" className="dark:bg-slate-900">Male</option>
                <option value="female" className="dark:bg-slate-900">Female</option>
                <option value="other" className="dark:bg-slate-900">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 01700000000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Create Password *
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? "Submitting Verification..." : "Create Verified Student Account"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already verified?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
