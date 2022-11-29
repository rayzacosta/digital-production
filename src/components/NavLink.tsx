import { useRouter } from 'next/router';

import { Link } from '.';

type NavLinkProps = {
  href: string;
  exact?: boolean;
  className?: string;
  children: any;
};

function NavLink({ children, href, exact, ...props }: NavLinkProps) {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  if (isActive) {
    props.className += ' active';
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

export { NavLink };
