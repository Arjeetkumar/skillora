
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'freelancer' | 'client';
  avatar: string;
  headline?: string;
  bio?: string;
  location?: string;
  hourlyRate?: string;
  skills?: string[];
}

export interface Job {
  id: string;
  clientId: string; // ID of the user who posted
  title: string;
  description: string;
  budget: string;
  type: 'Fixed Price' | 'Hourly';
  level: 'Entry Level' | 'Intermediate' | 'Expert';
  postedTime: string;
  tags: string[];
  clientRating: number;
  reviewCount: number;
  verified: boolean;
  proposalsCount: number;
  isNew?: boolean;
  status?: 'open' | 'closed';
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string; 
  freelancerAvatar: string; 
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  matchScore?: number; 
}

export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  freelancerId: string;
  freelancerName: string;
  amount: string;
  status: 'active' | 'completed';
  startDate: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
