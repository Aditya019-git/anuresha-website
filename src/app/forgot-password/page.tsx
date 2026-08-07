"use client";

import { useState } from "react";
import { sendOtp, verifyOtpAndSetPassword } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await sendOtp(email);
    setLoading(false);

    if (res.success) {
      setStep(2);
    } else {
      setError(res.error || "Failed to send OTP.");
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await verifyOtpAndSetPassword(email, otp, password);
    setLoading(false);

    if (res.success) {
      setStep(3);
    } else {
      setError(res.error || "Verification failed.");
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6 z-20">
        <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-white text-stone-700 font-bold hover:bg-stone-100 rounded-full transition-all shadow-sm border border-stone-200 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.png" alt="Anuresha Logo" width={180} height={70} className="object-contain" unoptimized />
        </div>
        <h2 className="text-center text-3xl font-extrabold font-outfit text-stone-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          We will send a verification code to your registered email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl border border-stone-100 sm:px-10">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium text-center">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                  <input 
                    type="email" 
                    required 
                    className="w-full pl-10 p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="e.g. aditya@example.com"
                  />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/20 disabled:opacity-70">
                {loading ? "Sending OTP..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyAndReset} className="space-y-5">
              <div className="p-4 bg-amber-50 text-amber-800 rounded-xl mb-6 text-sm border border-amber-100">
                We've sent a 6-digit code to <strong>{email}</strong>.
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Enter Reset Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required 
                  className="w-full p-3 text-center text-2xl tracking-[0.5em] rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                  <input 
                    type="password" 
                    required 
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-6 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-70">
                {loading ? "Verifying..." : "Reset Password & Login"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Password Reset Successful!</h3>
              <p className="text-stone-600 mb-8">
                Your password has been updated and you are now securely logged in.
              </p>
              <button onClick={() => router.push("/client")} className="inline-block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/20">
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
