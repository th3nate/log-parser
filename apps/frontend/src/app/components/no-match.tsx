import { Link } from 'react-router-dom';
import React from 'react';

export default function NoMatch() {
  return (
    <div className="mt-5">
      <header>
        <h1 className="block font-bold text-gray-800 dark:text-white">
          Nothing to see here!
        </h1>
      </header>
      <main>
        <Link className="text-blue-600" to="/">
          Go to the home page
        </Link>
      </main>
    </div>
  );
}
