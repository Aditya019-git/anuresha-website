"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { submitLead, getReviews } from "./actions";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";



export default function Home() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [showAllServices, setShowAllServices] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const revRes = await getReviews();
      if (revRes.success && revRes.data) {
        setReviews(revRes.data);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitLead(formData);

    if (result.success) {
      setFormState("success");
    } else {
      console.error(result.error);
      alert("Something went wrong. Please try again.");
      setFormState("idle");
    }
  };

  const services = [
    {
      name: "Modular Furniture & Carpentry",
      desc: "Custom wardrobes, modular kitchens, and premium wood crafting.",
      img: "/images/services/srv_modular_1777562390224.png"
    },
    {
      name: "Painting & Wallpaper",
      desc: "High-quality plastic/acrylic paints, textures, and luxury wallpapers.",
      img: "/images/services/srv_painting_1777562456198.png"
    },
    {
      name: "Gypsum & False Ceiling",
      desc: "Architectural ceiling designs with integrated ambient lighting.",
      img: "/images/services/srv_gypsum_1777562522113.png"
    },
    {
      name: "Glass & Filming Work",
      desc: "Toughened glass partitions, frosted films, and decorative glass.",
      img: "/images/services/srv_glass_1777562409518.png"
    },
    {
      name: "Electrical Installation",
      desc: "Complete wiring, switchgear, and energy-efficient LED fittings.",
      img: "/images/services/srv_electrical_1777562544418.png"
    },
    {
      name: "Road Transport Services",
      desc: "Logistics and safe transportation of bulk construction materials.",
      img: "/images/services/srv_road_1777562483347.png"
    },
    {
      name: "Fabrication & ACP",
      desc: "Heavy metal fabrication and modern Aluminum Composite Panels.",
      img: "/images/services/srv_fabrication_1777562596590.png"
    },
    {
      name: "Civil & Epoxy Works",
      desc: "Structural modifications, tiling, and industrial epoxy flooring.",
      img: "/images/services/srv_epoxy_1777562500060.png"
    },
    {
      name: "Plumbing & Sanitary",
      desc: "End-to-end plumbing pipelines and luxury sanitary fittings.",
      img: "/images/services/srv_plumbing_1777562624524.png"
    },
    {
      name: "Polishing Services",
      desc: "Marble, wood, and metal polishing to restore natural shine.",
      img: "/images/services/srv_polishing_1777562652631.png"
    },
    {
      name: "Material Supply",
      desc: "Sourcing and supply of all types of premium construction materials.",
      img: "/images/services/srv_material_1777562695545.png"
    },
    {
      name: "Solar Installation",
      desc: "Rooftop solar panel installation for sustainable energy.",
      img: "/images/services/srv_solar_1777562727307.png"
    }
  ];

  const displayedServices = showAllServices ? services : services.slice(0, 8);

  return (
    <>
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 lg:pt-48 lg:pb-40 min-h-[90vh] flex items-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero_light.jpg" 
            alt="Luxury Interior Design" 
            fill
            unoptimized={true}
            className="object-cover"
            priority
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-stone-900 bg-white/70 p-6 sm:p-8 rounded-3xl backdrop-blur-md border border-white/60 shadow-xl"
          >
            <h1 className="font-outfit text-3xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6">
              Transforming Spaces. <br /> Building Trust.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-stone-800 mb-6 sm:mb-8 max-w-xl leading-relaxed">
              An Innovator in Building and Property Maintenance. Covering all Pune, Mumbai & Nearby areas for Commercial, Industrial and Residential projects.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm text-sm">A</div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm text-sm">S</div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm text-sm">M</div>
              </div>
              <div className="text-sm">
                <div className="font-bold text-stone-900">Trusted by 500+ Clients</div>
                <div className="text-stone-700 font-medium">Across Pune & Mumbai</div>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/portfolio" className="px-8 py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 shadow-xl shadow-amber-600/30 transition-all hover:-translate-y-1 inline-block text-center">
                View Our Work
              </Link>
            </div>
          </motion.div>

          {/* Right Lead Capture Form (Livspace Style) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-stone-100">
              {formState === "success" ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-outfit text-2xl font-bold text-stone-900 mb-2">Thank You!</h3>
                  <p className="text-stone-600 mb-6">Your request has been received. Our senior designer will call you within the next hour.</p>
                  <button onClick={() => setFormState("idle")} className="text-amber-600 font-medium hover:underline">Submit another request</button>
                </div>
              ) : (
                <>
                  <h2 className="font-outfit text-2xl font-bold text-stone-900 mb-6 text-center">Start Your Transformation</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input type="text" name="name" required placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all shadow-sm" />
                    </div>
                    <div>
                      <input type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all shadow-sm" />
                    </div>
                    <div className="flex gap-0">
                      <div className="w-20 px-3 py-3 rounded-l-lg border border-stone-200 bg-stone-100 flex items-center justify-center text-stone-600 font-medium border-r-0 shadow-sm">
                        +91
                      </div>
                      <input type="tel" name="phone" required placeholder="Mobile Number" className="w-full px-4 py-3 rounded-r-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all shadow-sm" />
                    </div>
                    
                    <label className="flex items-center gap-3 py-2 cursor-pointer mt-2">
                      <input type="checkbox" name="notify_whatsapp" className="w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500" defaultChecked />
                      <span className="text-sm font-medium text-stone-700">Notify me via WhatsApp</span>
                    </label>

                    <div>
                      <select name="city" required className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all text-stone-600 bg-white appearance-none">
                        <option value="">Select Project City</option>
                        <option value="pune">Pune</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formState === "submitting"}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3.5 rounded-lg transition-colors mt-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formState === "submitting" ? "Processing..." : "REQUEST ESTIMATE"}
                    </button>
                  </form>
                  <p className="text-center text-xs text-stone-400 mt-4">By submitting this form, you agree to our privacy policy & terms.</p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="bg-stone-900 py-12 border-y border-stone-800 overflow-hidden">
        <div className="container mx-auto px-6 mb-8">
          <p className="text-stone-400 text-sm font-medium tracking-widest uppercase text-center">Trusted by Corporate Leaders</p>
        </div>
        <div className="flex gap-16 items-center justify-center flex-wrap px-10 text-stone-500 opacity-70 hover:opacity-100 transition-opacity duration-500">
           <div className="font-bold text-2xl tracking-tighter hover:text-stone-300 transition-colors">TCS</div>
           <div className="font-bold text-2xl font-serif hover:text-stone-300 transition-colors">SYNTEL</div>
           <div className="font-bold text-2xl text-red-800/60 hover:text-red-600 transition-colors">FUJITSU</div>
           <div className="font-bold text-2xl tracking-widest hover:text-stone-300 transition-colors">SYNECHRON</div>
           <div className="font-extrabold text-2xl italic hover:text-stone-300 transition-colors">DANA</div>
           <div className="font-bold text-2xl hover:text-stone-300 transition-colors">MPHASIS</div>
           <div className="font-bold text-2xl tracking-tighter text-blue-800/60 hover:text-blue-500 transition-colors">HCL</div>
           <div className="font-black text-2xl text-green-800/60 hover:text-green-500 transition-colors">NVIDIA</div>
           <div className="font-bold text-2xl tracking-widest text-green-700/60 hover:text-green-500 transition-colors">SUZLON</div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="font-outfit text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Comprehensive <span className="text-amber-600">Turnkey Solutions</span>
              </h2>
              <p className="text-lg text-stone-600">
                From structural changes to the finest decorative details, our skilled tradesmen deliver professional quality work without compromising on cost.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {displayedServices.map((svc, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4 bg-stone-200">
                  <Image src={svc.img} fill unoptimized={true} className="object-cover group-hover:scale-105 transition-transform duration-700" alt={svc.name} />
                </div>
                <h3 className="font-outfit text-xl font-semibold text-stone-900 mb-2">{svc.name}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
          
          {/* VIEW ALL BUTTON */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => setShowAllServices(!showAllServices)}
              className="px-8 py-3 rounded-full border-2 border-amber-600 text-amber-600 font-semibold hover:bg-amber-600 hover:text-white transition-colors flex items-center gap-2"
            >
              {showAllServices ? "Show Less" : "View All 14 Services"} <ArrowRight className={`w-5 h-5 transition-transform ${showAllServices ? 'rotate-[-90deg]' : 'rotate-90'}`} />
            </button>
          </div>
        </div>
      </section>



      {/* GENUINE CLIENT REVIEWS */}
      {reviews.length > 0 && (
        <section id="testimonials" className="py-24 bg-amber-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-outfit text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                What Our <span className="text-amber-600">Clients Say</span>
              </h2>
              <p className="text-lg text-stone-600">
                100% genuine feedback from our SaaS Client Portal upon project completion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-amber-100 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                    ))}
                  </div>
                  <p className="text-stone-600 italic leading-relaxed mb-6 flex-1">"{review.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold">
                      {review.clients?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{review.clients?.name}</div>
                      <div className="text-xs text-stone-500">Verified Client</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT US & TEAM SECTION */}
      <section id="about" className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-outfit text-4xl md:text-5xl font-bold text-stone-900 mb-6">
              Built Solely on <span className="text-amber-600">Trust & Recommendation</span>
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Anuresha Interior Pvt Ltd is an innovator in Building and Property Maintenance. Covering all Pune, Mumbai & nearby areas, we bring reliability and integrity to Commercial, Industrial, and Residential projects.
            </p>
          </div>

          {/* About Company */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
            
            {/* Left Column - Stacked Images */}
            <div className="flex flex-col gap-8 w-full">
              <div className="relative h-[450px] lg:h-[600px] w-full rounded-3xl overflow-hidden shadow-xl">
                <Image src="/images/about_bg.png" alt="Anuresha Office" fill unoptimized={true} className="object-cover" />
              </div>
              <div className="relative h-[450px] lg:h-[600px] w-full rounded-3xl overflow-hidden shadow-xl hidden lg:block">
                <Image src="/images/about_bg2.png" alt="Anuresha Architecture Studio" fill unoptimized={true} className="object-cover" />
              </div>
            </div>
            
            {/* Right Column - Text & Policies */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 border-l-4 border-l-amber-600">
                <p className="text-lg text-stone-700 leading-relaxed">
                  Our team of professionals is driven by a single-point motto: <strong className="text-stone-900">Complete Client Satisfaction</strong>. We have successfully retained all our clients by consistently delivering on time with the highest levels of quality.
                </p>
              </div>
                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h4 className="font-bold text-amber-600 text-xl mb-3 flex items-center gap-2">Vision</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">To gain customer trust and become a leading and competitive business Building and Property Maintenance service provider by offering innovative ideas & solutions.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h4 className="font-bold text-amber-600 text-xl mb-3 flex items-center gap-2">Mission</h4>
                    <p className="text-stone-600 text-sm leading-relaxed">We will provide the most compelling Building and Property Maintenance service in terms of safety, cost and performance, to become the partner of choice.</p>
                  </div>
                </div>

                {/* Policies */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <h4 className="font-bold text-stone-900 text-xl mb-3">Quality Policy</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">We are ever committed to deliver in time with highest levels of quality work by adopting continual improvement methods to achieve customer satisfaction & reviewing periodically the effectiveness of our quality management system.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <h4 className="font-bold text-stone-900 text-xl mb-3">Health & Safety Policy</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">The health & safety of our people is of the highest priority and cannot be compromised. Our objective is a workplace free of incidents & injuries. To achieve this we must all ensure our own safety & that of our fellow worker through an absolute commitment to safe work practices and a healthy work environment.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <h4 className="font-bold text-stone-900 text-xl mb-3">Environmental Policy</h4>
                  <p className="text-stone-600 text-sm leading-relaxed mb-3">Our policy is to be environmentally responsible in our work activities & on our sites by minimizing any effects that may have on the environment. Therefore, we are committed to:</p>
                  <ul className="text-stone-600 text-sm space-y-1 list-disc list-inside">
                    <li>Trying to prevent pollution.</li>
                    <li>Reducing waste to the lowest practicable level.</li>
                    <li>Providing training to the employees.</li>
                  </ul>
                </div>

                <div className="bg-stone-900 p-8 rounded-2xl shadow-lg text-white">
                  <h4 className="font-bold text-amber-500 text-xl mb-4">Our Core Values</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-white"># Respect</span>
                      <p className="text-stone-400 text-sm mt-1">Fair, thoughtful and dignified treatment of others.</p>
                    </div>
                    <div>
                      <span className="font-bold text-white"># Integrity</span>
                      <p className="text-stone-400 text-sm mt-1">Always honest and ethical in words and actions.</p>
                    </div>
                    <div>
                      <span className="font-bold text-white"># Quality</span>
                      <p className="text-stone-400 text-sm mt-1">We believe in Quality & deliver the same.</p>
                    </div>
                    <div>
                      <span className="font-bold text-white"># Innovation</span>
                      <p className="text-stone-400 text-sm mt-1">Overcome challenges with creativity.</p>
                    </div>
                  </div>
                </div>

            </div>
          </div>

          {/* Leadership Team / Board of Directors */}
          <div className="pt-12 mt-12 border-t border-stone-200">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-outfit text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Board of <span className="text-amber-600">Directors</span>
              </h2>
              <p className="text-lg text-stone-600">
                The visionary leadership team driving Anuresha Interiors towards excellence in every single project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Mr. Ranjit Pande */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-100 group">
                <div className="relative h-96 w-full overflow-hidden">
                  <Image src="/images/team/ranjit.jpg" alt="Mr. Ranjit Pande" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="font-outfit text-2xl font-bold text-stone-900 mb-1">Mr. Ranjit Pande</h3>
                  <p className="text-amber-600 font-medium mb-4">Founder & Director</p>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    One of the founding members with over 8+ years of expertise in full-scale interior and industrial maintenance. He heads Marketing, Sales, Execution, and Customer Relations.
                  </p>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">Trusted By Corporate Clients</span>
                    <p className="text-sm font-medium text-stone-700">TCS, Syntel, Fujitsu, Nvidia, HCL, Suzlon, Synechron & Mphasis.</p>
                  </div>
                </div>
              </div>

              {/* Mr. Nilesh Bhusal */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-100 group">
                <div className="relative h-96 w-full overflow-hidden">
                  <Image src="/images/team/nilesh.png" alt="Mr. Nilesh Bhusal" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="font-outfit text-2xl font-bold text-stone-900 mb-1">Mr. Nilesh Bhusal</h3>
                  <p className="text-amber-600 font-medium mb-4">Founder & Director</p>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    Co-founder and Director of Anuresha Interiors. He heads Project Operations, Resource Procurement, and technical planning, ensuring that all projects run seamlessly and meet engineering standards.
                  </p>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">Core Philosophy</span>
                    <p className="text-sm font-medium text-stone-700">"Ensuring seamless execution, structural integrity, and premium craftsmanship."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Team Section */}
          <div className="pt-24 mt-24 border-t border-stone-200">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-outfit text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Our <span className="text-amber-600">Team</span>
              </h2>
              <p className="text-lg text-stone-600">
                The highly skilled professionals driving Anuresha Interiors towards excellence in every single project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Anita Pande */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image src="/images/team/anita.jpg" alt="Anita Pande" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-outfit text-xl font-bold text-stone-900 mb-1">Anita Pande</h3>
                  <p className="text-amber-600 font-medium text-sm">Back Office Executive</p>
                </div>
              </div>

              {/* Uday Jaiswar */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image src="/images/team/uday.png" alt="Uday Jaiswar" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-outfit text-xl font-bold text-stone-900 mb-1">Uday Jaiswar</h3>
                  <p className="text-amber-600 font-medium text-sm">Operations Manager</p>
                </div>
              </div>

              {/* Shrikant */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image src="/images/team/shrikant.jpg" alt="Shrikant" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-outfit text-xl font-bold text-stone-900 mb-1">Shrikant</h3>
                  <p className="text-amber-600 font-medium text-sm">Head of Solar Operations</p>
                </div>
              </div>

              {/* Vishwajit */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image src="/images/team/vishwajit.jpg" alt="Vishwajit" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-outfit text-xl font-bold text-stone-900 mb-1">Vishwajit</h3>
                  <p className="text-amber-600 font-medium text-sm">Site Supervisor</p>
                </div>
              </div>

              {/* Nayan Pawar */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image src="/images/team/nayan.jpg" alt="Nayan Pawar" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-outfit text-xl font-bold text-stone-900 mb-1">Nayan Pawar</h3>
                  <p className="text-amber-600 font-medium text-sm">Site Supervisor</p>
                </div>
              </div>

              {/* Aditya Pande */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image src="/images/team/aditya.jpg" alt="Aditya Pande" fill unoptimized={true} className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-outfit text-xl font-bold text-stone-900 mb-1">Aditya Pande</h3>
                  <p className="text-amber-600 font-medium text-sm">Site Supervisor</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      
    </main>

      <Footer />

    </>
  );
}

