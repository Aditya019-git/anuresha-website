import { getClientDashboardData } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, MapPin, Calendar, CheckCircle2, Clock, Hammer, Camera } from "lucide-react";
import TimelineImageGallery from "@/components/TimelineImageGallery";
import ReviewForm from "@/components/ReviewForm";

export default async function ClientDashboard() {
  const data = await getClientDashboardData();

  if (!data) {
    redirect("/login");
  }

  const { client, projects } = data;
  const activeProject = projects[0];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navbar */}
      <nav className="bg-stone-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="Anuresha Logo" width={140} height={50} className="object-contain" unoptimized />
              <div className="h-6 w-px bg-stone-700 hidden sm:block"></div>
              <span className="text-stone-300 font-medium tracking-wide text-sm hidden sm:block">Client Portal</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">{client.name}</p>
                <p className="text-xs text-stone-400">{client.phone}</p>
              </div>
              <form action={async () => {
                "use server";
                const cookieStore = await cookies();
                cookieStore.delete("client_session");
                redirect("/login");
              }}>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-sm font-medium transition-colors border border-stone-700">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl lg:text-4xl font-outfit font-bold text-stone-900 mb-2">
            Welcome back, {client.name.split(' ')[0]}
          </h1>
          <p className="text-stone-500 text-lg">
            Here is the live status of your interior execution.
          </p>
        </div>

        {!activeProject ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hammer className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">No Active Projects</h3>
            <p className="text-stone-500 mb-8">You haven't approved or started any projects with us yet.</p>
            <Link href="/" className="px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors">
              Request an Estimate
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Project Details & Status */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Project Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className={`p-6 text-white ${
                  activeProject.status === 'Pending Approval' ? 'bg-amber-600' :
                  activeProject.status === 'In Progress' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                      {activeProject.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-outfit font-bold mb-1">{activeProject.property_type}</h2>
                  <p className="text-white/80 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {activeProject.property_size}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Selected Services</p>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.selected_services.map((service: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Approved Estimate</p>
                    <p className="text-2xl font-bold text-stone-900">₹{activeProject.estimated_price}</p>
                  </div>
                </div>
              </div>

              {/* Contact Manager */}
              <div className="bg-stone-900 rounded-3xl p-6 text-white border border-stone-800">
                <h3 className="font-outfit font-bold text-xl mb-4">Your Project Manager</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-stone-800 border border-stone-700 overflow-hidden relative">
                    <Image src="/images/team/team_pm.png" alt="PM" fill className="object-cover object-top" unoptimized />
                  </div>
                  <div>
                    <p className="font-bold">Rahul Sharma</p>
                    <p className="text-stone-400 text-sm">Senior Execution Lead</p>
                  </div>
                </div>
                <a href="tel:+919876543210" className="block w-full text-center py-3 rounded-xl bg-amber-600 hover:bg-amber-700 font-bold transition-colors shadow-lg shadow-amber-600/20">
                  Call Manager
                </a>
              </div>

            </div>

            {/* Right Column - Live Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 h-full">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-outfit font-bold text-stone-900">Live Execution Timeline</h2>
                    <p className="text-stone-500 mt-1">Real-time updates directly from the site.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-outfit font-bold text-amber-600">{activeProject.completion_percentage}%</span>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Completed</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 rounded-full h-3 mb-10 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${activeProject.completion_percentage}%` }}
                  ></div>
                </div>

                {/* Milestone Checklist */}
                <div className="mb-10 bg-stone-50 rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-bold text-stone-900 mb-4 text-xs uppercase tracking-wider">Milestone Progress</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {activeProject.selected_services.map((service: string, i: number) => {
                      const isCompleted = activeProject.completed_services?.includes(service);
                      return (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={isCompleted ? 'text-stone-900 font-medium' : 'text-stone-500'}>{service}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Section */}
                {activeProject.status === 'Completed' && (!activeProject.reviews || activeProject.reviews.length === 0) && (
                  <div className="mb-10">
                    <ReviewForm projectId={activeProject.id} />
                  </div>
                )}
                
                {activeProject.status === 'Completed' && activeProject.reviews && activeProject.reviews.length > 0 && (
                  <div className="mb-10 bg-green-50 text-green-800 p-6 rounded-2xl border border-green-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Project Successfully Completed!</h4>
                      <p className="text-sm">Thank you for leaving a review. You can view your completed timeline below.</p>
                    </div>
                  </div>
                )}

                {/* Updates List */}
                <div className="relative border-l-2 border-stone-100 ml-3 md:ml-6 space-y-10 pb-4">
                  {activeProject.status === 'Pending Approval' && (
                    <div className="relative pl-8 md:pl-10">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-amber-500 shadow-sm"></div>
                      <p className="text-sm font-bold text-amber-600 mb-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Awaiting Admin Approval
                      </p>
                      <h4 className="text-lg font-bold text-stone-900 mb-2">Reviewing Project Scope</h4>
                      <p className="text-stone-600 leading-relaxed">
                        Your estimator request has been received. Our team is currently reviewing your property details and selected services. We will call you to finalize the contract.
                      </p>
                    </div>
                  )}

                  {activeProject.project_updates && activeProject.project_updates.length > 0 ? (
                    activeProject.project_updates.map((update: any, idx: number) => (
                      <div key={update.id} className="relative pl-8 md:pl-10">
                        {/* Timeline Node */}
                        <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-amber-600 shadow-sm"></div>
                        
                        <p className="text-sm font-bold text-amber-600 mb-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        
                        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 mt-3">
                          <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">
                            {update.update_text}
                          </p>
                          
                          <TimelineImageGallery images={update.images} />
                        </div>
                      </div>
                    ))
                  ) : activeProject.status !== 'Pending Approval' && (
                    <div className="relative pl-8 md:pl-10">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-stone-300"></div>
                      <p className="text-stone-500 italic">No site updates posted yet. Check back soon once work begins!</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
