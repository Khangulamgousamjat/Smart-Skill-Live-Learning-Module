import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { MailCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const OTPVerifyPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      toast.error('Email not provided');
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Please enter 6-digit OTP');

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', { email, otp: otpCode });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(loginSuccess(res.data.data));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await api.post('/auth/resend-otp', { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resend failed');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[20%] right-[20%] w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 text-center glare-hover">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <MailCheck className="h-8 w-8 text-emerald-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2 font-sora">Verify Your Email</h2>
          <p className="text-slate-400 text-sm mb-8">
            We've sent a 6-digit verification code to
            <br />
            <span className="text-white font-medium">{email}</span>
          </p>
          
          <form onSubmit={handleVerify} className="space-y-6 relative z-10">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((data, index) => {
                return (
                  <input
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-bold bg-slate-800 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-inner"
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-bold text-slate-900 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Verify Account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <p className="text-sm text-slate-400">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResend}
                disabled={resendLoading}
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 inline-flex items-center"
              >
                {resendLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
