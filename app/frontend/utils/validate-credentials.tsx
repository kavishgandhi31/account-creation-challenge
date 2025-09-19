import zxcvbn from 'zxcvbn';

type CredentialsError = {
    isUsernameValid: boolean;
    isPasswordValid: boolean;
    usernameErrors: string[];
    passwordErrors: string[];
}

export const validateCredentials = async (username: string, password: string): Promise<CredentialsError> => {
    let isUsernameValid = true;
    let isPasswordValid = true;
    const usernameErrors: string[] = [];
    const passwordErrors: string[] = [];

    // The username is >= 10 characters, and <= 50 characters.
    if (username.trim().length < 10 || username.trim().length > 50) { 
        isUsernameValid = false;
        usernameErrors.push('Username must be between 10 and 50 characters.');
    }

    //username should only allow letters, numbers, underscores, hyphens (no spaces or special characters)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        isUsernameValid = false;
        usernameErrors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // no leading or trailing spaces
    if (username !== username.trim()) {
        isUsernameValid = false;
        usernameErrors.push('Username cannot have leading or trailing spaces');
    }

    // no duplicate usernames
    const response = await fetch('/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const users = await response.json();
    const usernameSet = new Set(users.map((user: { username: string }) => user.username)); // creating a usernameSet for faster lookup
    
    if (usernameSet.has(username)) {
        isUsernameValid = false;
        usernameErrors.push('Username already exists. Please choose a different one.');
    }

    // The password is >= 20 characters, and <= 50 characters
    if (password.length < 20 || password.length > 50) {
        isPasswordValid = false;
        passwordErrors.push('Password must be between 20 and 50 characters.');
    }
    // Password contains at least 1 letter (a-zA-Z) and 1 number (0-9)
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        isPasswordValid = false;
        passwordErrors.push('Password must contain at least 1 letter and 1 number.');
    }
    // The password has a Zxcvbn score >= 2.
    const passwordResult = zxcvbn(password);
    if (passwordResult.score < 2) {
        isPasswordValid = false;
        passwordErrors.push('Password is too weak. Try adding more letters, numbers, and special characters.');
    }

    return { isUsernameValid, isPasswordValid, usernameErrors, passwordErrors };
}