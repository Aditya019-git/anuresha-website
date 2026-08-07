"use client";

import React, { useEffect, useState } from "react";
import { getLeads, updateLeadStatus } from "@/app/actions";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  whatsapp_opt_in: boolean;
  status: string;
  created_at: string;
};

const PHONE_ICON = "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z";
const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const result = await getLeads();
      if (result.success && result.data) {
        setLeads(result.data);
      } else {
        console.error("Error fetching leads:", (result as any).error);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatusHandler(id: string, newStatus: string) {
    try {
      const result = await updateLeadStatus(id, newStatus);
      if (result.success) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  }

  function getWaLink(phone: string, name: string) {
    const digits = phone.replace(/\D/g, "");
    const msg = encodeURIComponent("Hi " + name + ", this is from Anuresha Interior.");
    return "https://wa.me/91" + digits + "?text=" + msg;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 mt-4">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
        <div>
          <h2 className="font-outfit text-3xl font-bold text-stone-900">Incoming Leads</h2>
          <p className="text-stone-500 mt-1 text-sm">Manage and track client requests from the website.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-stone-200 flex flex-col min-w-[140px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">New Leads</span>
            <span className="font-outfit text-3xl font-bold text-stone-900 leading-none mt-2">{leads.filter(l => l.status === "New").length}</span>
          </div>

          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-stone-200 flex flex-col min-w-[140px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Contacted</span>
            <span className="font-outfit text-3xl font-bold text-stone-900 leading-none mt-2">{leads.filter(l => l.status === "Contacted").length}</span>
          </div>

          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-stone-200 flex flex-col min-w-[140px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Closed Deal</span>
            <span className="font-outfit text-3xl font-bold text-stone-900 leading-none mt-2">{leads.filter(l => l.status === "Closed").length}</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-4 mb-6 border-b border-stone-200">
        <button className="pb-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 border-amber-600 text-amber-600">
          Incoming Leads
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Client Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">City</th>
                <th className="p-4 font-semibold">WhatsApp</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-stone-500">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-stone-500">No leads found. Test the form on the homepage!</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-sm text-stone-600">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-stone-900">{lead.name}</td>
                    <td className="p-4 text-sm text-stone-600">
                      <div>{lead.email}</div>
                      <div className="text-stone-500">{lead.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-stone-600 capitalize">{lead.city}</td>
                    <td className="p-4 text-sm">
                      {lead.whatsapp_opt_in ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                          Opted In
                        </span>
                      ) : (
                        <span className="text-stone-400">No</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatusHandler(lead.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                          lead.status === "New" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          lead.status === "Contacted" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <a
                          href={"tel:" + lead.phone}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={PHONE_ICON} />
                          </svg>
                          Call
                        </a>
                        {lead.whatsapp_opt_in && (
                          <a
                            href={getWaLink(lead.phone, lead.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 border border-green-200"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d={WA_ICON} />
                            </svg>
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
