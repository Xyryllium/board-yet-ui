export interface Member {
    email: string;
    role: string;
}

import type { InvitationResponse, OrganizationDetailsResponse } from '~/api/types';
import { memberInvite as apiMemberInvite } from '../api/organizations/invite';
import { acceptInvitation as apiAcceptInvitation } from '../api/organizations/acceptInvitation';
import { listOrganizationDetails as apiListOrganizationDetails } from '../api/organizations/list';

export async function inviteMember(memberInfo: Member, organizationId: number): Promise<InvitationResponse> {
  return apiMemberInvite(memberInfo, organizationId);
}

export async function acceptInvitation(token: string): Promise<InvitationResponse> {
  return apiAcceptInvitation(token);
}

export async function listOrganizationDetails(token: string): Promise<OrganizationDetailsResponse> {
  return apiListOrganizationDetails(token);
}