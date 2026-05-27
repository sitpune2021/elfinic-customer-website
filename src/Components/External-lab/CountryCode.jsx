import React from 'react';
import Select from 'react-select';
import useApi from '../../hooks/useApi';

function CountryCode({ onCountrySelect, value }) {
    const { countryCodes } = useApi();

    // Safety check to ensure countryCodes is an array before mapping
    const options = (countryCodes || []).map(country => ({
        value: country.dialCode,
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                    src={country.flag}
                    alt={country.name}
                    style={{ width: '20px', height: '15px' }}
                />
                <span>{country.dialCode} {country.name}</span>
            </div>
        ),
        country: country
    }));

    const handleChange = (selectedOption) => {
        if (onCountrySelect && selectedOption) {
            onCountrySelect(selectedOption.country);
        }
    };

    return (
        <Select
            options={options}
            value={options.find(opt => opt.value === value)}
            onChange={handleChange}
            isLoading={!countryCodes || countryCodes.length === 0}
            placeholder="Select country"
            isSearchable
        />
    );
}

export default CountryCode;