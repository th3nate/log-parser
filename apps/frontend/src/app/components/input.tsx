import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

interface Input {
  name: string;
  rules?: RegisterOptions;
  register: UseFormRegister<any>;
}

type InputExtendedProps = Input & React.HTMLProps<HTMLInputElement>;

export default function Input({
  name,
  register,
  rules,
  ...rest
}: InputExtendedProps) {
  return (
    <input
      className="w-full appearance-none text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-lg py-2 px-3 shadow-md focus:outline-none focus-visible:border-sky-500 focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
      {...register(name, { ...rules })}
      {...rest}
    />
  );
}
