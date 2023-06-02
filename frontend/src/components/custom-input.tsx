import {
  Form,
  FormCheckProps,
  FormControlProps,
  FormGroupProps,
  FormSelectProps,
} from "react-bootstrap";
import { isNullOrEmpty } from "../shared/helpers";
import styles from "./styles/custom-input.module.css";

export enum InputTypes {
  TEXT = "TEXT",
  SELECT = "SELECT",
  CHECK = "CHECK",
}

export type SelectInput = {
  key: string | number;
  value: string;
};

type Props = {
  inputType: InputTypes;
  name: string;
  onChange:
    | FormControlProps["onChange"]
    | FormSelectProps["onChange"]
    | FormCheckProps["onChange"];
  value?: FormControlProps["value"];
  checked?: FormCheckProps["checked"];
  optionValues?: any[];
  className?: string;
  controlId?: FormGroupProps["controlId"];
  label?: string;
  type?: FormControlProps["type"];
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  setLabel?: boolean;
};

export const CustomInput = ({
  inputType,
  className = "mb-3",
  controlId,
  label,
  type,
  placeholder = "",
  autoComplete = "off",
  required,
  name,
  value,
  onChange,
  error,
  defaultValue,
  optionValues,
  min,
  max,
  checked,
  setLabel = true,
}: Props) => (
  <Form.Group className={className} controlId={controlId}>
    {setLabel && label && <Form.Label>{label}</Form.Label>}

    {inputType === InputTypes.TEXT && (
      <Form.Control
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        name={name}
        value={value}
        isInvalid={!isNullOrEmpty(error)}
        onChange={onChange as FormControlProps["onChange"]}
      />
    )}

    {inputType === InputTypes.SELECT && (
      <Form.Select
        aria-label={label}
        onChange={onChange as FormSelectProps["onChange"]}
        defaultValue={defaultValue}
        name={name}
        autoComplete={autoComplete}
      >
        {typeof optionValues[0] !== "object"
          ? optionValues.map((type, index) => (
              <option key={index} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))
          : optionValues.map((type: SelectInput, index) => (
              <option key={index} value={type.key}>
                {type.value}
              </option>
            ))}
      </Form.Select>
    )}

    {inputType === InputTypes.CHECK && (
      <Form.Check
        type="switch"
        id={`default-${{ name }}`}
        label={label}
        name={name}
        checked={checked}
        onChange={onChange as FormCheckProps["onChange"]}
      />
    )}

    {error && <Form.Text className={styles.formText}>{error}</Form.Text>}
  </Form.Group>
);
