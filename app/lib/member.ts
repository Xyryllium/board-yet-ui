export interface Member {
    email: string;
    role: string;
}

import type { InvitationResponse } from '~/api/types';
import { memberInvite as apiMemberInvite } from '../api/organizations/invite';

export async function inviteMember(memberInfo: Member, organizationId: number): Promise<InvitationResponse> {
  return apiMemberInvite(memberInfo, organizationId);
}