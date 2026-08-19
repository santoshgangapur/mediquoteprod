import React, { useState, useEffect } from 'react';

interface SmsGatewayManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsGatewayManagerModal: React.FC<SmsGatewayManagerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'tester'>('config');

  // Config State
  const [provider, setProvider] = useState<string>('telecom_simulation');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioPhone, setTwilioPhone] = useState('');
  const [fast2smsKey, setFast2smsKey] = useState('');
  const [msg91Key, setMsg91Key] = useState('');
  const [msg91Sender, setMsg91Sender] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // Tester State
  const [testNumber, setTestNumber] = useState('+919246195689');
  const [testMessage, setTestMessage] = useState('MediQuote AI SMS Gateway Test - Code: 987654');
  const [testResult, setTestResult] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  // Logs State
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [fast2smsConfigured, setFast2smsConfigured] = useState(false);
  const [fast2smsMasked, setFast2smsMasked] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      fetchLogs();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/sms-gateway-config');
      const data = await res.json();
      if (data && data.config) {
        if (data.config.activeProvider) setProvider(data.config.activeProvider);
        setFast2smsConfigured(Boolean(data.config.fast2smsConfigured));
        if (data.config.fast2smsKeyMasked) {
          setFast2smsMasked(data.config.fast2smsKeyMasked);
          if (!fast2smsKey) {
            setFast2smsKey(data.config.fast2smsKeyMasked);
          }
        }
      }
    } catch (_e) {}
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/sms-logs');
      const data = await res.json();
      if (data && data.logs) {
        setSmsLogs(data.logs);
      }
    } catch (_e) {
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/sms-gateway-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeProvider: provider,
          twilioAccountSid: twilioSid,
          twilioAuthToken: twilioToken,
          twilioPhone,
          fast2smsApiKey: fast2smsKey,
          msg91AuthKey: msg91Key,
          msg91SenderId: msg91Sender,
          customWebhookUrl: webhookUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('SMS Gateway Provider Configuration Saved Successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Failed to save config: ' + err.message);
    }
  };

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: testNumber,
          message: testMessage,
          otp: '987654',
          purpose: 'GATEWAY_TEST_DISPATCH',
        }),
      });

      const data = await res.json();
      setTestResult(data);
      fetchLogs();
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-4 flex justify-center items-start sm:items-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-2xl w-full rounded-3xl border border-[#c3c6d4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto cursor-default"
      >
        {/* Header */}
        <div className="bg-[#003178] text-white p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#81f3e5] text-[#003178] rounded-xl flex items-center justify-center font-bold shadow-md">
              <span className="material-symbols-outlined text-[24px]">sms</span>
            </div>
            <div>
              <h2 className="text-[20px] font-extrabold tracking-tight">SMS Telecom Gateway Manager</h2>
              <p className="text-[12px] text-blue-100">Configure Twilio, Fast2SMS, MSG91 DLT or Webhook API for SMS OTPs</p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-2 mt-4 bg-white/10 p-1 rounded-xl text-[13px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'config' ? 'bg-white text-[#003178] shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              <span>Gateway Config</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tester')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'tester' ? 'bg-white text-[#003178] shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send Test SMS</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('logs');
                fetchLogs();
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'logs' ? 'bg-white text-[#003178] shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>SMS Dispatch Logs ({smsLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {saveSuccessMsg && (
            <div className="p-3 bg-[#81f3e5]/20 border border-[#81f3e5] rounded-xl text-[#006f66] text-[13px] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div>
                <label className="block text-[12px] font-extrabold text-[#434652] uppercase mb-2">
                  Select Active SMS Telephony Gateway
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'telecom_simulation',
                      title: 'MediQuote Free Instant Handset Gateway',
                      desc: 'Instant 100% free virtual phone SMS receiver popping up in browser',
                      badge: '100% Free Testing',
                    },
                    {
                      id: 'textbelt_free',
                      title: 'Textbelt Free Physical SMS API',
                      desc: 'Sends 1 free physical SMS per IP/day directly to mobile handset (No Key Required)',
                      badge: 'Free Real SMS',
                    },
                    {
                      id: 'twilio',
                      title: 'Twilio SMS Gateway',
                      desc: 'Global SMS dispatch via Twilio Programmable Messaging API',
                      badge: 'Paid Enterprise',
                    },
                    {
                      id: 'fast2sms',
                      title: 'Fast2SMS India Gateway',
                      desc: 'High-speed Indian mobile SMS route with OTP templates',
                      badge: 'Paid India',
                    },
                    {
                      id: 'msg91',
                      title: 'MSG91 DLT Gateway',
                      desc: 'Indian DLT compliant transactional OTP SMS service',
                      badge: 'Paid DLT',
                    },
                    {
                      id: 'custom_webhook',
                      title: 'Custom HTTP Webhook SMS Gateway',
                      desc: 'Forward SMS payloads to your custom API endpoint',
                      badge: 'Custom API',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProvider(item.id)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        provider === item.id
                          ? 'bg-[#e6f6ff] border-[#003178] shadow-sm'
                          : 'bg-white border-[#c3c6d4] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-[14px] text-[#003178]">{item.title}</span>
                        <span className="px-2 py-0.5 bg-[#003178] text-white text-[9px] font-extrabold rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#434652]">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Specific Inputs */}
              {provider === 'twilio' && (
                <div className="p-4 bg-[#f3faff] rounded-2xl border border-[#003178]/20 space-y-3">
                  <h4 className="font-bold text-[14px] text-[#003178] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                    <span>Twilio Account Credentials</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">Account SID</label>
                      <input
                        type="text"
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={twilioSid}
                        onChange={(e) => setTwilioSid(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">Auth Token</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••••••••••••••"
                        value={twilioToken}
                        onChange={(e) => setTwilioToken(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">Twilio Sender Phone Number</label>
                    <input
                      type="text"
                      placeholder="+18885550199"
                      value={twilioPhone}
                      onChange={(e) => setTwilioPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                    />
                  </div>
                </div>
              )}

              {provider === 'fast2sms' && (
                <div className="p-4 bg-[#f3faff] rounded-2xl border border-[#003178]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[14px] text-[#003178] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">key</span>
                      <span>Fast2SMS API Integration</span>
                    </h4>
                    {fast2smsConfigured ? (
                      <span className="px-2.5 py-1 bg-[#dcfce7] text-[#15803d] border border-[#86efac] text-[11px] font-extrabold rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>API Key Active</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-extrabold rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        <span>Key Required</span>
                      </span>
                    )}
                  </div>

                  {fast2smsMasked && (
                    <div className="p-2.5 bg-white border border-[#c3c6d4] rounded-xl flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#003178]">vpn_key</span>
                        <span className="text-[#434652] font-semibold">Active Key in System:</span>
                        <code className="font-mono-data font-bold text-[#003178] bg-[#e6f6ff] px-2 py-0.5 rounded">
                          {fast2smsMasked}
                        </code>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                        ✓ Ready to Send
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">
                      Update Fast2SMS API Key
                    </label>
                    <input
                      type="password"
                      placeholder="Paste new Fast2SMS Authorization API Key here"
                      value={fast2smsKey}
                      onChange={(e) => setFast2smsKey(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                    />
                    <p className="text-[11px] text-[#737783] mt-1">
                      Obtain your Authorization Key from fast2sms.com/dev/bulkV2 API settings.
                    </p>
                  </div>
                </div>
              )}

              {provider === 'msg91' && (
                <div className="p-4 bg-[#f3faff] rounded-2xl border border-[#003178]/20 space-y-3">
                  <h4 className="font-bold text-[14px] text-[#003178] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>MSG91 DLT API Configuration</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">MSG91 Auth Key</label>
                      <input
                        type="password"
                        placeholder="MSG91 Auth Key"
                        value={msg91Key}
                        onChange={(e) => setMsg91Key(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">Sender ID (DLT Approved)</label>
                      <input
                        type="text"
                        placeholder="e.g. MEDIQT"
                        value={msg91Sender}
                        onChange={(e) => setMsg91Sender(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                      />
                    </div>
                  </div>
                </div>
              )}

              {provider === 'custom_webhook' && (
                <div className="p-4 bg-[#f3faff] rounded-2xl border border-[#003178]/20 space-y-3">
                  <h4 className="font-bold text-[14px] text-[#003178] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">webhook</span>
                    <span>Custom HTTP SMS Webhook Endpoint</span>
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://your-api.com/sms/dispatch-webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#c3c6d4] rounded-xl text-[13px] font-mono-data"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#003178] hover:bg-[#002256] text-white font-extrabold text-[15px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Save Active Gateway Settings</span>
              </button>
            </form>
          )}

          {activeTab === 'tester' && (
            <form onSubmit={handleSendTestSms} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">Destination Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  placeholder="+919246195689"
                  className="w-full px-3.5 py-2.5 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[15px] font-mono-data font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#434652] uppercase mb-1">SMS Message Content</label>
                <textarea
                  rows={3}
                  required
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f3faff] border border-[#c3c6d4] rounded-xl text-[13px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 bg-[#006f66] hover:bg-[#004f48] text-white font-extrabold text-[15px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                    <span>Dispatching Test SMS...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>Send Test SMS Dispatch Now</span>
                  </>
                )}
              </button>

              {testResult && (
                <div className={`p-4 rounded-2xl border text-[13px] space-y-2 ${
                  testResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-[14px]">
                    <span className="material-symbols-outlined text-[20px]">
                      {testResult.success ? 'check_circle' : 'error'}
                    </span>
                    <span>{testResult.success ? 'SMS Dispatched Successfully' : 'SMS Dispatch Error'}</span>
                  </div>
                  <pre className="p-2.5 bg-black/5 rounded-xl font-mono text-[11px] overflow-x-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </form>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-[14px] text-[#003178]">Real-time SMS Dispatch Audit Trail</h4>
                <button
                  type="button"
                  onClick={fetchLogs}
                  className="px-3 py-1 bg-[#e6f6ff] text-[#003178] text-[12px] font-bold rounded-lg hover:bg-[#003178] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingLogs ? (
                <div className="p-8 text-center text-[13px] text-gray-500">Loading SMS logs...</div>
              ) : smsLogs.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-[13px]">
                  No SMS dispatches recorded yet. Try sending a test SMS or logging in via OTP.
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {smsLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-[#f8fafc] border border-[#c3c6d4] rounded-2xl space-y-1 text-[12px]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-data font-bold text-[#003178] text-[13px]">{log.mobileNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          log.status === 'SENT' || log.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.status} ({log.provider})
                        </span>
                      </div>
                      <p className="text-[#434652] italic">{log.smsText}</p>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                        <span>OTP Code: <strong className="font-mono font-bold text-[#006f66]">{log.otp}</strong></span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
