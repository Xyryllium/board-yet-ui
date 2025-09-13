import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import type { Route } from "./+types/board-dashboard";
import { Link } from "react-router";
import { useEffect } from "react";
import { BoardForm, BoardList } from "~/components/board";
import { ErrorAlert, LoadingSpinner, CreatingIndicator } from "~/components/ui";
import { useAuth } from "~/hooks/useAuth";
import { useBoardManagement } from "~/hooks/useBoardManagement";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "My Boards - Board Yet" },
        { name: "description", content: "Manage your boards" },
    ];
}

export default function BoardDashboard() {
    const { isInitialized } = useAuth();
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
        fetchBoards,
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
        fetchBoards();
    }, [isInitialized, hasFetched, setHasFetched, fetchBoards]);

    if (isLoading) {
        return (
            <div className="page-container flex items-center justify-center">
                <LoadingSpinner size="lg" message="Loading boards..." />
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

                <ErrorAlert error={error} onDismiss={clearError} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="order-2 lg:order-1">
                        <BoardForm
                            onCreate={handleCreateBoard}
                            isLoading={isCreating}
                        />
                    </div>
                    <div className="order-1 lg:order-2 relative">
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
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                    <Link
                        to="/organization-dashboard"
                        className="btn-primary-lg"
                    >
                        Back to Organization
                    </Link>
                </div>
            </div>
        </div>
    );
}