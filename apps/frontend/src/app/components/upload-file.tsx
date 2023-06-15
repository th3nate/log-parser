import React, { ChangeEvent, Fragment, useState } from 'react';
import { LogParserResponse } from '@log-parser/common';
import { postData } from '../services/api.service';
import { FormProvider, useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { formatBytes } from '../utils/utils';
import Input from './input';

interface UploadFileProps {
  onUploaded: (file: LogParserResponse) => void;
}

interface UploadFileForm {
  file: FileList;
  name: string;
}

export default function UploadFile({ onUploaded }: UploadFileProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const methods = useForm<UploadFileForm>({
    mode: 'onChange',
    defaultValues: {
      file: undefined,
      name: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const handleUpload = async ({ file, name }: UploadFileForm) => {
    const fileValue = file && file[0];
    if (!fileValue) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', fileValue, fileValue.name);
      formData.append('name', name || fileValue.name);

      const result = await postData<LogParserResponse>(`/log-file`, formData);
      onUploaded(result);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenFileDialog = () =>
    setOpen((cur) => {
      return !cur;
    });

  const handleClose = () => {
    reset();
    setSelectedFile(undefined);
    setOpen(false);
  };

  return (
    <>
      <button
        className="mb-5 mt-5 bg-sky-500 hover:bg-sky-400 text-white text-sm leading-6 py-2 px-3 rounded-lg"
        onClick={handleOpenFileDialog}
      >
        Upload log file
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={handleClose} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-5 shadow-2xl">
              <FormProvider {...methods}>
                <form
                  className="grid auto-rows-max grid-flow-row gap-4"
                  onSubmit={handleSubmit(handleUpload)}
                >
                  <Dialog.Title className="text-lg font-semibold">
                    Upload log file
                  </Dialog.Title>
                  <div className="p-3 rounded-md bg-white border border-slate-200">
                    <p>
                      Uploading log file support files with '.txt' extension,
                      And up to 1mb in size.
                    </p>
                    <p className="text-sm mb-2 mt-2 italic">
                      Supported format example:
                    </p>
                    <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded-md">
                      2023-03-10 15:19:09 info: 🚀 App listening on port 3000
                    </pre>
                  </div>
                  <Input
                    name="name"
                    register={register}
                    rules={{ required: true }}
                    placeholder="Name"
                    required
                  />

                  <Input
                    name="file"
                    register={register}
                    rules={{ required: true }}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSelectedFile(
                        event.target.files ? event.target.files[0] : undefined
                      )
                    }
                    required
                    type="file"
                  />
                  {selectedFile && (
                    <div className="rounded-full bg-slate-100 text-slate-400 h-7 text-center text-sm pt-1 align-middle">{`${
                      selectedFile.name
                    } ${formatBytes(selectedFile.size)}`}</div>
                  )}
                  {errors.name && (
                    <div className="text-yellow-500 font-semibold p-1">
                      - Log name is required
                    </div>
                  )}
                  {errors.file && (
                    <div className="text-yellow-500 font-semibold p-1">
                      - File is required
                    </div>
                  )}
                  <div className="text-right">
                    <button
                      className="bg-slate-500 hover:bg-slate-400 text-white text-sm leading-6 py-2 px-3 mr-2 rounded-lg"
                      onClick={() => handleClose()}
                      type="button"
                    >
                      Cancel
                    </button>

                    <button
                      className="bg-sky-500 hover:bg-sky-400 text-white text-sm leading-6 py-2 px-3 rounded-lg"
                      type="submit"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </FormProvider>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
