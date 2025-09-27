export function meta() {
  return [
    { title: "Health Check - Board Yet" },
  ];
}

export default function HealthCheck() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-2">✅ Healthy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Board Yet application is running properly
        </p>
      </div>
    </div>
  );
}
