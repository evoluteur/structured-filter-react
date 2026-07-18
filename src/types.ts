export type FieldType = "text" | "boolean" | "number" | "date" | "time" | "list";

export interface ListOption {
  id: string;
  text: string;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  list?: ListOption[];
}

export type ConditionValue = string | string[] | null;

export interface Condition {
  field: string;
  operator: string;
  value: ConditionValue;
}
