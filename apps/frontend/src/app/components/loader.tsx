import React from 'react';
import Spinner from './spinner';

export default function Loader() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-0">
        <Spinner />
      </div>
    </div>
  );
}
