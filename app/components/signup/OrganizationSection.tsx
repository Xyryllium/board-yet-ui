interface OrganizationSectionProps {
  className?: string;
  createOrganization?: boolean;
  onOrganizationToggle?: (enabled: boolean) => void;
}

export function OrganizationSection({ 
  className = "", 
  createOrganization = false, 
  onOrganizationToggle 
}: OrganizationSectionProps) {

  return (
    <div className={`org-section ${className}`}>
      <div className="org-toggle">
        <input
          type="checkbox"
          id="createOrg"
          checked={createOrganization}
          onChange={(e) => onOrganizationToggle?.(e.target.checked)}
          className="form-checkbox"
        />
        <label htmlFor="createOrg" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Create an organization
        </label>
      </div>

      {createOrganization && (
        <div className="org-content">
          <div className="org-status">
            <div className="org-status-icon">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span className="org-status-text">
              Organization Creation Enabled
            </span>
          </div>
          
          <div>
            <label htmlFor="orgName" className="form-label">
              Organization Name *
            </label>
            <input
              type="text"
              id="orgName"
              className="form-input"
              placeholder="Enter organization name"
              required={createOrganization}
            />
          </div>

          <div>
            <label htmlFor="orgDescription" className="form-label">
              Organization Description
            </label>
            <textarea
              id="orgDescription"
              rows={3}
              className="form-textarea"
              placeholder="Describe your organization's purpose"
            />
          </div>
        </div>
      )}
    </div>
  );
}
