import { createContext } from 'react';

export interface TitleContextProps {
  title: string;
  setTitle: (title: string) => void;
  getTitle: () => string;
}

export const TitleContext = createContext<TitleContextProps>({
  title: '',
  setTitle: (title: string): void => undefined,
  getTitle: (): string => '',
});
