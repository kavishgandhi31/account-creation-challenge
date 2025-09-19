import React from "react";
import Wealthfront_Logo from "../../reusable-components/wealthfront-logo/wealthfront-logo.png";
import { CreateAccountForm } from "../../reusable-components/create-account-form/create-account-form.tsx";

export function CreateAccount() {
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-25">
            <div className="flex flex-col items-center justify-center max-w-md w-full rounded-3xl shadow-2xl bg-white">
                <div className="w-full mt-4">
                    <img src={Wealthfront_Logo} alt="Wealthfront Logo" className="h-12 w-auto mx-auto mb-4" />
                </div>
                <h2 className="font-sans-serif font-black text-3xl text-gray-900">Create New Account</h2>
                <div className="flex flex-col items-center justify-center max-w-md w-full mt-8 px-4">
                    <CreateAccountForm />
                </div>
            </div>
        </div>
    )
}