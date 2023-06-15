import { useController, useFormContext } from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';

interface Select<T> {
  name: string;
  keyExtractor: (item: T) => string;
  valueExtractor: (item: T) => string;
  options: T[];
}

export default function Select<T>({
  name,
  options,
  valueExtractor,
  keyExtractor,
}: Select<T>) {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  return (
    <Listbox
      as="div"
      onChange={field.onChange}
      value={field.value}
      name={field.name}
    >
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full -top-1 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
          <span className="block truncate">
            {field.value ? field.value : 'Please select'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((item: T, itemIdx: number) => (
              <Listbox.Option
                key={keyExtractor(item) || itemIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                  }`
                }
                value={valueExtractor(item)}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {valueExtractor(item)}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
