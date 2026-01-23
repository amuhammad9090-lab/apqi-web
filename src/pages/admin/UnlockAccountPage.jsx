import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  ShieldCheck, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Search,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import PasswordToggle from '@/components/PasswordToggle';

const UnlockAccountPage = () => {
  const [targetEmail, setTargetEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, verifying, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { adminUser } = useAdminAuth();
  const { toast } = useToast();

  const handleUnlock = async (e) => {
    e.preventDefault();
    setStatus('verifying');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!targetEmail || !adminPassword) {
        throw new Error("All fields are required.");
      }

      // 1. Re-authenticate Current Admin
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: adminUser.email,
        password: adminPassword,
      });

      if (authError) {
        throw new Error("Admin verification failed. Incorrect password.");
      }

      setStatus('processing');

      // 2. Call Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('unlock-admin-account', {
        body: JSON.stringify({ email: targetEmail })
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to communicate with the server.");
      }

      if (data?.error) {
         throw new Error(data.error);
      }

      setStatus('success');
      setSuccessMessage(data.message || "Account unlocked successfully.");
      toast({
        title: "Account Unlocked",
        description: `Successfully removed restrictions for ${targetEmail}`,
        className: "bg-green-50 border-green-200 text-green-900",
      });
      
      // Reset sensitive fields
      setAdminPassword('');
      setTargetEmail('');

    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
      toast({
        title: "Operation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Unlock Account - Admin Console</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Recovery</h1>
          <p className="text-slate-500 mt-2">Unlock suspended or banned user accounts safely.</p>
        </div>
        <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center">
          <Unlock className="w-6 h-6 text-sky-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-700">Unlock Credentials</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleUnlock} className="space-y-6">
                
                {/* Status Messages */}
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-sm text-red-800 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Unlock Failed</span>
                      {errorMessage}
                    </div>
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Success</span>
                      {successMessage}
                    </div>
                  </div>
                )}

                {/* Target Account Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Locked Account Email</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={targetEmail}
                      onChange={(e) => setTargetEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                      disabled={status === 'processing' || status === 'verifying'}
                    />
                  </div>
                  <p className="text-xs text-slate-500">Enter the email address of the account that needs to be unlocked.</p>
                </div>

                <div className="border-t border-slate-100 my-4 pt-4">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Admin Verification
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Your Password</label>
                    <PasswordToggle
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Verify your identity"
                      disabled={status === 'processing' || status === 'verifying'}
                    />
                    <p className="text-xs text-slate-500">For security reasons, please re-enter your admin password to confirm this action.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                    disabled={status === 'processing' || status === 'verifying' || !targetEmail || !adminPassword}
                  >
                    {status === 'verifying' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying Admin...
                      </>
                    ) : status === 'processing' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Unlocking Account...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock Account
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-sky-50 rounded-xl p-6 border border-sky-100">
            <h3 className="font-semibold text-sky-900 mb-2">Security Note</h3>
            <p className="text-sm text-sky-800 mb-4">
              Unlocking an account clears the "Banned Until" timestamp and resets login failure counters. 
            </p>
            <ul className="text-sm text-sky-700 space-y-2 list-disc pl-4">
              <li>This action is logged for audit purposes.</li>
              <li>Only perform this for verified users.</li>
              <li>If the account was locked due to suspicious activity, recommend a password reset.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Common Lock Reasons</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-600">
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold h-fit mt-0.5">3+</span>
                <span>Too many failed login attempts within a short period.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-600">
                <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-xs font-bold h-fit mt-0.5">Admin</span>
                <span>Manual suspension by an administrator.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockAccountPage;