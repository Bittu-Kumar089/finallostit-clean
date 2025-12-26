
import React, { useState } from 'react';
import { User, Item, ItemType } from '../types';
import { Mail, Calendar, MapPin, Trash2, Edit2, PackageOpen, CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface UserProfileProps {
  user: User;
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
  onResolve: (itemId: string) => void;
  onNavigateHome: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, items, onEdit, onDelete, onResolve, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'CLAIMS'>('LISTINGS');

  // Items posted by the user
  const myListings = items.filter(item => item.userId === user.id);
  
  // Items claimed BY the user (Found by others, claimed by me)
  const myClaims = items.filter(item => item.claimedBy === user.id);

  const lostCount = myListings.filter(i => i.type === ItemType.LOST).length;
  const foundCount = myListings.filter(i => i.type === ItemType.FOUND).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start text-gray-500 mt-2 gap-4">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Member since 2023
                </span>
              </div>
            </div>
            <div className="flex gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lostCount}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Lost Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{foundCount}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Found Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
           <button 
             onClick={() => setActiveTab('LISTINGS')}
             className={`pb-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'LISTINGS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
           >
             <ArrowUpRight className="h-4 w-4" />
             My Listings
             <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{myListings.length}</span>
           </button>
           <button 
             onClick={() => setActiveTab('CLAIMS')}
             className={`pb-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'CLAIMS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
           >
             <ArrowDownLeft className="h-4 w-4" />
             My Claims
             <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{myClaims.length}</span>
           </button>
        </div>

        {/* CONTENT AREA */}
        
        {/* --- TAB: MY LISTINGS (Items I posted) --- */}
        {activeTab === 'LISTINGS' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Items You Reported</h2>
              <p className="text-gray-500 text-sm">Manage items you've posted to the gallery.</p>
            </div>

            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myListings.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      
                      {/* Status Badge Over Image */}
                      {item.status === 'CLAIMED' && (
                         <div className="absolute inset-0 bg-amber-500/80 backdrop-blur-sm flex items-center justify-center flex-col text-white p-4 text-center">
                            <AlertCircle className="h-8 w-8 mb-1" />
                            <span className="font-bold text-lg">Action Required</span>
                            <span className="text-xs opacity-90">Someone claimed this!</span>
                         </div>
                      )}
                      {item.status === 'RESOLVED' && (
                         <div className="absolute inset-0 bg-green-600/80 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                            <CheckCircle className="h-10 w-10 mb-2" />
                            <span className="font-bold">Returned</span>
                         </div>
                      )}

                      <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm z-10 ${
                        item.type === ItemType.LOST ? 'bg-red-500' : 'bg-emerald-500'
                      }`}>
                        {item.type}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      
                      {/* Action Area */}
                      <div className="mt-auto pt-4 border-t border-gray-50">
                        
                        {/* CASE 1: CLAIMED (Needs Approval) */}
                        {item.status === 'CLAIMED' ? (
                          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                             <p className="text-xs text-amber-800 font-semibold mb-2">Claim Pending</p>
                             <button 
                               onClick={() => onResolve(item.id)}
                               className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded transition-colors flex items-center justify-center"
                             >
                               <CheckCircle className="h-3 w-3 mr-1.5" />
                               Mark as Returned
                             </button>
                          </div>
                        ) : item.status === 'RESOLVED' ? (
                          <div className="flex justify-center py-2 text-green-600 text-xs font-bold items-center bg-green-50 rounded-lg border border-green-100">
                             <CheckCircle className="h-3 w-3 mr-1.5" />
                             Transaction Complete
                          </div>
                        ) : (
                          <div className="flex gap-2">
                             <button 
                               onClick={() => onEdit(item)}
                               className="flex-1 py-2 border border-gray-200 rounded text-gray-600 text-xs font-semibold hover:bg-gray-50"
                             >
                               Edit
                             </button>
                             <button 
                               onClick={() => {
                                 if (confirm('Are you sure you want to delete this item?')) onDelete(item.id);
                               }}
                               className="flex-1 py-2 border border-gray-200 rounded text-red-600 text-xs font-semibold hover:bg-red-50"
                             >
                               Delete
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No items reported" msg="Items you report will appear here." action={onNavigateHome} />
            )}
          </div>
        )}

        {/* --- TAB: MY CLAIMS (Items I found/lost and claimed) --- */}
        {activeTab === 'CLAIMS' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Active Claims</h2>
              <p className="text-gray-500 text-sm">Items you have requested to claim from others.</p>
            </div>

            {myClaims.length > 0 ? (
              <div className="space-y-4">
                {myClaims.map((item) => (
                   <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                      <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                      
                      <div className="flex-grow text-center md:text-left">
                         <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${
                              item.type === ItemType.LOST ? 'bg-red-500' : 'bg-emerald-500'
                            }`}>
                              {item.type}
                            </span>
                         </div>
                         <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                         <p className="text-xs text-gray-400 mt-1 flex items-center justify-center md:justify-start">
                           <MapPin className="h-3 w-3 mr-1" />
                           {item.location}
                         </p>
                      </div>

                      <div className="min-w-[200px] flex flex-col items-center">
                         {item.status === 'CLAIMED' ? (
                           <>
                             <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
                                <Clock className="h-3 w-3 mr-1.5" />
                                Pending Owner Approval
                             </div>
                             <p className="text-[10px] text-gray-400 text-center">
                               Wait for the owner to verify your claim.
                             </p>
                           </>
                         ) : (
                           <>
                              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold mb-2">
                                <CheckCircle className="h-3 w-3 mr-1.5" />
                                Claim Approved
                             </div>
                             <p className="text-[10px] text-gray-400 text-center">
                               This item has been marked as returned to you.
                             </p>
                           </>
                         )}
                      </div>
                   </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No active claims" msg="When you find an item in the gallery and click 'This is mine', it shows here." action={onNavigateHome} />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const EmptyState = ({ title, msg, action }: { title: string, msg: string, action: () => void }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
    <div className="bg-gray-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
      <PackageOpen className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-sm mx-auto mb-6">{msg}</p>
    <button 
      onClick={action}
      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Browse Gallery
    </button>
  </div>
);

export default UserProfile;
