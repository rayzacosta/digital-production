import { NavLink } from '.';
import { userService } from 'src/services';
import { useUser } from 'src/hooks/useUser';
import { Icon } from '@iconify/react';
import Link from 'next/link';

function NavMobile() {
  const user = useUser();

  function logout() {
    userService.logout();
  }

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container ps-4">
        <div className="navbar-nav w-100">
          <Link href="/mobile">
            <NavLink href="/mobile" exact className="nav-item nav-link">
              Início
            </NavLink>
          </Link>

          {user.role !== 'operator' && (
            <Link href="/">
              <NavLink href="/" exact className="nav-item nav-link">
                Voltar para gestão
              </NavLink>
            </Link>
          )}

          <div className="d-flex align-items-center gap-2 ms-auto">
            <span className="text-white">{user?.name}</span>

            <a
              onClick={logout}
              className="nav-item nav-link fs-3"
              role="button"
              title="Sair do sistema"
            >
              <Icon icon="material-symbols:digital-out-of-home" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { NavMobile };
