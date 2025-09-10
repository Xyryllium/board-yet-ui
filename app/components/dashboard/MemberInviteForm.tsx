import { useState } from "react";

interface MemberInviteFormProps {
    onInvite?: (memberEmail: string, adminEmail: string) => void;
    isLoading?: boolean;
}

export function MemberInviteForm({onInvite, isLoading = false}: MemberInviteFormProps) {
    const [memberEmail, setMemberEmail] = useState("");
    const [adminEmail, setAdminEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(onInvite){
            onInvite(memberEmail, adminEmail);
        }
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h2>
            </div>

            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add Member
                        </label>
                        <input
                        type="email"
                        id="memberEmail"
                        value={memberEmail}
                        disabled={isLoading}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Enter member email"
                        />
                    </div>

                    <div>
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add Admin
                        </label>
                        <input
                        type="email"
                        id="adminEmail"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Enter admin email"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200">
                    {isLoading ? "Sending Invites..." : "Send Invite"}
                    </button>
                </form>
            </div>
        </div>
    );
}