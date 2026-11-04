# 🎒 TourMate BD — Campus Tour-Mate Network

The first verified student tour-mate web platform in Bangladesh. Built with **Next.js 16**, **Tailwind CSS**, and **Supabase (PostgreSQL)**.

---

## 🚀 Quick Start (Running Locally)

### 1. Start the Development Server
Open your terminal inside this folder and run:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Setting Up Free Supabase Backend (2 Minutes)

1. Go to [https://supabase.com](https://supabase.com) and create a free account & project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open the file `supabase_schema.sql` in this folder, copy all contents, and click **Run**.
4. Go to **Project Settings** -> **API** in Supabase and copy:
   - **Project URL**
   - **Anon / Public Key**
5. Open `.env.local` in this folder and paste them:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🌟 Key Features

1. **Dual Verification Pipeline:**
   - **Instant Verification:** Institutional emails (`.edu`, `.edu.bd`, `.ac.bd` like DU, BUET, NSU, BRACU, AIUB, IUT, etc.) are verified automatically.
   - **Student ID Card Upload:** Students from National University and other colleges can upload their student ID photo for manual admin approval.
2. **Tour Discovery Feed:**
   - Filter by destination (Sajek, Saint Martin, Cox's Bazar, Srimangal, etc.).
   - Filter by budget in BDT and group preferences (**Girls-Only Trips 🌸**, Boys-Only, or Mixed).
3. **Plan & Host Tours:**
   - Set dates, budgets, group limits, and itineraries.
   - Add a private WhatsApp group invite link that is **hidden by default** and **only unlocked for approved members**.
4. **Interactive Dashboard:**
   - Manage incoming join requests (Accept / Decline).
   - Track tours you applied to join.
5. **Admin Verification Desk:**
   - Located at `/admin/verify` to approve or reject student ID cards.


