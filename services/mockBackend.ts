
import { Job, ChatContact, Message, Proposal, User, Contract, Notification } from '../types';

// --- Database Configuration ---
const DB_KEYS = {
  JOBS: 'skillora_db_jobs',
  PROPOSALS: 'skillora_db_proposals',
  MESSAGES: 'skillora_db_messages',
  USER: 'skillora_db_user',
  CONTACTS: 'skillora_db_contacts',
  CONTRACTS: 'skillora_db_contracts',
  NOTIFICATIONS: 'skillora_db_notifications'
};

// --- Seed Data (Initial "Database" State) ---
const SEED_JOBS: Job[] = [
  {
    id: 'job_1',
    clientId: 'client_default',
    title: 'E-Commerce Website Redesign',
    description: 'We are looking for an experienced web designer to completely overhaul our Shopify store. The goal is to improve conversion rates and modernize the UI. Must have a strong portfolio in fashion e-commerce.',
    budget: 'Rs 2,500',
    type: 'Fixed Price',
    level: 'Expert',
    postedTime: '2 hours ago',
    tags: ['Shopify', 'UI/UX', 'Figma'],
    clientRating: 5.0,
    reviewCount: 12,
    verified: true,
    proposalsCount: 3,
    status: 'open'
  },
  {
    id: 'job_2',
    clientId: 'client_default',
    title: 'Python Script for Data Analysis',
    description: 'Need a Python developer to write a script that scrapes data from 3 specific websites and outputs it into a structured CSV. The script needs to run daily on a cron job.',
    budget: 'Rs 500/hr',
    type: 'Hourly',
    level: 'Intermediate',
    postedTime: '5 hours ago',
    tags: ['Python', 'Web Scraping', 'Data Mining'],
    clientRating: 4.8,
    reviewCount: 45,
    verified: true,
    proposalsCount: 8,
    status: 'open'
  },
  {
    id: 'job_3',
    clientId: 'client_default',
    title: 'Social Media Content Creator',
    description: 'Looking for a creative individual to design 10 Instagram posts for a new coffee brand. Assets will be provided. Great opportunity for someone building their portfolio.',
    budget: 'Rs 2,000',
    type: 'Fixed Price',
    level: 'Entry Level',
    postedTime: '1 day ago',
    tags: ['Canva', 'Instagram', 'Graphic Design'],
    clientRating: 0,
    reviewCount: 0,
    verified: false,
    proposalsCount: 1,
    status: 'open'
  }
];

const SEED_CONTACTS: ChatContact[] = [
  {
    id: 'c1',
    name: 'Arjeet Kumar',
    role: 'UI Designer',
    avatar: 'https://i.pravatar.cc/150?u=ella_pro',
    isOnline: true,
    lastMessage: 'Glad you liked it! I was thinking we could...',
    lastMessageTime: '10:05 AM',
    unreadCount: 0
  },
  {
    id: 'c2',
    name: 'Kashish Kumari',
    role: 'Client',
    avatar: 'https://i.pravatar.cc/150?u=david_dev',
    isOnline: false,
    lastMessage: 'Thanks for the update, I\'ll push the...',
    lastMessageTime: '2h ago',
    unreadCount: 0
  }
];

const SEED_MESSAGES: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1',
      senderId: 'c1',
      text: "Hi! I've just uploaded the updated wireframes for the dashboard. Let me know what you think about the new navigation layout.",
      timestamp: 'Yesterday 4:20 PM',
      isMe: false
    },
    {
      id: 'm2',
      senderId: 'me',
      text: "Thanks Arjeet! Looking at them right now. The sidebar changes look much cleaner.",
      timestamp: 'Yesterday 4:25 PM',
      isMe: true
    }
  ]
};

// --- Database Service ---
class DatabaseService {
    
    // Core Helpers
    private get<T>(key: string, defaultValue: T): T {
        const stored = localStorage.getItem(key);
        if (!stored) return defaultValue;
        try {
            return JSON.parse(stored);
        } catch {
            return defaultValue;
        }
    }

    private set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Authentication & User ---

    login(role: 'client' | 'freelancer', name: string): User {
        const existingUser = this.get<User | null>(DB_KEYS.USER, null);
        
        let user: User;
        if (existingUser && existingUser.role === role) {
            user = existingUser; // Return existing session
        } else {
            // Initialize new user session
            user = {
                id: role === 'client' ? 'client_current' : 'freelancer_current',
                name,
                email: `${name.toLowerCase().replace(/\s/g, '.')}@skillora.com`,
                role,
                avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
                headline: role === 'freelancer' ? 'Professional Freelancer' : 'Hiring Manager',
                bio: 'I am passionate about creating great work and collaborating with amazing people on Skillora.',
                location: 'Remote, India',
                hourlyRate: role === 'freelancer' ? 'Rs 1000/hr' : undefined,
                skills: role === 'freelancer' ? ['React', 'Design', 'Communication'] : []
            };
            this.set(DB_KEYS.USER, user);
            
            // Seed welcome notification
            this.addNotification({
                id: 'notif_welcome',
                text: `Welcome to Skillora, ${name}! Your account is ready.`,
                time: 'Just now',
                isRead: false,
                type: 'info'
            });
        }
        return user;
    }

    getCurrentUser(): User | null {
        return this.get<User | null>(DB_KEYS.USER, null);
    }

    async updateUser(updates: Partial<User>): Promise<User | null> {
        await this.delay(400); // Simulate network
        const currentUser = this.get<User | null>(DB_KEYS.USER, null);
        if (!currentUser) return null;

        const updatedUser = { ...currentUser, ...updates };
        this.set(DB_KEYS.USER, updatedUser);
        return updatedUser;
    }

    logout() {
        localStorage.removeItem(DB_KEYS.USER);
    }

    resetDatabase() {
        localStorage.clear();
        window.location.reload();
    }

    // --- Notifications ---

    async getNotifications(): Promise<Notification[]> {
        return this.get<Notification[]>(DB_KEYS.NOTIFICATIONS, []);
    }

    private addNotification(notification: Notification) {
        const notifs = this.get<Notification[]>(DB_KEYS.NOTIFICATIONS, []);
        this.set(DB_KEYS.NOTIFICATIONS, [notification, ...notifs]);
    }

    // --- Jobs ---

    async getJobs(query?: string): Promise<Job[]> {
        await this.delay(300);
        const jobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        if (!query) return jobs;
        
        const q = query.toLowerCase();
        return jobs.filter(j => 
            j.title.toLowerCase().includes(q) || 
            j.description.toLowerCase().includes(q) ||
            j.tags.some(t => t.toLowerCase().includes(q))
        );
    }

    async getJobById(jobId: string): Promise<Job | undefined> {
        await this.delay(200);
        const jobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        return jobs.find(j => j.id === jobId);
    }

    async getMyJobs(): Promise<Job[]> {
        await this.delay(300);
        const user = this.getCurrentUser();
        if (!user) return [];
        const allJobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        // For demo, if user is 'client_current', show jobs with that ID or 'client_default' to populate list
        return allJobs.filter(j => j.clientId === user.id || j.clientId === 'client_default');
    }

    async postJob(jobData: Partial<Job>): Promise<Job> {
        await this.delay(800);
        const user = this.getCurrentUser();
        const allJobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        
        const newJob: Job = {
            id: 'job_' + Math.random().toString(36).substr(2, 9),
            clientId: user?.id || 'unknown',
            title: jobData.title || 'Untitled Job',
            description: jobData.description || '',
            budget: 'Rs ' + (Math.floor(Math.random() * 50) * 100 + 500),
            type: 'Fixed Price',
            level: 'Intermediate',
            postedTime: 'Just now',
            tags: ['New', 'Hiring'],
            clientRating: 5.0,
            reviewCount: 0,
            verified: true,
            proposalsCount: 0,
            isNew: true,
            status: 'open'
        };

        this.set(DB_KEYS.JOBS, [newJob, ...allJobs]);
        
        this.addNotification({
            id: Math.random().toString(),
            text: `Your job "${newJob.title}" has been posted successfully.`,
            time: 'Just now',
            isRead: false,
            type: 'success'
        });

        return newJob;
    }

    // --- Proposals ---

    async submitProposal(jobId: string, coverLetter: string, matchScore?: number): Promise<boolean> {
        await this.delay(800);
        const user = this.getCurrentUser();
        const allProposals = this.get<Proposal[]>(DB_KEYS.PROPOSALS, []);
        
        // Check duplication
        if (allProposals.some(p => p.jobId === jobId && p.freelancerId === user?.id)) {
            return false;
        }

        const newProposal: Proposal = {
            id: 'prop_' + Math.random().toString(36).substr(2, 9),
            jobId,
            freelancerId: user?.id || 'unknown',
            freelancerName: user?.name || 'Unknown Freelancer',
            freelancerAvatar: user?.avatar || 'https://i.pravatar.cc/150',
            coverLetter,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            matchScore: matchScore || Math.floor(Math.random() * 15) + 85
        };

        this.set(DB_KEYS.PROPOSALS, [...allProposals, newProposal]);

        // Increment Job Proposal Count
        const allJobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        const updatedJobs = allJobs.map(j => 
            j.id === jobId ? { ...j, proposalsCount: j.proposalsCount + 1 } : j
        );
        this.set(DB_KEYS.JOBS, updatedJobs);

        this.addNotification({
            id: Math.random().toString(),
            text: `Application sent for "${updatedJobs.find(j => j.id === jobId)?.title}"`,
            time: 'Just now',
            isRead: false,
            type: 'success'
        });

        return true;
    }

    async getProposalsForJob(jobId: string): Promise<Proposal[]> {
        await this.delay(300);
        const allProposals = this.get<Proposal[]>(DB_KEYS.PROPOSALS, []);
        return allProposals.filter(p => p.jobId === jobId);
    }

    async getMyProposals(): Promise<{proposal: Proposal, job: Job, contract?: Contract}[]> {
        await this.delay(300);
        const user = this.getCurrentUser();
        if (!user) return [];
        
        const allProposals = this.get<Proposal[]>(DB_KEYS.PROPOSALS, []);
        const myProposals = allProposals.filter(p => p.freelancerId === user.id);
        
        const allJobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        const allContracts = this.get<Contract[]>(DB_KEYS.CONTRACTS, []);

        return myProposals.map(p => {
            const job = allJobs.find(j => j.id === p.jobId);
            const contract = allContracts.find(c => c.jobId === p.jobId);
            return { proposal: p, job: job!, contract };
        }).filter(item => item.job !== undefined);
    }

    // --- Contracts ---

    async hireFreelancer(jobId: string, freelancerName: string, amount: string): Promise<string> {
        await this.delay(1000);
        const user = this.getCurrentUser();
        
        // Close Job
        const allJobs = this.get<Job[]>(DB_KEYS.JOBS, SEED_JOBS);
        const job = allJobs.find(j => j.id === jobId);
        const updatedJobs = allJobs.map(j => j.id === jobId ? { ...j, status: 'closed' as const } : j);
        this.set(DB_KEYS.JOBS, updatedJobs);

        // Create Contract
        const allContracts = this.get<Contract[]>(DB_KEYS.CONTRACTS, []);
        const newContract: Contract = {
            id: 'contract_' + Math.random().toString(36).substr(2, 9),
            jobId,
            jobTitle: job?.title || 'Project',
            clientId: user?.id || 'unknown',
            freelancerId: 'mock_freelancer_id',
            freelancerName,
            amount,
            status: 'active',
            startDate: new Date().toLocaleDateString()
        };
        this.set(DB_KEYS.CONTRACTS, [newContract, ...allContracts]);

        // Update Proposal Status
        const allProposals = this.get<Proposal[]>(DB_KEYS.PROPOSALS, []);
        // Find proposal for this freelancer on this job (simplified matching by name for mock)
        const updatedProposals = allProposals.map(p => 
            p.jobId === jobId && p.freelancerName === freelancerName 
            ? { ...p, status: 'accepted' as const } 
            : p
        );
        this.set(DB_KEYS.PROPOSALS, updatedProposals);

        this.addNotification({
            id: Math.random().toString(),
            text: `Contract started with ${freelancerName}`,
            time: 'Just now',
            isRead: false,
            type: 'success'
        });

        return newContract.id;
    }

    async getContract(contractId: string): Promise<Contract | undefined> {
        await this.delay(200);
        const contracts = this.get<Contract[]>(DB_KEYS.CONTRACTS, []);
        return contracts.find(c => c.id === contractId);
    }

    // --- Messages ---

    async getContacts(): Promise<ChatContact[]> {
        await this.delay(300);
        return this.get<ChatContact[]>(DB_KEYS.CONTACTS, SEED_CONTACTS);
    }

    async getMessages(contactId: string): Promise<Message[]> {
        await this.delay(200);
        const allMessages = this.get<Record<string, Message[]>>(DB_KEYS.MESSAGES, SEED_MESSAGES);
        return allMessages[contactId] || [];
    }

    async sendMessage(contactId: string, text: string): Promise<Message> {
        await this.delay(200);
        const allMessages = this.get<Record<string, Message[]>>(DB_KEYS.MESSAGES, SEED_MESSAGES);
        const user = this.getCurrentUser();

        const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            senderId: user?.id || 'me',
            text,
            timestamp: 'Just now',
            isMe: true
        };
        
        const contactMessages = allMessages[contactId] || [];
        allMessages[contactId] = [...contactMessages, newMessage];
        this.set(DB_KEYS.MESSAGES, allMessages);
        
        // Update contact snippet
        const contacts = this.get<ChatContact[]>(DB_KEYS.CONTACTS, SEED_CONTACTS);
        const updatedContacts = contacts.map(c => 
            c.id === contactId ? { ...c, lastMessage: text, lastMessageTime: 'Just now' } : c
        );
        this.set(DB_KEYS.CONTACTS, updatedContacts);

        return newMessage;
    }
}

// Export Singleton
export const api = new DatabaseService();
