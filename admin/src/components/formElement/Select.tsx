import * as React from "react";
import { Option } from "../application/Option";

export interface selectType {
    htmlFor: string;
    name: string;
    label: string;
    option: string[][] | number[][] | (number[] | string[])[];
    register?: any;
    class?: string;
}

export function Select(props: selectType) {
    return (
        <div className={props.class ? `myInput ${props.class}` : "myInput"}>
            <label htmlFor={props.htmlFor}>{props.label}</label>
            <br />
            <select name={props.name} id={props.name} ref={props.register}>
                {props.option.map((opt: string[] | number[]) => {
                    return (
                        <Option
                            value={opt[0] + ""}
                            option={opt[1] + ""}
                        ></Option>
                    );
                })}
            </select>
        </div>
    );
}
