"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Send } from "lucide-react";

type InvoiceItem = {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
};

function numberToWords(num: number): string {
  if (num === 0) return "zero only.";
  const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  const b = ['', '', 'twenty ','thirty ','forty ','fifty ', 'sixty ','seventy ','eighty ','ninety '];

  const numStr = num.toString();
  if (numStr.length > 9) return 'amount too large';
  const n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + a[Number(n[1][1])]) + 'crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + a[Number(n[2][1])]) + 'lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + a[Number(n[3][1])]) + 'thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + a[Number(n[4][1])]) + 'hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + a[Number(n[5][1])]) : '';
  return str.trim() + ' only.';
}

export default function InvoiceGenerator({ 
  projectId, 
  clientName,
  clientDetails,
  onSave, 
  onCancel 
}: { 
  projectId: string, 
  clientName?: string,
  clientDetails?: string,
  onSave: (bill: any, status: 'Draft'|'Published') => void, 
  onCancel: () => void 
}) {
  const [items, setItems] = useState<InvoiceItem[]>([
    { 
      id: Math.random().toString(), 
      description: 'Custom Modular Kitchen Fabrication and Installation (Including Hettich Hardware)', 
      hsn: '995456', 
      quantity: 1, 
      uom: 'LS', 
      rate: 250000, 
      amount: 250000 
    },
    { 
      id: Math.random().toString(), 
      description: 'False Ceiling (Gypsum Board with Cove Lighting)', 
      hsn: '995456', 
      quantity: 450, 
      uom: 'SQ.FT', 
      rate: 140, 
      amount: 63000 
    }
  ]);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [isSaving, setIsSaving] = useState(false);

  // Editable Header Fields
  const [invoiceNo, setInvoiceNo] = useState("AIPL26-27/001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '.'));
  const [poNo, setPoNo] = useState("3700408047");
  const [poDate, setPoDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '.'));
  const [clientPan, setClientPan] = useState("AAICS0960L");
  const [clientGst, setClientGst] = useState("27AAICS0960L2ZZ");
  const [kindAtten, setKindAtten] = useState(clientName || "Mr. Client");
  const [clientContact, setClientContact] = useState("+91");
  const [subject, setSubject] = useState("Tax Invoice for Interior Services");
  
  const [localClientName, setLocalClientName] = useState(clientName || "Client Name");
  const [localClientAddress, setLocalClientAddress] = useState(clientDetails || "Project Address Here");

  const COMPANY_DETAILS = {
    name: "Anuresha Interior Pvt Ltd",
    pan: "AAWCA6641G",
    gst: "27AAWCA6641G1Z9",
    phone: "91-9767592251",
    email: "info@anuresha.com",
    address: "Fl.No. C-401, Sr. No. 219/2B, Subhadra Heights,\nDighi Road, Bhosari,\nPune 411039. Maharashtra (India)."
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount = Number(updated.quantity) * Number(updated.rate);
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', hsn: '', quantity: 1, uom: 'EA', rate: 0, amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const basicAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const cgstAmount = (basicAmount * (gstPercentage / 2)) / 100;
  const sgstAmount = (basicAmount * (gstPercentage / 2)) / 100;
  const totalTaxAmount = cgstAmount + sgstAmount;
  const rawGrandTotal = basicAmount + totalTaxAmount;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = (grandTotal - rawGrandTotal).toFixed(2);

  const handleAction = async (status: 'Draft' | 'Published') => {
    setIsSaving(true);
    await onSave({
      invoice_number: invoiceNo,
      items,
      subtotal: basicAmount,
      gst_percentage: gstPercentage,
      grand_total: grandTotal,
      bank_details: {
        accountName: "ANURESHA INTERIOR PRIVATE LIMITED",
        accountNumber: "50200068423117",
        ifsc: "HDFC0001578",
        bankName: "HDFC Bank",
        branch: "Kharadi Pune"
      }
    }, status);
    setIsSaving(false);
  };

  return (
    <div className="bg-white text-black p-4 sm:p-8 font-sans w-full max-w-[850px] mx-auto shadow-2xl my-8 text-[11px] sm:text-xs leading-tight">
      <div className="border-[1.5px] border-black">
        
        {/* Header */}
        <div className="text-center font-bold text-sm sm:text-base border-b border-black py-1 tracking-wider">
          TAX INVOICE
        </div>
        
        {/* To / Company */}
        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black p-2 flex flex-col gap-1">
            <span className="font-bold text-sm">To,</span>
            <input 
              className="font-bold outline-none text-sm w-full bg-transparent" 
              value={localClientName} 
              onChange={e => setLocalClientName(e.target.value)} 
            />
            <textarea 
              className="outline-none resize-none h-16 w-full bg-transparent" 
              value={localClientAddress} 
              onChange={e => setLocalClientAddress(e.target.value)} 
            />
          </div>
          <div className="w-1/2 p-2 flex flex-col gap-1">
            <span className="font-bold text-sm">{COMPANY_DETAILS.name}</span>
            <span className="whitespace-pre-line text-stone-700">{COMPANY_DETAILS.address}</span>
          </div>
        </div>
        
        {/* Meta Data */}
        <div className="flex border-b border-black bg-white">
          <div className="w-1/2 border-r border-black flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Client's PAN No:</div>
             <input className="w-2/3 outline-none uppercase p-1 bg-transparent" value={clientPan} onChange={e => setClientPan(e.target.value)} />
          </div>
          <div className="w-1/2 flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Tax Invoice No:</div>
             <input className="w-2/3 outline-none uppercase p-1 bg-transparent" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
          </div>
        </div>
        
        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Client's GST No:</div>
             <input className="w-2/3 outline-none uppercase p-1 bg-transparent" value={clientGst} onChange={e => setClientGst(e.target.value)} />
          </div>
          <div className="w-1/2 flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Tax Invoice Date:</div>
             <input className="w-2/3 outline-none uppercase p-1 bg-transparent" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
          </div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">PO / WO No:</div>
             <input className="w-2/3 outline-none uppercase p-1 bg-transparent" value={poNo} onChange={e => setPoNo(e.target.value)} />
          </div>
          <div className="w-1/2 flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">ANURESHA's PAN No-</div>
             <div className="w-2/3 p-1 uppercase">{COMPANY_DETAILS.pan}</div>
          </div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">PO / WO Date:</div>
             <input className="w-2/3 outline-none uppercase p-1 bg-transparent" value={poDate} onChange={e => setPoDate(e.target.value)} />
          </div>
          <div className="w-1/2 flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">ANURESHA's GST No-</div>
             <div className="w-2/3 p-1 uppercase">{COMPANY_DETAILS.gst}</div>
          </div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Kind Atten:</div>
             <input className="w-2/3 outline-none p-1 bg-transparent" value={kindAtten} onChange={e => setKindAtten(e.target.value)} />
          </div>
          <div className="w-1/2 flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">E-mail:</div>
             <div className="w-2/3 p-1 text-stone-700">{COMPANY_DETAILS.email}</div>
          </div>
        </div>

        <div className="flex border-b border-black">
          <div className="w-1/2 border-r border-black flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Contact No:</div>
             <input className="w-2/3 outline-none p-1 bg-transparent" value={clientContact} onChange={e => setClientContact(e.target.value)} />
          </div>
          <div className="w-1/2 flex">
             <div className="w-1/3 font-bold border-r border-black p-1 flex items-center">Contact No:</div>
             <div className="w-2/3 p-1 text-stone-700">{COMPANY_DETAILS.phone}</div>
          </div>
        </div>

        {/* Subject */}
        <div className="border-b border-black p-2 flex items-center bg-stone-50">
           <span className="font-bold mr-2 whitespace-nowrap">Subject :</span>
           <input className="outline-none w-full font-bold bg-transparent" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>

        {/* Items Table Header */}
        <div className="flex border-b border-black text-center font-bold items-center">
          <div className="w-[8%] border-r border-black p-1 h-full">Sr. No.</div>
          <div className="w-[45%] border-r border-black p-1 h-full">Type of Work / Goods</div>
          <div className="w-[12%] border-r border-black p-1 h-full">Quantity</div>
          <div className="w-[10%] border-r border-black p-1 h-full">UOM</div>
          <div className="w-[12.5%] border-r border-black p-1 h-full">Rate /<br/>Unit</div>
          <div className="w-[12.5%] p-1 h-full">Total<br/>Amount</div>
        </div>

        {/* Items rows */}
        <div className="min-h-[120px] flex flex-col">
          {items.map((item, idx) => (
            <div className="flex relative group border-b border-stone-200 hover:bg-stone-50 transition-colors" key={item.id}>
              <div className="w-[8%] border-r border-black p-2 text-center">{idx + 1})</div>
              <div className="w-[45%] border-r border-black p-2 flex flex-col gap-1">
                <textarea 
                  className="w-full font-bold outline-none resize-none bg-transparent" 
                  value={item.description} 
                  onChange={e => updateItem(item.id, 'description', e.target.value)} 
                  rows={2} 
                  placeholder="Item Description"
                />
                <div className="flex items-center text-[10px]">
                  <span className="text-stone-500 mr-1 whitespace-nowrap">HSN/SAC Code:</span>
                  <input className="outline-none bg-transparent w-full" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} />
                </div>
              </div>
              <div className="w-[12%] border-r border-black p-2 flex items-start justify-center">
                 <input className="w-full text-center outline-none bg-transparent" type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', e.target.value)} />
              </div>
              <div className="w-[10%] border-r border-black p-2 flex items-start justify-center font-bold">
                 <input className="w-full text-center outline-none uppercase bg-transparent" value={item.uom} onChange={e => updateItem(item.id, 'uom', e.target.value)} />
              </div>
              <div className="w-[12.5%] border-r border-black p-2 flex items-start justify-end">
                 <input className="w-full text-right outline-none bg-transparent" type="number" value={item.rate || ""} onChange={e => updateItem(item.id, 'rate', e.target.value)} placeholder="0.00" />
              </div>
              <div className="w-[12.5%] p-2 text-right font-bold">
                 {item.amount.toFixed(2)}
              </div>
              <button onClick={() => removeItem(item.id)} className="absolute -right-8 top-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-full shadow-sm"><Trash2 className="w-4 h-4"/></button>
            </div>
          ))}
          {/* Buffer space to stretch down if needed */}
          <div className="flex-1 flex">
            <div className="w-[8%] border-r border-black"></div>
            <div className="w-[45%] border-r border-black"></div>
            <div className="w-[12%] border-r border-black"></div>
            <div className="w-[10%] border-r border-black"></div>
            <div className="w-[12.5%] border-r border-black"></div>
            <div className="w-[12.5%]"></div>
          </div>
        </div>

        {/* Totals Section */}
        <div className="border-t border-black">
          <div className="flex border-b border-black">
            <div className="w-[87.5%] border-r border-black text-right pr-2 font-bold py-1">Basic Amount :</div>
            <div className="w-[12.5%] text-right pr-2 font-bold py-1">{basicAmount.toFixed(2)}</div>
          </div>
          <div className="flex border-b border-black">
            <div className="w-[87.5%] border-r border-black text-right pr-2 py-1 flex justify-end gap-1">
              <span className="font-bold">CGST-</span>
              <span className="font-bold flex items-center">@<input type="number" className="w-8 outline-none text-center bg-amber-50" value={gstPercentage/2} onChange={e => setGstPercentage(Number(e.target.value)*2)} />%</span> 
              <span>on Total Bill Amount :</span>
            </div>
            <div className="w-[12.5%] text-right pr-2 py-1">{cgstAmount.toFixed(2)}</div>
          </div>
          <div className="flex border-b border-black">
            <div className="w-[87.5%] border-r border-black text-right pr-2 py-1 flex justify-end gap-1">
              <span className="font-bold">SGST-</span>
              <span className="font-bold">@{(gstPercentage/2).toFixed(2)}%</span> 
              <span>on Total Bill Amount :</span>
            </div>
            <div className="w-[12.5%] text-right pr-2 py-1">{sgstAmount.toFixed(2)}</div>
          </div>
          <div className="flex border-b border-black">
            <div className="w-[87.5%] border-r border-black text-right pr-2 py-1 flex justify-end gap-1">
              <span className="font-bold">IGST-</span>
              <span className="font-bold">@0.00%</span> 
              <span>on Total Bill Amount :</span>
            </div>
            <div className="w-[12.5%] text-right pr-2 py-1">0.00</div>
          </div>
          <div className="flex border-b border-black bg-stone-100">
            <div className="w-[87.5%] border-r border-black text-right pr-2 font-bold py-1">Total Tax Amount :</div>
            <div className="w-[12.5%] text-right pr-2 font-bold py-1">{totalTaxAmount.toFixed(2)}</div>
          </div>
        </div>
        
        {/* Amount in Words & Grand Total Block */}
        <div className="flex border-b border-black">
          <div className="w-[60%] border-r border-black font-bold py-1 flex flex-col justify-between">
            <div className="text-center w-full mb-2 mt-1">AMOUNT IN WORDS</div>
            <div className="px-2 italic font-normal text-stone-700 capitalize pb-1">
              Rupees {numberToWords(grandTotal)}
            </div>
          </div>
          <div className="w-[40%] flex flex-col">
            <div className="flex border-b border-black flex-1">
              <div className="w-[68.75%] border-r border-black text-right pr-2 py-1">Other Charges :</div>
              <div className="w-[31.25%] text-right pr-2 py-1">0.00</div>
            </div>
            <div className="flex border-b border-black flex-1">
              <div className="w-[68.75%] border-r border-black text-right pr-2 py-1">Round off (+/-) :</div>
              <div className="w-[31.25%] text-right pr-2 py-1">{roundOff}</div>
            </div>
            <div className="flex bg-stone-100 flex-1 items-center">
              <div className="w-[68.75%] border-r border-black text-right pr-2 font-bold py-1.5 text-sm">GRAND TOTAL</div>
              <div className="w-[31.25%] text-right pr-2 font-bold py-1.5 text-sm">{grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>

        {/* Payment & Signatory */}
        <div className="flex border-b border-black relative">
           <div className="w-[15%] border-r border-black flex flex-col items-center justify-center font-bold p-2 text-center">
              Payment<br/>Methods
           </div>
           <div className="w-[45%] border-r border-black p-2">
              <div className="font-bold mb-1">1. Direct Transfer - Account details as follows:</div>
              <div className="flex"><div className="w-24">Bank Name:</div><div>HDFC Bank</div></div>
              <div className="flex"><div className="w-24">A/C Name:</div><div>ANURESHA INTERIOR PRIVATE LIMITED</div></div>
              <div className="flex"><div className="w-24">A/C No.:</div><div>50200068423117</div></div>
              <div className="flex"><div className="w-24">IFSC Code:</div><div>HDFC0001578</div></div>
              <div className="flex"><div className="w-24">Branch:</div><div>Kharadi Pune</div></div>
           </div>
           <div className="w-[40%] flex flex-col relative">
              <div className="font-bold text-center border-b border-black py-1">2. Cheque</div>
              <div className="flex-1 flex items-center justify-center p-2 text-center">
                In favor of "Anuresha Interior Pvt Ltd".
              </div>
           </div>
        </div>

        {/* Terms & Conditions */}
        <div className="flex">
           <div className="w-[60%] border-r border-black p-1">
              <div className="font-bold text-center border-b border-black mb-1 pb-1">STANDARD TERMS & CONDITIONS</div>
              <ol className="list-decimal pl-6 space-y-0.5 text-[10px]">
                <li>Objection / Claim of any nature whatsoever will lapse unless raise in writing within three days from the date of Invoice</li>
                <li>Interest @ 24% P. A. will be charged if bill is not paid within due date.</li>
                <li>Subject to pune jurisdiction only.</li>
              </ol>
           </div>
           <div className="w-[40%] flex flex-col justify-between p-2">
              <div className="font-bold text-right pt-1">For, Anuresha Interior Pvt Ltd</div>
              <div className="font-bold text-right mt-12 pb-2">Authorized Signatory</div>
           </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-200">
        <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-100/50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Row
        </button>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={isSaving} className="px-6 py-2 rounded-lg font-bold text-stone-600 hover:bg-stone-200 transition-colors">Cancel</button>
          <button onClick={() => handleAction('Draft')} disabled={isSaving} className="px-6 py-2 rounded-lg font-bold text-stone-700 bg-white border border-stone-200 shadow-sm hover:bg-stone-50 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => handleAction('Published')} disabled={isSaving} className="px-6 py-2 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" /> Publish Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
