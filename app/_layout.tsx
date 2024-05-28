// Global layout  |  May used for context
import { Slot } from "expo-router";
// import { SessionProvider } from "@/components/core/AuthContext";

export default function Root() {
    // Set up the auth context and render our layout inside of it  |  For other providers, the same approach can be used
    return (
        <>
            <Slot />
        </>
    );
}