// src/Filter.tsx
import { useCallback as useCallback2, useEffect, useMemo, useRef, useState } from "react";

// src/i18n.ts
var i18n = {
  sEqual: "equals",
  sNotEqual: "not equal",
  sStart: "starts with",
  sContain: "contains",
  sNotContain: "doesn't contain",
  sFinish: "finishes with",
  sInList: "any of",
  sIsNull: "is empty",
  sIsNotNull: "is not empty",
  sBefore: "before",
  sAfter: "after",
  sNumEqual: "=",
  sNumNotEqual: "!=",
  sGreater: ">",
  sSmaller: "<",
  sOn: "on",
  sNotOn: "not on",
  sAt: "at",
  sNotAt: "not at",
  sBetween: "between",
  sNotBetween: "not between",
  opAnd: "and",
  yes: "Yes",
  no: "No",
  bNewCond: "New filter condition",
  bAddCond: "Add condition",
  bUpdateCond: "Update condition",
  bOK: "OK",
  bCancel: "Cancel"
};
var i18n_default = i18n;

// src/FilterPill.tsx
import { memo, useCallback } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var FilterPill = memo(function FilterPill2({
  id,
  field,
  operator,
  value,
  op,
  selected,
  fnEdit,
  fnDelete
}) {
  const clickEdit = useCallback(
    (evt) => {
      fnEdit(parseInt(evt.currentTarget.id, 10));
    },
    [fnEdit]
  );
  const clickDelete = useCallback(
    (evt) => {
      evt.stopPropagation();
      fnDelete(parseInt(evt.currentTarget.id, 10));
    },
    [fnDelete]
  );
  const valueEl = op === "null" || op === "nn" ? null : /* @__PURE__ */ jsx("span", { className: "pill-value", children: value });
  return /* @__PURE__ */ jsxs("div", { id, className: selected ? "active-pill" : "", onClick: clickEdit, children: [
    /* @__PURE__ */ jsxs("span", { className: "pill-text", children: [
      /* @__PURE__ */ jsx("span", { className: "pill-field", children: field }),
      /* @__PURE__ */ jsx("span", { className: "pill-operator", children: operator }),
      valueEl
    ] }),
    /* @__PURE__ */ jsx("span", { className: "pill-del", id, onClick: clickDelete, children: "\xD7" })
  ] });
});
var FilterPill_default = FilterPill;

// src/FilterUtils.ts
function symetric(obj) {
  let sym = {};
  for (let prop in obj) {
    sym[obj[prop]] = prop;
  }
  return sym;
}
function dateString(d) {
  if (d) {
    d = d.substring(0, 10);
    const dateParts = d.split("-");
    if (dateParts.length > 1) {
      return dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
    }
  }
  return "";
}
var evoAPI = {
  sEqual: "eq",
  sNotEqual: "ne",
  sStart: "sw",
  sContain: "ct",
  sNotContain: "nct",
  sFinish: "fw",
  sInList: "in",
  sIsNull: "null",
  sIsNotNull: "nn",
  sGreater: "gt",
  sSmaller: "lt",
  sBetween: "bw",
  sNotBetween: "nbw"
};
var api2i18n = symetric(evoAPI);

// src/Filter.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
import { createElement } from "react";
var fieldTypes = {
  text: "text",
  bool: "boolean",
  number: "number",
  date: "date",
  time: "time",
  list: "list"
};
var opt = (value, label) => /* @__PURE__ */ jsx2("option", { value, children: label }, value);
function lovHash(lov) {
  let h = {};
  (lov || []).forEach((l) => {
    h[l.id] = l.text;
  });
  return h;
}
function fieldsHash(fields) {
  let h = {};
  fields.forEach((f) => {
    h[f.id] = f;
  });
  return h;
}
function Filter({ fields, onChange }) {
  const fieldsH = useMemo(() => fieldsHash(fields), [fields]);
  const hashLovs = useRef({});
  const hashLovConds = useRef({});
  const [conditions, setConditions] = useState([]);
  useEffect(() => {
    onChange?.(conditions);
  }, [conditions, onChange]);
  const [field, setField] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState(null);
  const [showCondition, setShowCondition] = useState(false);
  const [conditionIdx, setConditionIdx] = useState(-1);
  const toggleCondition = useCallback2(() => {
    setShowCondition((prev) => !prev);
  }, []);
  const fieldChange = useCallback2((evt) => {
    setField(evt.currentTarget.value);
    setOperator(null);
  }, []);
  const operatorChange = useCallback2((evt) => {
    const op = evt.currentTarget.value;
    hashLovConds.current = {};
    setOperator(op);
    setValue((prev) => op === "null" || op === "nn" ? null : prev);
  }, []);
  const valueChange = useCallback2(
    (evt) => {
      const f = field ? fieldsH[field] : null, target = evt.currentTarget;
      let v = target.value;
      if (f && f.type === fieldTypes.list) {
        if (target.checked) {
          hashLovConds.current[v] = target.parentElement?.textContent || "";
        } else {
          delete hashLovConds.current[v];
        }
        v = Object.keys(hashLovConds.current);
      }
      setValue(v);
    },
    [field, fieldsH]
  );
  const cancel = useCallback2(() => {
    hashLovConds.current = {};
    setField(null);
    setOperator(null);
    setValue(null);
    setShowCondition(false);
    setConditionIdx(-1);
  }, []);
  const ok = useCallback2(() => {
    setConditions((prevConditions) => {
      const c = {
        field,
        operator,
        value: operator === "null" || operator === "nn" ? null : value
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
  const deletePill = useCallback2(
    (idx) => {
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
  const editPill = useCallback2(
    (idx) => {
      const c = conditions[idx];
      if (!c) {
        return;
      }
      const fid = c.field, fType = fieldsH[fid].type;
      if (fType === fieldTypes.list) {
        const hlov = hashLovs.current[fid];
        const nextHashLovConds = {};
        c.value.forEach((v) => {
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
  const operatorText = (op) => {
    return i18n_default[api2i18n[op]];
  };
  const valueText = (v, f) => {
    if (f.type === fieldTypes.list) {
      if (!v) {
        return "";
      }
      let hlov = hashLovs.current[f.id];
      if (!hlov) {
        hlov = hashLovs.current[f.id] = lovHash(f.list);
      }
      return v.map((vi) => hlov[vi]).join(", ");
    } else if (f.type === fieldTypes.bool) {
      return v && v !== "0" ? i18n_default.yes : i18n_default.no;
    } else if (f.type === fieldTypes.date) {
      return dateString(v);
    }
    return v || "";
  };
  const pillValue = (cond) => {
    const f = fieldsH[cond.field];
    return {
      field: f.label,
      operator: operatorText(cond.operator),
      value: valueText(cond.value, f),
      op: cond.operator
    };
  };
  const conditionIsValid = () => {
    if (field && operator) {
      if (operator === "null" || operator === "nn") {
        return true;
      }
      return !!value;
    }
    return false;
  };
  const renderOperator = () => {
    const f = fieldsH[field], opts = [], fType = f.type;
    switch (fType) {
      case fieldTypes.list:
        opts.push(opt(evoAPI.sInList, i18n_default.sInList));
        break;
      case fieldTypes.bool:
        opts.push(opt(evoAPI.sEqual, i18n_default.sEqual));
        break;
      case fieldTypes.date:
      case fieldTypes.time:
        if (fType === fieldTypes.time) {
          opts.push(
            opt(evoAPI.sEqual, i18n_default.sAt),
            opt(evoAPI.sNotEqual, i18n_default.sNotAt)
          );
        } else {
          opts.push(
            opt(evoAPI.sEqual, i18n_default.sOn),
            opt(evoAPI.sNotEqual, i18n_default.sNotOn)
          );
        }
        opts.push(
          opt(evoAPI.sGreater, i18n_default.sAfter),
          opt(evoAPI.sSmaller, i18n_default.sBefore),
          opt(evoAPI.sBetween, i18n_default.sBetween),
          opt(evoAPI.sNotBetween, i18n_default.sNotBetween)
        );
        break;
      case fieldTypes.number:
        opts.push(
          opt(evoAPI.sEqual, i18n_default.sNumEqual),
          opt(evoAPI.sNotEqual, i18n_default.sNumNotEqual),
          opt(evoAPI.sGreater, i18n_default.sGreater),
          opt(evoAPI.sSmaller, i18n_default.sSmaller)
        );
        break;
      default:
        opts.push(
          opt(evoAPI.sEqual, i18n_default.sEqual),
          opt(evoAPI.sNotEqual, i18n_default.sNotEqual),
          opt(evoAPI.sStart, i18n_default.sStart),
          opt(evoAPI.sContain, i18n_default.sContain),
          opt(evoAPI.sNotContain, i18n_default.sNotContain),
          opt(evoAPI.sFinish, i18n_default.sFinish)
        );
    }
    opts.push(
      opt(evoAPI.sIsNull, i18n_default.sIsNull),
      opt(evoAPI.sIsNotNull, i18n_default.sIsNotNull)
    );
    return /* @__PURE__ */ jsxs2(
      "select",
      {
        onChange: operatorChange,
        value: operator || "",
        className: "form-control",
        children: [
          /* @__PURE__ */ jsx2("option", {}),
          opts
        ]
      }
    );
  };
  const renderValue = () => {
    const f = field ? fieldsH[field] : null, fType = f?.type, v = value;
    if (operator === "null" || operator === "nn") {
      return null;
    }
    switch (fType) {
      case fieldTypes.bool:
        return /* @__PURE__ */ jsxs2("span", { id: "value", children: [
          /* @__PURE__ */ jsxs2("label", { htmlFor: "value1", children: [
            /* @__PURE__ */ jsx2(
              "input",
              {
                id: "value1",
                name: "value",
                type: "radio",
                value: "1",
                checked: v === "1",
                onChange: valueChange
              }
            ),
            i18n_default.yes
          ] }),
          "\xA0",
          /* @__PURE__ */ jsxs2("label", { htmlFor: "value0", children: [
            /* @__PURE__ */ jsx2(
              "input",
              {
                id: "value0",
                name: "value",
                type: "radio",
                value: "0",
                checked: v === "0",
                onChange: valueChange
              }
            ),
            i18n_default.no
          ] }),
          "\xA0"
        ] });
      case fieldTypes.list:
        return /* @__PURE__ */ jsx2("span", { id: "value", className: "lov-checkboxes", children: f?.list?.map((lv) => /* @__PURE__ */ jsx2("span", { children: /* @__PURE__ */ jsxs2("label", { children: [
          /* @__PURE__ */ jsx2(
            "input",
            {
              type: "checkbox",
              value: lv.id,
              onChange: valueChange,
              checked: !!hashLovConds.current[lv.id]
            }
          ),
          lv.text
        ] }) }, lv.id)) });
      case fieldTypes.date:
      case fieldTypes.time:
        return /* @__PURE__ */ jsx2(
          "input",
          {
            id: "value",
            type: fType,
            onChange: valueChange,
            value: v || "",
            className: "form-control"
          }
        );
      default:
        return /* @__PURE__ */ jsx2(
          "input",
          {
            id: "value",
            type: "text",
            onChange: valueChange,
            value: v || "",
            className: "form-control"
          }
        );
    }
  };
  return /* @__PURE__ */ jsxs2("div", { className: "evo-filter", children: [
    /* @__PURE__ */ jsx2("div", { className: "fltr-pills", children: conditions ? conditions.map((c, idx) => /* @__PURE__ */ createElement(
      FilterPill_default,
      {
        ...pillValue(c),
        key: c.field + idx,
        id: "" + idx,
        selected: idx === conditionIdx,
        fnEdit: editPill,
        fnDelete: deletePill
      }
    )) : null }),
    /* @__PURE__ */ jsx2("div", { className: "fltr-cond", children: showCondition ? /* @__PURE__ */ jsxs2("div", { className: "cond evol-fld", children: [
      /* @__PURE__ */ jsx2("div", { className: "cond-field", children: /* @__PURE__ */ jsx2("div", { className: "evo-rdonly", children: /* @__PURE__ */ jsxs2(
        "select",
        {
          onChange: fieldChange,
          value: field || "",
          className: "form-control",
          children: [
            /* @__PURE__ */ jsx2("option", { value: "" }),
            fields.map((f) => /* @__PURE__ */ jsx2("option", { value: f.id, children: f.label }, f.id))
          ]
        }
      ) }) }),
      field ? /* @__PURE__ */ jsx2("div", { className: "cond-operator", children: /* @__PURE__ */ jsx2("div", { className: "evo-rdonly", children: renderOperator() }) }) : null,
      operator ? /* @__PURE__ */ jsx2("div", { className: "cond-value", children: /* @__PURE__ */ jsx2("div", { className: "evo-rdonly", children: renderValue() }) }) : null,
      /* @__PURE__ */ jsx2("br", {}),
      /* @__PURE__ */ jsxs2("div", { className: "cond-buttons", children: [
        /* @__PURE__ */ jsxs2("button", { onClick: cancel, className: "btn btn-default", children: [
          " ",
          i18n_default.bCancel,
          " "
        ] }, "cancel"),
        conditionIsValid() ? /* @__PURE__ */ jsxs2("button", { onClick: ok, className: "btn btn-primary", children: [
          " ",
          i18n_default.bOK,
          " "
        ] }, "ok") : null
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "clearer" })
    ] }) : /* @__PURE__ */ jsxs2("button", { onClick: toggleCondition, className: "btn btn-default", children: [
      " ",
      "+",
      " "
    ] }, "plus") })
  ] });
}
export {
  Filter as default
};
//# sourceMappingURL=index.js.map