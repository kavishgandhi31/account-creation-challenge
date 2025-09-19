import { validateCredentials } from '../validate-credentials';

global.fetch = jest.fn();

describe('validateCredentials', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url === '/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ username: 'existinguser', password: 'existinguserpassword123456' }],
                });
            }
            return Promise.reject(new Error('Unknown endpoint'));
        });
    });

    it('returns valid for correct username and password', async () => {
        const result = await validateCredentials('validuser123', 'passwordissolong123456789');
        expect(result.isUsernameValid).toBe(true);
        expect(result.isPasswordValid).toBe(true);
        expect(result.usernameErrors).toHaveLength(0);
        expect(result.passwordErrors).toHaveLength(0);
    });

    it('invalid if username is too short', async () => {
        const result = await validateCredentials('short', 'passwordissolong123456789');
        expect(result.isUsernameValid).toBe(false);
        expect(result.usernameErrors).toContain('Username must be between 10 and 50 characters.');
    });

    it('invalid if username is too long', async () => {
        const longUsername = 'a'.repeat(51);
        const result = await validateCredentials(longUsername, 'passwordissolong123456789');
        expect(result.isUsernameValid).toBe(false);
        expect(result.usernameErrors).toContain('Username must be between 10 and 50 characters.');
    });

    it('invalid if username contains invalid characters', async () => {
        const result = await validateCredentials('invalid user!', 'passwordissolong123456789');
        expect(result.isUsernameValid).toBe(false);
        expect(result.usernameErrors).toContain('Username can only contain letters, numbers, underscores, and hyphens');
    });

    it('invalid if username has leading/trailing spaces', async () => {
        const result = await validateCredentials(' username123 ', 'passwordissolong123456789');
        expect(result.isUsernameValid).toBe(false);
        expect(result.usernameErrors).toContain('Username cannot have leading or trailing spaces');
    });

    it('invalid if username already exists', async () => {
        const result = await validateCredentials('existinguser', 'passwordissolong123456789');
        expect(result.isUsernameValid).toBe(false);
        expect(result.usernameErrors).toContain('Username already exists. Please choose a different one.');
    });

    it('invalid if password is too short', async () => {
        const result = await validateCredentials('validusername', 'pass');
        expect(result.isPasswordValid).toBe(false);
        expect(result.passwordErrors).toContain('Password must be between 20 and 50 characters.');
    });

    it('invalid if password is too long', async () => {
        const longPassword = 'a'.repeat(51) + '1';
        const result = await validateCredentials('validusername', longPassword);
        expect(result.isPasswordValid).toBe(false);
        expect(result.passwordErrors).toContain('Password must be between 20 and 50 characters.');
    });

    it('invalid if password lacks a letter', async () => {
        const result = await validateCredentials('validusername', '12345678901234567890');
        expect(result.isPasswordValid).toBe(false);
        expect(result.passwordErrors).toContain('Password must contain at least 1 letter and 1 number.');
    });

    it('invalid if password lacks a number', async () => {
        const result = await validateCredentials('validusername', 'thispassworddoesnotcontainanynumbers');
        expect(result.isPasswordValid).toBe(false);
        expect(result.passwordErrors).toContain('Password must contain at least 1 letter and 1 number.');
    });

    it('invalid if password is too weak', async () => {
        const result = await validateCredentials('validusername', 'weakpasswordpassword');
        expect(result.isPasswordValid).toBe(false);
        expect(result.passwordErrors).toContain('Password is too weak. Try adding more letters, numbers, and special characters.');
    });

    it('returns multiple errors for multiple invalid fields', async () => {
        const result = await validateCredentials(' existinguser ', 'short');
        expect(result.isUsernameValid).toBe(false);
        expect(result.usernameErrors.length).toBeGreaterThan(0);
        expect(result.isPasswordValid).toBe(false);
        expect(result.passwordErrors.length).toBeGreaterThan(0);
    });
});