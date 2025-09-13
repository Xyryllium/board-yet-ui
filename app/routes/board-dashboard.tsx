import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import type { Route } from "./+types/board-dashboard";
import { Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import { BoardForm } from "~/components/board/BoardForm";
import { BoardList } from "~/components/board/BoardList";
import { createBoard, fetchBoard } from "~/lib/board";
import type { Board } from "~/api/types";
import { getAuthToken, getUserData, isAuthenticated } from "~/lib/auth";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "My Boards - Board Yet" },
        { name: "description", content: "Manage your boards" },
    ];
}

export default function BoardDashboard(){
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [boards, setBoards] = useState<Board[]>([]);
    const [organizationId, setOrganizationId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const hasFetched = useRef(false);
    
    const ITEMS_PER_PAGE = 4;

    const totalPages = Math.ceil(boards.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedBoards = boards.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchBoards = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetchBoard();
            
            if (response.success && response.data) {
                const boardsArray = Array.isArray(response.data) ? response.data : [response.data];
                setBoards(boardsArray);
            } else {
                setError(response.error || 'Failed to fetch boards');
            }
        } catch (error) {
            setError('An error occurred while fetching boards');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        
        hasFetched.current = true;

        const authToken = getAuthToken();
        const authenticated = isAuthenticated();
        const userData = getUserData();

        setToken(authToken);
        setIsAuth(authenticated);
        
        if (userData && userData.organization_id) {
            setOrganizationId(userData.organization_id);
        }

        fetchBoards();
    }, []);
    const handleCreate = async (boardName: string) => {
        setIsCreating(true);
        setError(null);
        
        try {
            const response = await createBoard({ name: boardName });

            if(response.success && response.data) {
                const newBoard = Array.isArray(response.data) ? response.data[0] : response.data;
                setBoards(prevBoards => [...prevBoards, newBoard]);
                setCurrentPage(1);
            } else {
                setError(response.error || 'Failed to create board');
            }
        } catch (error) {
            setError('An error occurred while creating the board');
        } finally {
            setIsCreating(false);
        }
    }

    if(isLoading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="container mx-auto px-4 py-8">
                <DashboardHeader
                    title="Board Dashboard"
                    description="Manage your boards"
                 />

                 {error && (
                     <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
                         {error}
                     </div>
                 )}

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="order-2 lg:order-1">
                        <BoardForm
                            onCreate={handleCreate}
                            isLoading={isCreating}
                        />
                    </div>
                    <div className="order-1 lg:order-2 relative">
                        {isCreating && (
                            <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Adding board...</span>
                                </div>
                            </div>
                        )}
                        <BoardList
                            boards={paginatedBoards}
                            totalBoards={boards.length}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                 </div>

                <div className="mt-8 flex justify-center space-x-4">
                    <Link
                        to="/organization-dashboard"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                        Back to Organization
                    </Link>
                </div>
            </div>
        </div>
    );
}