
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Upload, AlertCircle, CheckCircle2, MapPin, Tag, Info, Calendar, Sparkles, Cloud } from 'lucide-react';
import { Item, ItemType, ItemCategory, User } from '../types';
import { analyzeItemImage, fileToGenerativePart } from '../services/geminiService';
import { uploadImageToS3 } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

interface ReportFormProps {
  type?: ItemType;
  initialData?: Item;
  user: User | null;
  onSubmit: (item: Item) => void;
  onCancel: () => void;
  onLoginRequest: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ type, initialData, user, onSubmit, onCancel, onLoginRequest }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.OTHER);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [aiConfidence, setAiConfidence] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category as ItemCategory);
      setLocation(initialData.location);
      setDate(initialData.date);
      setImagePreview(initialData.imageUrl);
    }
  }, [initialData]);

  const effectiveType = initialData ? initialData.type : (type || ItemType.LOST);
  const isLost = effectiveType === ItemType.LOST;
  const isEditing = !!initialData;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setAnalysisError('');
    setAiConfidence(false);

    setIsAnalyzing(true);
    try {
      const base64Data = await fileToGenerativePart(file);
      const analysis = await analyzeItemImage(base64Data, file.type);

      setTitle(analysis.title);
      setDescription(analysis.description);
      setCategory(analysis.category);
      setAiConfidence(true);
    } catch (err) {
      console.error(err);
      setAnalysisError('AI analysis unavailable. Please fill details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    setIsUploading(true);
    try {
      let finalImageUrl = imagePreview || 'https://picsum.photos/400/400';
      if (imageFile) {
        // Attempt cloud upload
        finalImageUrl = await uploadImageToS3(imageFile);
      }

      const newItem: Item = {
        id: initialData ? initialData.id : uuidv4(),
        type: effectiveType,
        title,
        description,
        category,
        location,
        date,
        imageUrl: finalImageUrl,
        status: initialData ? initialData.status : 'OPEN',
        userId: user?.id
      };

      onSubmit(newItem);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Cloud sync failed. The item was saved locally but images might not be viewable by others.");
    } finally {
      setIsUploading(false);
    }
  };

  const themeColor = isLost ? 'blue' : 'emerald';
  const themeText = isLost ? 'text-blue-600' : 'text-emerald-600';
  const themeBg = isLost ? 'bg-blue-600' : 'bg-emerald-600';
  const themeBgLight = isLost ? 'bg-blue-50/50' : 'bg-emerald-50/50';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full glass rounded-[2.5rem] card-shadow p-10 text-center animate-reveal">
          <div className={`mx-auto w-20 h-20 ${themeBgLight} rounded-3xl flex items-center justify-center mb-6`}>
            <Info className={`w-10 h-10 ${themeText}`} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Join our verified community to report {isLost ? 'lost' : 'found'} items and track recovery status.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={onLoginRequest} className={`w-full py-4 ${themeBg} text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all`}>
              Sign In Now
            </button>
            <button onClick={onCancel} className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-all">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center animate-reveal">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            {isEditing ? 'Update Listing' : `Report ${isLost ? 'Lost' : 'Found'} Item`}
          </h2>
          <p className="text-gray-500 font-medium">
            Verified as <span className="text-gray-900 font-bold underline decoration-blue-200 decoration-4">{user.name}</span>
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] card-shadow overflow-hidden border border-gray-100 animate-reveal" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row">

            {/* Image Col */}
            <div className={`w-full lg:w-2/5 p-10 ${themeBgLight} border-r border-gray-50`}>
              <h3 className={`text-sm font-black uppercase tracking-widest ${themeText} mb-6 flex items-center`}>
                <Camera className="w-4 h-4 mr-2" />
                Visual Evidence
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 bg-white hover:border-${themeColor}-400 hover:shadow-xl cursor-pointer transition-all flex flex-col items-center justify-center p-6 group overflow-hidden focus-within:ring-4 focus-within:ring-blue-100`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm backdrop-blur-sm">
                      Change Photo
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-5 rounded-2xl ${themeBgLight} mb-4 group-hover:scale-110 transition-transform`}>
                      <Upload className={`h-8 w-8 ${themeText}`} />
                    </div>
                    <p className="text-sm font-bold text-gray-700 text-center">Drop your photo here</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">JPG or PNG allowed</p>
                  </>
                )}

                {(isAnalyzing || isUploading) && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-10 animate-reveal">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className={`h-12 w-12 animate-spin ${themeText} mb-4`} />
                        <p className={`text-xs font-black uppercase tracking-widest ${themeText}`}>AI Scanning...</p>
                      </>
                    ) : (
                      <>
                        <Cloud className={`h-12 w-12 animate-bounce ${themeText} mb-4`} />
                        <p className={`text-xs font-black uppercase tracking-widest ${themeText}`}>Cloud Uploading...</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

              {aiConfidence && (
                <div className="mt-8 bg-white/80 backdrop-blur-sm p-5 rounded-[1.5rem] border border-gray-100 shadow-sm animate-reveal">
                  <div className="flex items-center text-[11px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Smart Detect Active
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Gemini AI has analyzed your photo and pre-filled the details. Review them below!
                  </p>
                </div>
              )}
            </div>

            {/* Details Col */}
            <div className="w-full lg:w-3/5 p-10 space-y-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Item Attributes
              </h3>

              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lost Silver iPhone 13"
                    className="block w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner py-4 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ItemCategory)}
                        className="block w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner py-4 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none transition-all outline-none"
                      >
                        {Object.values(ItemCategory).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <Tag className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner py-4 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Found/Lost Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Main Quad, Library Level 3"
                      className="block w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner py-4 px-5 pl-12 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Visual Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe specific marks, serial numbers, or unique stickers..."
                    className="block w-full rounded-2xl border-gray-100 bg-gray-50/50 shadow-inner py-4 px-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex items-center justify-end gap-5">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || isUploading}
                  className={`px-10 py-4 rounded-[1.25rem] text-sm font-black uppercase tracking-widest text-white shadow-xl ${themeBg} hover:scale-105 transition-all focus:ring-4 focus:ring-${themeColor}-100 ${isAnalyzing || isUploading ? 'opacity-50' : ''}`}
                >
                  {isAnalyzing ? 'Analyzing...' : isUploading ? 'Syncing...' : (isEditing ? 'Save Update' : 'Publish Report')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
