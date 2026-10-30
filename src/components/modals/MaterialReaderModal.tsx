import React from 'react';
import { StudyMaterial } from '../../types';
import { 
  X, 
  Share2, 
  ExternalLink, 
  Download, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Clock, 
  User, 
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

interface MaterialReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: StudyMaterial | null;
}

// Course badge color helper matching MaterialsPage.tsx
const COURSE_COLORS: Record<string, { main: string; light: string; border: string }> = {
  Anatomy: { main: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-200 dark:border-blue-800' },
  Physiology: { main: 'text-emerald-600', light: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-200 dark:border-emerald-800' },
  'Rad Tech': { main: 'text-purple-600', light: 'bg-purple-50 dark:bg-purple-950/50', border: 'border-purple-200 dark:border-purple-800' },
  'Rad Equipment': { main: 'text-rose-600', light: 'bg-rose-50 dark:bg-rose-950/50', border: 'border-rose-200 dark:border-rose-800' },
  Pathology: { main: 'text-red-600', light: 'bg-red-50 dark:bg-red-950/50', border: 'border-red-200 dark:border-red-800' },
  CT: { main: 'text-cyan-600', light: 'bg-cyan-50 dark:bg-cyan-950/50', border: 'border-cyan-200 dark:border-cyan-800' },
  MRI: { main: 'text-amber-600', light: 'bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-200 dark:border-amber-800' },
  USS: { main: 'text-teal-600', light: 'bg-teal-50 dark:bg-teal-950/50', border: 'border-teal-200 dark:border-teal-800' },
  Projects: { main: 'text-indigo-600', light: 'bg-indigo-50 dark:bg-indigo-950/50', border: 'border-indigo-200 dark:border-indigo-800' },
  'Professional Exams PQ': { main: 'text-slate-600', light: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
  Others: { main: 'text-pink-600', light: 'bg-pink-50 dark:bg-pink-950/50', border: 'border-pink-200 dark:border-pink-800' },
  All: { main: 'text-[#002147] dark:text-[#38BDF8]', light: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
};

export const MaterialReaderModal: React.FC<MaterialReaderModalProps> = ({
  isOpen,
  onClose,
  material,
}) => {
  if (!isOpen || !material) return null;

  const config = COURSE_COLORS[material.course] || COURSE_COLORS.All;
  const isVideo = material.type === 'video' || material.link?.includes('youtube.com') || material.link?.includes('youtu.be');
  const isLink = material.type === 'link';
  const isDocument = !isVideo && !isLink;

  // Extract YouTube ID if applicable
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('/shorts/')) {
        const parts = url.split('/shorts/');
        const id = parts[1]?.split(/[?&#]/)[0];
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      }
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      return url;
    } catch {
      return url;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${material.title} | StudiRad Material`,
        text: `Check out this radiography study resource on ${material.course}!`,
        url: material.link || window.location.href,
      }).catch(() => {});
    } else {
      if (material.link) {
        navigator.clipboard.writeText(material.link);
      }
    }
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'Recent update';
    if (typeof dateVal === 'string') return dateVal;
    if (dateVal.toDate) {
      return dateVal.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn text-slate-900 dark:text-slate-100 select-none">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#121824] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden text-left animate-slideUp border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-[#121824]">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${config.light} ${config.main} border ${config.border}`}>
              {material.course}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
              {isVideo ? 'Video Lecture' : isLink ? 'Clinical Link' : 'Study Document'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              title="Share Material"
              aria-label="Share Material"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              aria-label="Close"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">
          
          {/* Main Player or Reader Embed */}
          {isVideo ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <iframe
                src={getYouTubeEmbedUrl(material.link)}
                title={material.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : isDocument && material.link?.toLowerCase().endsWith('.pdf') ? (
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-inner flex flex-col items-center justify-center text-center p-6">
              <FileText className="w-16 h-16 text-[#002147] dark:text-[#38BDF8] mb-3" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white max-w-md">
                PDF Clinical Document Ready
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Access the official high-resolution document directly in your browser or download for offline rounds.
              </p>
              <a
                href={material.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#002147] hover:bg-[#001733] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Open / Download PDF</span>
              </a>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${config.light} ${config.main}`}>
                  {isLink ? <LinkIcon className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isLink ? 'External Radiography Resource' : 'Radiography Study Guide'}
                  </h4>
                  <span className="text-xs text-slate-400">Verified Academic Source</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {material.description || `Curated study material for radiographers focusing on ${material.course}. Published to assist students and imaging professionals in mastering core clinical concepts.`}
              </p>
            </div>
          )}

          {/* Title & Metadata Strip */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {material.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-slate-400" />
                <span>Uploaded by <strong className="text-slate-700 dark:text-slate-200">{material.uploader || 'StudiRad Faculty'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{formatDate(material.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Clinical Highlights / Focus Points */}
          <div className="p-4 rounded-2xl bg-[#002147]/5 dark:bg-[#161F30] border border-[#002147]/15 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#002147] dark:text-[#38BDF8] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FF7F32]" />
              <span>Study Notes & Clinical Integration</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Reviewed and validated by the StudiRad Academic Board</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Aligned with professional radiography licensure examination standards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          {material.link && (
            <a
              href={material.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-5 rounded-xl bg-[#002147] hover:bg-[#001733] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              {isVideo ? (
                <>
                  <Video className="w-4 h-4 text-[#FF7F32]" />
                  <span>Open Video in YouTube</span>
                </>
              ) : isLink ? (
                <>
                  <ExternalLink className="w-4 h-4 text-[#FF7F32]" />
                  <span>Visit External Link</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#FF7F32]" />
                  <span>Open / Download File</span>
                </>
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
