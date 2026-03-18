import { ReactNode, MouseEvent, AnchorHTMLAttributes } from "react";

interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: ReactNode;
}

/**
 * Custom navigation link component that works without React Router context
 * Uses window.location for navigation while maintaining Link-like API
 */
export function NavLink({ to, children, onClick, ...props }: NavLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Navigate using window.location
    window.location.href = to;
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
