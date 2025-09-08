interface FormField {
  id: string;
  name: keyof FormData;
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  required?: boolean;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PersonalInfoFormProps {
  className?: string;
  formData: FormData;
  errors?: FormErrors;
  onChange: (field: keyof FormData, value: string) => void;
}

const formFields: FormField[] = [
  {
    id: 'name',
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    id: 'signupEmail',
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    id: 'signupPassword',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Create a password',
    required: true,
  },
  {
    id: 'confirmPassword',
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    required: true,
  },
];

function FormFieldComponent({ 
  field, 
  value, 
  error, 
  onChange 
}: {
  field: FormField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={field.id} className="form-label">
        {field.label}
      </label>
      <input
        type={field.type}
        id={field.id}
        className={`form-input ${error ? 'border-red-500' : ''}`}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

export function PersonalInfoForm({
  className = "",
  formData,
  errors = {},
  onChange
}: PersonalInfoFormProps) {
  return (
    <div className={`form-fields ${className}`}>
      {formFields.map((field) => (
        <FormFieldComponent
          key={field.id}
          field={field}
          value={formData[field.name]}
          error={errors[field.name]}
          onChange={(value) => onChange(field.name, value)}
        />
      ))}
    </div>
  );
}
