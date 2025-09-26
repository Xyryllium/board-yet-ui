export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  organization_id?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface CreateOrganizationData {
  name: string;
  description?: string;
  subdomain?: string;
  settings?: {
    theme: {
      primaryColor: string;
      logo?: string;
      customCss?: string;
    };
    //TODO: Add more organization settings as needed, for now we keep it simple
    // e.g., billing info, plan type, etc.
    // plan: {
    //   type: 'free' | 'pro' | 'enterprise';
    //   billingCycle: 'monthly' | 'yearly';
    // };
    // features: {
    //   allowGuestAccess: boolean;
    //   maxBoards: number;
    //   maxMembers: number;
    //   allowFileUploads: boolean;
    // };
    branding: {
      companyName: string;
      supportEmail: string;
      customDomain?: string;
    };
  };
}

export interface OrganizationDetails {
  id: number;
  name: string;
  owner?: User;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: number;
}

export interface CreateOrganizationResponse {
  success: boolean;
  organization?: OrganizationDetails;
  error?: string;
}

export interface OrganizationDetailsResponse {
  success: boolean;
  data?: OrganizationDetails;
  error?: string;
}

export interface Invitation {
  id: number;
  email: string;
  token: string;
  organization_id: number;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  organization: {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface Card {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationResponse {
  success: boolean;
  message?: string;
  invitation?: Invitation;
  error?: string;
  status?: string;
  email?: string;
}

export interface Column {
  id: number;
  name: string;
  order?: number;
  cards?: Card[];
}

export interface Board {
  id: number;
  name: string;
  description?: string | null;
  columns: Column[];
  created_at: string;
  updated_at: string;
}

export interface CreateBoardData {
  name: string;
}

export interface CreateColumnData {
  boardId: number;
  columns: Column | Column[];
}

export interface BoardResponse {
  success: boolean;
  message?: string;
  data?: Board | Board[];
  error?: string;
}

export interface ColumnResponse {
  success: boolean;
  message?: string;
  data?: Column | Column[];
  error?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: number;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  columnId: number;
  order?: number;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data?: Task;
  error?: string;
}

export interface TaskApiResponse {
  id: number;
  column_id: number;
  title: string;
  description?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Member {
    id?: number;
    email: string;
    name?: string;
    role: string;
}

export interface MemberResponse {
    success: boolean;
    members?: Member[];
    error?: string;
}