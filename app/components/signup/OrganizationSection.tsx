interface OrganizationData {
  name: string;
}

interface OrganizationErrors {
  organizationName?: string;
}

interface OrganizationSectionProps {
  className?: string;
  createOrganization?: boolean;
  onOrganizationToggle?: (enabled: boolean) => void;
  organizationData?: OrganizationData;
  onOrganizationChange?: (field: keyof OrganizationData, value: string) => void;
  errors?: OrganizationErrors;
}

export function OrganizationSection({ 
  className = "", 
  createOrganization = false, 
  onOrganizationToggle,
  organizationData = { name: "" },
  onOrganizationChange,
  errors = {}
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
              className={`form-input ${errors.organizationName ? 'border-red-500' : ''}`}
              placeholder="Enter organization name"
              value={organizationData.name}
              onChange={(e) => onOrganizationChange?.('name', e.target.value)}
              required={createOrganization}
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm mt-1">{errors.organizationName}</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
