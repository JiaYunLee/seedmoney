"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#333] border-b border-black/[0.12] flex items-center justify-between px-[15px] py-[13px] h-[66px]">
        <div className="h-[40px] w-[160px] shrink-0 flex items-center">
          <span className="font-bold text-[22px] text-[#5aba52] tracking-tight font-[family-name:var(--font-lato)]">SeedMoney</span>
        </div>
        <nav className="flex items-center gap-7 font-[family-name:var(--font-opensans)] text-[14px] text-white">
          <a href="#" className="cursor-pointer hover:opacity-80">
            Sign Up
          </a>
          <a href="#" className="cursor-pointer hover:opacity-80">
            Log In
          </a>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex flex-1 pt-[66px]">
        {/* Hero image — left column */}
        <div className="hidden lg:flex lg:flex-[993_0_0] min-h-[799px] bg-gradient-to-br from-[#1a4a28] via-[#2d7a45] to-[#56bd60] items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" aria-hidden="true">
            <circle cx="90" cy="90" r="89" stroke="white" strokeOpacity="0.2" strokeWidth="2"/>
            <path d="M90 40C90 40 55 60 55 95C55 118.196 70.804 136 90 136C109.196 136 125 118.196 125 95C125 60 90 40 90 40Z" fill="white" fillOpacity="0.15"/>
            <path d="M90 60C90 60 70 75 70 95C70 105.493 79.178 115 90 115C100.822 115 110 105.493 110 95C110 75 90 60 90 60Z" fill="white" fillOpacity="0.25"/>
            <text x="90" y="163" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="14" fontFamily="Lato, sans-serif">Community Garden</text>
          </svg>
        </div>

        {/* Form — right column */}
        <div className="flex-1 flex items-start justify-center px-6 py-[177px] bg-white min-h-[799px]">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5 w-full max-w-[350px]"
          >
            {/* Title */}
            <div className="flex flex-col items-start">
              <p className="font-bold text-[24px] leading-[1.334] text-[rgba(0,0,0,0.87)]">
                Welcome to SeedMoney
              </p>
              <p className="text-[14px] leading-[1.33] text-[rgba(0,0,0,0.6)]">
                Please log in or sign up below.
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3 w-full">
              {/* Email */}
              <div className="flex flex-col w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-[16px] leading-[24px] tracking-[0.15px] text-[rgba(0,0,0,0.6)] border-0 border-b border-black/[0.42] bg-transparent pb-[6px] focus:border-[#2d7a45] transition-colors placeholder:text-[rgba(0,0,0,0.6)]"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col w-full">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-[16px] leading-[24px] tracking-[0.15px] text-[rgba(0,0,0,0.6)] border-0 border-b border-black/[0.42] bg-transparent pb-[6px] focus:border-[#2d7a45] transition-colors placeholder:text-[rgba(0,0,0,0.6)]"
                />
              </div>
            </div>

            {/* Captcha placeholder */}
            <div className="h-[66px] w-[300px] self-center shrink-0 border border-[rgba(0,0,0,0.23)] rounded flex items-center justify-center bg-[#f9f9f9] text-[14px] text-[rgba(0,0,0,0.38)]">
              I&apos;m not a robot (reCAPTCHA)
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 items-center w-full">
              {/* Log In button */}
              <button
                type="submit"
                className="w-full bg-[#2d7a45] flex items-center justify-center gap-2 px-5 py-[10px] rounded-[8px] cursor-pointer hover:bg-[#245f37] transition-colors"
              >
                {/* Lock icon */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                  <rect x="3.5" y="9" width="13" height="9.5" rx="1.5" stroke="white" strokeWidth="1.5"/>
                  <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="13.5" r="1.5" fill="white"/>
                </svg>
                <span className="font-bold text-[16px] leading-[26px] text-white uppercase">
                  Log In
                </span>
              </button>

              {/* Log In with Google */}
              <button
                type="button"
                className="w-full bg-white border border-[#2d7a45] flex items-center justify-center gap-2 px-[26px] py-3 rounded-[8px] cursor-pointer hover:bg-[#f5faf7] transition-colors"
              >
                {/* Google G logo */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-bold text-[16px] leading-[26px] text-[rgba(0,0,0,0.6)] uppercase">
                  Log In with Google
                </span>
              </button>

              {/* Sign up link */}
              <a href="#" className="text-[14px] leading-[1.33] text-[rgba(0,0,0,0.6)] cursor-pointer">
                {`Don't have an account? `}
                <span className="text-[#1976d2] underline">Sign up here</span>
              </a>

              {/* Forgot password */}
              <a href="#" className="text-[14px] leading-[1.33] text-[rgba(0,0,0,0.6)] cursor-pointer">
                Forgot Password / Activate Account
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#333] pt-[35px] pb-0 min-h-[252px] relative">
        {/* Star divider */}
        <div className="flex items-center justify-center mb-[43px]">
          <div className="flex-1 max-w-[304px] h-px bg-white/[0.15]" />
          <div className="mx-4 h-[14px] w-[14px] shrink-0 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.545 4.758H13.5l-4.045 2.939 1.545 4.757L7 10.516l-3.999 2.938 1.545-4.757L.5 5.758H5.454L7 1z" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <div className="flex-1 max-w-[304px] h-px bg-white/[0.15]" />
        </div>

        {/* Link columns */}
        <div className="flex justify-center gap-0 mb-[35px]">
          {/* Left column */}
          <div className="w-[150px] flex flex-col gap-[26px]">
            <p className="font-bold text-[14px] text-[#5aba52] leading-[18.62px]">
              SeedMoney
            </p>
            <div className="flex flex-col gap-[25px] font-[family-name:var(--font-opensans)] text-[14px] text-white leading-[16.8px]">
              <a href="#" className="hover:opacity-80">Home</a>
              <a href="#" className="hover:opacity-80">Contact</a>
              <a href="#" className="hover:opacity-80">FAQ</a>
            </div>
          </div>
          {/* Right column */}
          <div className="w-[150px] flex flex-col gap-[26px]">
            <p className="font-bold text-[14px] text-[#5aba52] leading-[18.62px]">
              Need help?
            </p>
            <div className="flex flex-col gap-[25px] font-[family-name:var(--font-opensans)] text-[14px] text-white leading-[16.8px]">
              <a href="#" className="hover:opacity-80">FAQ</a>
              <a href="#" className="hover:opacity-80">Terms</a>
              <a href="#" className="hover:opacity-80">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.15]" />

        {/* Copyright */}
        <div className="py-4 text-center font-[family-name:var(--font-opensans)] text-[14px] text-white leading-[18.62px]">
          © 2026 SeedMoney All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
