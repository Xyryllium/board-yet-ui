import React from 'react';
import { Link } from 'react-router';
import { formatRelativeTime } from '~/lib/dateUtils';
import { isMember } from '~/lib/auth';

interface BoardHeaderProps {
    boardName: string;
    boardDescription: string;
    columnCount: number;
    columnCreatedAt: string;
}

const HEADER_STYLES = {
    container: "mb-6 sm:mb-8",
    content: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
    info: "flex-1 min-w-0",
    title: "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 break-words",
    description: "text-base sm:text-lg text-gray-600 dark:text-gray-300 break-words",
    stats: "flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400",
    statItem: "flex items-center gap-1 whitespace-nowrap",
    icon: "w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
} as const;

const ICONS = {
    columns: (
        <svg className={HEADER_STYLES.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    time: (
        <svg className={HEADER_STYLES.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
} as const;

export function BoardHeader({ boardName, boardDescription, columnCount , columnCreatedAt }: BoardHeaderProps) {
    const relativeTime = formatRelativeTime(columnCreatedAt);
    const isUserMember = isMember();
    
    return (
        <div className={HEADER_STYLES.container}>
            <div className={HEADER_STYLES.content}>
                <div className={HEADER_STYLES.info}>
                    <h1 className={HEADER_STYLES.title}>
                        {boardName}
                    </h1>
                    <p className={HEADER_STYLES.description}>
                        {boardDescription}
                    </p>
                    <div className={HEADER_STYLES.stats}>
                        <span className={HEADER_STYLES.statItem}>
                            {ICONS.columns}
                            {columnCount} columns
                        </span>
                        <span className={HEADER_STYLES.statItem}>
                            {ICONS.time}
                            {relativeTime}
                        </span>
                    </div>
                </div>
                
                {isUserMember && (
                    <div className="flex-shrink-0 mt-4 lg:mt-0">
                        <Link
                            to="/tenant/boards"
                            className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="hidden sm:inline">Back to Boards</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
