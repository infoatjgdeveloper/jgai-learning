import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebase';
import { useAuth } from '../AuthContext';
import { OperationType } from '../types';
import { User, Mail, GraduationCap, Briefcase, Heart, Save } from 'lucide-react';
import { motion } from 'motion/react';

import { seedData } from '../seed';

export function Profile() {
  const { profile, logout, user } = useAuth();
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '');
  const [interests, setInterests] = useState(profile?.interests?.join(', ') || '');
  const [saving, setSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase() === 'gajjarjay79@gmail.com';

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedData(user);
      alert('Seeding attempted. Check catalog for courses.');
    } catch (error) {
      console.error(error);
      alert('Seeding failed.');
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setSkills(profile.skills?.join(', ') || '');
      setInterests(profile.interests?.join(', ') || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        bio,
        skills: skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        interests: interests.split(',').map(i => i.trim()).filter(i => i !== '')
      });
      alert('Profile updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${profile.uid}`);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.displayName}`} alt={profile.displayName} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold italic">{profile.displayName}</h1>
          <div className="flex items-center gap-4 text-fog">
            <span className="flex items-center gap-1"><Mail size={16} /> {profile.email}</span>
            <span className="flex items-center gap-1 uppercase tracking-widest text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">{profile.role}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="card space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-fog flex items-center gap-2">
              <User size={20} /> About Me
            </h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full h-40 p-4 bg-panel-2 border border-edge rounded-2xl focus:ring-2 focus:ring-olive-accent outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-fog flex items-center gap-2">
                <Briefcase size={20} /> Skills
              </h2>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, Design..."
                className="w-full p-4 bg-panel-2 border border-edge rounded-2xl focus:ring-2 focus:ring-olive-accent outline-none transition-all"
              />
              <p className="text-[10px] text-fog uppercase font-bold">Separate with commas</p>
            </div>
            <div className="card space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-widest text-fog flex items-center gap-2">
                <Heart size={20} /> Interests
              </h2>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="AI, History, Music..."
                className="w-full p-4 bg-panel-2 border border-edge rounded-2xl focus:ring-2 focus:ring-olive-accent outline-none transition-all"
              />
              <p className="text-[10px] text-fog uppercase font-bold">Separate with commas</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="olive-button w-full py-4 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Profile Details'}
          </button>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-fog">Institutional Info</h2>
          <div className="card space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-jgai/10 text-jgai-bright rounded-full flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-xs text-fog uppercase font-bold">University ID</p>
                <p className="font-bold">{profile.universityId}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 text-fog rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-fog uppercase font-bold">Joined</p>
                <p className="font-bold">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-edge space-y-4">
            {isAdmin && (
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full p-4 bg-jgai text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSeeding ? 'Seeding...' : 'Seed Sample Data'}
              </button>
            )}
            <button
              onClick={logout}
              className="w-full p-4 bg-red-50 text-red-600 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
