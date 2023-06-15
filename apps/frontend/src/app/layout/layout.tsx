import * as React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './header';
import Navigation from './navigation';
import Intro from './intro';

export default function Layout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <>
      <div
        id="app-wrapper"
        className="grid grid-flow-col auto-cols-max h-screen w-screen overflow-x-hidden"
      >
        <div
          id="app-sidebar"
          className={
            (!isOpen ? 'w-12' : 'w-64') +
            ' z-20 bg-white border-solid border-r border-l-0 border-t-0 border-b-0 border-r-slate-200'
          }
        >
          <Navigation
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
          ></Navigation>
        </div>

        <div
          id="app-content"
          className={
            'w-[calc(100vw-16rem)] p-10 bg-slate-50 mt-14 ' +
            (!isOpen ? 'w-[calc(100vw-3rem)]' : '')
          }
        >
          <Header isOpen={isOpen} />
          <Intro />
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
