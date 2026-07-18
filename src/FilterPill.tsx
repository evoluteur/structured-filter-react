import { memo, useCallback, type MouseEvent } from "react";

import "./FilterPill.css";

export interface FilterPillProps {
  id: string;
  field?: string;
  operator?: string;
  value?: string;
  op?: string;
  selected?: boolean;
  fnEdit: (idx: number) => void;
  fnDelete: (idx: number) => void;
}

const FilterPill = memo(function FilterPill({
  id,
  field,
  operator,
  value,
  op,
  selected,
  fnEdit,
  fnDelete,
}: FilterPillProps) {
  const clickEdit = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      fnEdit(parseInt(evt.currentTarget.id, 10));
    },
    [fnEdit]
  );

  const clickDelete = useCallback(
    (evt: MouseEvent<HTMLSpanElement>) => {
      evt.stopPropagation();
      fnDelete(parseInt(evt.currentTarget.id, 10));
    },
    [fnDelete]
  );

  const valueEl =
    op === "null" || op === "nn" ? null : (
      <span className="pill-value">{value}</span>
    );

  return (
    <div id={id} className={selected ? "active-pill" : ""} onClick={clickEdit}>
      <span className="pill-text">
        <span className="pill-field">{field}</span>
        <span className="pill-operator">{operator}</span>
        {valueEl}
      </span>
      <span className="pill-del" id={id} onClick={clickDelete}>
        ×
      </span>
    </div>
  );
});

export default FilterPill;
