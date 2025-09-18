import React from 'react';

export interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
}

export const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className = '',
  target,
}) => {
  return (
    <a
      href={href}
      target={target}
      className={className}
    >
      {children}
    </a>
  );
};