import clsx from "clsx";

export const ActionButton = ({
  onClick,
  className,
  title,
  children,
}: React.PropsWithChildren<{
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
}>) => {
  return (
    <div
      className={clsx(
        "h-5 w-5 hidden group-hover:flex items-center justify-center hover:bg-white",
        className
      )}
      onClick={onClick}
      title={title}
    >
      {children}
    </div>
  );
};
