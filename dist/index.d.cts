import * as react from 'react';

type FieldType = "text" | "boolean" | "number" | "date" | "time" | "list";
interface ListOption {
    id: string;
    text: string;
}
interface Field {
    id: string;
    type: FieldType;
    label: string;
    list?: ListOption[];
}
type ConditionValue = string | string[] | null;
interface Condition {
    field: string;
    operator: string;
    value: ConditionValue;
}

interface FilterProps {
    /** The list of fields available to build search conditions from. */
    fields: Field[];
    /** Called whenever the list of conditions changes (a condition is added, edited, or removed). */
    onChange?: (conditions: Condition[]) => void;
}
declare function Filter({ fields, onChange }: FilterProps): react.JSX.Element;

export { type Condition, type ConditionValue, type Field, type FieldType, type FilterProps, type ListOption, Filter as default };
