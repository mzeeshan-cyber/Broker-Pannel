import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { OutlinedInput } from '@mui/material';
import Autocomplete from "react-google-autocomplete";
import 'react-phone-input-2/lib/style.css';

const AddressField = ({
    id,
    label,
    placeholder,
    touched,
    errors,
    values,
    handleBlur,
    setFieldValue,
    disabled
}) => {

    const GOOGLE_API = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

    return (
        <Stack spacing={1}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                error={Boolean(touched && errors)}
                id={id}
                name={id}
                onBlur={handleBlur}
                value={values}
                inputComponent={({ inputRef, ...inputProps }) => (
                    <Autocomplete
                        disabled={disabled}
                        apiKey={GOOGLE_API}
                        onPlaceSelected={(place) => {
                            setFieldValue(id, place.formatted_address);
                            setFieldValue(`${id}_place_id`, place.place_id);
                        }}
                        options={{
                            types: ["geocode"],
                            componentRestrictions: { country: "us" }
                        }}
                        defaultValue={values}
                        placeholder={placeholder}
                        inputProps={{
                            ref: inputRef,
                            ...inputProps,
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            width: '100%',
                            color: 'currentColor',
                            padding: '16px',
                            outline: 'none',
                            boxShadow: 'none',
                        }}
                    />
                )}
            />

        </Stack>
    )
}

export default AddressField