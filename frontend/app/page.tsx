"use client";

import React, { useState } from 'react';
import { User } from '../lib/types';
import { MOCK_USERS } from '../lib/mockData';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

// Patient Components
import { PatientDashboard } from '../components/patient/PatientDashboard';
import { SymptomCheckView } from '../components/patient/SymptomCheckView';
import { ReportsView } from '../components/patient/ReportsView';
import { DocumentsView } from '../components/patient/DocumentsView';
import { MedicationsView } from '../components/patient/MedicationsView';
import { FindDoctorsView } from '../components/patient/FindDoctorsView';
import { AppointmentsView } from '../components/patient/AppointmentsView';
import { ProfileView } from '../components/patient/ProfileView';

// Doctor Components
import { DoctorDashboard } from '../components/doctor/DoctorDashboard';

// Admin Components
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { UserManagementView } from '../components/admin/UserManagementView';
import { DoctorManagementView } from '../components/admin/DoctorManagementView';
import { HospitalManagementView } from '../components/admin/HospitalManagementView';
import { LiveSupervisionView } from '../components/admin/LiveSupervisionView';
import { AuditLogsView } from '../components/admin/AuditLogsView';
import { SystemSettingsView } from '../components/admin/SystemSettingsView';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'patient') {
      setActiveTab('dashboard');
    } else if (user.role === 'doctor') {
      setActiveTab('doctor-dashboard');
    } else {
      setActiveTab('admin-dashboard');
    }
  };

  const renderContent = () => {
    // Patient Tabs
    if (activeTab === 'dashboard') return <PatientDashboard user={currentUser} onNavigate={setActiveTab} />;
    if (activeTab === 'symptom-check') return <SymptomCheckView user={currentUser} />;
    if (activeTab === 'reports') return <ReportsView user={currentUser} />;
    if (activeTab === 'documents') return <DocumentsView user={currentUser} />;
    if (activeTab === 'medications') return <MedicationsView user={currentUser} />;
    if (activeTab === 'doctors') return <FindDoctorsView user={currentUser} onBookSuccess={() => setActiveTab('appointments')} />;
    if (activeTab === 'appointments') return <AppointmentsView user={currentUser} />;
    if (activeTab === 'profile') return <ProfileView user={currentUser} />;

    // Doctor Tabs
    if (activeTab === 'doctor-dashboard' || activeTab === 'clinical-reviews') {
      return <DoctorDashboard user={currentUser} />;
    }
    if (activeTab === 'doctor-appointments') return <AppointmentsView user={currentUser} />;
    if (activeTab === 'patient-records') return <UserManagementView />;

    // Admin Tabs
    if (activeTab === 'admin-dashboard') return <AdminDashboard user={currentUser} onNavigate={setActiveTab} />;
    if (activeTab === 'user-management') return <UserManagementView />;
    if (activeTab === 'doctor-management') return <DoctorManagementView />;
    if (activeTab === 'hospital-management') return <HospitalManagementView />;
    if (activeTab === 'live-supervision') return <LiveSupervisionView />;
    if (activeTab === 'audit-logs') return <AuditLogsView />;
    if (activeTab === 'system-settings') return <SystemSettingsView />;

    return <PatientDashboard user={currentUser} onNavigate={setActiveTab} />;
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f0f4fc]">
      <Navbar
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        activeTab={activeTab}
      />
      <div className="flex">
        <Sidebar
          role={currentUser.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 p-6 max-w-7xl">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
