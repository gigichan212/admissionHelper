import { applicationType, applicationYear, round, periodsEditMap, periodIsActiveMap } from "./Mapping";

export interface periodItemsType {
  label: string;
  name: string;
  required: {};
  type?: string | undefined;
  options?: [string, string][] | [number, number][];
}

//Get label and name
export let periodItems: periodItemsType[] = Array.from(periodsEditMap)
  .slice(0, -1)
  .map((item) => {
    return {
      label: item[0],
      name: item[1],
      required: { required: true },
    };
  });

//Get options
const mapArray = [Array.from(applicationType), Array.from(applicationYear), Array.from(round)];

//Add type and option to period items array
const array1 = periodItems.slice(0, 3).map((item: periodItemsType) => {
  return { ...item, type: "select", options: mapArray[periodItems.indexOf(item)] };
});

//Add type to period items array
const array2 = periodItems.slice(3).map((item: periodItemsType) => {
  console.log(item);

  if (periodItems.indexOf(item) % 2 !== 0) {
    return { ...item, type: "date" };
  } else {
    return { ...item, type: "time" };
  }
});

//combine arrays
periodItems = [...array1, ...array2];
