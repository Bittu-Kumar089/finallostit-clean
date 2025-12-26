
export enum ItemType {
  LOST = 'LOST',
  FOUND = 'FOUND'
}

export enum ItemCategory {
  ELECTRONICS = 'Electronics',
  CLOTHING = 'Clothing',
  DOCUMENTS = 'Documents',
  ACCESSORIES = 'Accessories',
  KEYS = 'Keys',
  OTHER = 'Other'
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl: string;
  status: 'OPEN' | 'CLAIMED' | 'RESOLVED';
  contactInfo?: string; 
  userId?: string; // ID of the user who posted this item
  claimedBy?: string; // ID of the user who claimed this item
}

export interface AIAnalysisResult {
  title: string;
  category: ItemCategory;
  description: string;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'HOME' | 'REPORT_LOST' | 'REPORT_FOUND' | 'GALLERY' | 'PROFILE' | 'EDIT_ITEM';