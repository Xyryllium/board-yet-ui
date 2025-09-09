interface DashboardHeaderProps {
    title: string;
    description: string;
}

export function DashboardHeader({title, description}: DashboardHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {description}
            </p>
        </div>
    );
}