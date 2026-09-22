import React, { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Check, X, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CVContactInfo } from '../types/cv';

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: CVContactInfo;
  showPhoto?: boolean;
  onSave: (updated: CVContactInfo, showPhoto?: boolean) => void;
}

export const QuickContactModal: React.FC<QuickContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  showPhoto = true,
  onSave
}) => {
  const [formData, setFormData] = useState<CVContactInfo>({
    fullName: contact.fullName || '',
    email: contact.email || '',
    phone: contact.phone || '',
    location: contact.location || '',
    photoUrl: contact.photoUrl || '',
    linkedin: contact.linkedin || '',
    github: contact.github || '',
    portfolio: contact.portfolio || ''
  });
  const [includePhoto, setIncludePhoto] = useState(showPhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
        setIncludePhoto(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, includePhoto);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Your True Personal Details</h3>
              <p className="text-[11px] text-slate-400">
                Exact name, contact info & optional professional photo for your CV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Optional Profile Photo Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Profile Photo (Optional)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={includePhoto}
                  onChange={(e) => setIncludePhoto(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 focus:outline-hidden"
                />
                <span>Show on CV</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0 flex items-center justify-center shadow-inner">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Candidate portrait"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-500" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{formData.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>

                  {formData.photoUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  PNG, JPG or WebP (max 5MB). Photo is strictly optional — ATS layouts will automatically adapt without it.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                required
                placeholder="e.g. Hafsa Shamim"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. hafsashamim07@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                City / Country (Location)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Lahore, Pakistan or London, UK"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                LinkedIn (Optional)
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="linkedin.com/in/username"
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Portfolio / GitHub (Optional)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. github.com/username or yoursite.com"
                value={formData.portfolio || formData.github || ''}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to CV</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

