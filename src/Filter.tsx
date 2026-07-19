import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";

import i18n from "./i18n";
import FilterPill from "./FilterPill";
import { evoAPI, api2i18n, dateString } from "./FilterUtils";
import type { Condition, ConditionValue, Field, FieldType } from "./types";

import "./Filter.css";

const fieldTypes: Record<string, FieldType> = {
  text: "text",
  bool: "boolean",
  number: "number",
  date: "date",
  time: "time",
  list: "list",
};

const opt = (value: string, label: string) => (
  <option value={value} key={value}>
    {label}
  </option>
);

function lovHash(lov: Field["list"]): Record<string, string> {
  let h: Record<string, string> = {};
  (lov || []).forEach((l) => {
    h[l.id] = l.text;
  });
  return h;
}

function fieldsHash(fields: Field[]): Record<string, Field> {
  let h: Record<string, Field> = {};
  fields.forEach((f) => {
    h[f.id] = f;
  });
  return h;
}

export interface FilterProps {
  /** The list of fields available to build search conditions from. */
  fields: Field[];
  /** Called whenever the list of conditions changes (a condition is added, edited, or removed). */
  onChange?: (conditions: Condition[]) => void;
}

export default function Filter({ fields, onChange }: FilterProps) {
  const fieldsH = useMemo(() => fieldsHash(fields), [fields]);
  const hashLovs = useRef<Record<string, Record<string, string>>>({});
  const hashLovConds = useRef<Record<string, string>>({});

  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    onChange?.(conditions);
  }, [conditions, onChange]);
  const [field, setField] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [value, setValue] = useState<ConditionValue>(null);
  const [showCondition, setShowCondition] = useState(false);
  const [conditionIdx, setConditionIdx] = useState(-1);

  const toggleCondition = useCallback(() => {
    setShowCondition((prev) => !prev);
  }, []);

  const fieldChange = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    setField(evt.currentTarget.value);
    setOperator(null);
  }, []);

  const operatorChange = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    const op = evt.currentTarget.value;

    hashLovConds.current = {};
    setOperator(op);
    setValue((prev) => (op === "null" || op === "nn" ? null : prev));
  }, []);

  const valueChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const f = field ? fieldsH[field] : null,
        target = evt.currentTarget;
      let v: ConditionValue = target.value;

      if (f && f.type === fieldTypes.list) {
        if (target.checked) {
          hashLovConds.current[v as string] = target.parentElement?.textContent || "";
        } else {
          delete hashLovConds.current[v as string];
        }
        v = Object.keys(hashLovConds.current);
      }
      setValue(v);
    },
    [field, fieldsH]
  );

  const cancel = useCallback(() => {
    hashLovConds.current = {};
    setField(null);
    setOperator(null);
    setValue(null);
    setShowCondition(false);
    setConditionIdx(-1);
  }, []);

  const ok = useCallback(() => {
    setConditions((prevConditions) => {
      const c: Condition = {
        field: field as string,
        operator: operator as string,
        value: operator === "null" || operator === "nn" ? null : value,
      };

      if (conditionIdx > -1) {
        const next = prevConditions.slice();
        next[conditionIdx] = c;
        return next;
      }
      return prevConditions.concat([c]);
    });
    hashLovConds.current = {};
    setField(null);
    setOperator(null);
    setValue(null);
    setShowCondition(false);
    setConditionIdx(-1);
  }, [field, operator, value, conditionIdx]);

  const deletePill = useCallback(
    (idx: number) => {
      if (idx > -1 && conditions.length) {
        let condIdx = -1;
        if (idx < conditionIdx) {
          condIdx = conditionIdx - 1;
        } else if (idx > conditionIdx) {
          condIdx = conditionIdx;
        }
        setConditions((prev) => {
          const next = prev.slice();
          next.splice(idx, 1);
          return next;
        });
        setConditionIdx(condIdx);
      }
    },
    [conditions.length, conditionIdx]
  );

  const editPill = useCallback(
    (idx: number) => {
      const c = conditions[idx];
      if (!c) {
        return;
      }
      const fid = c.field,
        fType = fieldsH[fid].type;

      if (fType === fieldTypes.list) {
        const hlov = hashLovs.current[fid];
        const nextHashLovConds: Record<string, string> = {};
        (c.value as string[]).forEach((v) => {
          nextHashLovConds[v] = hlov[v];
        });
        hashLovConds.current = nextHashLovConds;
      }
      if (idx > -1 && conditions.length) {
        setField(fid);
        setOperator(c.operator);
        setValue(c.value);
        setShowCondition(true);
        setConditionIdx(idx);
      }
    },
    [conditions, fieldsH]
  );

  const operatorText = (op: string): string => {
    return i18n[api2i18n[op]];
  };

  const valueText = (v: ConditionValue, f: Field): string => {
    if (f.type === fieldTypes.list) {
      if (!v) {
        return "";
      }
      let hlov = hashLovs.current[f.id];
      if (!hlov) {
        hlov = hashLovs.current[f.id] = lovHash(f.list);
      }
      return (v as string[]).map((vi) => hlov[vi]).join(", ");
    } else if (f.type === fieldTypes.bool) {
      return v && v !== "0" ? i18n.yes : i18n.no;
    } else if (f.type === fieldTypes.date) {
      return dateString(v as string);
    }
    return (v as string) || "";
  };

  const pillValue = (cond: Condition) => {
    const f = fieldsH[cond.field];
    return {
      field: f.label,
      operator: operatorText(cond.operator),
      value: valueText(cond.value, f),
      op: cond.operator,
    };
  };

  const conditionIsValid = (): boolean => {
    if (field && operator) {
      if (operator === "null" || operator === "nn") {
        return true;
      }
      return !!value;
    }
    return false;
  };

  const renderOperator = (): ReactNode => {
    const f = fieldsH[field as string],
      opts: ReactNode[] = [],
      fType = f.type;

    switch (fType) {
      case fieldTypes.list:
        opts.push(opt(evoAPI.sInList, i18n.sInList));
        break;
      case fieldTypes.bool:
        opts.push(opt(evoAPI.sEqual, i18n.sEqual));
        break;
      case fieldTypes.date:
      case fieldTypes.time:
        if (fType === fieldTypes.time) {
          opts.push(
            opt(evoAPI.sEqual, i18n.sAt),
            opt(evoAPI.sNotEqual, i18n.sNotAt)
          );
        } else {
          opts.push(
            opt(evoAPI.sEqual, i18n.sOn),
            opt(evoAPI.sNotEqual, i18n.sNotOn)
          );
        }
        opts.push(
          opt(evoAPI.sGreater, i18n.sAfter),
          opt(evoAPI.sSmaller, i18n.sBefore),
          opt(evoAPI.sBetween, i18n.sBetween),
          opt(evoAPI.sNotBetween, i18n.sNotBetween)
        );
        break;
      case fieldTypes.number:
        opts.push(
          opt(evoAPI.sEqual, i18n.sNumEqual),
          opt(evoAPI.sNotEqual, i18n.sNumNotEqual),
          opt(evoAPI.sGreater, i18n.sGreater),
          opt(evoAPI.sSmaller, i18n.sSmaller)
        );
        break;
      default:
        opts.push(
          opt(evoAPI.sEqual, i18n.sEqual),
          opt(evoAPI.sNotEqual, i18n.sNotEqual),
          opt(evoAPI.sStart, i18n.sStart),
          opt(evoAPI.sContain, i18n.sContain),
          opt(evoAPI.sNotContain, i18n.sNotContain),
          opt(evoAPI.sFinish, i18n.sFinish)
        );
    }
    opts.push(
      opt(evoAPI.sIsNull, i18n.sIsNull),
      opt(evoAPI.sIsNotNull, i18n.sIsNotNull)
    );
    return (
      <select
        onChange={operatorChange}
        value={operator || ""}
        className="form-control"
      >
        <option />
        {opts}
      </select>
    );
  };

  const renderValue = (): ReactNode => {
    const f = field ? fieldsH[field] : null,
      fType = f?.type,
      v = value;

    if (operator === "null" || operator === "nn") {
      return null;
    }
    switch (fType) {
      case fieldTypes.bool:
        return (
          <span id="value">
            <label htmlFor="value1">
              <input
                id="value1"
                name="value"
                type="radio"
                value="1"
                checked={v === "1"}
                onChange={valueChange}
              />
              {i18n.yes}
            </label>
            &nbsp;
            <label htmlFor="value0">
              <input
                id="value0"
                name="value"
                type="radio"
                value="0"
                checked={v === "0"}
                onChange={valueChange}
              />
              {i18n.no}
            </label>
            &nbsp;
          </span>
        );
      case fieldTypes.list:
        return (
          <span id="value" className="lov-checkboxes">
            {f?.list?.map((lv) => (
              <span key={lv.id}>
                <label>
                  <input
                    type="checkbox"
                    value={lv.id}
                    onChange={valueChange}
                    checked={!!hashLovConds.current[lv.id]}
                  />
                  {lv.text}
                </label>
              </span>
            ))}
          </span>
        );
      case fieldTypes.date:
      case fieldTypes.time:
        return (
          <input
            id="value"
            type={fType}
            onChange={valueChange}
            value={(v as string) || ""}
            className="form-control"
          />
        );
      default:
        return (
          <input
            id="value"
            type="text"
            onChange={valueChange}
            value={(v as string) || ""}
            className="form-control"
          />
        );
    }
  };

  return (
    <div className="evo-filter">
      <div className="fltr-pills">
        {conditions
          ? conditions.map((c, idx) => (
              <FilterPill
                {...pillValue(c)}
                key={c.field + idx}
                id={"" + idx}
                selected={idx === conditionIdx}
                fnEdit={editPill}
                fnDelete={deletePill}
              />
            ))
          : null}
      </div>
      <div className="fltr-cond">
        {showCondition ? (
          <div className="cond evol-fld">
            <div className="cond-field">
              <div className="evo-rdonly">
                <select
                  onChange={fieldChange}
                  value={field || ""}
                  className="form-control"
                >
                  <option value="" />
                  {fields.map((f) => (
                    <option value={f.id} key={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {field ? (
              <div className="cond-operator">
                <div className="evo-rdonly">{renderOperator()}</div>
              </div>
            ) : null}
            {operator ? (
              <div className="cond-value">
                <div className="evo-rdonly">{renderValue()}</div>
              </div>
            ) : null}
            <br />
            <div className="cond-buttons">
              <button onClick={cancel} key="cancel" className="btn btn-default">
                {" "}
                {i18n.bCancel}{" "}
              </button>
              {conditionIsValid() ? (
                <button onClick={ok} key="ok" className="btn btn-primary">
                  {" "}
                  {i18n.bOK}{" "}
                </button>
              ) : null}
            </div>
            <div className="clearer" />
          </div>
        ) : (
          <button onClick={toggleCondition} key="plus" className="btn btn-default">
            {" "}
            +{" "}
          </button>
        )}
      </div>
    </div>
  );
}
