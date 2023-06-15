import React from 'react';
import { ReactComponent as ReactIcon } from '../../assets/react-icon.svg';
import { ReactComponent as NestJs } from '../../assets/nestjs.svg';
import { ReactComponent as Nx } from '../../assets/nx.svg';

export default function Intro() {
  return (
    <div>
      <h1 className="block text-2xl font-bold text-gray-800 sm:text-3xl">
        Full stack application
      </h1>
      <p>
        <ReactIcon className="inline-block w-10 h-10" title="React" />
        <NestJs
          className="inline-block w-10 h-10 mr-2 ml-2 mb-1"
          title="NestJS"
        />
        <Nx className="inline-block w-10 h-10" title="NX" />
      </p>
      <p className="mt-2 text-lg text-gray-800">
        Built with React, NestJS and NX monorepo
      </p>
    </div>
  );
}
