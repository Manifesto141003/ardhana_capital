import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { supabase } from '../lib/supabase';

export const Login = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('If this email is registered, a reset link will be sent shortly.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Login successful.');
  };

  return (
    <main className="min-h-screen bg-[#020617] px-4 pb-16 pt-28 text-white sm:px-6 sm:pt-36">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <p className="text-sm uppercase tracking-[0.3em] text-[#A67D32]">Ardhana Capital</p>
          <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight">
            Your portfolio, securely within reach.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
            Sign in to access your private performance dashboard and investment reports.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0D1320]/90 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>

          <div className="mt-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#A67D32]/15 text-[#D7AD55]">
              {isForgotPassword ? <Mail size={22} /> : <LockKeyhole size={22} />}
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {isForgotPassword ? 'Reset your password' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {isForgotPassword
                ? 'Enter your email and we will send you a secure reset link.'
                : 'Sign in to continue to your Ardhana Capital account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-white/80">Email address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 border-white/15 bg-white/[0.03] text-white placeholder:text-white/35"
                required
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="login-password" className="text-white/80">Password</Label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-[#D7AD55] transition hover:text-[#F0C978]"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 border-white/15 bg-white/[0.03] text-white placeholder:text-white/35"
                  required
                />
              </div>
            )}

            <Button type="submit" className="h-11 w-full bg-[#A67D32] font-semibold text-black hover:bg-[#BFAA6B]">
              {isForgotPassword ? 'Send reset link' : 'Login'}
            </Button>
          </form>

          {isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="mt-5 block w-full text-center text-sm text-white/60 transition hover:text-white"
            >
              Back to login
            </button>
          )}
        </section>
      </div>
    </main>
  );
};