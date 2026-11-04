import Link from "next/link";
import { Shield, Users, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              <span className="font-extrabold text-xl text-white">
                TourMate <span className="text-emerald-500">BD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              The first verified student tour-mate network in Bangladesh. Connecting university and college travelers for safer, affordable, and authentic group trips across Bangladesh.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 pt-2">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" /> 100% Student Verified
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" /> Peer-to-Peer Travel
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/tours" className="hover:text-emerald-400">Browse Tours</Link></li>
              <li><Link href="/tours/create" className="hover:text-emerald-400">Plan a Tour</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400">Join as Student</Link></li>
              <li><Link href="/admin/verify" className="hover:text-emerald-400">Student ID Verification Portal</Link></li>
            </ul>
          </div>

          {/* Safety & Trust in BD */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Safety First in BD</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>🔒 Institutional Email & Student ID checks</li>
              <li>⚠️ Never send full advance without campus meet</li>
              <li>👭 Female-only tour filter options</li>
              <li>📍 Emergency contact sharing</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 TourMate BD. Built for Bangladeshi Students.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for campus travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
