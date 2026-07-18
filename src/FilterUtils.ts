function symetric(obj: Record<string, string>): Record<string, string> {
  let sym: Record<string, string> = {};
  for (let prop in obj) {
    sym[obj[prop]] = prop;
  }
  return sym;
}

export function dateString(d?: string | null): string {
  if (d) {
    d = d.substring(0, 10);
    const dateParts = d.split("-");
    if (dateParts.length > 1) {
      return dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
    }
  }
  return "";
}

export const evoAPI = {
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
  sNotBetween: "nbw",
} as const;

export type Operator = (typeof evoAPI)[keyof typeof evoAPI];

export const api2i18n = symetric(evoAPI);
