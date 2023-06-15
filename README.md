# Log Parser

<a alt="React logo" href="https://github.com/facebook/react" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png?20220125121207" width="45"></a>
<a alt="Nestjs logo" href="https://github.com/nestjs/nest" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/NestJS.svg/621px-NestJS.svg.png?20221211225055" width="45"></a>
<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="60"></a>

Log Parser supports adding log files and viewing them with filtering options.

This full stack application is composed out of a Nestjs backend and Reactjs frontend over NX monorepo.

## Installation

Run `npm i`

## Sample log file

To get you started quickly and see an example of a supported log format, A sample log file is provided
in `apps/backend/src/assets/input.txt`

## Postman

Postman collection supporting the various operations is also available
in `apps/backend/src/assets/log-parser.postman_collection.json`.

## Start the app

To start the development server run `npx nx run-many -t serve -p backend frontend`. Open your browser and navigate
to http://localhost:4200/.

## Testing

Run `npm run test:all`

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```