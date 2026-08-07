"use client";

import { useActionState, useState } from "react";
import { loginUser, sendAdminOtp, verifyAdminOtp } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Lock, AlertCircle, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginUser, null);
  const [adminOtpState, verifyOtpAction, verifying] = useActionState(verifyAdminOtp, null);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isAdminOtpStep, setIsAdminOtpStep] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleAdminCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if ((username || "").trim().toLowerCase() === "admin") {
      e.preventDefault();
      setIsSendingOtp(true);
      setOtpError("");
      const res = await sendAdminOtp();
      if (res.success) {
        setIsAdminOtpStep(true);
      } else {
        setOtpError(res.error || "Failed to send OTP to Admin Email");
      }
      setIsSendingOtp(false);
    }
  };

  const isAdminUser = (username || "").trim().toLowerCase() === "admin";

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white font-bold hover:bg-amber-700 rounded-full transition-all shadow-lg shadow-amber-600/30 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 items-center justify-center overflow-hidden">
          <Image 
            src="/images/hero_light.jpg" 
            alt="Luxury Interior" 
            fill 
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="relative z-10 p-12 max-w-lg text-center">
            <h1 className="text-4xl font-outfit font-bold text-white mb-6 leading-tight">
              Welcome to the <br/> Anuresha Client Portal
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed">
              Track your project's live progress, view site photos, and manage approvals securely from your personalized dashboard.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white shadow-2xl z-10">
          <div className="w-full max-w-md">
            <div className="mb-12 text-center lg:text-left">
              <Image src="/images/logo.png" alt="Anuresha Logo" width={220} height={80} className="object-contain mx-auto lg:mx-0 mb-8" unoptimized />
              <h2 className="text-3xl font-outfit font-bold text-stone-900 mb-3">
                {isAdminOtpStep ? "Admin Verification" : "Sign In"}
              </h2>
              <p className="text-stone-500">
                {isAdminOtpStep 
                  ? "An OTP has been sent to info.anuresha@gmail.com." 
                  : "Enter your phone number and password to access your dashboard."}
              </p>
            </div>

            {isAdminOtpStep ? (
              <form action={verifyOtpAction} className="space-y-6">
                {(adminOtpState?.error || otpError) && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{adminOtpState?.error || otpError}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-5 h-5 text-stone-400" />
                    </div>
                    <input 
                      name="otp" 
                      type="text" 
                      maxLength={6}
                      required 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 123456" 
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-stone-900 bg-stone-50/50 text-center tracking-[0.5em] font-bold text-xl"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={verifying}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
                  >
                    {verifying ? "Verifying..." : "Verify & Login"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAdminOtpStep(false)}
                    className="text-stone-500 text-sm font-medium hover:text-stone-900 mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form action={formAction} className="space-y-6">
                {(state?.error || otpError) && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{state?.error || otpError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number / Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-stone-400" />
                    </div>
                    <input 
                      name="username" 
                      type="text" 
                      required 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter phone number or 'admin'" 
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-stone-900 bg-stone-50/50"
                    />
                  </div>
                </div>

                {!isAdminUser && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-stone-700">Password</label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-stone-400" />
                      </div>
                      <input 
                        name="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" 
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-stone-900 bg-stone-50/50"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Link href="/forgot-password" className="text-sm text-amber-600 font-medium hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={pending || isSendingOtp}
                  onClick={handleAdminCheck}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                >
                  {isSendingOtp ? "Sending OTP..." : pending ? "Authenticating..." : isAdminUser ? "Get Admin OTP" : "Access Portal"}
                </button>
              </form>
            )}

            <div className="mt-10 pt-8 border-t border-stone-100 text-center">
              <p className="text-sm text-stone-500">
                Want to start a new project? <br/>
                <Link href="/" className="text-amber-600 font-medium hover:underline mt-1 inline-block">Request an AI Estimate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
