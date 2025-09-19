import React from 'react';

type ErrorListProps = {
    errorField: string;
    errors: string[];
}

export function ErrorList({ errorField, errors }: ErrorListProps) {
    return errors.length > 0 && (
        <div data-testid={`${errorField}-error`} className="text-red-500 text-sm mt-4 mb-4 flex flex-wrap mr-4 ml-4">
            Invalid {errorField}. The {errorField} must meet the following requirements:
            <ul>
                {errors?.map((error, index) => (
                    <li key={index}>- {error}</li>
                ))}
            </ul>
        </div>
    );
}