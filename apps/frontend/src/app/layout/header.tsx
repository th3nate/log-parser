import React, { useContext } from 'react';
import { TitleContext } from '../context/title.context';

interface Header {
  isOpen: boolean;
}

export default function Header({ isOpen }: Header) {
  const { getTitle } = useContext(TitleContext);

  return (
    <div
      className={
        'fixed z-10 top-0 right-0 w-[calc(100vw-16rem)] mb-20 bg-sky-500 h-[3.3rem] shadow-md text-white text-lg font-semibold ' +
        (!isOpen ? 'w-[calc(100vw-3rem)]' : '')
      }
    >
      <div className="relative top-3 ml-6">
        Log Parser
        <span className="rounded-full bg-sky-400 pl-2 pr-2 pt-1 pb-1 text-sm font-light ml-3">
          {getTitle()}
        </span>
      </div>
    </div>
  );
}
