import React from 'react';

interface EmptyBoardProps {
    onCreateColumn: () => void;
}

const EMPTY_BOARD_STYLES = {
    container: "text-center py-16 px-6 flex-1 flex items-center justify-center",
    iconContainer: "w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center",
    icon: "w-12 h-12 text-blue-500 dark:text-blue-400",
    title: "heading-4 mb-3",
    description: "text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto",
    button: "btn-primary-lg flex items-center gap-2 mx-auto",
    buttonIcon: "w-5 h-5"
} as const;

const ICONS = {
    document: (
        <svg className={EMPTY_BOARD_STYLES.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    plus: (
        <svg className={EMPTY_BOARD_STYLES.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    )
} as const;

export function EmptyBoard({ onCreateColumn }: EmptyBoardProps) {
    return (
        <div className={EMPTY_BOARD_STYLES.container}>
            <div className={EMPTY_BOARD_STYLES.iconContainer}>
                {ICONS.document}
            </div>
            <h3 className={EMPTY_BOARD_STYLES.title}>
                No columns yet
            </h3>
            <p className={EMPTY_BOARD_STYLES.description}>
                Get started by creating your first column to organize your tasks and ideas.
            </p>
            <button
                onClick={onCreateColumn}
                className={EMPTY_BOARD_STYLES.button}
            >
                {ICONS.plus}
                Create Your First Column
            </button>
        </div>
    );
}
