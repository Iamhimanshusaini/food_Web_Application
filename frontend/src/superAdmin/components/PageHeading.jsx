export default function PageHeading({ eyebrow = "Super Admin", title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm text-slate-400">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
