import React from "react";
import { useSelector } from "react-redux";
import { Label } from "reactstrap";
import { IRootState } from "../../store";

export default function FormElement(props: {
  label: string;
  name: string;
  type?: string;
}) {
  const previewData = useSelector((state: IRootState) => {
    return state.application.payload.application.data;
  });

  return (
    <div className="form-ele">
      <div className="formLeft">
        <Label>{props.label}</Label>
      </div>
      <div className="formRight">
        <p>{(previewData as any)[props.name]}</p>
      </div>
    </div>
  );
}
