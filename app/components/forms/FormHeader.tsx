interface FormHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function FormHeader({ title, description, className = "" }: FormHeaderProps) {
  return (
    <div className={`text-center-content ${className}`}>
      <h2 className="heading-3">{title}</h2>
      <p className="text-body-sm mt-2">{description}</p>
    </div>
  );
}
