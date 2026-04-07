"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const imgLogo =
  "https://www.figma.com/api/mcp/asset/5eb00121-9545-4e3d-b244-c2ddffc281e2";
const imgHero =
  "https://www.figma.com/api/mcp/asset/0ce3b0d2-239b-40d0-85db-e7cd50aed7e5";
const imgCaptcha =
  "https://www.figma.com/api/mcp/asset/11da6fb8-6d1b-44ac-b3e4-1fa80ef41849";
const imgGoogle =
  "https://www.figma.com/api/mcp/asset/5c60c633-fb91-411f-997f-87138c866526";
const imgLoginIcon =
  "https://www.figma.com/api/mcp/asset/6027c88d-4c7a-4b38-9594-0dba318ef160";
const imgStarIcon =
  "https://www.figma.com/api/mcp/asset/c486217d-3bce-48ca-83d0-065ec38b3426";

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
        <div className="relative h-[40px] w-[160px] shrink-0">
          <Image
            src={imgLogo}
            alt="SeedMoney"
            fill
            className="object-contain object-left"
            unoptimized
          />
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
        <div className="relative hidden lg:block lg:flex-[993_0_0] min-h-[799px]">
          <Image
            src={imgHero}
            alt="Community garden"
            fill
            className="object-cover"
            unoptimized
            priority
          />
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
            <div className="relative h-[66px] w-[300px] self-center shrink-0">
              <Image
                src={imgCaptcha}
                alt="Captcha"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 items-center w-full">
              {/* Log In button */}
              <button
                type="submit"
                className="w-full bg-[#2d7a45] flex items-center justify-center gap-2 px-5 py-[10px] rounded-[8px] cursor-pointer hover:bg-[#245f37] transition-colors"
              >
                <div className="relative size-5 shrink-0">
                  <Image
                    src={imgLoginIcon}
                    alt=""
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-bold text-[16px] leading-[26px] text-white uppercase">
                  Log In
                </span>
              </button>

              {/* Log In with Google */}
              <button
                type="button"
                className="w-full bg-white border border-[#2d7a45] flex items-center justify-center gap-2 px-[26px] py-3 rounded-[8px] cursor-pointer hover:bg-[#f5faf7] transition-colors"
              >
                <div className="relative size-6 shrink-0">
                  <Image
                    src={imgGoogle}
                    alt=""
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
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
          <div className="relative mx-4 h-[14px] w-[14px] shrink-0">
            <Image
              src={imgStarIcon}
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
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
