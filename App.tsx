import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ReportForm from './components/ReportForm';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import { ViewState, Item, ItemType, ItemCategory, User } from './types';
import { checkAwsConnection } from './services/aws-exports';
import { getItems, createItem, deleteItem, claimItem, API_BASE_URL, setAuthTokenProvider } from './services/api';
import { Loader2, Cloud, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from 'react-oidc-context';

// Fallback Mock Data (Used if API is down or unconnected)
const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    type: ItemType.LOST,
    title: 'Silver Macbook Pro 14"',
    description: 'Lost in the library study room 3B. Has a distinct "NASA" sticker on the lid. Slightly scratched on the bottom right corner.',
    category: ItemCategory.ELECTRONICS,
    location: 'Central Library',
    date: '2023-10-25',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    status: 'OPEN',
    userId: 'user-mock-1'
  },
  {
    id: '2',
    type: ItemType.FOUND,
    title: 'Blue Water Bottle',
    description: 'Found on the bench near the main park entrance. 32oz size, has a few dents near the base. Sticker on bottom.',
    category: ItemCategory.OTHER,
    location: 'City Park Entrance',
    date: '2023-10-26',
    imageUrl: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&q=80&w=800',
    status: 'OPEN',
    userId: 'user-mock-2'
  },
  {
    id: '3',
    type: ItemType.LOST,
    title: 'Brown Leather Wallet',
    description: 'Contains ID card and driving license. Reward offered! It is a vintage leather wallet.',
    category: ItemCategory.ACCESSORIES,
    location: 'Student Center Cafeteria',
    date: '2023-10-24',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&q=80&w=800',
    status: 'OPEN',
    userId: 'user-mock-1'
  },
  {
    id: '4',
    type: ItemType.FOUND,
    title: 'Car Keys (Toyota)',
    description: 'Found these keys on the 3rd floor hallway. Has a red keychain attached.',
    category: ItemCategory.KEYS,
    location: 'Science Building',
    date: '2023-10-27',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    status: 'OPEN',
    userId: 'user-mock-3'
  },
  {
    id: '5',
    type: ItemType.FOUND,
    title: 'Wireless Headphones',
    description: 'Black over-ear headphones found in the gym locker room. Sony branding.',
    category: ItemCategory.ELECTRONICS,
    location: 'Campus Gym',
    date: '2023-10-28',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    status: 'OPEN',
    userId: 'user-mock-4'
  }
];

const App: React.FC = () => {
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [items, setItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
 
  // AWS Connection State (Simulation)
  const [isConnecting, setIsConnecting] = useState(true);

  // Handle Cognito callback if code is in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
   
    if (error) {
      console.error('❌ Cognito callback error:', error);
      const errorDescription = urlParams.get('error_description');
      console.error('Error description:', errorDescription);
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code) {
      console.log('✅ Received authorization code from Cognito');
      // The OIDC library should handle this automatically
      // Force a check after a short delay to ensure user is loaded
      setTimeout(() => {
        if (auth.isAuthenticated && auth.user) {
          console.log('✅ User authenticated successfully');
        } else {
          console.log('⏳ Waiting for OIDC to process callback...');
        }
      }, 1000);
    }
  }, [auth]);

  // Wire Cognito tokens into API calls and set local user profile
  useEffect(() => {
    console.log('🔐 Auth state changed:', {
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      hasUser: !!auth.user,
      userProfile: auth.user?.profile,
    });

    setAuthTokenProvider(() => auth.user?.id_token || auth.user?.access_token || null);

    if (auth.isAuthenticated && auth.user?.profile) {
      const profile = auth.user.profile as Record<string, string>;
      console.log('✅ Setting user from profile:', profile);
      const userData = {
        id: profile.sub || profile.email || 'unknown-user',
        email: profile.email || profile['cognito:username'] || 'unknown@example.com',
        name: profile.name || profile.email || profile['cognito:username'] || 'Cognito User',
      };
      console.log('👤 User data:', userData);
      setUser(userData);
    } else {
      console.log('❌ No authenticated user');
      setUser(null);
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user]);

  // Initial App Load
  useEffect(() => {
    const initApp = async () => {
      // 1. Simulate Cloud Connection
      await checkAwsConnection();
      setIsConnecting(false);

      // 2. Fetch Data from Real Backend (or fall back to mock)
      fetchData();
    };
    initApp();
  }, []);

  const fetchData = async () => {
    setIsLoadingItems(true);
    setBackendError(null);
    try {
      // Attempt to fetch from AWS
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    } catch (error: any) {
      console.log("Using Demo Data (Backend Unreachable)");
      setItems(MOCK_ITEMS);
      setBackendError(error.message || "Unknown Connection Error");
    } finally {
      setIsLoadingItems(false);
    }
  };

  const handleAddItem = async (newItem: Item) => {
    try {
      // Optimistic Update (Immediate UI feedback)
      setItems(prev => [newItem, ...prev]);
      setCurrentView('GALLERY');
     
      // Attempt Real Backend Call
      try {
        await createItem(newItem);
        // If successful, data is persisted.
      } catch (e: any) {
        console.error("Cloud save failed", e);
        // Important: Alert the user that the save failed!
        alert(`⚠️ Warning: Could not save to Cloud Database.\n\nError: ${e.message}\n\nIf you are on an AWS Student Account, ensure your Lambda uses 'LabRole' instead of the default role.`);
      }
     
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const handleUpdateItem = (updatedItem: Item) => {
    // For now, we update local state. In a full app, we'd PUT to the API.
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
    setCurrentView('PROFILE');
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
       // Optimistic Delete
       setItems(prev => prev.filter(item => item.id !== itemId));
       
       // Real Backend Call
       deleteItem(itemId).catch(e => console.warn("Backend sync failed (Demo Mode)", e));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  const handleClaimItem = async (itemToClaim: Item) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // Optimistic Update: Set status to CLAIMED and assign claimedBy
      setItems(prev => prev.map(item =>
        item.id === itemToClaim.id ? { ...item, status: 'CLAIMED', claimedBy: user.id } : item
      ));

      // Real Backend Call
      await claimItem(itemToClaim.id);
    } catch (error) {
      console.error("Failed to claim item", error);
      // Revert if failed (optional, but good practice)
      setItems(prev => prev.map(item =>
        item.id === itemToClaim.id ? { ...item, status: 'OPEN', claimedBy: undefined } : item
      ));
      throw error;
    }
  };

  // Called when the Owner marks the item as returned/resolved
  const handleResolveItem = async (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: 'RESOLVED' } : item
    ));
    // In a real app, you would send an API call here: await resolveItem(itemId);
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setCurrentView('EDIT_ITEM');
  };

  const handleLogout = () => {
    auth.signoutRedirect();
    setCurrentView('HOME');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return <Hero onNavigate={setCurrentView} />;
      case 'GALLERY':
        return (
          <Gallery
            items={items}
            user={user}
            onDeleteItem={handleDeleteItem}
            onClaimItem={handleClaimItem}
            onLoginRequest={() => setIsAuthModalOpen(true)}
          />
        );
      case 'REPORT_LOST':
        return (
          <ReportForm
            type={ItemType.LOST}
            user={user}
            onSubmit={handleAddItem}
            onCancel={() => setCurrentView('HOME')}
            onLoginRequest={() => setIsAuthModalOpen(true)}
          />
        );
      case 'REPORT_FOUND':
        return (
          <ReportForm
            type={ItemType.FOUND}
            user={user}
            onSubmit={handleAddItem}
            onCancel={() => setCurrentView('HOME')}
            onLoginRequest={() => setIsAuthModalOpen(true)}
          />
        );
      case 'PROFILE':
        if (!user) {
          setCurrentView('HOME');
          return null;
        }
        return (
          <UserProfile
            user={user}
            items={items}
            onEdit={handleEditClick}
            onDelete={handleDeleteItem}
            onResolve={handleResolveItem}
            onNavigateHome={() => setCurrentView('HOME')}
          />
        );
      case 'EDIT_ITEM':
        if (!user || !editingItem) {
          setCurrentView('HOME');
          return null;
        }
        return (
          <ReportForm
            initialData={editingItem}
            user={user}
            onSubmit={handleUpdateItem}
            onCancel={() => setCurrentView('PROFILE')}
            onLoginRequest={() => setIsAuthModalOpen(true)}
          />
        );
      default:
        return <Hero onNavigate={setCurrentView} />;
    }
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Cloud className="h-16 w-16 text-blue-500 mb-6 relative z-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connecting to AWS Cloud</h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Initializing AWS Lambda (us-east-1)...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 relative">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
     
      <main className="flex-grow">
        {isLoadingItems && currentView === 'GALLERY' && items.length === 0 ? (
           <div className="flex justify-center items-center h-64">
             <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
           </div>
        ) : (
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ChatBot />

      <Footer />
    </div>
  );
};

export default App;
