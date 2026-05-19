
'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/lib/withAuth';
import { useEffect, useState } from 'react';

type StatusState = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

const UserSettings = () => {
  const { user, updatePassword, updateProfile } = useAuth();
  const [status, setStatus] = useState<StatusState>(null);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    setProfileName(user?.name ?? '');
    setProfileEmail(user?.email ?? '');
  }, [user]);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!profileName.trim() || !profileEmail.trim()) {
      setStatus({ type: 'error', message: 'Name and email are required.' });
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateProfile({ name: profileName.trim(), email: profileEmail.trim() });
      setStatus({ type: 'success', message: res.message });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await updatePassword({ currentPassword, newPassword });
      setStatus({ type: 'success', message: res.message });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update password.',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">User settings</h1>
        <p className="text-gray-500 font-medium">
          Keep your profile up to date and secure your account.
        </p>
      </div>

      {status && (
        <div
          className={`mb-8 rounded-2xl border px-5 py-4 text-sm font-semibold ${
            status.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-blue-200 bg-blue-50 text-blue-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update the name and email connected to your account.
            </p>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <Input
              label="Full name"
              placeholder="Enter your full name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="primary" isLoading={isSavingProfile}>
                {isSavingProfile ? 'Saving...' : 'Save profile'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setProfileName(user?.name ?? '');
                  setProfileEmail(user?.email ?? '');
                  setStatus(null);
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Password</h2>
            <p className="text-sm text-gray-500 mt-1">
              Use a strong password with at least 6 characters.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <Input
              label="Current password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="New password"
                type="password"
                placeholder="Create a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" isLoading={isSavingPassword}>
              {isSavingPassword ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default withAuth(UserSettings);