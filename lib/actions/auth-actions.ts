'use server';

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signOut = async () => {
    const result = await auth.api.signOut({ headers: await headers() });

    return result;
}

export const signInGoogle = async (provider: 'google') => {
    const {url} = await auth.api.signInSocial({
        body: {
            provider,
            callbackURL: 'http://localhost:3000/api/auth/callback/google'
        }
    })

    if (url) {
        redirect(url)
    }
}