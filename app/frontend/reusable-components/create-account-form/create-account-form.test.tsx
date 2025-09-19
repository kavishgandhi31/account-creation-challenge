import React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { CreateAccountForm } from "./create-account-form";
import { BrowserRouter } from 'react-router-dom';
import { fireEvent } from "@testing-library/react";

global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Create Account Form", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url === '/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [],
                });
            }
            if (url === '/api/create-account') {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ success: true }),
                });
            }
            return Promise.reject(new Error('Unknown endpoint'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it ("renders the create account form component", async() => {
        const { container } = render(<CreateAccountForm />, { wrapper: BrowserRouter });
        await waitFor(() => {
            expect(container).toMatchSnapshot();

            expect(screen.getByText("Create Account")).toBeInTheDocument();
            expect(screen.getByLabelText("Username")).toBeInTheDocument();
            expect(screen.getByLabelText("Password")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
        });
    });

    it ("validates that username and password fields are of the required length", async () => {
        render(<CreateAccountForm />, { wrapper: BrowserRouter });
        
        const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
        const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: "Create Account" });

        // Initial state: no warnings
        await waitFor(() => {
            expect(screen.queryByTestId("username-error")).not.toBeInTheDocument();
            expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
        });

        // Entering invalid username and password
        fireEvent.change(usernameInput, { target: { value: "ab" } });
        fireEvent.blur(usernameInput);
        fireEvent.change(passwordInput, { target: { value: "shortpass" } });
        fireEvent.blur(passwordInput);
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.queryByTestId("username-error")).toHaveTextContent("Username must be between 10 and 50 characters.");
            expect(screen.queryByTestId("password-error")).toHaveTextContent("Password must be between 20 and 50 characters.");
        });
        
        // Entering valid username and password
        fireEvent.change(usernameInput, { target: { value: "validusername" } });
        fireEvent.blur(usernameInput);
        fireEvent.change(passwordInput, { target: { value: "passwordissolong123456789" } });
        fireEvent.blur(passwordInput);
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.queryByTestId("username-error")).not.toBeInTheDocument();
            expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
        });
    });

    it ("validates that username field is unique, doesn't have leading/trailing spaces, and is alphanumeric", async () => {
        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url === '/users') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [{ username: 'existinguser' }],
                });
            }
            return Promise.reject(new Error('Unknown endpoint'));
        });

        render(<CreateAccountForm />, { wrapper: BrowserRouter });
        
        const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
        const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: "Create Account" });

        // Entering username with leading/trailing spaces and non-alphanumeric characters
        fireEvent.change(usernameInput, { target: { value: " existing user! " } });
        fireEvent.blur(usernameInput);
        fireEvent.change(passwordInput, { target: { value: "passwordissolong123456789" } });
        fireEvent.blur(passwordInput);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByTestId("username-error")).toHaveTextContent("Username can only contain letters, numbers, underscores, and hyphens");
            expect(screen.queryByTestId("username-error")).toHaveTextContent("Username cannot have leading or trailing spaces");
        });

        // Entering a duplicate username
        fireEvent.change(usernameInput, { target: { value: "existinguser" } });
        fireEvent.blur(usernameInput);
        fireEvent.click(submitButton);

         await waitFor(() => {
            expect(screen.queryByTestId("username-error")).toHaveTextContent("Username already exists. Please choose a different one.");
        });
    });

    it ("submits the form and calls the /api/create-account endpoint", async () => {
        render(<CreateAccountForm />, { wrapper: BrowserRouter });

        const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
        const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
        const submitButton = screen.getByRole("button", { name: "Create Account" });

        // Entering valid username and password
        fireEvent.change(usernameInput, { target: { value: "validusername" } });
        fireEvent.blur(usernameInput);
        fireEvent.change(passwordInput, { target: { value: "passwordissolong123456789" } });
        fireEvent.blur(passwordInput);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect((global.fetch as jest.Mock)).toHaveBeenCalledWith('/api/create-account', expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: "validusername", password: "passwordissolong123456789" }),
            }));
        });

    });

    it("successful account creation navigates to account selection", async () => {
        render(<CreateAccountForm />, { wrapper: BrowserRouter });
        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "validusername" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "passwordissolong123456789" } });
        fireEvent.click(screen.getByRole("button", { name: /create account/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/signup/account-selection");
        });
    });
});

