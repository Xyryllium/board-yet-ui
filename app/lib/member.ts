import type { InvitationResponse, OrganizationDetailsResponse, Member, MemberResponse } from '../api/types';
import { memberInvite as apiMemberInvite } from '../api/organizations/invite';
import { acceptInvitation as apiAcceptInvitation } from '../api/organizations/acceptInvitation';
import { listOrganizationDetails as apiListOrganizationDetails } from '../api/organizations/list';
import { listAllUsers as apiListAllMembers } from '../api/users/list';

export async function inviteMember(memberInfo: Member, organizationId: number): Promise<InvitationResponse> {
  return apiMemberInvite(memberInfo, organizationId);
}

export async function acceptInvitation(token: string): Promise<InvitationResponse> {
  return apiAcceptInvitation(token);
}

export async function listOrganizationDetails(token: string): Promise<OrganizationDetailsResponse> {
  return apiListOrganizationDetails(token);
}

export async function fetchAllMembers(organizationId: number): Promise<MemberResponse> {
  return apiListAllMembers(organizationId);
}