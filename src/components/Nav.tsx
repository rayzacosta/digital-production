import { useState, useEffect } from 'react';

import { NavLink } from '.';
import { userService } from 'src/services';
import { NavDropdown, Nav as NavUi } from 'react-bootstrap';
import { useUser } from 'src/hooks/useUser';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export { Nav };

function Nav() {
  const user = useUser();

  const isAdmin = user?.role === 'admin';

  function logout() {
    userService.logout();
  }

  // only show nav when logged in
  if (!user) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container ps-4">
        <div className="navbar-nav w-100">
          <Link href="/" passHref>
            <NavLink href="/" exact className="nav-item nav-link">
              Início
            </NavLink>
          </Link>

          <NavDropdown title="Cadastros" id="cadastros">
            <Link href="/processes" passHref>
              <NavDropdown.Item>Processos</NavDropdown.Item>
            </Link>
            <Link href="/products" passHref>
              <NavDropdown.Item>Produtos</NavDropdown.Item>
            </Link>
            <Link href="/users" passHref>
              <NavDropdown.Item>Usuários</NavDropdown.Item>
            </Link>
            <Link href="/lots" passHref>
              <NavDropdown.Item>Lotes</NavDropdown.Item>
            </Link>
          </NavDropdown>

          <NavDropdown title="Produção" id="produção">
            <Link href="/production" passHref>
              <NavDropdown.Item href="/production">
                Registros de Produção
              </NavDropdown.Item>
            </Link>
            {isAdmin && (
              <>
                <Link href="/production/report" passHref>
                  <NavDropdown.Item href="/production/report">
                    Relatório por Usuário - Periodo
                  </NavDropdown.Item>
                </Link>
                <Link href="/production/financial-report" passHref>
                  <NavDropdown.Item href="/production/financial-report">
                    Relatório Financeiro
                  </NavDropdown.Item>
                </Link>
              </>
            )}
          </NavDropdown>

          <NavLink href="/mobile" exact className="nav-item nav-link">
            Checar operadores
          </NavLink>

          <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="text-white">{user?.name}</span>
          <a
            onClick={logout}
            className="nav-item nav-link ms-auto"
            role="button"
          >
            <Icon icon="material-symbols:digital-out-of-home" />
          </a>
            </div>
        </div>
      </div>
    </nav>
  );
}
