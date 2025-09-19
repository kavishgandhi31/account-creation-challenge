import React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { CreateAccount } from "./create-account";
import { BrowserRouter } from "react-router-dom";

describe("CreateAccount", () => {
    it ("renders the create account form", async () => {
        const { container } = render(<CreateAccount />, { wrapper: BrowserRouter });
        await waitFor(() => {
            expect(container).toMatchSnapshot();

            expect(screen.getByText("Create Account")).toBeInTheDocument();
            expect(screen.getByLabelText("Username")).toBeInTheDocument();
            expect(screen.getByLabelText("Password")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
        })
        
    });
})