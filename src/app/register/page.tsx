"use client";

import { useState, useEffect } from "react";
import { sendOtp, verifyOtpAndSetPassword, createPendingProject } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, CheckCircle2, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", otp: "", password: "" });
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load data from session storage
    const savedData = sessionStorage.getItem("pendingProjectData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProjectData(parsed);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || "",
        phone: parsed.phone || "",
        email: parsed.email || ""
      }));
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await sendOtp(formData.email, formData.name, formData.phone);
    setLoading(false);

    if (res.success) {
      setStep(2);
    } else {
      setError(res.error || "Failed to send OTP.");
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Verify OTP and Create Password
    const authRes = await verifyOtpAndSetPassword(formData.email, formData.otp, formData.password);
    
    if (!authRes.success || !authRes.clientId) {
      setError(authRes.error || "Verification failed.");
      setLoading(false);
      return;
    }

    // 2. Create the Project if we have project data
    if (projectData) {
      const projRes = await createPendingProject({
        clientId: authRes.clientId,
        propertyType: projectData.propertyType,
        size: Number(projectData.size),
        services: projectData.services,
        estimateRange: projectData.estimateRange
      });

      if (!projRes.success) {
        setError("Account created, but failed to save project details. Please contact support.");
        setLoading(false);
        return;
      }
      
      // Clear session storage
      sessionStorage.removeItem("pendingProjectData");
    }

    setLoading(false);
    setStep(3); // Success Step
  };

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 px-6 py-2.5 bg-white text-stone-700 font-bold hover:bg-stone-100 rounded-full transition-all shadow-sm border border-stone-200 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.png" alt="Anuresha Logo" width={180} height={70} className="object-contain" unoptimized />
        </div>
        <h2 className="text-center text-3xl font-extrabold font-outfit text-stone-900">
          Client Registration
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Set up your secure portal to track your project.
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
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                  <input type="text" required className="w-full pl-10 p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                  <input type="tel" required className="w-full pl-10 p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                  <input type="email" required className="w-full pl-10 p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Create a Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                  <input type="password" required minLength={6} placeholder="Minimum 6 characters" className="w-full pl-10 p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/20 disabled:opacity-70">
                {loading ? "Sending OTP..." : "Send OTP via Email"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              <div className="p-4 bg-amber-50 text-amber-800 rounded-xl mb-6 text-sm border border-amber-100">
                We've sent a 6-digit verification code to <strong>{formData.email}</strong>.
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Enter OTP Code</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required 
                  className="w-full p-3 text-center text-2xl tracking-[0.5em] rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none text-stone-900 bg-white" 
                  value={formData.otp} 
                  onChange={e => setFormData({...formData, otp: e.target.value})} 
                />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-6 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-70">
                {loading ? "Verifying..." : "Verify & Complete Registration"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Registration Complete!</h3>
              <p className="text-stone-600 mb-8">
                Your account is set up and your project request has been submitted to our team for approval.
              </p>
              <Link href="/client" className="inline-block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/20">
                Go to Dashboard
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
