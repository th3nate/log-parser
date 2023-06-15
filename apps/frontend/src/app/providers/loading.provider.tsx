import React, { ReactNode, useState } from 'react';
import {
  LoadingContext,
  LoadingContextProps,
} from '../context/loading.context';

type Props = {
  children: ReactNode;
};

export default function LoadingProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const contextValue: LoadingContextProps = {
    isLoading,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}
