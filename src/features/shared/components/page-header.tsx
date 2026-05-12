interface PageHeaderProps {
  title: string;
  description: string;
}

/** Renders consistent page heading and section description. */
export function PageHeader({ title, description }: PageHeaderProps): React.JSX.Element {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-base text-muted-foreground">{description}</p>
    </div>
  );
}
