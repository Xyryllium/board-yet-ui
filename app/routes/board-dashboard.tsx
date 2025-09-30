import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import type { Route } from "./+types/board-dashboard";
import { Link } from "react-router";
import { useEffect } from "react";
import { BoardForm, BoardList } from "~/components/board";
import { ErrorAlert, LoadingSpinner, CreatingIndicator } from "~/components/ui";
import { EmailVerificationPrompt } from "~/components/auth";
import { useAuth } from "~/hooks/useAuth";
import { useBoardManagement } from "~/hooks/useBoardManagement";
import { isAdmin } from "~/lib/auth";
import { useUser } from "~/contexts/UserContext";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "My Boards - Board Yet" },
        { name: "description", content: "Manage your boards" },
    ];
}

export default function BoardDashboard() {
    const { isInitialized } = useAuth();
    const { user } = useUser();
    const isUserAdmin = isAdmin(user || undefined);
    const {
        boards,
        paginatedBoards,
        currentPage,
        totalPages,
        totalBoards,
        isLoading,
        isCreating,
        error,
        hasFetched,
        fetchAllBoards,
        setHasFetched,
        handleCreateBoard,
        handleAddColumns,
        handleUpdateColumn,
        handleDeleteColumn,
        handleReorderColumns,
        handlePageChange,
        clearError
    } = useBoardManagement();

    useEffect(() => {
        if (!isInitialized || hasFetched) return;
        
        setHasFetched(true);
        fetchAllBoards();
    }, [isInitialized, hasFetched, setHasFetched, fetchAllBoards]);

    if (isLoading) {
        return (
            <div className="page-container flex items-center justify-center">
                <LoadingSpinner size="lg" message="Loading boards..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <EmailVerificationPrompt />
                
                <DashboardHeader
                    title="Board Dashboard"
                    description="Manage your boards"
                />

                <ErrorAlert error={error} onDismiss={clearError} />

                <div className={`grid grid-cols-1 gap-8 ${isUserAdmin ? 'lg:grid-cols-2' : 'w-full'}`}>
                    {isUserAdmin && (
                        <div className="order-2 lg:order-1">
                            <BoardForm
                                onCreate={handleCreateBoard}
                                isLoading={isCreating}
                            />
                        </div>
                    )}
                    <div className={`order-1 relative ${isUserAdmin ? 'lg:order-2' : 'w-full'}`}>
                        <CreatingIndicator isVisible={isCreating} />
                        <BoardList
                            boards={paginatedBoards}
                            allBoards={boards}
                            totalBoards={totalBoards}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onAddColumns={handleAddColumns}
                            onUpdateColumn={handleUpdateColumn}
                            onDeleteColumn={handleDeleteColumn}
                            onReorderColumns={handleReorderColumns}
                            isAdmin={isUserAdmin}
                        />
                    </div>
                </div>

                {isUserAdmin && (
                    <div className="mt-8 flex justify-center space-x-4">
                        <Link
                            to="/tenant/"
                            className="btn-primary-lg"
                        >
                            Back to Organization
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}