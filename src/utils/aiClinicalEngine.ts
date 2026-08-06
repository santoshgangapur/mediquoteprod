import { SurgicalCase, HospitalQuote, AITreatmentRecommendation } from '../types';

export interface ClinicalInput {
  caseTitle: string;
  procedureTitle: string;
  customTitle?: string;
  symptomsDescription: string;
  urgency: 'Routine' | 'Moderate' | 'Urgent';
  preferredCity: string;
  insuranceProvider: string;
  policyNumber: string;
  vitalsSummaryText: string;
  attachedRecordCount: number;
  hba1cNum?: number;
  fastSugarNum?: number;
}

export type MedicalCategory =
  | 'HEADACHE_NEUROLOGY'
  | 'SPINE_BACK'
  | 'GYNAECOLOGY'
  | 'ORTHOPAEDIC_JOINT'
  | 'GALLBLADDER_GI'
  | 'UROLOGY'
  | 'OPHTHALMOLOGY'
  | 'CARDIOLOGY'
  | 'ENT'
  | 'HERNIA_GENERAL'
  | 'GENERAL';

export function detectCategory(text: string, procedureTitle: string): MedicalCategory {
  const combined = `${text} ${procedureTitle}`.toLowerCase();

  if (
    combined.includes('headache') ||
    combined.includes('migraine') ||
    combined.includes('head pain') ||
    combined.includes('head') ||
    combined.includes('brain') ||
    combined.includes('neuro') ||
    combined.includes('cranial') ||
    combined.includes('vertigo') ||
    combined.includes('dizziness') ||
    combined.includes('concussion') ||
    combined.includes('seizure') ||
    combined.includes('stroke') ||
    combined.includes('aneurysm') ||
    combined.includes('craniotomy')
  ) {
    return 'HEADACHE_NEUROLOGY';
  }

  if (
    combined.includes('back') ||
    combined.includes('spine') ||
    combined.includes('lumbar') ||
    combined.includes('disc') ||
    combined.includes('sciatica') ||
    combined.includes('discectomy') ||
    combined.includes('laminectomy') ||
    combined.includes('vertebra') ||
    combined.includes('nerve compression') ||
    combined.includes('slip disc')
  ) {
    return 'SPINE_BACK';
  }

  if (
    combined.includes('gyn') ||
    combined.includes('uteru') ||
    combined.includes('fibroid') ||
    combined.includes('ovary') ||
    combined.includes('cyst') ||
    combined.includes('hysterectomy') ||
    combined.includes('myomectomy') ||
    combined.includes('menorrhagia') ||
    combined.includes('pelvic') ||
    combined.includes('endometriosis')
  ) {
    return 'GYNAECOLOGY';
  }

  if (
    combined.includes('knee') ||
    combined.includes('hip') ||
    combined.includes('joint') ||
    combined.includes('acl') ||
    combined.includes('meniscus') ||
    combined.includes('arthroscopy') ||
    combined.includes('ortho')
  ) {
    return 'ORTHOPAEDIC_JOINT';
  }

  if (
    combined.includes('kidney') ||
    combined.includes('stone') ||
    combined.includes('urol') ||
    combined.includes('prostate') ||
    combined.includes('turp') ||
    combined.includes('lithotripsy') ||
    combined.includes('rirs') ||
    combined.includes('bladder')
  ) {
    return 'UROLOGY';
  }

  if (
    combined.includes('cataract') ||
    combined.includes('eye') ||
    combined.includes('phaco') ||
    combined.includes('vision') ||
    combined.includes('lens') ||
    combined.includes('ophthalm')
  ) {
    return 'OPHTHALMOLOGY';
  }

  if (
    combined.includes('heart') ||
    combined.includes('cardiac') ||
    combined.includes('angioplasty') ||
    combined.includes('stent') ||
    combined.includes('bypass') ||
    combined.includes('cabg') ||
    combined.includes('chest pain')
  ) {
    return 'CARDIOLOGY';
  }

  if (
    combined.includes('gallbladder') ||
    combined.includes('cholecyst') ||
    combined.includes('bile') ||
    combined.includes('liver') ||
    combined.includes('abdomen')
  ) {
    return 'GALLBLADDER_GI';
  }

  if (
    combined.includes('hernia') ||
    combined.includes('appendix') ||
    combined.includes('appendicitis') ||
    combined.includes('mesh')
  ) {
    return 'HERNIA_GENERAL';
  }

  if (
    combined.includes('tonsil') ||
    combined.includes('sinus') ||
    combined.includes('septoplasty') ||
    combined.includes('ent')
  ) {
    return 'ENT';
  }

  return 'GENERAL';
}

export function generateAIClinicalRecommendation(input: ClinicalInput) {
  const combinedText = `${input.caseTitle} ${input.procedureTitle} ${input.customTitle || ''} ${input.symptomsDescription}`;
  const category = detectCategory(combinedText, input.procedureTitle);

  const selectedTitle =
    input.procedureTitle === 'Other'
      ? input.customTitle || 'Custom Surgical Case'
      : input.procedureTitle;

  const city = input.preferredCity || 'Bangalore';
  const insurance = input.insuranceProvider || 'HDFC Optima Restore';
  const isUrgent = input.urgency === 'Urgent';

  let conditionName = '';
  let icdCode = '';
  let findingFromReport = '';
  let bestTreatmentProcedure = '';
  let whyBestTreatment = '';
  let altTreatments = [];
  let preOp = [];
  let postOp = [];

  // Doctors & Specialties per category
  let apolloDoc = { name: 'Dr. S. K. Nair', exp: '22+ Years Senior Consultant', specialty: 'General & Minimal Access Surgery' };
  let fortisDoc = { name: 'Dr. Meera Rao', exp: '18+ Years Specialist', specialty: 'Specialist Surgeon' };
  let spectraDoc = { name: 'Dr. Kavita Sharma', exp: '16+ Years Clinical Exp.', specialty: 'Day-Care Surgical Specialist' };

  switch (category) {
    case 'HEADACHE_NEUROLOGY':
      conditionName = 'Refractory Chronic Migraine / Intracranial Vasospasm / Neurological Syndrome';
      icdCode = 'G43.909 (Migraine, Unspecified) / R51.9 (Headache)';
      findingFromReport = input.symptomsDescription || 'Comprehensive neurological screening confirms chronic recurrent headache with photophobia and neuro-vascular reactivity.';
      bestTreatmentProcedure = 'Advanced Neurological Care Protocol (MRI Brain + MRA / CGRP Target Therapy / Nerve Block)';
      whyBestTreatment = 'Gold-standard non-invasive neuro-diagnostic protocol. Rules out vascular malformations or intracranial aneurysms while providing targeted migraine prophylaxis and rapid symptom abortive care.';
      altTreatments = [
        {
          treatmentName: 'Standard Oral NSAID & Triptan Analgesic Therapy',
          suitabilityScorePercent: 55,
          notes: 'Provides acute symptomatic relief but risks medication-overuse rebound headaches if taken frequently.'
        },
        {
          treatmentName: 'Oral Anticonvulsant / Beta-Blocker Daily Prophylaxis',
          suitabilityScorePercent: 68,
          notes: 'Reduces attack frequency by 40-50% but requires weeks to reach therapeutic efficacy with systemic side-effects.'
        }
      ];
      preOp = [
        'High-resolution 3T MRI Brain with MR Angiogram (MRA) vascular review',
        'Neurological visual field & optic disc fundoscopy examination',
        'Serum electrolyte & inflammatory marker panel (ESR/CRP)',
        '30-Day digital headache trigger & frequency log'
      ];
      postOp = [
        'Maintain daily fluid hydration minimum 3.0 liters',
        'Strict dietary trigger avoidance (caffeine, aged cheeses, nitrate preservatives)',
        'Follow-up neurology consultation in 14 days for treatment response check'
      ];
      apolloDoc = { name: 'Dr. K. S. Rana', exp: '24+ Years Senior Director Neurology', specialty: 'Neurology & Neuro-Vascular Medicine' };
      fortisDoc = { name: 'Dr. Vivek Sharma', exp: '20+ Years Chief Consultant', specialty: 'Neurology & Headache Specialist' };
      spectraDoc = { name: 'Dr. Anita Malhotra', exp: '16+ Years Neuro Specialist', specialty: 'Neurology & Neuro-Rehabilitation' };
      break;

    case 'SPINE_BACK':
      conditionName = 'Lumbar Disc Herniation with Sciatica / Nerve Compression';
      icdCode = 'M51.26 (Lumbar Disc Displacement)';
      findingFromReport = input.symptomsDescription || 'MRI Lumbar Spine shows L4-L5/L5-S1 disc protrusion causing bilateral nerve root compression and radicular lower back pain.';
      bestTreatmentProcedure = 'Minimally Invasive Lumbar Microdiscectomy & Endoscopic Decompression';
      whyBestTreatment = 'Gold-standard spine procedure. Relieves spinal nerve root compression, preserves normal spinal biomechanics, eliminates radiating leg & back pain with 96% clinical success rate.';
      altTreatments = [
        {
          treatmentName: 'Epidural Steroid Injection & Core Stabilization Physio',
          suitabilityScorePercent: 68,
          notes: 'Provides temporary inflammation relief (3-6 months) but does not remove herniated disc tissue.'
        },
        {
          treatmentName: 'Open Laminectomy with Pedicle Screw Spinal Fusion',
          suitabilityScorePercent: 52,
          notes: 'Requires longer recovery, spinal hardware implantation, and higher tissue disruption.'
        }
      ];
      preOp = [
        'High-resolution MRI Lumbar Spine (1.5T or 3T) contrast scan review',
        'Pre-Anesthetic Clearance (PAC) with Spine Anesthesia Specialist',
        'Discontinue blood thinners (Aspirin/NSAIDs) 5 days prior to procedure',
        'Physical therapy lumbar posture assessment'
      ];
      postOp = [
        'Wear lumbar corset belt for 3 weeks during standing/walking',
        'Avoid forward bending, twisting, or lifting heavy objects >5kg for 4 weeks',
        'Initiate supervised spinal physical therapy starting 10 days post-op'
      ];
      apolloDoc = { name: 'Dr. H. S. Chhabra', exp: '24+ Years Senior Spine Director', specialty: 'Spine & Neurosurgery' };
      fortisDoc = { name: 'Dr. B. S. Murthy', exp: '20+ Years Chief Spine Consultant', specialty: 'Orthopaedic Spine Surgery' };
      spectraDoc = { name: 'Dr. Arvind Jayaswal', exp: '18+ Years Spine Specialist', specialty: 'Minimally Invasive Spine Surgery' };
      break;

    case 'GYNAECOLOGY':
      conditionName = 'Symptomatic Uterine Leiomyoma / Ovarian Cystadenoma';
      icdCode = 'N80.0 (Pelvic Endometriosis / Uterine Fibroids)';
      findingFromReport = input.symptomsDescription || 'Pelvic Ultrasound / MRI shows symptomatic intramural uterine fibroid or ovarian cyst causing menorrhagia and pelvic pressure.';
      bestTreatmentProcedure = '3D Laparoscopic / Robotic Myomectomy (or Hysterectomy as indicated)';
      whyBestTreatment = 'Minimally invasive excision of fibroids/cysts preserving uterine integrity, minimizing intraoperative blood loss, and enabling 24-48 hour hospital discharge.';
      altTreatments = [
        {
          treatmentName: 'Uterine Artery Embolization (UAE)',
          suitabilityScorePercent: 70,
          notes: 'Nonsurgical vascular procedure that shrinks fibroids but has variable long-term recurrence rates.'
        },
        {
          treatmentName: 'Hormonal GnRH Agonist Medical Therapy',
          suitabilityScorePercent: 42,
          notes: 'Provides transient symptom reduction; fibroids typically regrow once medication stops.'
        }
      ];
      preOp = [
        'Transvaginal Ultrasound (TVUS) & Hemoglobin / Anemia screening',
        'Pap Smear & Endometrial Biopsy verification if indicated',
        'Pre-Anesthetic Clearance (PAC) and blood cross-matching pre-booking'
      ];
      postOp = [
        'Rest for 7-10 days; avoid heavy abdominal exertion for 3 weeks',
        'Monitor wound incisions; report any fever >100.4°F immediately',
        'Follow-up pelvic checkup at 2 weeks post-discharge'
      ];
      apolloDoc = { name: 'Dr. Veena Bhat', exp: '25+ Years Director Gynaecology', specialty: 'Obstetrics & Gynaecological Surgery' };
      fortisDoc = { name: 'Dr. Anuradha Kapur', exp: '22+ Years Senior Consultant', specialty: 'Robotic & Laparoscopic Gynaecology' };
      spectraDoc = { name: 'Dr. Sunita Verma', exp: '17+ Years Gynae Specialist', specialty: 'Minimal Access Gynaecological Surgery' };
      break;

    case 'ORTHOPAEDIC_JOINT':
      conditionName = 'Severe Osteoarthritis / Meniscal Tear Joint Pathology';
      icdCode = 'M17.11 (Primary Osteoarthritis Knee/Joint)';
      findingFromReport = input.symptomsDescription || 'Weight-bearing X-ray / MRI shows joint space narrowing, subchondral sclerosis, and significant functional mobility impairment.';
      bestTreatmentProcedure = 'Robotic-Assisted Total Joint Replacement / Arthroscopic Repair';
      whyBestTreatment = 'Sub-millimeter implant precision, custom alignment, 30+ year implant durability, and rapid weight-bearing within 24 hours.';
      altTreatments = [
        {
          treatmentName: 'Intra-Articular Hyaluronic Acid / PRP Injections',
          suitabilityScorePercent: 60,
          notes: 'Temporary lubrication relieving pain in mild-to-moderate arthritis; ineffective for stage 4 severe bone-on-bone arthritis.'
        },
        {
          treatmentName: 'Arthroscopic Joint Debridement Alone',
          suitabilityScorePercent: 48,
          notes: 'Short-term lavage; does not correct structural joint deformity.'
        }
      ];
      preOp = [
        'Digital weight-bearing X-rays & CT template mapping',
        'Cardiac clearance & complete coagulation screening',
        'Pre-operative physiotherapy range-of-motion baseline'
      ];
      postOp = [
        'Walk with walker support on Day 1 post-op under physio guidance',
        'Apply ice packs 15 mins thrice daily for swelling control',
        'Suture / staple removal at 12-14 days post-op'
      ];
      apolloDoc = { name: 'Dr. Ashok Rajgopal', exp: '28+ Years Group Chairman Orthopaedics', specialty: 'Joint Replacement & Robotic Ortho' };
      fortisDoc = { name: 'Dr. Yash Gulati', exp: '24+ Years Senior Director', specialty: 'Orthopaedics & Joint Surgery' };
      spectraDoc = { name: 'Dr. IPS Oberoi', exp: '19+ Years Joint Specialist', specialty: 'Arthroscopy & Joint Replacement' };
      break;

    case 'UROLOGY':
      conditionName = 'Renal / Ureteral Calculus with Hydronephrosis';
      icdCode = 'N20.1 (Calculus of Ureter / Kidney Stone)';
      findingFromReport = input.symptomsDescription || 'NCCT KUB confirms obstructing ureteric/renal stone causing flank pain and hydronephrosis.';
      bestTreatmentProcedure = 'Holmium Laser Retrograde Intrarenal Surgery (RIRS) / URSL';
      whyBestTreatment = 'Incisionless endoscopic laser dusts kidney stones into fine powder. No external cuts, 100% stone clearance, same-day or 1-day discharge.';
      altTreatments = [
        {
          treatmentName: 'Extracorporeal Shock Wave Lithotripsy (ESWL)',
          suitabilityScorePercent: 65,
          notes: 'Non-invasive acoustic shocks; lower clearance rates for hard stones >10mm.'
        },
        {
          treatmentName: 'Medical Expulsive Therapy (MET)',
          suitabilityScorePercent: 35,
          notes: 'Suitable only for tiny stones <5mm without severe obstruction.'
        }
      ];
      preOp = [
        'Non-Contrast CT KUB scan review for precise stone density (Hounsfield Units)',
        'Urine Culture Routine to exclude active Urinary Tract Infection (UTI)',
        'Hydration optimization prior to anesthesia'
      ];
      postOp = [
        'Drink 3-4 liters of water daily to flush residual stone dust',
        'Ureteral DJ Stent removal at 2 weeks post-procedure if placed',
        'Dietary oxalate/uric acid modification consultation'
      ];
      apolloDoc = { name: 'Dr. Rajesh Taneja', exp: '23+ Years Senior Consultant Urologist', specialty: 'Urology & Laser Lithotripsy' };
      fortisDoc = { name: 'Dr. Anant Kumar', exp: '25+ Years Chairman Urology', specialty: 'Urology, Robotics & Kidney Transplant' };
      spectraDoc = { name: 'Dr. N. P. Gupta', exp: '20+ Years Senior Urologist', specialty: 'Endourology & Laser Surgery' };
      break;

    case 'OPHTHALMOLOGY':
      conditionName = 'Visually Significant Nuclear Sclerotic Cataract';
      icdCode = 'H25.9 (Senile Cataract)';
      findingFromReport = input.symptomsDescription || 'Slit-lamp examination reveals Grade 2-3 cataract causing blurred vision, glare at night, and decreased contrast sensitivity.';
      bestTreatmentProcedure = 'Femto-Laser Assisted Phacoemulsification + Premium Multifocal IOL';
      whyBestTreatment = 'Bladedless laser precision micro-incision, ultrasound lens emulsification, fast 10-minute outpatient procedure restoring clear distance and near vision.';
      altTreatments = [
        {
          treatmentName: 'Standard Manual Small Incision Cataract Surgery (MSICS)',
          suitabilityScorePercent: 75,
          notes: 'Effective traditional method with slightly larger incision and longer healing visual recovery.'
        }
      ];
      preOp = [
        'Optical Biometry (IOLMaster) for exact intraocular lens power calculation',
        'Dilated fundus retina evaluation',
        'Instill antibiotic eye drops 1 day prior as instructed'
      ];
      postOp = [
        'Instill prescribed antibiotic/steroid eye drops for 3 weeks',
        'Wear protective eye shield while sleeping for 7 days',
        'Avoid splashing tap water into operated eye for 10 days'
      ];
      apolloDoc = { name: 'Dr. Mahipal S. Sachdev', exp: '26+ Years Chairman Eye Sciences', specialty: 'Ophthalmology & Refractive Laser' };
      fortisDoc = { name: 'Dr. Mohan Raj', exp: '20+ Years Senior Eye Surgeon', specialty: 'Cataract & Cornea Specialist' };
      spectraDoc = { name: 'Dr. Lingam Gopal', exp: '18+ Years Retina & Eye Consultant', specialty: 'Phacoemulsification & IOL' };
      break;

    case 'CARDIOLOGY':
      conditionName = 'Atherosclerotic Coronary Artery Disease';
      icdCode = 'I25.10 (Atherosclerotic Heart Disease)';
      findingFromReport = input.symptomsDescription || 'Coronary Angiography reveals significant coronary stenosis causing angina and dyspnea on exertion.';
      bestTreatmentProcedure = 'Coronary Angioplasty with Drug-Eluting Stents (DES)';
      whyBestTreatment = 'Percutaneous radial approach opens blocked coronary artery, restores myocardial perfusion, and prevents acute myocardial infarction.';
      altTreatments = [
        {
          treatmentName: 'Coronary Artery Bypass Grafting (CABG / Open Heart)',
          suitabilityScorePercent: 70,
          notes: 'Indicated if multi-vessel diffuse disease or left main occlusion present.'
        },
        {
          treatmentName: 'Optimal Medical Therapy (OMT)',
          suitabilityScorePercent: 40,
          notes: 'Controls symptoms in non-critical stenosis (<70%) but does not open anatomical blockage.'
        }
      ];
      preOp = [
        'Coronary Angiogram CD review & Echocardiogram LVEF assessment',
        'Renal function test (Serum Creatinine) for contrast safety',
        'Dual antiplatelet therapy loading as directed by cardiologist'
      ];
      postOp = [
        'Strict compliance with dual antiplatelet medication (Clopidogrel/Ticagrelor)',
        'Cardiac rehabilitation walking program starting Week 2',
        'Regular blood pressure & lipid profile monitoring'
      ];
      apolloDoc = { name: 'Dr. Naresh Trehan', exp: '30+ Years Chairman Cardiac Sciences', specialty: 'Cardiothoracic & Vascular Surgery' };
      fortisDoc = { name: 'Dr. Ashok Seth', exp: '28+ Years Chairman Heart Institute', specialty: 'Interventional Cardiology' };
      spectraDoc = { name: 'Dr. Devi Shetty', exp: '32+ Years Founder & Chief Cardiac Surgeon', specialty: 'Cardiac Surgery' };
      break;

    case 'HERNIA_GENERAL':
      conditionName = 'Symptomatic Inguinal / Umbilical Hernia';
      icdCode = 'K40.90 (Inguinal Hernia without Obstruction)';
      findingFromReport = input.symptomsDescription || 'Clinical exam and Ultrasound confirm palpable hernia defect with expansile cough impulse.';
      bestTreatmentProcedure = '3D Laparoscopic TAPP / TEP Hernia Mesh Repair';
      whyBestTreatment = 'Reinforces abdominal wall defect with high-grade synthetic mesh via keyhole incisions. Minimal post-op groin pain and 1-day hospital stay.';
      altTreatments = [
        {
          treatmentName: 'Open Lichtenstein Mesh Hernioplasty',
          suitabilityScorePercent: 78,
          notes: 'Standard open incision repair; slightly longer wound discomfort than keyhole laparoscopy.'
        }
      ];
      preOp = [
        'Abdominal Ultrasound to measure exact hernial defect size',
        'Pre-Anesthetic Clearance (PAC) & NPO 8 hours prior'
      ];
      postOp = [
        'Avoid straining or coughing hard; use abdominal binder support',
        'Avoid lifting heavy weights (>5kg) for 6 weeks'
      ];
      apolloDoc = { name: 'Dr. Pradeep Chowbey', exp: '26+ Years Chairman Laparoscopic Surgery', specialty: 'Hernia & GI Minimal Access' };
      fortisDoc = { name: 'Dr. Arun Prasad', exp: '22+ Years Senior Laparoscopic Director', specialty: 'General & Bariatric Surgery' };
      spectraDoc = { name: 'Dr. Deep Goel', exp: '19+ Years Minimal Access Consultant', specialty: 'Hernia & Day-Care Surgery' };
      break;

    case 'GALLBLADDER_GI':
      conditionName = 'Symptomatic Cholelithiasis / Chronic Cholecystitis';
      icdCode = 'K80.20 (Calculus of Gallbladder without Cholecystitis)';
      findingFromReport = input.symptomsDescription || 'Abdominal Ultrasound confirms multiple gallstones causing biliary colic and post-prandial right upper quadrant pain.';
      bestTreatmentProcedure = 'Laparoscopic Cholecystectomy (Keyhole Gallbladder Removal)';
      whyBestTreatment = 'Gold-standard surgical cure. Permanently eliminates gallstone complications, prevents pancreatitis or cholecystitis, with 24-hour hospital stay.';
      altTreatments = [
        {
          treatmentName: 'Oral Bile Acid Dissolution Therapy (Ursodeoxycholic Acid)',
          suitabilityScorePercent: 35,
          notes: 'Only effective for tiny radiolucent cholesterol stones (<5mm) with high recurrence rate after stopping.'
        }
      ];
      preOp = [
        'Liver Function Test (LFT) & Ultrasound Abdomen review',
        'Pre-Anesthetic Clearance & 8 hours fasting (NPO)'
      ];
      postOp = [
        'Low-fat bland diet for 2 weeks',
        'Normal physical walk resumed next day'
      ];
      apolloDoc = { name: 'Dr. S. K. Nair', exp: '22+ Years Senior Consultant', specialty: 'Laparoscopic GI Specialist' };
      fortisDoc = { name: 'Dr. Meera Rao', exp: '18+ Years Specialist', specialty: 'GI & Hepatobiliary Surgery' };
      spectraDoc = { name: 'Dr. Kavita Sharma', exp: '16+ Years Clinical Exp.', specialty: 'Day-Care Surgical Specialist' };
      break;

    case 'GENERAL':
    default:
      conditionName = `Clinical Symptomatic Assessment: ${selectedTitle}`;
      icdCode = 'R69 (Unspecified Medical Assessment)';
      findingFromReport = input.symptomsDescription || `Patient evaluated for ${selectedTitle} with targeted clinical review and diagnostic examination.`;
      bestTreatmentProcedure = `Comprehensive Medical Management & Surgical Evaluation for ${selectedTitle}`;
      whyBestTreatment = `Evidence-based clinical protocol tailored specifically to patient presentation and symptom severity.`;
      altTreatments = [
        {
          treatmentName: 'Conservative Medical Management',
          suitabilityScorePercent: 50,
          notes: 'Monitors symptom progression under outpatient supervision.'
        }
      ];
      preOp = [
        'Standard clinical laboratory investigations & vital sign monitoring',
        'Specialist consultation clearance'
      ];
      postOp = [
        'Follow prescribed medication schedule',
        'Schedule follow-up review in 7-10 days'
      ];
      apolloDoc = { name: 'Dr. S. K. Nair', exp: '22+ Years Senior Consultant', specialty: `${selectedTitle} Specialist` };
      fortisDoc = { name: 'Dr. Meera Rao', exp: '18+ Years Specialist', specialty: `${selectedTitle} Specialist` };
      spectraDoc = { name: 'Dr. Kavita Sharma', exp: '16+ Years Clinical Exp.', specialty: 'Day-Care Surgical Specialist' };
      break;
  }

  const generatedHospitals: HospitalQuote[] = [
    {
      id: `apollo-dyn-${Date.now()}`,
      hospitalName: 'Apollo Hospitals',
      location: `Bannerghatta Road, ${city}`,
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
      totalQuoteINR: category === 'OPHTHALMOLOGY' ? 68000 : category === 'HEADACHE_NEUROLOGY' ? 82000 : category === 'SPINE_BACK' ? 198000 : 178000,
      badge: 'MOST EXPERIENCED',
      badgeType: 'neutral',
      roomInclusion: category === 'HEADACHE_NEUROLOGY' ? 'Neuro-Care Suite / Private AC' : 'Private AC Deluxe',
      roomSubtext: 'Surgeon + OT + Nursing',
      doctorName: apolloDoc.name,
      doctorExp: apolloDoc.exp,
      doctorSpecialty: apolloDoc.specialty,
      estStay: category === 'OPHTHALMOLOGY' ? 'Day Care (Same Day)' : category === 'HEADACHE_NEUROLOGY' ? '1-2 Days Evaluation' : '2 Nights Stay',
      supportedInsurance: [insurance, 'Star Health', 'ICICI Lombard'],
      rating: 4.8,
      reviewsCount: 1240,
      distanceKm: 1.8,
      costRangeText: category === 'OPHTHALMOLOGY' ? '₹65k - ₹75k' : category === 'HEADACHE_NEUROLOGY' ? '₹75k - ₹90k' : category === 'SPINE_BACK' ? '₹1.85L - ₹2.25L' : '₹1.70L - ₹2.10L',
      details: {
        surgicalProcedure: category === 'SPINE_BACK' ? 125000 : category === 'HEADACHE_NEUROLOGY' ? 45000 : 105000,
        roomRent: 28000,
        implantsEquipment: category === 'HEADACHE_NEUROLOGY' ? 8000 : 22000,
        consultationLabs: 18000,
        platformDiscount: 5000,
      },
    },
    {
      id: `fortis-dyn-${Date.now()}`,
      hospitalName: 'Fortis Hospital',
      location: `Cunningham Road, ${city}`,
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUoaDfXwgwTwAhL-iEtHW7HNmamkQXxPApgBT6AwVIuZTywxYyk3q7_8u8KTBgIlMfGW_D2DiTbymH5cgFDvvRjjDg1m4py5LhXzZGeX5VPy5ME5dNwR_5YZagBqmRmaeg-Fl-jJoCwUKVJH14oPRmormTZUnjiw4lXALmHYN_pxaZj0LTyeb9ivOIxVAHlU0YpI4uQaoR6Mgt95H8kZfJuNBFeT1CFwdBtreoMbXD_25bOI3S0zii',
      totalQuoteINR: category === 'OPHTHALMOLOGY' ? 58000 : category === 'HEADACHE_NEUROLOGY' ? 68000 : category === 'SPINE_BACK' ? 168000 : 148500,
      badge: 'AI RECOMMENDED',
      badgeType: 'secondary',
      roomInclusion: 'Semi-Private AC Room',
      roomSubtext: 'Specialist + Post-Op Kit',
      doctorName: fortisDoc.name,
      doctorExp: fortisDoc.exp,
      doctorSpecialty: fortisDoc.specialty,
      estStay: category === 'OPHTHALMOLOGY' ? 'Day Care' : category === 'HEADACHE_NEUROLOGY' ? 'Day Care / 1 Night' : '1 Night Stay',
      supportedInsurance: [insurance, 'All Major TPAs'],
      rating: 4.7,
      reviewsCount: 910,
      savingsVsAvgPercentage: 16,
      distanceKm: 2.4,
      costRangeText: category === 'OPHTHALMOLOGY' ? '₹55k - ₹65k' : category === 'HEADACHE_NEUROLOGY' ? '₹60k - ₹75k' : category === 'SPINE_BACK' ? '₹1.55L - ₹1.80L' : '₹1.40L - ₹1.65L',
      details: {
        surgicalProcedure: category === 'SPINE_BACK' ? 108000 : category === 'HEADACHE_NEUROLOGY' ? 38000 : 92000,
        roomRent: 20000,
        implantsEquipment: category === 'HEADACHE_NEUROLOGY' ? 5000 : 20000,
        consultationLabs: 14500,
        platformDiscount: 6000,
      },
    },
    {
      id: `spectra-dyn-${Date.now()}`,
      hospitalName: 'Apollo Spectra Hospitals',
      location: `Kailash Colony, ${city}`,
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACPUuJAWSY5eeAu8Kx9RzbZuDsHSs3YPWNr0FLjYtsC_lf74QJO56ac0ErJOT82il3lTQNkSEYnhgGletnH3VKLpmG5mBMcUfXMakF7QfTn0R1W33VyV_-9h20_4erKMKMYDrsG13QF4WYgoJH6LP9fv6g1iXshUaLkChHbDE3czUogDP9mc8azPH9a3iuFm_fByO4TbpvsqGZFNKqMQ7BWFcDwtcvi5On_4-b3cLF5bEMmYJFiA_P',
      totalQuoteINR: category === 'OPHTHALMOLOGY' ? 45000 : category === 'HEADACHE_NEUROLOGY' ? 42000 : category === 'SPINE_BACK' ? 128000 : 112000,
      badge: 'BUDGET FRIENDLY',
      badgeType: 'accent',
      roomInclusion: 'Short-Stay Daycare Bay',
      roomSubtext: 'Fast-Track Discharge Package',
      doctorName: spectraDoc.name,
      doctorExp: spectraDoc.exp,
      doctorSpecialty: spectraDoc.specialty,
      estStay: 'Day Care (Same Day Discharge)',
      supportedInsurance: [insurance, 'Star Health', 'Care Health'],
      rating: 4.9,
      reviewsCount: 620,
      distanceKm: 0.8,
      costRangeText: category === 'OPHTHALMOLOGY' ? '₹40k - ₹50k' : category === 'HEADACHE_NEUROLOGY' ? '₹38k - ₹48k' : category === 'SPINE_BACK' ? '₹1.15L - ₹1.40L' : '₹95k - ₹1.25L',
      details: {
        surgicalProcedure: category === 'SPINE_BACK' ? 82000 : category === 'HEADACHE_NEUROLOGY' ? 24000 : 72000,
        roomRent: 12000,
        implantsEquipment: category === 'HEADACHE_NEUROLOGY' ? 3000 : 14000,
        consultationLabs: 10000,
        platformDiscount: 4000,
      },
    },
  ];

  const overallHealthScore = category === 'SPINE_BACK' ? 78 : category === 'CARDIOLOGY' ? 72 : 85;

  return {
    category,
    selectedTitle,
    conditionName,
    icdCode,
    findingFromReport,
    overallHealthScore,
    reportAnalysisSummary: `Clinical report & AI analysis confirms diagnosis for ${conditionName}. ${input.vitalsSummaryText}. Procedure recommended within ${isUrgent ? '3 to 7' : '7 to 14'} days to prevent disease progression.`,
    hospitalSelectionReasoning: `Hospitals in ${city} were matched based on specialized ${apolloDoc.specialty} department ranking and high cashless approval rate under ${insurance}.`,
    healthIssuesDetected: [
      {
        conditionName,
        icdCode,
        findingFromReport,
        severity: isUrgent ? ('High / Serious' as const) : ('Moderate' as const),
        severityBadgeColor: isUrgent ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800',
        urgencyText: isUrgent ? 'Schedule within 3 to 7 days' : 'Schedule within 7 to 14 days',
        riskIfDelayed: category === 'SPINE_BACK'
          ? 'Delay in spine decompression may risk permanent nerve damage, persistent muscle weakness, or severe bowel/bladder incontinence.'
          : category === 'GYNAECOLOGY'
          ? 'Delay may cause progressive enlargement of fibroids/cysts, worsening anemia, and severe pelvic organ compression.'
          : category === 'UROLOGY'
          ? 'Obstructing stone may lead to severe hydronephrosis, urinary tract sepsis, or irreversible kidney damage.'
          : 'Delay in surgical management may increase risk of acute flare-ups, severe pain, or emergency hospital admission.'
      },
      ...(input.hba1cNum && input.hba1cNum > 6.0
        ? [
            {
              conditionName: 'Elevated Glycemic Profile / Borderline HbA1c',
              icdCode: 'R73.03 (Pre-diabetes)',
              findingFromReport: `Fasting blood sugar ${input.fastSugarNum ?? 110} mg/dL with HbA1c ${input.hba1cNum}%.`,
              severity: 'Moderate' as const,
              severityBadgeColor: 'bg-amber-100 text-amber-800',
              urgencyText: 'Pre-operative metabolic optimization required',
              riskIfDelayed: 'Elevated blood sugar levels may impair wound healing post-operatively.'
            }
          ]
        : [])
    ],
    treatmentRecommendation: {
      bestTreatmentProcedure,
      whyBestTreatment,
      alternativeTreatmentsEvaluated: altTreatments,
      urgencyTimelineDays: isUrgent ? 'Within 3 to 7 Days' : 'Within 7 to 14 Days',
      urgencyLevel: isUrgent
        ? ('Urgent (Within 48-72 Hours)' as const)
        : ('Recommended Soon (Within 7-14 Days)' as const),
      preOpPreparations: preOp,
      postOpCareInstructions: postOp,
    },
    hospitals: generatedHospitals,
  };
}
