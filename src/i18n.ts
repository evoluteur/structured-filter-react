export interface I18n {
  [key: string]: string;
  sEqual: string;
  sNotEqual: string;
  sStart: string;
  sContain: string;
  sNotContain: string;
  sFinish: string;
  sInList: string;
  sIsNull: string;
  sIsNotNull: string;
  sBefore: string;
  sAfter: string;
  sNumEqual: string;
  sNumNotEqual: string;
  sGreater: string;
  sSmaller: string;
  sOn: string;
  sNotOn: string;
  sAt: string;
  sNotAt: string;
  sBetween: string;
  sNotBetween: string;
  opAnd: string;
  yes: string;
  no: string;
  bNewCond: string;
  bAddCond: string;
  bUpdateCond: string;
  bOK: string;
  bCancel: string;
}

const i18n: I18n = {
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
  bCancel: "Cancel",
};

export default i18n;
