import React from 'react';

export default function ErrorToast({ toastProps }: any) {
  return (
    <>
      {toastProps.data?.name && (
        <div className="font-semibold text-sm">
          Name:{' '}
          <span className="font-normal text-slate-500">
            {toastProps.data.name}
          </span>
        </div>
      )}
      {toastProps.data?.message && (
        <div className="font-semibold text-sm">
          Message:{' '}
          <span className="font-normal text-slate-500">
            {toastProps.data.message}
          </span>
        </div>
      )}
      {toastProps.data?.code && (
        <div className="font-semibold text-sm">
          Code:{' '}
          <span className="font-normal text-slate-500">
            {toastProps.data.code}
          </span>
        </div>
      )}
    </>
  );
}
