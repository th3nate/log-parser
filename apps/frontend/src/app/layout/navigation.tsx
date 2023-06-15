import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Bars3Icon,
  PresentationChartBarIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

interface Navigation {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Navigation({ isOpen, toggleSidebar }: Navigation) {
  return (
    <>
      <header>
        <h2 className="font-semibold text-lg text-center leading-2 mt-3 pb-3 border-b">
          <Bars3Icon
            onClick={() => toggleSidebar()}
            className="inline-block cursor-pointer h-5 w-5"
          />
        </h2>
      </header>

      <ul role="list">
        <li>
          <NavLink
            className="block w-full text-slate-500 hover:bg-slate-100 p-3"
            title="Dashboard"
            to={`/`}
          >
            {({ isActive }) => (
              <span className={isActive ? 'text-sky-500' : ''}>
                <PresentationChartBarIcon className="inline-block h-5 w-5 mr-2" />
                {isOpen && 'Dashboard'}
              </span>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            title="Logs"
            className="block w-full text-slate-500 hover:bg-slate-100 p-3"
            to={`/logs`}
          >
            {({ isActive }) => (
              <span className={isActive ? 'text-sky-500' : ''}>
                <RectangleStackIcon className="inline-block h-5 w-5 mr-2" />
                {isOpen && 'Logs'}
              </span>
            )}
          </NavLink>
        </li>
      </ul>
    </>
  );
}
