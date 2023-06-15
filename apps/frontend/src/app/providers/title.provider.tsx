import React, { ReactNode, useEffect, useState } from 'react';
import { TitleContext, TitleContextProps } from '../context/title.context';
import { useLocation } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

export default function TitleProvider({ children }: Props) {
  const [title, setPageTitle] = useState<string>('');
  const { pathname } = useLocation();

  const getTitle = (): string => {
    return title;
  };

  const setTitle = (title: string) => {
    setPageTitle(title);
  };

  const generatePageTitle = () => {
    const currentRouteParts = pathname.split('/');
    const currentTitle = currentRouteParts.reduce((acc, currentValue, idx) => {
      if (acc !== '') {
        return idx <= 2 ? acc + ' ❭ ' + currentValue : acc;
      }
      return acc + currentValue;
    });

    const title = pathname === '/' ? 'Dashboard' : currentTitle;

    setTitle(title);
  };

  const contextValue: TitleContextProps = {
    title,
    getTitle,
    setTitle,
  };

  useEffect(generatePageTitle, [pathname]);

  return (
    <TitleContext.Provider value={contextValue}>
      {children}
    </TitleContext.Provider>
  );
}
