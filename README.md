# Structured-Filter-React

Structured-Filter-React is a React component for building structured search/filter queries.

With it you can build structured search conditions like *Firstname starts with 'A'* and *Birthday after 1/1/1990* and *Category in (Family, Friends)*...

Check out the [Demo](https://evoluteur.github.io/structured-filter-react/).

![Structured-Filter-React Light mode](https://raw.github.com/evoluteur/structured-filter-react/master/screenshots/sfr-light.webp)

![Structured-Filter-React Dark mode](https://raw.github.com/evoluteur/structured-filter-react/master/screenshots/sfr-dark.webp)

This is the React re-write of [Structured-Filter](https://github.com/evoluteur/structured-filter), the original jQuery UI widget.

### Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Model](#model)
4. [Props](#props)
5. [Development](#development)
6. [License](#license)

<a name="installation"></a>
## Installation

```bash
npm install structured-filter-react
```

`react` and `react-dom` (18 or 19) are peer dependencies and must already be installed in your project.

<a name="usage"></a>
## Usage

```tsx
import Filter from "structured-filter-react";
import "structured-filter-react/dist/index.css";

const fields = [
  { id: "lastname", type: "text", label: "Lastname" },
  { id: "firstname", type: "text", label: "Firstname" },
  { id: "active", type: "boolean", label: "Is active" },
  { id: "age", type: "number", label: "Age" },
  { id: "bday", type: "date", label: "Birthday" },
  {
    id: "category", type: "list", label: "Category",
    list: [
      { id: "1", text: "Family" },
      { id: "2", text: "Friends" },
      { id: "3", text: "Business" },
      { id: "4", text: "Acquaintances" },
      { id: "5", text: "Other" },
    ],
  },
];

const App = () => <Filter fields={fields} />;
```

Check the [Demo](https://evoluteur.github.io/structured-filter-react/) for a full example, including reading the current conditions back out via `onChange`.

<a name="model"></a>
## Model

### Fields

Each field must have an `id`, a `type`, and a `label`.

- `id` - unique identifier for the field.
- `label` - displayed field name.
- `type` - one of: `text`, `number`, `boolean`, `date`, `time`, `list`.

Fields of type `list` must also have a `list` property: an array of `{ id, text }` options.

### Conditions

The filter's value is an array of conditions, each shaped as:

```ts
{ field: string, operator: string, value: string | string[] | null }
```

The available operators depend on the field's type:

| Type | Operators |
|---|---|
| `text` | equals (`eq`), not equal (`ne`), starts with (`sw`), contains (`ct`), doesn't contain (`nct`), finishes with (`fw`), is empty (`null`), is not empty (`nn`) |
| `number` | = (`eq`), != (`ne`), > (`gt`), < (`lt`), is empty (`null`), is not empty (`nn`) |
| `boolean` | equals (`eq`), is empty (`null`), is not empty (`nn`) |
| `date` | on/not on (`eq`/`ne`), after (`gt`), before (`lt`), between/not between (`bw`/`nbw`), is empty (`null`), is not empty (`nn`) |
| `time` | at/not at (`eq`/`ne`), after (`gt`), before (`lt`), between/not between (`bw`/`nbw`), is empty (`null`), is not empty (`nn`) |
| `list` | any of (`in`), is empty (`null`), is not empty (`nn`) |

> Note: `between`/`not between` are exposed in the operator dropdown for `date`/`time` fields, but the value editor currently only captures a single value — a second "to" input isn't implemented yet.

<a name="props"></a>
## Props

### `<Filter>`

| Prop | Type | Required | Description |
|---|---|---|---|
| `fields` | `Field[]` | yes | The list of fields available to build conditions from. |
| `onChange` | `(conditions: Condition[]) => void` | no | Called whenever the list of conditions changes. |

### Types

The package exports its TypeScript types alongside the component:

```ts
import type { Field, FieldType, ListOption, Condition, ConditionValue } from "structured-filter-react";
```

<a name="development"></a>
## Development

```bash
npm install       # install dependencies
npm run demo      # run the demo app at http://localhost:3001
npm run build     # build the library to dist/
npm run typecheck # type-check the project
```

<a name="license"></a>
## License

Structured-Filter-React is released under the MIT license.

Copyright (c) 2026 [Olivier Giulieri](https://evoluteur.github.io/).
