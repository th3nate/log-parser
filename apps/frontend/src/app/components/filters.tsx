import React, { useEffect } from 'react';
import { Levels } from '@log-parser/common';
import { FormProvider, useForm } from 'react-hook-form';
import Select from './select';
import Input from './input';

interface SelectData {
  name: string;
}

interface FiltersProps {
  onChanged: (filters: FormProps) => void;
}

export interface FormProps {
  content: string;
  timestamp: string;
  level: string;
}

const Filters = ({ onChanged }: FiltersProps) => {
  const defaultValues: FormProps = {
    content: '',
    timestamp: '',
    level: '',
  };

  const methods = useForm<FormProps>({
    mode: 'onChange',
    defaultValues,
  });

  const { reset, watch, register } = methods;

  useEffect(() => {
    const subscription = watch((value: any) => {
      onChanged(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleReset = () => {
    reset(defaultValues);
  };

  const selectData = Object.values(Levels).map((x) => ({ name: x }));

  return (
    <FormProvider {...methods}>
      <form className="group relative">
        <header>
          <h2 className="font-semibold text-slate-900">Filters</h2>
        </header>
        <div className="grid grid-flow-col grid-cols-4 gap-4 mt-3">
          <div>
            <Input name="content" register={register} placeholder="Content" />
          </div>
          <div>
            <Input
              name="timestamp"
              register={register}
              placeholder="Timestamp"
            />
          </div>
          <div>
            <Select<SelectData>
              name={'level'}
              options={selectData}
              keyExtractor={(item) => item.name}
              valueExtractor={(item) => item.name}
            />
          </div>
          <div>
            <button
              className="bg-sky-500 hover:bg-sky-400 text-white text-sm leading-6 py-2 px-3 rounded-lg"
              onClick={() => handleReset()}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
export default Filters;
