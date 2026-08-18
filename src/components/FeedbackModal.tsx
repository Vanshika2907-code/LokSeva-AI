import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Complaint, LanguageCode } from '../types';
import { submitFeedbackAPI } from '../utils/aiService';
import { t, locNum, localizeDigitsInString, locDepartment } from '../utils/localization';

interface FeedbackModalProps {
  complaint: Complaint | null;
  currentLanguage?: LanguageCode;
  onClose: () => void;
  onFeedbackSubmitted: (updatedComplaint: Complaint) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  complaint,
  currentLanguage = 'en',
  onClose,
  onFeedbackSubmitted,
}) => {
  if (!complaint) return null;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [speedRating, setSpeedRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await submitFeedbackAPI(complaint.id, {
        rating,
        comment: comment.trim() || 'Prompt and satisfactory resolution by municipal team.',
        aspects: {
          speed: speedRating,
          quality: qualityRating,
          communication: 5,
        },
      });

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onFeedbackSubmitted(updated);
      onClose();
    } catch (err) {
      console.error('Feedback submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0b2545] font-serif">
                {t('rateResolution', currentLanguage)}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                #{localizeDigitsInString(complaint.complaintNumber, currentLanguage)} • {locDepartment(complaint.department, currentLanguage)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          
          {/* Star Rating Selector */}
          <div className="text-center space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {t('rateResolution', currentLanguage)}
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-700">
              {locNum(rating, currentLanguage)} / {locNum(5, currentLanguage)} Stars
            </div>
          </div>

          {/* Granular Ratings */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-slate-600 block text-[11px] font-bold">Resolution Speed</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSpeedRating(val)}
                    className={`w-6 h-6 rounded text-center text-xs font-bold cursor-pointer transition-colors ${
                      speedRating >= val ? 'bg-[#0b2545] text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {locNum(val, currentLanguage)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-600 block text-[11px] font-bold">Work Quality</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQualityRating(val)}
                    className={`w-6 h-6 rounded text-center text-xs font-bold cursor-pointer transition-colors ${
                      qualityRating >= val ? 'bg-[#0b2545] text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {locNum(val, currentLanguage)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Citizen Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              {t('enterDescription', currentLanguage)}:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comments or feedback for the field engineer..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              {t('cancel', currentLanguage)}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <span>{t('saving', currentLanguage)}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('saveChanges', currentLanguage)}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
