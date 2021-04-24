import * as React from "react";

export interface inputType {
    type?: string;
    htmlFor: string;
    name: string;
    label: string;
    value?: string;
    register?: any;
    readOnly?: boolean;
    className?: string;
}

export function Input(props: inputType) {
    const classes = `${props.className} myInput`;

    if (props.type === "textarea") {
        return (
            <div className={props.className ? classes : "myInput"}>
                <label htmlFor={props.htmlFor}>{props.label}</label>
                <br />
                <textarea
                    name={props.name}
                    id={props.name}
                    readOnly={props.readOnly ? props.readOnly : false}
                    defaultValue={props.value}
                    ref={props.register}
                />
            </div>
        );
    } else {
        return (
            <div className={props.className ? classes : "myInput"}>
                <label htmlFor={props.htmlFor}>{props.label}</label>
                <br />
                <input
                    type={props.type ? props.type : "text"}
                    name={props.name}
                    id={props.name}
                    readOnly={props.readOnly ? props.readOnly : false}
                    defaultValue={props.value}
                    ref={props.register}
                ></input>
            </div>
        );
    }
}
