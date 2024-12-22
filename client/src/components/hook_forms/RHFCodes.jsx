import { useRef } from "react";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Stack, TextField } from "@mui/material";

export default function RHFCodes({ keyName = "", inputs = [], ...other }) {
  const codesRef = useRef(null);
  const { control } = useFormContext();

  const handleChangeWithNextField = (event, handleChange) => {
    const { maxLength, value, name } = event.target;

    const fieldIndex = name.replace(keyName, "");
    const fieldIntIndex = Number(fieldIndex);

    const nextField = document.querySelector(
      `input[name=${keyName}${fieldIntIndex + 1}]`
    );
    const prevField = document.querySelector(
      `input[name=${keyName}${fieldIntIndex - 1}]`
    );

    if (value.length > maxLength) {
      event.target.value = value[0];
    }
    
    // Move focus to the next field
    if (value.length >= maxLength && fieldIntIndex < inputs.length && nextField !== null) {
      nextField.focus();
    }

    // If pressing backspace and the field is empty, move to the previous field
    if (event.key === "Backspace" && value === "" && prevField !== null) {
      prevField.focus();
    }

    handleChange(event);
  };

  return (
    <Stack direction="row" spacing={2} justifyContent="center" ref={codesRef}>
      {inputs.map((name, index) => (
        <Controller
          key={name}
          name={`${keyName}${index + 1}`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              autoFocus={index === 0}
              placeholder="-"
              onChange={(event) => handleChangeWithNextField(event, field.onChange)}
              onKeyDown={(event) => handleChangeWithNextField(event, field.onChange)}
              onFocus={(event) => event.currentTarget.select()}
              InputProps={{
                sx: {
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 },
                  "& input": { p: 0, textAlign: "center" },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent", // Remove the border color on focus
                  },
                },
                // Remove spinner (up/down arrows) in Chrome, Safari, Edge
                inputMode: 'numeric', // restrict to numeric keypad on mobile devices
              }}
              inputProps={{
                maxLength: 1,
                type: "number",
                // Remove up and down arrows in Firefox and Chrome
                style: {
                  boxShadow:'none',
                  MozAppearance: "textfield", // Firefox
                },
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                  WebkitAppearance: "none", // Chrome, Safari, Edge
                  margin: 0,
                },
              }}
              {...other}
            />
          )}
        />
      ))}
    </Stack>
  );
}
