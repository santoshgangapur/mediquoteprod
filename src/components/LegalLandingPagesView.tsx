import React, { useState } from 'react';
import { ViewMode } from '../types';

interface LegalLandingPagesViewProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer' | 'abha-guide' | 'copyright' | 'legal';
  onNavigate: (view: ViewMode) => void;
}

export const LegalLandingPagesView: React.FC<LegalLandingPagesViewProps> = ({
  initialTab = 'privacy',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'abha-guide' | 'copyright'>(
    initialTab === 'legal' || !initialTab ? 'privacy' : (initialTab as any)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#001d4a] via-[#002d6e] to-[#001233] text-white rounded-3xl p-6 md:p-8 border border-[#1e4d8c] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#81f3e5]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#81f3e5] text-[#001d4a] text-[11px] font-black rounded-full font-mono uppercase tracking-wider">
              Legal & Trust Center
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold rounded-full font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              DPDP Act 2023 & NHA Compliant
            </span>
            <span className="text-gray-400 text-[12px] font-mono">Effective: August 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            MediQuote AI Platform Governance, Regulatory & Patient Portal Guidelines
          </h1>
          <p className="text-[#a0c4eb] text-sm md:text-base leading-relaxed max-w-3xl">
            Complete compliance documentation, privacy frameworks, clinical advisory guidelines, and Ayushman Bharat Health Account (ABHA) integration architecture.
          </p>
        </div>
      </div>

      {/* Navigation Tab Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#c3c6d4] no-scrollbar">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-[#001d4a] text-[#81f3e5] shadow-md border border-[#81f3e5]/30'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-[#001d4a] text-[#81f3e5] shadow-md border border-[#81f3e5]/30'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">gavel</span>
          <span>Terms of Service</span>
        </button>

        <button
          onClick={() => setActiveTab('disclaimer')}
          className={`px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'disclaimer'
              ? 'bg-[#001d4a] text-[#81f3e5] shadow-md border border-[#81f3e5]/30'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
          <span>Clinical Disclaimer</span>
        </button>

        <button
          onClick={() => setActiveTab('abha-guide')}
          className={`px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'abha-guide'
              ? 'bg-[#001d4a] text-[#81f3e5] shadow-md border border-[#81f3e5]/30'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">id_card</span>
          <span>ABHA Sync & ABDM Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('copyright')}
          className={`px-4 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            activeTab === 'copyright'
              ? 'bg-[#001d4a] text-[#81f3e5] shadow-md border border-[#81f3e5]/30'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">copyright</span>
          <span>Copyright & IP Notice</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl border border-[#c3c6d4] p-6 md:p-10 shadow-sm space-y-8">
        {/* ==================== PRIVACY POLICY ==================== */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 text-[#1c2024] leading-relaxed">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 flex-wrap">
              <div>
                <h2 className="text-xl font-extrabold text-[#001d4a]">Digital Personal Data Protection (DPDP) Privacy Policy</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">Compliant with DPDP Act 2023 (India), ISO 27001 & HIPAA Guidelines</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Policy</span>
              </button>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#81f3e5]/30 text-[#001d4a] text-xs font-bold flex items-center justify-center">1</span>
                <span>Data Collection & Protected Health Information (PHI)</span>
              </h3>
              <p className="text-sm text-gray-700">
                MediQuote AI Technologies Pvt. Ltd. (“MediQuote AI”, “We”, “Our”) collects personal health information (PHI) exclusively for processing surgical cost quotations, hospital matching, medical tourism concierges, and ABDM health record synchronization.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-2">
                <li><strong>Identity Data:</strong> Full Name, Age, Gender, Contact Number (+91 SMS/WhatsApp verification), ABHA Address (14-digit ABHA Number).</li>
                <li><strong>Clinical Data:</strong> Diagnostic imaging (MRI/CT), Pathology lab reports, Discharge summaries, ICD-10 condition codes, and surgical requirements.</li>
                <li><strong>Insurance & Financial Data:</strong> TPA pre-authorization details, policy numbers, claim approval letters (excluding payment card CVVs).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#81f3e5]/30 text-[#001d4a] text-xs font-bold flex items-center justify-center">2</span>
                <span>Data Encryption & Storage Architecture</span>
              </h3>
              <p className="text-sm text-gray-700">
                All patient documents uploaded to MediQuote AI Secured Vault are encrypted at rest using <strong>AES-256</strong> bit encryption standard and encrypted in transit using <strong>TLS 1.3 SSL protocols</strong>.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">verified_user</span>
                  <span>Zero Data Monetization Guarantee</span>
                </p>
                <p>
                  MediQuote AI never sells, rents, or monetizes patient records, diagnostic scans, or medical history to pharmaceutical companies, advertisers, or third-party brokers.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#81f3e5]/30 text-[#001d4a] text-xs font-bold flex items-center justify-center">3</span>
                <span>Sharing Data with NABH/JCI Partner Hospitals</span>
              </h3>
              <p className="text-sm text-gray-700">
                When you request a surgical quote or broadcast your medical file for quotation comparison, anonymized clinical data (symptom history, report findings, required procedure) is transmitted strictly to accredited partner hospital admission desks (Apollo, Fortis, Max, Manipal, Narayana, etc.) via encrypted API gateways.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#81f3e5]/30 text-[#001d4a] text-xs font-bold flex items-center justify-center">4</span>
                <span>Right to Erasure & Data Portability</span>
              </h3>
              <p className="text-sm text-gray-700">
                Under the Digital Personal Data Protection Act 2023, you retain 100% ownership of your data. You may delete your uploaded medical vault records at any time or request complete account erasure by contacting our Data Protection Officer at <code className="bg-gray-100 text-blue-800 px-1.5 py-0.5 rounded font-mono text-xs">dpo@mediquote.ai</code>.
              </p>
            </section>
          </div>
        )}

        {/* ==================== TERMS OF SERVICE ==================== */}
        {activeTab === 'terms' && (
          <div className="space-y-6 text-[#1c2024] leading-relaxed">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 flex-wrap">
              <div>
                <h2 className="text-xl font-extrabold text-[#001d4a]">Terms of Service & Surgical Procurement Agreement</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">MediQuote AI Patient Concierge Platform Rules</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Terms</span>
              </button>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">1. Platform Scope & Services Provided</h3>
              <p className="text-sm text-gray-700">
                MediQuote AI operates as an intelligent healthcare procurement concierge and hospital cost discovery platform. We facilitate transparent surgical estimations, AI diagnostic document analysis, hospital quote comparisons, and cashless insurance TPA pre-approvals.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">2. Indicative Nature of Hospital Quotations</h3>
              <p className="text-sm text-gray-700">
                All surgical quotes generated via MediQuote AI (including room rent, ICU charges, surgeon fee estimates, and implant costs) are indicative estimates derived from official hospital tariffs. Final hospital billing is established directly by the admitting hospital following clinical physical examination, doctor assessment, and intraoperative findings.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">3. Booking Commitments & No-Cost EMI Financing</h3>
              <p className="text-sm text-gray-700">
                Hospital admission reservations booked via MediQuote AI reserve priority OPD slots and care concierge assistance. Medical financing and No-Cost EMI options are powered by partner RBI-regulated NBFCs and banking entities, subject to credit underwriting.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">4. User Responsibilities</h3>
              <p className="text-sm text-gray-700">
                Users agree to provide accurate medical history, genuine diagnostic documents, and truthful insurance details. Uploading fraudulent medical certificates or altered diagnostic scans is prohibited and may result in immediate platform ban and reporting to regulatory authorities.
              </p>
            </section>
          </div>
        )}

        {/* ==================== CLINICAL DISCLAIMER ==================== */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-6 text-[#1c2024] leading-relaxed">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 flex-wrap">
              <div>
                <h2 className="text-xl font-extrabold text-rose-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-600">emergency</span>
                  <span>Clinical Disclaimer & Emergency Advisory</span>
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">MoHFW & National Medical Commission (NMC) Advisory Guidelines</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-950 text-xs md:text-sm space-y-2 leading-relaxed">
              <p className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-rose-600">warning</span>
                <span>CRITICAL MEDICAL EMERGENCY WARNING</span>
              </p>
              <p>
                MediQuote AI is <strong>NOT an emergency medical service provider</strong>. If you or a family member are experiencing chest pain, severe breathlessness, stroke symptoms, major trauma, active bleeding, or acute life-threatening distress, <strong>CALL EMERGENCY AMBULANCE IMMEDIATELY (+91 108 / 112 in India) OR VISIT THE NEAREST HOSPITAL EMERGENCY ROOM</strong>. Do not wait for AI document processing or online quotation responses during a critical medical emergency.
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">AI Diagnostic Assistance vs. Professional Medical Advice</h3>
              <p className="text-sm text-gray-700">
                The clinical report summaries, ICD-10 condition tags, treatment urgency scores, and hospital recommendations generated by MediQuote AI are powered by advanced multimodal AI systems (Google Gemini Pro / MedLM architecture). These outputs serve strictly as <strong>informational decision-support tools for surgical cost comparison</strong> and do NOT constitute formal medical diagnosis, clinical treatment plans, or prescription of drugs.
              </p>
              <p className="text-sm text-gray-700">
                Always consult with a licensed, qualified medical doctor or registered medical practitioner (RMP) before undergoing any surgical procedure, altering medications, or making medical decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">Doctor Consultations & Verification</h3>
              <p className="text-sm text-gray-700">
                Surgeons and specialist doctors listed on MediQuote AI hospital network hold valid qualifications (MBBS, MS, MCh, DNB, FRCS) verified against national medical council registries. However, patient-doctor relationships are established during formal hospital consultations.
              </p>
            </section>
          </div>
        )}

        {/* ==================== ABHA SYNC & ABDM GUIDE ==================== */}
        {activeTab === 'abha-guide' && (
          <div className="space-y-6 text-[#1c2024] leading-relaxed">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 flex-wrap">
              <div>
                <h2 className="text-xl font-extrabold text-[#001d4a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#81f3e5] bg-[#001d4a] p-1 rounded-lg">id_card</span>
                  <span>Ayushman Bharat Health Account (ABHA) & ABDM Integration Guide</span>
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">National Health Authority (NHA) Sandbox M1, M2 & M3 Standards</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs md:text-sm space-y-2">
              <div className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>What is ABHA (Ayushman Bharat Health Account)?</span>
              </div>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                ABHA is a 14-digit unique health identifier issued under the Ayushman Bharat Digital Mission (ABDM) by the Government of India. It enables seamless digital storage, consent-based health record sharing, and instant hospital admissions across India.
              </p>
            </div>

            <section className="space-y-4">
              <h3 className="text-base font-bold text-[#003178]">Step-by-Step Guide: Syncing ABHA with MediQuote AI Vault</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#001d4a] text-[#81f3e5] font-extrabold text-sm flex items-center justify-center font-mono">01</div>
                  <h4 className="font-bold text-sm text-[#001d4a]">Link ABHA Address</h4>
                  <p className="text-xs text-gray-600">
                    Enter your 14-digit ABHA Number or ABHA Address (e.g., <code className="text-blue-800 font-mono">name@abdm</code>) in the Secured Vault tab.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#001d4a] text-[#81f3e5] font-extrabold text-sm flex items-center justify-center font-mono">02</div>
                  <h4 className="font-bold text-sm text-[#001d4a]">Aadhaar OTP Authorization</h4>
                  <p className="text-xs text-gray-600">
                    Verify via instant Aadhaar-linked mobile OTP sent by the NHA Health Gateway.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#001d4a] text-[#81f3e5] font-extrabold text-sm flex items-center justify-center font-mono">03</div>
                  <h4 className="font-bold text-sm text-[#001d4a]">Seamless Records Fetch</h4>
                  <p className="text-xs text-gray-600">
                    Automatically fetch lab reports, discharge summaries, and vaccine certificates from connected hospitals nationwide.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-[#003178]">ABDM Milestone Approvals</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                  <span><strong>M1 Milestone:</strong> ABHA Creation & Authentication via Mobile / Aadhaar OTP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                  <span><strong>M2 Milestone:</strong> Health Information Provider (HIP) & Health Information User (HIU) record linking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                  <span><strong>M3 Milestone:</strong> Patient Consent Manager flow for secure, time-bound hospital record access.</span>
                </li>
              </ul>
            </section>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('records')}
                className="px-5 py-3 bg-[#001d4a] text-[#81f3e5] font-extrabold text-xs rounded-xl hover:bg-[#002d6e] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Open Secured Vault & Sync ABHA Now</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== COPYRIGHT & IP NOTICE ==================== */}
        {activeTab === 'copyright' && (
          <div className="space-y-6 text-[#1c2024] leading-relaxed">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 flex-wrap">
              <div>
                <h2 className="text-xl font-extrabold text-[#001d4a]">Copyright & Intellectual Property Notice</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">MediQuote AI Proprietary Technology & Trademarks</p>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">Copyright Ownership</h3>
              <p className="text-sm text-gray-700">
                © 2026 MediQuote AI Technologies Pvt. Ltd. All Rights Reserved.
              </p>
              <p className="text-sm text-gray-700">
                All content, web interface designs, source code, AI clinical document extraction models, surgical cost comparison algorithms, brand logos, graphics, icons, and software components embodied within the MediQuote AI application are the exclusive intellectual property of MediQuote AI Technologies Pvt. Ltd.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">Trademarks & Brand Assets</h3>
              <p className="text-sm text-gray-700">
                "MediQuote AI", "Clinical Procurement Engine", "Secured Health Vault", "Hospital Broadcast Desk", and the MediQuote AI pulse-heart logo are registered or pending trademarks of MediQuote AI Technologies Pvt. Ltd. Unauthorized use, copying, or imitation of brand assets is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#003178]">Patent & AI Algorithm Notice</h3>
              <p className="text-sm text-gray-700">
                Our proprietary AI document parser and surgical tariff comparison matching engines are protected under Indian Patent Law and International Intellectual Property Treaties.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* Return to Dashboard Footer bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 text-xs">
        <span className="text-gray-500">Need specific legal clarification? Contact <strong className="text-[#001d4a]">legal@mediquote.ai</strong></span>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 bg-[#001d4a] text-white font-bold rounded-xl hover:bg-[#002d6e] transition-colors cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
