import type { Route } from "./+types/home";
import { AuthForm } from "../components";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Board Yet - Project Management" },
    { name: "description", content: "Welcome to Board Yet - Your project management solution" },
  ];
}

export default function Home() {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="grid-2-lg items-center min-h-[80vh]">
          <div className="space-section">
            <div className="space-items">
              <h1 className="heading-1">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Board Yet
                </span>
              </h1>
              <p className="text-body">
                Streamline your projects with our intuitive project management platform.
                Organize tasks, collaborate with teams, and achieve your goals faster.
              </p>
            </div>
            
            <div className="space-content">
              <div className="feature-item">
                <div className="feature-icon feature-icon-blue">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="feature-text">Task Management</span>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon feature-icon-green">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="feature-text">Team Collaboration</span>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon feature-icon-purple">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="feature-text">Progress Tracking</span>
              </div>
            </div>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
