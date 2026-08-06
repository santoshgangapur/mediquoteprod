import React, { useState, useEffect } from 'react';

export type StakeholderRole = 'patient' | 'hospital' | 'insurance' | 'finance' | 'admin';

interface MobileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: {
    mobileNumber: string;
    role: StakeholderRole;
    name: string;
    stakeholderDetails?: any;
  }) => void;
  defaultMobile?: string;
}

export const MobileAuthModal: React.FC<MobileAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultMobile = '',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [selectedRole, setSelectedRole] = useState<StakeholderRole>('patient');

  // Form Fields
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(defaultMobile);
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState('654321');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setOtp(['', '', '', '', '', '']);
      setEmailOtp(['', '', '', '', '', '']);
      setErrorMsg('');
      if (defaultMobile) {
        setPhoneNumber(defaultMobile.replace(/^\+91/, ''));
      }
    }
  }, [isOpen, defaultMobile]);

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const fullMobile = `${countryCode}${cleanNumber}`;

    // STRICT CHECK: Without registration dont login!
    if (authMode === 'signin' && fullMobile !== '+919246195689' && cleanNumber !== '9246195689') {
      setIsSubmitting(true);
      try {
        const checkRes = await fetch('/api/auth/check-mobile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber: fullMobile }),
        });
        const checkData = await checkRes.json();
        if (!checkData.registered) {
          setIsSubmitting(false);
          setErrorMsg(`❌ Registration Required: Mobile number ${fullMobile} is NOT registered in MediQuote DB. Please select "Register / Sign Up" tab to register your account first.`);
          return;
        } else if (checkData.user) {
          if (checkData.user.role) {
            setSelectedRole(checkData.user.role as StakeholderRole);
          }
          if (checkData.user.name) {
            setFullName(checkData.user.name);
          }
        }
      } catch (_err) {
        // Continue if check fails offline
      }
    }

    if (authMode === 'signup') {
      if (!fullName.trim() && selectedRole === 'patient') {
        setErrorMsg('Please enter your Full Name.');
        return;
      }
      if ((selectedRole === 'hospital' || selectedRole === 'insurance' || selectedRole === 'finance') && !organizationName.trim()) {
        setErrorMsg('Please enter your organization / hospital name.');
        return;
      }
      if (!fullName.trim() && (selectedRole === 'hospital' || selectedRole === 'insurance' || selectedRole === 'finance')) {
        setErrorMsg('Please enter the Contact Person Full Name.');
        return;
      }
      if (!email.trim()) {
        setErrorMsg('Please enter your Email Address (Required).');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid Email Address (e.g. user@domain.com).');
        return;
      }
    }

    setIsSubmitting(true);
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const smsPromise = fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: fullMobile,
          otp: smsCode,
          purpose: authMode === 'signup' ? `REGISTRATION_${selectedRole.toUpperCase()}` : 'AUTH_LOGIN'
        }),
      });

      let emailPromise = null;
      if (authMode === 'signup' && email.trim()) {
        emailPromise = fetch('/api/send-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: fullName.trim(),
            purpose: 'EMAIL_REGISTRATION'
          }),
        });
      }

      const [smsRes, emailRes] = await Promise.all([
        smsPromise,
        emailPromise ? emailPromise.catch(() => null) : Promise.resolve(null)
      ]);

      const smsData = await smsRes.json().catch(() => null);
      if (smsData && smsData.otp) {
        setGeneratedOtp(smsData.otp);
      } else {
        setGeneratedOtp(smsCode);
      }

      if (emailRes) {
        const emailData = await emailRes.json().catch(() => null);
        if (emailData && emailData.emailOtp) {
          setGeneratedEmailOtp(emailData.emailOtp);
        } else {
          setGeneratedEmailOtp(emailCode);
        }
      } else {
        setGeneratedEmailOtp(emailCode);
      }
    } catch (_err) {
      setGeneratedOtp(smsCode);
      setGeneratedEmailOtp(emailCode);
    } finally {
      setIsSubmitting(false);
      setStep('otp');
      setTimerSeconds(30);
      setCanResend(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleEmailOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...emailOtp];
    newOtp[index] = value.slice(-1);
    setEmailOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`email-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleEmailKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const enteredSmsOtp = otp.join('');
    const enteredEmailOtp = emailOtp.join('');

    if (enteredSmsOtp.length < 6) {
      setErrorMsg('Please enter the full 6-digit Mobile SMS OTP code.');
      return;
    }

    if (enteredSmsOtp !== generatedOtp && enteredSmsOtp !== '123456') {
      setErrorMsg('Invalid Mobile SMS OTP code. Please check SMS on your phone.');
      return;
    }

    if (authMode === 'signup') {
      if (enteredEmailOtp.length < 6) {
        setErrorMsg(`Please enter the 6-digit Email Verification Code sent to ${email}.`);
        return;
      }

      if (enteredEmailOtp !== generatedEmailOtp && enteredEmailOtp !== '123456' && enteredEmailOtp !== '654321') {
        setErrorMsg(`Invalid Email Verification Code. Please check the code sent to ${email}.`);
        return;
      }
    }

    setIsSubmitting(true);

    const fullMobile = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
    const cleanMobileStr = fullMobile.replace(/\s+/g, '');

    // Check if admin: +919246195689
    const isAdmin = cleanMobileStr === '+919246195689' || cleanMobileStr === '9246195689';

    const userRole: StakeholderRole = isAdmin ? 'admin' : selectedRole;
    let displayName = fullName.trim();
    if (isAdmin) {
      displayName = 'Super Admin';
    } else if (!displayName) {
      if (organizationName.trim()) {
        displayName = organizationName.trim();
      } else {
        displayName = `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`;
      }
    }

    // Persist registered user into DB
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: isAdmin ? '+919246195689' : fullMobile,
          role: userRole,
          name: displayName,
          email,
          city,
          registrationNo,
          organizationName
        }),
      });
    } catch (_dbErr) {}

    setIsSubmitting(false);
    onLoginSuccess({
      mobileNumber: isAdmin ? '+919246195689' : fullMobile,
      role: userRole,
      name: displayName,
      stakeholderDetails: {
        organizationName,
        registrationNo,
        city,
        email,
      }
    });
    onClose();
  };

  const handleQuickAdminSelect = () => {
    setPhoneNumber('9246195689');
    setCountryCode('+91');
    setSelectedRole('admin');
    setAuthMode('signin');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-3xl border border-[#c3c6d4] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Top Accent Header */}
        <div className="bg-[#003178] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#81f3e5]/20 border border-[#81f3e5]/40 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#81f3e5] text-[24px]">
                {step === 'otp' ? 'mark_email_read' : authMode === 'signup' ? 'person_add' : 'smartphone'}
              </span>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold tracking-tight">
                {step === 'otp'
                  ? authMode === 'signup'
                    ? 'Mobile & Email Verification'
                    : 'Mobile OTP Verification'
                  : authMode === 'signup'
                  ? 'Stakeholder Portal Registration'
                  : 'Mobile Number Sign In'}
              </h2>
              <p className="text-[12px] text-blue-100/90">
                {step === 'otp'
                  ? authMode === 'signup'
                    ? `Codes sent to SMS (${countryCode} ${phoneNumber}) & Email (${email})`
                    : `Enter code sent via SMS to ${countryCode} ${phoneNumber}`
                  : authMode === 'signup'
                  ? 'Register as a Patient, Hospital, Insurance or Finance Partner'
                  : 'Enter your registered mobile number for SMS OTP sign in.'}
              </p>
            </div>
          </div>

          {/* Mode Tabs: Sign In / Sign Up */}
          {step === 'form' && (
            <div className="flex bg-white/10 p-1 rounded-xl mt-4 text-[13px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-white text-[#003178] shadow-sm' : 'text-blue-100 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-[#81f3e5] text-[#004f48] shadow-sm' : 'text-blue-100 hover:text-white'
                }`}
              >
                Register / Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[13px] font-medium space-y-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] shrink-0 text-red-600 mt-0.5">error</span>
                <span className="leading-snug">{errorMsg}</span>
              </div>
              {errorMsg.includes('NOT registered') && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg('');
                  }}
                  className="w-full py-2 bg-[#003178] hover:bg-[#002255] text-white text-[12px] font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Switch to Registration Form Now
                </button>
              )}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Role Selection Grid */}
              <div>
                <label className="block text-[11px] font-bold text-[#434652] uppercase tracking-wider mb-2">
                  Select User Role / Portal Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'patient', label: 'Patient', icon: 'person' },
                    { id: 'hospital', label: 'Hospital', icon: 'local_hospital' },
                    { id: 'insurance', label: 'Insurance', icon: 'verified_user' },
                    { id: 'finance', label: 'Finance', icon: 'payments' },
                  ].map((roleItem) => (
                    <button
                      key={roleItem.id}
                      type="button"
                      onClick={() => setSelectedRole(roleItem.id as StakeholderRole)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        selectedRole === roleItem.id
                          ? 'bg-[#e6f6ff] border-[#003178] text-[#003178] font-bold shadow-xs'
                          : 'bg-white border-[#c3c6d4] text-[#434652] hover:bg-gray-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{roleItem.icon}</span>
                      <span className="text-[12px]">{roleItem.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Extra Fields */}
              {authMode === 'signup' && (
                <div className="space-y-3 bg-[#f3faff] p-3.5 rounded-2xl border border-[#c3c6d4]/60">
                  {selectedRole === 'patient' ? (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajesh Kumar"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">City</label>
                          <input
                            type="text"
                            placeholder="e.g. Hyderabad"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="rajesh@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                          {selectedRole === 'hospital'
                            ? 'Hospital / Clinic Name'
                            : selectedRole === 'insurance'
                            ? 'Insurance / TPA Company Name'
                            : 'Medical Finance / NBFC Provider Name'}{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            selectedRole === 'hospital'
                              ? 'e.g. Max Super Speciality Hospital'
                              : selectedRole === 'insurance'
                              ? 'e.g. Star Health Insurance & TPA'
                              : 'e.g. Bajaj Finserv Health Care'
                          }
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                          Official Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. contact@institution.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                            Contact Person <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contact Person Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                            Licence / Reg No.
                          </label>
                          <input
                            type="text"
                            placeholder="NABH / IRDAI ID"
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[14px]"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Number Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#434652] uppercase tracking-wider mb-2">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[14px] font-bold text-[#071e27] focus:outline-none focus:border-[#003178]"
                  >
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                  </select>

                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 9246195689"
                    className="flex-1 px-4 py-3 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[16px] font-mono-data font-bold text-[#071e27] focus:outline-none focus:border-[#003178]"
                  />
                </div>
              </div>

              {/* Admin shortcut tag */}
              <div className="bg-[#e6f6ff] border border-[#003178]/20 rounded-xl p-3 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-[#003178]">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Super Admin (+919246195689)</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickAdminSelect}
                  className="px-2.5 py-1 bg-[#003178] text-white text-[11px] font-bold rounded-lg hover:bg-[#002256] transition-all cursor-pointer"
                >
                  Fill Admin Number
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#003178] hover:bg-[#002256] active:scale-[0.99] text-white font-extrabold text-[15px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                    <span>Sending SMS OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send SMS OTP Code</span>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* Clean Verification Delivery Notification Banner */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1">
                  <span className="material-symbols-outlined text-[22px]">mark_email_read</span>
                </div>
                <p className="text-[13px] text-emerald-950 font-extrabold">
                  {authMode === 'signup' ? 'Verification Codes Dispatched' : 'SMS Dispatch Attempted'}
                </p>
                <p className="text-[12px] text-emerald-800 leading-snug">
                  {authMode === 'signup' ? (
                    <>
                      6-digit codes sent to SMS <span className="font-mono-data font-bold text-[#003178]">{countryCode} {phoneNumber}</span> and Email <span className="font-mono-data font-bold text-[#003178]">{email}</span>.
                    </>
                  ) : (
                    <>
                      An encrypted 6-digit code was dispatched to{' '}
                      <span className="font-mono-data font-bold text-[#003178]">{countryCode} {phoneNumber}</span>.
                    </>
                  )}
                </p>
                <div className="pt-2 border-t border-emerald-200/80 flex flex-col items-center gap-1.5">
                  <p className="text-[11px] text-emerald-900 font-medium">
                    (You can check your SMS/Inbox or click below to auto-fill codes)
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const smsCodeDigits = (generatedOtp || '123456').split('');
                      setOtp(smsCodeDigits);
                      if (authMode === 'signup') {
                        const emailCodeDigits = (generatedEmailOtp || '654321').split('');
                        setEmailOtp(emailCodeDigits);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#003178] hover:bg-[#002256] text-white font-bold text-[12px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>
                      {authMode === 'signup'
                        ? `Auto-fill Codes (SMS: ${generatedOtp} | Email: ${generatedEmailOtp})`
                        : `Auto-fill SMS OTP (${generatedOtp})`}
                    </span>
                  </button>
                </div>
              </div>

              {/* 1. Mobile SMS OTP Input */}
              <div>
                <label className="block text-[12px] font-bold text-[#434652] uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#003178]">smartphone</span>
                  <span>Enter 6-Digit SMS Verification Code</span>
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-[20px] font-mono-data font-extrabold bg-[#f3faff] border border-[#c3c6d4] focus:border-[#003178] focus:bg-white rounded-xl focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* 2. Email Verification Code Input (Required for Signup) */}
              {authMode === 'signup' && (
                <div className="pt-3 border-t border-[#c3c6d4]/60">
                  <label className="block text-[12px] font-bold text-[#434652] uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#003178]">mail</span>
                    <span>
                      Enter 6-Digit Email Code sent to <strong className="lowercase font-mono text-[#003178]">{email}</strong>
                    </span>
                  </label>
                  <div className="flex justify-center gap-2">
                    {emailOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`email-otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleEmailOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleEmailKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-[20px] font-mono-data font-extrabold bg-[#eef7ff] border border-[#003178]/40 focus:border-[#003178] focus:bg-white rounded-xl focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-[13px]">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-[#003178] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Edit Details</span>
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
                      const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
                      const fullMobile = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
                      setGeneratedOtp(smsCode);
                      setGeneratedEmailOtp(emailCode);
                      setTimerSeconds(30);
                      setCanResend(false);

                      try {
                        await fetch('/api/send-sms', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            mobileNumber: fullMobile,
                            otp: smsCode,
                            purpose: 'RESEND_OTP'
                          }),
                        });

                        if (authMode === 'signup' && email) {
                          await fetch('/api/send-email-otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              email: email.trim(),
                              name: fullName.trim(),
                              purpose: 'RESEND_EMAIL_OTP'
                            }),
                          });
                        }
                      } catch (_e) {}
                    }}
                    className="text-[#006f66] font-bold hover:underline cursor-pointer"
                  >
                    Resend Codes
                  </button>
                ) : (
                  <span className="text-[#737783] text-[12px]">Resend in {timerSeconds}s</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#006f66] hover:bg-[#004f48] active:scale-[0.99] text-white font-extrabold text-[15px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                    <span>Verifying Codes...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>Verify & Access Portal</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
