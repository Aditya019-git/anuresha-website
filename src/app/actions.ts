"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import os from "os";

const LOCAL_PORTFOLIO_FILE = path.join(process.cwd(), "public", "portfolio_data.json");

function getLocalPortfolio(): any[] {
  try {
    if (fs.existsSync(LOCAL_PORTFOLIO_FILE)) {
      const data = fs.readFileSync(LOCAL_PORTFOLIO_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading local portfolio data:", e);
  }
  return [];
}

function saveLocalPortfolio(items: any[]) {
  try {
    const dir = path.dirname(LOCAL_PORTFOLIO_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_PORTFOLIO_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving local portfolio data:", e);
  }
}

const LOCAL_LEADS_FILE = path.join(process.cwd(), "public", "leads_data.json");

function getLocalLeads(): any[] {
  try {
    if (fs.existsSync(LOCAL_LEADS_FILE)) {
      const data = fs.readFileSync(LOCAL_LEADS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading local leads data:", e);
  }
  return [];
}

function saveLocalLeads(items: any[]) {
  try {
    const dir = path.dirname(LOCAL_LEADS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_LEADS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving local leads data:", e);
  }
}

export async function sendAdminNotificationEmail(projectName: string, clientName: string, estimatedPrice: string, clientPhone: string) {
  try {
    // Note: To make this work, the user needs to add SMTP_USER and SMTP_PASS to their .env.local
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // This should be a Google App Password
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Sending to the admin's own email
      subject: `🚀 New Project Request: ${projectName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #fafaf9; border-radius: 12px; border: 1px solid #e7e5e4;">
          <h2 style="color: #1c1917; margin-bottom: 5px;">New Project Request Submitted!</h2>
          <p style="color: #78716c; margin-top: 0;">A client has created a new project and is waiting for your approval.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; font-weight: bold; width: 150px;">Client Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Client Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4;">${clientPhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Project Type:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4;">${projectName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Estimated Price:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #d97706; font-weight: bold;">₹${estimatedPrice}</td>
            </tr>
          </table>

          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/admin" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in Admin Portal</a>
          </div>
        </div>
      `
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Admin notification email sent successfully.");
    } else {
      console.log("Email not sent: SMTP_USER and SMTP_PASS are not configured in .env.local");
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const cookieStore = await cookies();

  // 1. Check for Admin Login (Password removed, OTP flow triggered from frontend instead)
  if (username.toLowerCase() === "admin") {
    return { error: "Admin login has moved to OTP. Please click 'Get OTP'." };
  }

  // 2. Check for Client Login
  const { data: client, error } = await supabase
    .from("clients")
    .select("id, password")
    .eq("phone", username)
    .single();

  if (client && client.password === password) {
    cookieStore.set("client_session", client.id, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });
    redirect("/client");
  }

  return { error: "Invalid phone number or password" };
}

export async function getClientDashboardData() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get("client_session")?.value;

  if (!clientId) {
    redirect("/login");
  }

  try {
    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError) throw clientError;

    // Get projects with their updates
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        *,
        project_updates (
          id,
          update_text,
          images,
          created_at
        ),
        reviews (id)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (projectsError) {
      console.error("Projects Error:", projectsError);
      throw projectsError;
    }

    return { client, projects };
  } catch (error) {
    console.error("Error fetching client dashboard:", error);
    // Remove try-catch wrapper around redirect, return null instead and let component handle redirect
    return null;
  }
}

export async function submitLead(formData: FormData) {
  try {
    const name = (formData.get("name") as string) || "Anonymous Client";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const city = (formData.get("city") as string) || "Pune";
    const notify_whatsapp = formData.get("notify_whatsapp") === "on";

    const leadId = crypto.randomUUID();

    const newLead = {
      id: leadId,
      name,
      email,
      phone,
      city,
      whatsapp_opt_in: notify_whatsapp,
      status: "New",
      created_at: new Date().toISOString()
    };

    // 1. Insert into Supabase
    try {
      const { error } = await supabaseAdmin
        .from("leads")
        .insert([{
          id: leadId,
          name,
          email,
          phone,
          city,
          whatsapp_opt_in: notify_whatsapp,
          status: "New",
          created_at: newLead.created_at
        }]);

      if (error) {
        console.error("Supabase Lead Insert Error:", error);
      }
    } catch (e) {
      console.warn("Supabase insert failed for lead, continuing fallback:", e);
    }

    // 2. Save locally if writable
    try {
      const currentLeads = getLocalLeads();
      saveLocalLeads([newLead, ...currentLeads]);
    } catch (e) {
      console.warn("Local leads save warning (serverless mode):", e);
    }

    // 3. Send email notification to info.anuresha@gmail.com
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        await transporter.sendMail({
          from: `"Anuresha Interior" <${process.env.SMTP_USER}>`,
          to: "info.anuresha@gmail.com",
          subject: `📩 New Estimate Request: ${name} (${city})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background: #fafaf9; border-radius: 12px; border: 1px solid #e7e5e4;">
              <h2 style="color: #1c1917;">New Estimate Request Received!</h2>
              <p>A client has requested a transformation estimate from your website homepage.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">+91 ${phone}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">City:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${city}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">WhatsApp Opt-In:</td><td style="padding: 8px;">${notify_whatsapp ? "Yes" : "No"}</td></tr>
              </table>
            </div>
          `
        });
      }
    } catch (e) {
      console.warn("Admin email notification warning:", e);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error?.message || "Internal Server Error" };
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ------------------------------------------------------------------
// AUTH & OTP ACTIONS
// ------------------------------------------------------------------

export async function sendOtp(email: string, name?: string, phone?: string) {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    // 1. Check if client exists by email OR phone
    let query = supabase.from("clients").select("id").eq("email", email);
    
    // If phone is provided, we check for either email OR phone match
    if (phone) {
      query = supabase.from("clients").select("id").or(`email.eq.${email},phone.eq.${phone}`);
    }

    const { data: existingClients } = await query;
    const existingClient = existingClients && existingClients.length > 0 ? existingClients[0] : null;

    if (existingClient) {
      // Update existing client with OTP and ensure their email is set
      const { error: updateError } = await supabase.from("clients").update({ 
        email: email, // Set email in case they were created previously with just a phone number
        otp_code: otp, 
        otp_expires_at: expiresAt 
      }).eq("id", existingClient.id);
      
      if (updateError) {
        console.error("Update Client Error:", updateError);
        throw updateError;
      }
    } else if (name && phone) {
      // Create new pending client for registration
      const { error } = await supabase.from("clients").insert([{
        name,
        phone,
        email,
        password: "pending",
        otp_code: otp,
        otp_expires_at: expiresAt
      }]);
      if (error) {
        console.error("Insert Client Error:", error);
        return { success: false, error: "Failed to create account." };
      }
    } else {
      return { success: false, error: "Account not found." };
    }

    // 2. Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Anuresha Interior - Your Verification Code",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1c1917;">Verification Code</h2>
          <p style="color: #444; font-size: 16px;">Hello,</p>
          <p style="color: #444; font-size: 16px;">Your One-Time Password (OTP) to access the Anuresha Client Portal is:</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #d97706; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #78716c; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `
    };
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not set. Falling back to success for demo purposes.");
      // For testing without SMTP, you can look at the console to see the OTP
      console.log(`[DEMO MODE] OTP for ${email} is: ${otp}`);
      return { success: true };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return { success: false, error: error.message || "Failed to send OTP. Please check console for details." };
  }
}

export async function verifyOtpAndSetPassword(email: string, otp: string, newPassword?: string) {
  try {
    const { data: client, error } = await supabase
      .from("clients")
      .select("id, otp_code, otp_expires_at")
      .eq("email", email)
      .single();

    if (error || !client) return { success: false, error: "Account not found." };
    
    if (client.otp_code !== otp) {
      return { success: false, error: "Invalid OTP code." };
    }

    if (new Date() > new Date(client.otp_expires_at)) {
      return { success: false, error: "OTP has expired. Please request a new one." };
    }

    // OTP is valid! Update password if provided, and clear OTP
    const updateData: any = { otp_code: null, otp_expires_at: null };
    if (newPassword) {
      updateData.password = newPassword;
    }

    await supabase.from("clients").update(updateData).eq("id", client.id);

    // Set Session
    const cookieStore = await cookies();
    cookieStore.set("client_session", client.id, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });

    return { success: true, clientId: client.id };
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return { success: false, error: "Verification failed." };
  }
}

import crypto from "crypto";

const OTP_SECRET = process.env.SMTP_PASS || "anuresha-admin-otp-secret-key";

export async function sendAdminOtp() {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Compute cryptographic HMAC signature of OTP + expiration
    const hmac = crypto.createHmac("sha256", OTP_SECRET).update(`${otp}:${expiresAt}`).digest("hex");
    const challengeData = JSON.stringify({ hash: hmac, expiresAt });

    // Store challenge in secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_otp_challenge", challengeData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600 // 10 minutes
    });

    const email = "info.anuresha@gmail.com";
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Anuresha Interior" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔒 Your Admin Portal Login Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e7e5e4; }
            .header { background-color: #1c1917; padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
            .header p { color: #a8a29e; margin: 8px 0 0 0; font-size: 14px; }
            .content { padding: 40px 30px; text-align: center; }
            .content p { color: #57534e; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
            .otp-box { background-color: #fef3c7; border: 2px dashed #d97706; padding: 20px; border-radius: 8px; margin: 30px 0; }
            .otp-code { color: #d97706; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; }
            .footer { background-color: #fafaf9; padding: 20px; text-align: center; border-top: 1px solid #e7e5e4; }
            .footer p { color: #a8a29e; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ANURESHA INTERIOR</h1>
              <p>Admin Security Portal</p>
            </div>
            <div class="content">
              <p>Hello Admin,</p>
              <p>A login request was initiated for your Anuresha Interior Admin Portal. Please use the verification code below to securely sign in.</p>
              <div class="otp-box">
                <p class="otp-code">${otp}</p>
              </div>
              <p style="font-size: 14px; color: #78716c;">This code will expire in exactly <strong>10 minutes</strong>. If you did not request this login, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Anuresha Interior Private Limited. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DEMO MODE] ADMIN OTP is: ${otp}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Send Admin OTP Error:", error);
    return { success: false, error: error?.message || "Failed to send OTP to Admin Email." };
  }
}

export async function verifyAdminOtp(prevState: any, formData: FormData) {
  const userOtp = (formData.get("otp") as string)?.trim();

  try {
    const cookieStore = await cookies();
    const challengeCookie = cookieStore.get("admin_otp_challenge")?.value;

    if (!challengeCookie) {
      return { error: "No OTP requested or session expired. Please request a new code." };
    }

    const { hash: savedHash, expiresAt } = JSON.parse(challengeCookie);

    if (new Date() > new Date(expiresAt)) {
      return { error: "OTP has expired. Please request a new code." };
    }

    // Compute expected HMAC for user-entered OTP
    const expectedHash = crypto.createHmac("sha256", OTP_SECRET).update(`${userOtp}:${expiresAt}`).digest("hex");

    if (expectedHash !== savedHash) {
      return { error: "Invalid OTP code. Please check and try again." };
    }

    // Success - set admin session cookie
    cookieStore.set("admin_session", "true", { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });
    
    // Clear challenge cookie
    cookieStore.delete("admin_otp_challenge");

    redirect("/admin");
  } catch (error) {
    console.error("Verify Admin OTP Error:", error);
    if (error && typeof error === 'object' && 'digest' in error && (error as any).digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    return { error: "Verification failed. Please request a new OTP." };
  }
}

// ------------------------------------------------------------------
// PROJECT & NOTIFICATION ACTIONS
// ------------------------------------------------------------------

export async function createPendingProject(data: {
  clientId: string; // Changed to accept clientId directly since auth is handled
  propertyType: string;
  size: number;
  services: string[];
  estimateRange: string;
}) {
  try {
    // Get client details for the email
    const { data: client } = await supabase.from("clients").select("name, phone").eq("id", data.clientId).single();

    // Create the Project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([{
        client_id: data.clientId,
        property_type: data.propertyType,
        property_size: data.size.toString() + " Sq.Ft",
        selected_services: data.services,
        estimated_price: data.estimateRange,
        status: "Pending Approval"
      }])
      .select()
      .single();

    if (projectError) throw projectError;

    // Send Email Notification to Admin
    if (client) {
      await sendAdminNotificationEmail(
        `${data.propertyType} (${data.size} Sq.Ft)`,
        client.name,
        data.estimateRange,
        client.phone
      );

      // Remove the user from the "Casual Leads" list since they are now a registered SaaS Project
      await supabase.from("leads").delete().eq("phone", client.phone);
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating pending project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function getLeads() {
  const localData = getLocalLeads();

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const leadMap = new Map();

      // Add local leads first
      localData.forEach(item => {
        if (item && item.id) leadMap.set(item.id, item);
      });

      // Add Supabase leads
      data.forEach(item => {
        if (item && item.id) leadMap.set(item.id, item);
      });

      const allLeads = Array.from(leadMap.values()).sort((a: any, b: any) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      return { success: true, data: allLeads };
    }
  } catch (error) {
    console.error("Fetch Leads Supabase Error:", error);
  }

  return { success: true, data: localData };
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    // Update local data
    const localLeads = getLocalLeads();
    const updatedLeads = localLeads.map(lead => lead.id === id ? { ...lead, status } : lead);
    saveLocalLeads(updatedLeads);

    try {
      await supabaseAdmin
        .from("leads")
        .update({ status })
        .eq("id", id);
    } catch (e) {
      console.warn("Supabase update lead failed, updated locally.");
    }

    return { success: true };
  } catch (error) {
    console.error("Update Lead Error:", error);
    return { success: false, error: "Failed to update lead status" };
  }
}

export async function getProjects() {
  try {
    // Join projects with clients to get client name and phone
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        clients (
          name,
          phone,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function updateProjectStatus(id: string, status: string) {
  try {
    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Update Project Error:", error);
    return { success: false, error: "Failed to update project status" };
  }
}

export async function addProjectUpdate(formData: FormData) {
  try {
    const projectId = formData.get("projectId") as string;
    const updateText = formData.get("updateText") as string;
    const completedServicesStr = formData.get("completedServices") as string;
    const completedServices = completedServicesStr ? JSON.parse(completedServicesStr) : [];
    
    // We also need the total selected services to calculate percentage automatically
    const totalServicesStr = formData.get("totalServices") as string;
    const totalServices = totalServicesStr ? JSON.parse(totalServicesStr) : [];
    
    // Calculate new percentage automatically
    let completionPercentage = 0;
    if (totalServices.length > 0) {
      completionPercentage = Math.round((completedServices.length / totalServices.length) * 100);
    }
    
    const files = formData.getAll("images") as File[];
    
    // Convert files to base64
    const base64Images = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return `data:${file.type};base64,${buffer.toString('base64')}`;
    }));

    // Insert the timeline update
    const { error: updateError } = await supabase
      .from("project_updates")
      .insert([{
        project_id: projectId,
        update_text: updateText,
        images: base64Images
      }]);

    if (updateError) throw updateError;
    
    // Update the overall project completion percentage AND completed_services array
    const { error: projectError } = await supabase
      .from("projects")
      .update({ 
        completion_percentage: completionPercentage,
        completed_services: completedServices
      })
      .eq("id", projectId);
      
    if (projectError) throw projectError;

    // Get client details to send the email notification
    const { data: projectDetails } = await supabase
      .from("projects")
      .select(`
        clients ( name, email )
      `)
      .eq("id", projectId)
      .single();

    const clientData = Array.isArray(projectDetails?.clients) ? projectDetails?.clients[0] : projectDetails?.clients;
    const client = clientData as any;

    if (client?.email) {
      await sendClientTimelineNotification(
        client.name,
        client.email,
        updateText,
        files.length > 0,
        completionPercentage
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Add Update Error:", error);
    return { success: false, error: "Failed to post timeline update" };
  }
}

async function sendClientTimelineNotification(name: string, email: string, updateText: string, hasImages: boolean, newProgress: number) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "New Timeline Update - Anuresha Interior",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1c1917;">Your Project Was Updated!</h2>
          <p style="color: #444; font-size: 16px;">Hello ${name},</p>
          <p style="color: #444; font-size: 16px;">Our team has just posted a new update to your live project timeline.</p>
          
          <div style="background: #fdfae8; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0;">
            <p style="color: #92400e; font-size: 16px; font-weight: 500; margin: 0;">"${updateText}"</p>
          </div>
          
          ${hasImages ? `<p style="color: #444; font-size: 16px;">📸 <strong>New photos have been attached to this update!</strong></p>` : ''}
          <p style="color: #444; font-size: 16px;">📈 <strong>Current Progress:</strong> ${newProgress}%</p>
          
          <p style="color: #444; font-size: 16px; margin-top: 30px;">Log in to your Client Portal to view the full details.</p>
          <a href="${siteUrl}/login" style="display: inline-block; background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">View Dashboard</a>
        </div>
      `
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[DEMO MODE] Client Email sent to ${email}: ${updateText}`);
    }
  } catch (error) {
    console.error("Failed to send client notification email:", error);
  }
}

// REVIEWS ACTIONS
export async function submitReview(projectId: string, rating: number, comment: string) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("client_session")?.value;

    if (!sessionId) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("reviews")
      .insert([{
        project_id: projectId,
        client_id: sessionId,
        rating,
        comment,
        is_approved: true // Defaulting to true for demo purposes
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Submit Review Error:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function getReviews() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        clients (name)
      `)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return { success: true, data };
    }
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
  }
  return { success: true, data: [] };
}

// BILLING & INVOICE ACTIONS
export async function saveBill(projectId: string, billData: any, status: 'Draft' | 'Published') {
  try {
    // Check if we are updating an existing draft or creating a new one
    // For MVP, we will assume one main bill per project that gets updated, 
    // or we can insert a new one if it has a unique invoice number.
    // Let's generate a unique invoice number if creating.
    const invoiceNumber = `INV-${Date.now()}`;
    
    const { error } = await supabase
      .from("bills")
      .insert([{
        project_id: projectId,
        invoice_number: invoiceNumber,
        items: billData.items,
        subtotal: billData.subtotal,
        gst_percentage: billData.gst_percentage,
        grand_total: billData.grand_total,
        bank_details: billData.bank_details,
        status: status
      }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Save Bill Error:", error);
    return { success: false, error: "Failed to save bill" };
  }
}

export async function getBills(projectId: string) {
  try {
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Get Bills Error:", error);
    return { success: false, error: "Failed to fetch bills" };
  }
}

// PORTFOLIO ACTIONS
export async function getPortfolioItems() {
  const localData = getLocalPortfolio();

  try {
    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Merge local items (Synechron, Syntel) at the top, avoiding duplicate IDs/titles
      const mergedMap = new Map();
      
      // Add local items first
      localData.forEach((item: any) => {
        if (item && item.title) {
          mergedMap.set(item.title.trim().toLowerCase(), item);
        }
      });

      // Add Supabase items
      data.forEach((item: any) => {
        if (item && item.title && !mergedMap.has(item.title.trim().toLowerCase())) {
          mergedMap.set(item.title.trim().toLowerCase(), item);
        }
      });

      return { success: true, data: Array.from(mergedMap.values()) };
    }
  } catch (error) {
    console.error("Fetch Portfolio Supabase Error:", error);
  }

  return { success: true, data: localData };
}

async function uploadFileToSupabase(file: File | null, folder: string): Promise<string | null> {
  if (!file || file.size === 0 || file.name === 'undefined') return null;
  
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    const { error } = await supabase.storage
      .from('portfolio')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (!error) {
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);
      if (data?.publicUrl) return data.publicUrl;
    }
  } catch (err) {
    console.warn("Supabase storage upload failed, using Base64 data URL fallback");
  }

  // Base64 Data URL Fallback
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch (e) {
    console.error("Base64 conversion error:", e);
    return null;
  }
}

export async function addPortfolioItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const project_description = (formData.get("project_description") as string) || "";
    const client_review = project_description;
    const client_rating = 5;

    // 1. Upload Cover Image
    const coverFile = formData.get("cover_image") as File;
    const cover_image = await uploadFileToSupabase(coverFile, 'covers');
    
    if (!cover_image) throw new Error("Cover image is required");

    // 2. Upload Extra Photos (up to 5)
    const post_execution_images: string[] = [];
    const extraFiles = formData.getAll("extra_photos") as File[];
    const limitedFiles = extraFiles.slice(0, 5);
    for (const file of limitedFiles) {
      const url = await uploadFileToSupabase(file, 'gallery');
      if (url) post_execution_images.push(url);
    }

    const newItem = {
      id: "port-" + Date.now(),
      title,
      category,
      cover_image,
      pre_execution_images: [],
      post_execution_images,
      client_review,
      client_rating,
      created_at: new Date().toISOString()
    };

    // Save to local storage fallback
    const currentLocal = getLocalPortfolio();
    saveLocalPortfolio([newItem, ...currentLocal]);

    // Also attempt Supabase insert if available
    try {
      await supabase
        .from("portfolio")
        .insert([{ 
          id: newItem.id,
          title, 
          category, 
          cover_image, 
          pre_execution_images: [],
          post_execution_images,
          client_review,
          client_rating
        }]);
    } catch (e) {
      console.warn("Supabase insert failed, saved to local store.");
    }

    return { success: true, data: newItem };
  } catch (error: any) {
    console.error("Add Portfolio Error:", error);
    return { success: false, error: error.message || "Failed to add portfolio item" };
  }
}

export async function updatePortfolioItem(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const project_description = (formData.get("project_description") as string) || "";
    const existing_cover = (formData.get("existing_cover") as string) || "";
    const existing_extra = formData.get("existing_extra") ? JSON.parse(formData.get("existing_extra") as string) : [];

    // Cover image check
    const coverFile = formData.get("cover_image") as File;
    let cover_image = existing_cover;
    if (coverFile && coverFile.size > 0 && coverFile.name !== 'undefined') {
      const newCover = await uploadFileToSupabase(coverFile, 'covers');
      if (newCover) cover_image = newCover;
    }

    // Extra photos check
    let post_execution_images = [...existing_extra];
    const extraFiles = formData.getAll("extra_photos") as File[];
    const limitedFiles = extraFiles.slice(0, 5);
    const newExtraUrls: string[] = [];
    for (const file of limitedFiles) {
      const url = await uploadFileToSupabase(file, 'gallery');
      if (url) newExtraUrls.push(url);
    }
    if (newExtraUrls.length > 0) {
      post_execution_images = newExtraUrls;
    }

    const updatedFields = {
      title,
      category,
      cover_image,
      client_review: project_description,
      post_execution_images
    };

    // Update in local file
    const currentLocal = getLocalPortfolio();
    const updatedLocal = currentLocal.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    saveLocalPortfolio(updatedLocal);

    // Try Supabase update
    try {
      await supabase.from("portfolio").update(updatedFields).eq("id", id);
    } catch (e) {
      console.warn("Supabase update failed, saved to local store.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Update Portfolio Error:", error);
    return { success: false, error: error.message || "Failed to update portfolio item" };
  }
}

export async function deletePortfolioItem(id: string) {
  try {
    // Delete from local file safely
    try {
      const currentLocal = getLocalPortfolio();
      const filtered = currentLocal.filter(item => item.id !== id);
      saveLocalPortfolio(filtered);
    } catch (e) {
      console.warn("Local delete portfolio warning (serverless mode):", e);
    }

    // Try Supabase delete
    try {
      await supabaseAdmin.from("portfolio").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete failed, deleted from local store.");
    }

    return { success: true };
  } catch (error) {
    console.error("Delete Portfolio Error:", error);
    return { success: false, error: "Failed to delete portfolio item" };
  }
}
