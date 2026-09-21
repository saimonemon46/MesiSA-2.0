<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Doctor;
use App\Models\Hospital;
use App\Models\MedicalDocument;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HealthcareDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds with idempotent, production-grade medical data.
     */
    public function run(): void
    {
        // -----------------------------------------------------------------
        // 1. Seed Clinical Departments
        // -----------------------------------------------------------------
        $departments = [
            [
                'name' => 'Neurology',
                'slug' => 'neurology',
                'code' => 'NEURO',
                'description' => 'Comprehensive diagnosis and medical management of brain, spinal cord, and peripheral nervous system disorders including migraine, stroke, and epilepsy.',
                'icon_name' => 'brain',
            ],
            [
                'name' => 'Cardiology',
                'slug' => 'cardiology',
                'code' => 'CARDIO',
                'description' => 'Specialized care for coronary artery disease, arrhythmias, hypertension, heart failure, and structural cardiovascular interventions.',
                'icon_name' => 'heart',
            ],
            [
                'name' => 'Orthopedics & Spine',
                'slug' => 'orthopedics-spine',
                'code' => 'ORTHO',
                'description' => 'Surgical and non-surgical treatments for spinal conditions, joint replacements, cervical radiculopathy, and musculoskeletal trauma.',
                'icon_name' => 'bone',
            ],
            [
                'name' => 'General Internal Medicine',
                'slug' => 'internal-medicine',
                'code' => 'GENMED',
                'description' => 'Primary care clinical assessment, multi-system chronic disease management, preventive health screening, and initial diagnostic triage.',
                'icon_name' => 'stethoscope',
            ],
            [
                'name' => 'Pulmonology',
                'slug' => 'pulmonology',
                'code' => 'PULMO',
                'description' => 'Management of respiratory diseases, chronic obstructive pulmonary disease (COPD), asthma, sleep apnea, and interstitial lung diseases.',
                'icon_name' => 'activity',
            ],
        ];

        foreach ($departments as $deptData) {
            Department::updateOrCreate(['code' => $deptData['code']], $deptData);
        }

        $neuroDept = Department::where('code', 'NEURO')->first();
        $cardioDept = Department::where('code', 'CARDIO')->first();
        $orthoDept = Department::where('code', 'ORTHO')->first();
        $genDept = Department::where('code', 'GENMED')->first();

        // -----------------------------------------------------------------
        // 2. Seed Simulated Hospital Knowledge Bases (Hospital A, B, C)
        // -----------------------------------------------------------------
        $hospitals = [
            [
                'name' => 'Metropolitan Academic Medical Center',
                'slug' => 'metropolitan-academic-medical-center',
                'code' => 'HOSP_A',
                'kb_source' => 'hospital_a',
                'tier' => 'Quaternary Academic Center',
                'city' => 'Metropolis',
                'address' => '742 University Parkway, Medical District',
                'phone' => '+1 (555) 019-2831',
                'emergency_phone' => '+1 (555) 911-0001',
                'rating' => 4.85,
                'total_beds' => 850,
                'facilities' => [
                    'Level 1 Trauma Center',
                    '24/7 Comprehensive Stroke Unit',
                    'Dual 3T Research MRI',
                    'Hybrid Surgical Suites',
                    'Intensive Care Unit (ICU)'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'St. Jude Neurological & Spine Institute',
                'slug' => 'st-jude-neurological-spine-institute',
                'code' => 'HOSP_B',
                'kb_source' => 'hospital_b',
                'tier' => 'Specialized Neurological Center',
                'city' => 'Boston Medical Hub',
                'address' => '120 Longwood Avenue, Suite 400',
                'phone' => '+1 (555) 024-8840',
                'emergency_phone' => '+1 (555) 911-0002',
                'rating' => 4.95,
                'total_beds' => 320,
                'facilities' => [
                    'Dedicated Comprehensive Headache Clinic',
                    'Stereotactic Radiosurgery',
                    'Neurovascular Cath Lab',
                    'Continuous EEG Monitoring Unit',
                    'Outpatient Infusion Center'
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Apex Heart & Vascular Specialty Clinic',
                'slug' => 'apex-heart-vascular-clinic',
                'code' => 'HOSP_C',
                'kb_source' => 'hospital_c',
                'tier' => 'Tertiary Cardiovascular Center',
                'city' => 'Chicago Health Corridor',
                'address' => '500 Michigan Avenue, Tower B',
                'phone' => '+1 (555) 038-7711',
                'emergency_phone' => '+1 (555) 911-0003',
                'rating' => 4.78,
                'total_beds' => 260,
                'facilities' => [
                    'Advanced Echocardiography Lab',
                    'Ambulatory Blood Pressure Monitoring',
                    'Cardiac Rehabilitation Suite',
                    'Vascular Intervention Suite',
                    'Emergency Chest Pain Center'
                ],
                'is_active' => true,
            ],
        ];

        foreach ($hospitals as $hospData) {
            Hospital::updateOrCreate(['code' => $hospData['code']], $hospData);
        }

        $hospA = Hospital::where('code', 'HOSP_A')->first();
        $hospB = Hospital::where('code', 'HOSP_B')->first();
        $hospC = Hospital::where('code', 'HOSP_C')->first();

        // -----------------------------------------------------------------
        // 3. Seed Clinical Specialists (Doctors)
        // -----------------------------------------------------------------
        $doctors = [
            [
                'hospital_id' => $hospB->id,
                'department_id' => $neuroDept->id,
                'name' => 'Dr. Sarah Lin',
                'slug' => 'dr-sarah-lin',
                'title' => 'MD, PhD, FAAN',
                'sub_specialty' => 'Chronic Migraine, Trigeminal Neuralgia & Neurovascular Disorders',
                'qualifications' => 'Harvard Medical School (MD), Brigham and Women’s Hospital Residency, Fellowship in Headache Medicine',
                'experience_years' => 16,
                'consultation_fee' => 220.00,
                'availability' => 'Mon, Tue, Thu (09:00 - 15:30)',
                'rating' => 4.96,
                'review_count' => 312,
                'bio' => 'Dr. Sarah Lin is the Director of the Headache and Craniofacial Pain Clinic at St. Jude. She specializes in refractory daily headaches, migraine prevention protocols, and therapeutic nerve blocks.',
                'is_accepting_new_patients' => true,
            ],
            [
                'hospital_id' => $hospA->id,
                'department_id' => $neuroDept->id,
                'name' => 'Dr. Marcus Vance',
                'slug' => 'dr-marcus-vance',
                'title' => 'MD, FACS',
                'sub_specialty' => 'General Neurology, Acute Stroke & Neuro-Imaging Evaluation',
                'qualifications' => 'Johns Hopkins School of Medicine, Mayo Clinic Fellowship in Vascular Neurology',
                'experience_years' => 19,
                'consultation_fee' => 190.00,
                'availability' => 'Mon, Wed, Fri (08:30 - 16:00)',
                'rating' => 4.88,
                'review_count' => 184,
                'bio' => 'Senior Attending Neurologist at Metropolitan Academic Medical Center with expertise in structural brain pathologies, sudden-onset headaches, and secondary headache differential diagnosis.',
                'is_accepting_new_patients' => true,
            ],
            [
                'hospital_id' => $hospC->id,
                'department_id' => $cardioDept->id,
                'name' => 'Dr. Elena Rostova',
                'slug' => 'dr-elena-rostova',
                'title' => 'MD, FACC',
                'sub_specialty' => 'Refractory Hypertension, Vascular Hemodynamics & Cardio-Syncope',
                'qualifications' => 'Stanford University School of Medicine, Cleveland Clinic Cardiology Fellowship',
                'experience_years' => 14,
                'consultation_fee' => 175.00,
                'availability' => 'Tue, Wed, Fri (09:00 - 17:00)',
                'rating' => 4.82,
                'review_count' => 140,
                'bio' => 'Cardiovascular specialist examining systemic vascular causes of neurological symptoms, including hypertensive headache crises, autonomic instability, and cerebral blood flow regulation.',
                'is_accepting_new_patients' => true,
            ],
            [
                'hospital_id' => $hospA->id,
                'department_id' => $orthoDept->id,
                'name' => 'Dr. James Thorne',
                'slug' => 'dr-james-thorne',
                'title' => 'MD, FAAOS',
                'sub_specialty' => 'Cervical Spine Surgery & Cervicogenic Headaches',
                'qualifications' => 'Columbia University Vagelos College of Physicians and Surgeons',
                'experience_years' => 22,
                'consultation_fee' => 210.00,
                'availability' => 'Mon, Thu (10:00 - 16:00)',
                'rating' => 4.79,
                'review_count' => 98,
                'bio' => 'Spine specialist treating referred headaches originating from upper cervical spine facet arthrosis, nerve root compression, and postural biomechanical dysfunction.',
                'is_accepting_new_patients' => false,
            ],
            [
                'hospital_id' => $hospA->id,
                'department_id' => $genDept->id,
                'name' => 'Dr. Anita Desai',
                'slug' => 'dr-anita-desai',
                'title' => 'MD, FACP',
                'sub_specialty' => 'Internal Medicine, Diagnostic Triage & Preventative Care',
                'qualifications' => 'University of Pennsylvania Perelman School of Medicine',
                'experience_years' => 11,
                'consultation_fee' => 120.00,
                'availability' => 'Mon - Fri (08:00 - 14:00)',
                'rating' => 4.91,
                'review_count' => 245,
                'bio' => 'Primary medical physician focused on comprehensive clinical triage, rule-out diagnostics, and coordinating specialist referrals across multi-disciplinary healthcare systems.',
                'is_accepting_new_patients' => true,
            ],
        ];

        foreach ($doctors as $docData) {
            Doctor::updateOrCreate(['slug' => $docData['slug']], $docData);
        }

        // -----------------------------------------------------------------
        // 4. Seed Clinical Evidence Documents (The Core for FRAG vs RAG)
        // -----------------------------------------------------------------
        $documents = [
            // Knowledge Base: Hospital A (Metropolitan General)
            [
                'hospital_id' => $hospA->id,
                'department_id' => $neuroDept->id,
                'kb_source' => 'hospital_a',
                'document_code' => 'DOC-HA-NEURO-001',
                'title' => 'Metropolitan Clinical Protocol: Primary Care Triage of Recurring Headaches',
                'condition_name' => 'Recurring Cephalea & Tension-Type Headache',
                'clinical_summary' => 'Outlines initial triage workflow for recurring headaches. Directs patients presenting with frequency exceeding 15 days/month or unresponsive to NSAIDs to outpatient Neurology for neuro-imaging and preventive management.',
                'full_content' => "METROPOLITAN ACADEMIC MEDICAL CENTER CLINICAL GUIDELINE\nDepartment of Neurology | Reference ID: HA-NEURO-2024\n\nOBJECTIVE: Standardized evaluation of recurring non-acute headache syndromes.\n\n1. INITIAL SCREENING (SNOOP Criteria):\nScreen for Systemic symptoms (fever, weight loss), Neurological deficits, Onset sudden (thunderclap), Older age (>50 yrs), and Pattern change. If SNOOP criteria are positive, immediate urgent neuro-imaging (CT/MRI) is mandated.\n\n2. RECURRING CHRONIC PATTERNS:\nPatients experiencing recurring headaches without acute red flags should be classified into Tension-Type Headache vs Migraine with/without aura. When headache episodes occur on >= 15 days per month for > 3 consecutive months, diagnosis is consistent with Chronic Migraine or Chronic Tension Headache.\n\n3. SPECIALIST REFERRAL RECOMMENDATION:\nReferral to a board-certified Neurologist is recommended when:\n- Patient fails two first-line prophylactic medications.\n- Attacks interfere significantly with daily cognitive or occupational function.\n- Atypical sensory or visual auras are reported.",
                'evidence_level' => 'Class I, Level B',
                'citation' => 'Metropolitan Hospital Clinical Practice Guidelines 2024; Vol 14, pp 112-119.',
                'keywords' => ['headache', 'recurring', 'neurology', 'triage', 'migraine', 'tension headache', 'SNOOP criteria'],
            ],

            // Knowledge Base: Hospital B (St. Jude Neurological Institute)
            [
                'hospital_id' => $hospB->id,
                'department_id' => $neuroDept->id,
                'kb_source' => 'hospital_b',
                'document_code' => 'DOC-HB-NEURO-002',
                'title' => 'St. Jude Advanced Neuro-Protocol: Refractory Chronic Migraine & CGRP Pathway Management',
                'condition_name' => 'Chronic Migraine, Intractable Headache & Trigeminal Autonomic Cephalea',
                'clinical_summary' => 'Comprehensive specialty protocol for chronic migraine evaluation, brain MRI protocols (T1, T2 FLAIR, diffusion), and targeted neuromodulation. Authored by the St. Jude Headache Clinic led by Dr. Sarah Lin.',
                'full_content' => "ST. JUDE NEUROLOGICAL & SPINE INSTITUTE\nComprehensive Headache Center of Excellence | Doc: SJ-HA-904\n\nCLINICAL PATHWAY: CHRONIC REFRACTORY HEADACHE DISORDERS\n\n1. DEFINITION & CLASSIFICATION:\nChronic Migraine affects approximately 1-2% of the population. Characterized by >= 15 headache days/month, with at least 8 days fulfilling criteria for migraine (throbbing quality, unilateral location, moderate-to-severe intensity, photophobia/phonophobia, and nausea).\n\n2. DIAGNOSTIC WORKUP:\n- High-resolution 3.0 Tesla Brain MRI with and without gadolinium contrast to exclude Chiari I malformation, venous sinus thrombosis, and idiopathic intracranial hypertension (IIH).\n- Extended headache frequency diary monitoring.\n\n3. THERAPEUTIC REGIMENS:\n- Acute abortive therapy: Oral and subcutaneous Triptans, CGRP receptor antagonists (Ubrogepant, Rimegepant).\n- Preventive therapies: Monthly monoclonal antibodies targeting CGRP ligand (Fremanezumab, Galcanezumab) and quarterly OnabotulinumtoxinA injections for certified candidates.\n\nSPECIALIST CONTACT:\nDirect patient inquiries to Dr. Sarah Lin, Clinic Director, St. Jude Headache Clinic.",
                'evidence_level' => 'Class I, Level A',
                'citation' => 'St. Jude Neurological Bulletin 2024; Guideline #STJ-904-REV.',
                'keywords' => ['chronic migraine', 'headache', 'neurologist', 'Dr. Sarah Lin', 'CGRP', 'botox', 'brain MRI', 'St. Jude'],
            ],

            // Knowledge Base: Hospital C (Apex Heart & Vascular)
            [
                'hospital_id' => $hospC->id,
                'department_id' => $cardioDept->id,
                'kb_source' => 'hospital_c',
                'document_code' => 'DOC-HC-CARDIO-003',
                'title' => 'Apex Cardiovascular Protocol: Hypertensive Headache Crises & Cerebral Vasoreactivity',
                'condition_name' => 'Hypertensive Cephalea & Autonomic Vascular Instability',
                'clinical_summary' => 'Identifies secondary vascular etiologies where recurring morning headaches correlate with elevated blood pressure surges (BP > 180/110 mmHg). Recommends 24-hour ambulatory blood pressure monitoring and cardiology evaluation.',
                'full_content' => "APEX HEART & VASCULAR SPECIALTY CLINIC\nVascular Medicine Department | Guideline: APH-CARDIO-442\n\nDIAGNOSTIC ADVISORY: HYPERTENSIVE CEPHALEA & CEREBRAL PERFUSION\n\n1. CLINICAL PRESENTATION:\nWhile primary migraines are neurological, recurring bilateral occipital throbbing headaches occurring primarily upon waking can be a key manifestation of undetected stage 2 hypertension, pheochromocytoma, or nocturnal hypoxia.\n\n2. CLINICAL DIFFERENTIATION:\n- Neurological migraines typically present with unilateral throbbing, aura, or nausea.\n- Hypertensive headaches correlate synchronously with severe blood pressure peaks (systolic >= 160-180 mmHg).\n\n3. RECOMMENDED WORKUP:\n- 24-hour ambulatory blood pressure monitoring (ABPM).\n- Transthoracic echocardiogram to rule out left ventricular hypertrophy (LVH).\n- Joint consultation between Cardiology and Neurology if headaches persist post-normalization of blood pressure.",
                'evidence_level' => 'Class IIa, Level B',
                'citation' => 'American College of Cardiology / Apex Health Consensus on Vascular Cephalea 2024.',
                'keywords' => ['hypertension', 'headache', 'cardiology', 'blood pressure', 'vascular', 'occipital', 'Apex'],
            ],

            // Knowledge Base: National Clinical Guidelines (Ground Truth Reference)
            [
                'hospital_id' => null, // Global ground truth
                'department_id' => $neuroDept->id,
                'kb_source' => 'national_guidelines',
                'document_code' => 'DOC-NAT-NEURO-101',
                'title' => 'National Evidence-Based Clinical Guideline for Chronic Daily Headache in Adults',
                'condition_name' => 'Chronic Daily Headache (CDH) & International Classification (ICHD-3)',
                'clinical_summary' => 'Consensus diagnostic standard defining primary vs secondary headache syndromes. Class I evidence demonstrates that early referral to a Neurologist specializing in headache medicine reduces disability and emergency visits by 64%.',
                'full_content' => "NATIONAL HEALTHCARE EVIDENCE REPOSITORY\nDivision of Neurosciences and Health Standards | Document: NAT-REF-NEURO-ICHD3\n\nSTANDARDS OF CARE: CHRONIC DAILY HEADACHE DISORDERS\n\n1. EPIDEMIOLOGY & BURDEN:\nHeadache is among the top 10 most disabling conditions worldwide. Misdiagnosis and inappropriate reliance on over-the-counter analgesics frequently leads to Medication Overuse Headache (MOH).\n\n2. PRIMARY SPECIALIST ALIGNMENT:\nWhen a patient reports recurring headaches:\n- Primary Specialist to consult: Neurologist (Specialty Code: NEURO).\n- Recommended Sub-specialty: Headache Medicine / Craniofacial Neurologist.\n- Supporting Diagnostic Services: Neuro-imaging (Magnetic Resonance Imaging), Fundoscopic eye examination (to rule out papilledema).\n\n3. EVIDENCE SUMMARY:\nSystematic reviews demonstrate that structured care under a certified neurologist reduces headache days per month from an average of 18.4 to 6.1 days within 6 months of targeted therapy.",
                'evidence_level' => 'Class I, Level A (Meta-Analysis)',
                'citation' => 'National Institute of Neurological Disorders & ICHD-3 International Consensus Standard.',
                'keywords' => ['headache', 'neurologist', 'neurology', 'ICHD-3', 'migraine', 'clinical guidelines', 'national reference'],
            ],
        ];

        foreach ($documents as $docData) {
            MedicalDocument::updateOrCreate(['document_code' => $docData['document_code']], $docData);
        }
    }
}
