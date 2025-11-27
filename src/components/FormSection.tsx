import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  id?: string;
}

export default function FormSection({ title, icon, children, id }: FormSectionProps) {
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="mt-4" id={sectionId} aria-labelledby={`${sectionId}-heading`}>
      <h1 id={`${sectionId}-heading`} className="text-3xl font-bold flex items-center gap-2">
        {title}
        {icon && <span aria-hidden="true">{icon}</span>}
      </h1>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}
