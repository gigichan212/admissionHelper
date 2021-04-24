import * as React from "react";

export interface optionType {
    value: string;
    option: string;
}

export function Option(props: optionType) {
    return <option value={props.value}>{props.option}</option>;
}
