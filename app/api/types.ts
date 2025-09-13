export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  organization_id: number;
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
}

export interface OrganizationDetails {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateOrganizationResponse {
  success: boolean;
  organization?: OrganizationDetails;
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

export interface InvitationResponse {
  success: boolean;
  message?: string;
  invitation?: Invitation;
  error?: string;
}

export interface Column {
  id: number;
  name: string;
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

export interface BoardResponse {
  success: boolean;
  message?: string;
  data?: Board | Board[];
  error?: string;
}