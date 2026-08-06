interface ModulePlaceholderProps {
  title: string;
  description?: string;
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-2 p-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-slate-500">{description}</p>}
    </div>
  );
}
