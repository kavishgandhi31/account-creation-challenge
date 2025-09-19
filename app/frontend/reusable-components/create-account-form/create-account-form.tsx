import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorList } from "../error-list/error-list";
import { FormInput } from "../form-input/form-input";
import { FormButton } from "../form-button/form-button";
import { validateCredentials } from "../../utils/validate-credentials";

type CredentialsError = {
    isUsernameValid: boolean;
    isPasswordValid: boolean;
    usernameErrors: string[];
    passwordErrors: string[];
};

export const CreateAccountForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [credentialsError, setCredentialsError] = React.useState<CredentialsError>({
        isUsernameValid: true,
        isPasswordValid: true,
        usernameErrors: [],
        passwordErrors: []
    });
    const [fieldEntered, setFieldEntered] = useState<{ username: boolean; password: boolean }>({
        username: false,
        password: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent, username: string, password: string) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { isUsernameValid, isPasswordValid, usernameErrors, passwordErrors } = await validateCredentials(username, password);
            setCredentialsError({ isUsernameValid, isPasswordValid, usernameErrors, passwordErrors });
            
            if (!isUsernameValid) {
                throw new Error(usernameErrors?.join(' ') ?? 'Invalid username');
            }
            if (!isPasswordValid) {
                throw new Error(passwordErrors?.join(' ') ?? 'Invalid password');
            }

            const response = await fetch('/api/create-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                navigate('/signup/account-selection');
            } else {
                throw new Error(data.errors ?? 'Failed to create account');
            }
        } catch (error) {
            console.error('Error creating account:', error);
        }
        setSubmitting(false);
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setFieldEntered((prev) => ({
            ...prev,
            [event.target.name]: true,
        }));
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "username") {
            setUsername(value);
            const result = await validateCredentials(value, password);
            setCredentialsError(result);
        } else if (name === "password") {
            setPassword(value);
            const result = await validateCredentials(username, value);
            setCredentialsError(result);
        }
    };
    const inputClassNames = "w-full px-3 border-b-2 border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm";
    const labelClassNames = "block text-sm font-small text-gray-500 mb-4";

    const isFormValid = credentialsError.isUsernameValid &&
        credentialsError.isPasswordValid &&
        username.length > 0 &&
        password.length > 0;

    return (
        <form className="w-full" onSubmit={(e) => {
            handleSubmit(e, username, password);
        }}>
            <div>
                <FormInput
                    name="username"
                    type="text"
                    label="Username"
                    required={true}
                    inputClassNames={inputClassNames} 
                    labelClassNames={labelClassNames}
                    value={username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {fieldEntered.username && !credentialsError.isUsernameValid ? <ErrorList errorField="username" errors={credentialsError.usernameErrors} /> : <></>}
            </div>
            <div className="mt-4">
                <FormInput
                    name="password"
                    type="password"
                    label="Password"
                    required={true}
                    inputClassNames={inputClassNames}
                    labelClassNames={labelClassNames}
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {fieldEntered.password && !credentialsError.isPasswordValid ? <ErrorList errorField="password" errors={credentialsError.passwordErrors} /> : <></>}
            </div>
            <div className="pb-4 w-full items-center justify-center">
                <FormButton type="submit" disabled={!isFormValid || submitting} classNames={`inline-block p-4 mt-4 w-full ${isFormValid ? 'bg-[hsla(244,49%,49%,1)]' : 'bg-[hsla(244,49%,80%,0.5)]'} text-white rounded-xl`}>
                    { submitting ? "Creating account..." : "Create Account" }
                </FormButton>
            </div>
        </form>
    );
}