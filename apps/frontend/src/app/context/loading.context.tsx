import { createContext } from 'react';

export interface LoadingContextProps {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  showLoading: () => ({}),
  hideLoading: () => ({}),
});
