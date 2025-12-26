
import React, { useState } from 'react';
import { Item, ItemCategory, ItemType, User } from '../types';
// Added Clock and User (as UserIcon) to the imports
import { Search, Filter, Calendar, MapPin, Tag, ArrowRight, Trash2, Database, ImageOff, ChevronDown, Check, X, SlidersHorizontal, Clock, User as UserIcon } from 'lucide-react';
import ItemModal from './ItemModal';

interface GalleryProps {
  items: Item[];
  user: User | null;
  onDeleteItem: (id: string) => void;
  onClaimItem: (item: Item) => Promise<void>;
  onLoginRequest: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, user, onDeleteItem, onClaimItem, onLoginRequest }) => {
  const [filterType, setFilterType] = useState<ItemType | 'ALL'>('ALL');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const toggleCategory = (cat: ItemCategory) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setFilterType('ALL');
    setSelectedCategories([]);
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
  };

  const hasActiveFilters = filterType !== 'ALL' || selectedCategories.length > 0 || dateRange.start || dateRange.end || searchTerm;

  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category as ItemCategory);
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (dateRange.start) matchesDate = matchesDate && item.date >= dateRange.start;
    if (dateRange.end) matchesDate = matchesDate && item.date <= dateRange.end;
    return matchesType && matchesCategory && matchesSearch && matchesDate;
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, itemId: string) => {
    e.currentTarget.src = `https://picsum.photos/seed/${itemId}/600/400`;
    e.currentTarget.onerror = null; 
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Backdrop for closing dropdowns */}
      {(showCategoryMenu || showDateMenu) && (
        <div 
          className="fixed inset-0 z-20 cursor-default" 
          onClick={() => { setShowCategoryMenu(false); setShowDateMenu(false); }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 animate-reveal">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Live Feed</h1>
              <p className="text-gray-500 font-medium text-lg">Real-time database of reported items in your community.</p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100">
               <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></div>
               <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">{filteredItems.length} Items Found</span>
            </div>
          </div>
        </div>

        {/* Glass Filter Bar */}
        <div className="sticky top-28 z-30 mb-12 animate-reveal" style={{ animationDelay: '0.1s' }}>
          <div className="glass rounded-[2rem] card-shadow p-5 transition-all">
            <div className="flex flex-col lg:flex-row gap-5">
              
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-medium"
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Controls */}
              <div className="flex flex-wrap gap-3 items-center">
                
                <div className="relative min-w-[150px]">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as ItemType | 'ALL')}
                    className="appearance-none w-full pl-5 pr-12 py-3.5 bg-white/50 border border-gray-100 rounded-2xl text-gray-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 cursor-pointer text-sm transition-all"
                  >
                    <option value="ALL">Everything</option>
                    <option value={ItemType.LOST}>Lost Reports</option>
                    <option value={ItemType.FOUND}>Found Items</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <button 
                  onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowDateMenu(false); }}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 text-sm font-bold transition-all ${
                    selectedCategories.length > 0 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white/50 border-gray-100 hover:bg-white text-gray-600'
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  Categories
                  <ChevronDown className={`h-3 w-3 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
                </button>
                
                <button 
                  onClick={() => { setShowDateMenu(!showDateMenu); setShowCategoryMenu(false); }}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 text-sm font-bold transition-all ${
                    dateRange.start || dateRange.end 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white/50 border-gray-100 hover:bg-white text-gray-600'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                </button>

                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                    title="Reset all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Menus */}
            {showCategoryMenu && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2 animate-reveal">
                {Object.values(ItemCategory).map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      selectedCategories.includes(cat) 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-[2rem] border border-gray-100 card-shadow hover-lift overflow-hidden cursor-pointer relative focus:outline-none focus:ring-4 focus:ring-blue-100 animate-reveal"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-50">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    onError={(e) => handleImageError(e, item.id)}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-xl backdrop-blur-md ${
                    item.type === ItemType.LOST ? 'bg-rose-500/90' : 'bg-emerald-500/90'
                  }`}>
                    {item.type}
                  </div>

                  <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-800 shadow-sm flex items-center">
                    {/* Fixed: Clock was missing from imports */}
                    <Clock className="h-3 w-3 mr-1.5 text-blue-600" />
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase tracking-wider">{item.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors leading-tight">{item.title}</h3>
                  <div className="flex items-center text-sm font-medium text-gray-400 mb-6">
                    <MapPin className="h-4 w-4 mr-1.5 text-rose-400" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <div className="pt-5 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="h-7 w-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        {/* Fixed: UserIcon (aliased from User) was missing from imports */}
                        <UserIcon className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                    <span className="text-blue-600 text-xs font-black flex items-center uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      View Details <ArrowRight className="h-4 w-4 ml-1.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 animate-reveal">
              <div className="bg-blue-50 p-6 rounded-[2rem] w-fit mx-auto mb-6">
                <Database className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Nothing found</h3>
              <p className="text-gray-500 font-medium mb-8">Try adjusting your filters or search keywords.</p>
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:scale-105 transition-all"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <ItemModal 
          item={selectedItem} 
          user={user}
          onClose={() => setSelectedItem(null)} 
          onClaim={onClaimItem}
          onLoginRequest={onLoginRequest}
        />
      )}
    </div>
  );
};

export default Gallery;
