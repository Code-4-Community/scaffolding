import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import './root.css';

// Import SVG icons
import Logo from '../assets/icons/826-boston-logo.png';
import HomeIcon from '../assets/icons/home.svg';
import LibraryIcon from '../assets/icons/library.svg';
import LibraryActiveIcon from '../assets/icons/library-active.svg';
import ProjectsIcon from '../assets/icons/projects.svg';
import ResourcesIcon from '../assets/icons/resources.svg';
import PeopleIcon from '../assets/icons/people.svg';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import CollapseArrowIcon from '../assets/icons/collapse-arrow.svg';
import LogoutIcon from '../assets/icons/logout.svg';

const Root: React.FC = () => {
  const [libraryExpanded, setLibraryExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isLibraryActive =
    location.pathname.startsWith('/archive') || location.pathname === '/';

  return (
    <div className="root-shell">
      {/* Left sidebar */}
      <aside className={`root-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div>
          {/* Logo */}
          <div className="sidebar-logo-section">
            {!collapsed && (
              <img src={Logo} alt="826 Boston" className="sidebar-logo" />
            )}
            <img
              src={CollapseArrowIcon}
              alt=""
              className={`sidebar-collapse-arrow ${
                collapsed ? 'collapsed' : ''
              }`}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {/* Home */}
            <div className="sidebar-nav-item">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img src={HomeIcon} alt="" className="sidebar-nav-icon" />
                  {!collapsed && (
                    <span className="sidebar-nav-label">Home</span>
                  )}
                </div>
              </div>
            </div>

            {/* Library - Expandable Section */}
            <div className="sidebar-library-section">
              <button
                type="button"
                className="sidebar-library-header"
                onClick={() =>
                  !collapsed && setLibraryExpanded(!libraryExpanded)
                }
              >
                <div className="sidebar-library-header-content">
                  <div className="sidebar-library-header-left">
                    <img
                      src={isLibraryActive ? LibraryActiveIcon : LibraryIcon}
                      alt=""
                      className="sidebar-nav-icon"
                    />
                    {!collapsed && (
                      <span className="sidebar-nav-label sidebar-nav-label--bold">
                        Library
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <img
                      src={ChevronRightIcon}
                      alt=""
                      className={`sidebar-nav-arrow ${
                        libraryExpanded ? 'sidebar-nav-arrow--expanded' : ''
                      }`}
                    />
                  )}
                </div>
              </button>

              {!collapsed && libraryExpanded && (
                <ul className="sidebar-subnav">
                  <li>
                    <NavLink
                      to="/archive"
                      className={({ isActive }) =>
                        'sidebar-subnav-link' +
                        (isActive ? ' sidebar-subnav-link--active' : '')
                      }
                    >
                      All Publications
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/archive"
                      className={({ isActive }) =>
                        'sidebar-subnav-link' +
                        (isActive ? ' sidebar-subnav-link--active' : '')
                      }
                    >
                      In Progress
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/archive"
                      className={({ isActive }) =>
                        'sidebar-subnav-link' +
                        (isActive ? ' sidebar-subnav-link--active' : '')
                      }
                    >
                      Archive
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>

            {/* Projects */}
            <div className="sidebar-nav-item">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img src={ProjectsIcon} alt="" className="sidebar-nav-icon" />
                  {!collapsed && (
                    <span className="sidebar-nav-label">Projects</span>
                  )}
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="sidebar-nav-item">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img
                    src={ResourcesIcon}
                    alt=""
                    className="sidebar-nav-icon"
                  />
                  {!collapsed && (
                    <span className="sidebar-nav-label">Resources</span>
                  )}
                </div>
              </div>
            </div>

            {/* People */}
            <div className="sidebar-nav-item">
              <div className="sidebar-nav-item-content">
                <div className="sidebar-nav-item-left">
                  <img src={PeopleIcon} alt="" className="sidebar-nav-icon" />
                  {!collapsed && (
                    <span className="sidebar-nav-label">People</span>
                  )}
                </div>
                {!collapsed && (
                  <img
                    src={ChevronRightIcon}
                    alt=""
                    className="sidebar-nav-arrow"
                  />
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="sidebar-logout-section">
          <button type="button" className="sidebar-logout">
            <img src={LogoutIcon} alt="" className="sidebar-logout-icon" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="root-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
