
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { X, MapPin, Calendar, Tag, Shield, AlertTriangle, CheckCircle2, Loader2, ArrowRight, User as UserIcon } from 'lucide-react';
import { Item, ItemType, User } from '../types';

interface ItemModalProps {
  item: Item;
  user: User | null;
  onClose: () => void;
  onClaim: (item: Item) => Promise<void>;
  onLoginRequest: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, user, onClose, onClaim, onLoginRequest }) => {
  const [step, setStep] = useState<'DETAILS' | 'CONFIRM' | 'SUCCESS'>('DETAILS');
  const [isLoading, setIsLoading] = useState(false);

  const handleClaimClick = () => {
    if (!user) {
      onLoginRequest();
      return;
    }
    setStep('CONFIRM');
  };

  const handleConfirmClaim = async () => {
    setIsLoading(true);
    try {
      await onClaim(item);
      setStep('SUCCESS');
    } catch (error) {
      console.error("Claim failed", error);
      alert("Failed to process claim. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLost = item.type === ItemType.LOST;
  const themeColor = isLost ? 'blue' : 'emerald';

  return (
    <div 
      className="fixed inset-0 z-[100] overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
              aria-label="Close details"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-gray-100 relative min-h-[300px]">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                   <p className="text-sm font-medium opacity-90">{isLost ? 'Lost Item' : 'Found Item'}</p>
                   <p className="text-lg font-bold truncate pr-4">{item.title}</p>
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col justify-between">
                {/* --- VIEW: DETAILS --- */}
                {step === 'DETAILS' && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${isLost ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {item.type}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           item.status === 'RESOLVED' ? 'bg-purple-100 text-purple-800' :
                           item.status === 'CLAIMED' ? 'bg-amber-100 text-amber-800' : 
                           'bg-green-100 text-green-800'
                        }`}>
                          {item.status === 'RESOLVED' ? 'RETURNED' : item.status}
                        </span>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start text-sm text-gray-600">
                          <Tag className="h-4 w-4 mr-3 mt-0.5 text-gray-400" />
                          <div>
                            <span className="block text-xs text-gray-400">Category</span>
                            {item.category}
                          </div>
                        </div>
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-400" />
                          <div>
                            <span className="block text-xs text-gray-400">Location</span>
                            {item.location}
                          </div>
                        </div>
                        <div className="flex items-start text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-3 mt-0.5 text-gray-400" />
                          <div>
                            <span className="block text-xs text-gray-400">Date</span>
                            {item.date}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Description</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* QR Code Section */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs font-bold text-gray-900 mb-1">Item Verification ID</p>
                          <p className="text-xs font-mono text-gray-500">{item.id.slice(0, 12)}...</p>
                        </div>
                        <div className="bg-white p-1 rounded shadow-sm">
                           <QRCode value={JSON.stringify({ id: item.id, type: item.type })} size={48} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                       {item.status !== 'OPEN' ? (
                          <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg text-sm font-bold text-center cursor-not-allowed flex items-center justify-center gap-2">
                            <Shield className="h-4 w-4" />
                            {item.status === 'CLAIMED' ? 'Claim Pending Approval' : 'Item Resolved'}
                          </div>
                       ) : (
                         <button
                          className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${themeColor}-500 ${isLost ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                          onClick={handleClaimClick}
                         >
                           <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
                           {isLost ? 'I Found This!' : 'This Is Mine!'}
                         </button>
                       )}
                    </div>
                  </>
                )}

                {/* --- VIEW: CONFIRMATION --- */}
                {step === 'CONFIRM' && (
                  <div className="flex flex-col h-full animate-fade-in">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-6 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-bold">Safety Check</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Claim Request</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        You are about to initiate a claim for <strong>"{item.title}"</strong>.
                      </p>

                      <ul className="space-y-4 mb-8">
                        <li className="flex items-start text-sm text-gray-600">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                          <span>Your contact details (Email: <strong>{user?.email}</strong>) will be securely shared with the reporter.</span>
                        </li>
                        <li className="flex items-start text-sm text-gray-600">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                          <span>A verification log will be created in the AWS database.</span>
                        </li>
                        <li className="flex items-start text-sm text-gray-600">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                          <span>Meet in a public place (e.g., Campus Security Office) for the exchange.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => setStep('DETAILS')}
                        className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleConfirmClaim}
                        disabled={isLoading}
                        className={`flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center ${isLost ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Claim'}
                      </button>
                    </div>
                  </div>
                )}

                {/* --- VIEW: SUCCESS --- */}
                {step === 'SUCCESS' && (
                  <div className="flex flex-col h-full justify-center items-center text-center animate-fade-in py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Claim Initiated!</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                      We have notified the other party.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full mb-8 text-left">
                       <p className="text-xs font-bold text-gray-500 uppercase mb-2">Next Steps</p>
                       <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm">
                            <span className="block font-bold text-gray-900">Check Your Profile</span>
                            <span className="text-gray-500">Track the status of this claim in your user dashboard.</span>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={onClose}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      Close & Return to Gallery <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
