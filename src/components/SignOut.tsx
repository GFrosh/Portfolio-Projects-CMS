"use client";


import { useState } from "react";
import { signOut } from "next-auth/react";
import { SignOutIcon } from "@/components/icons";
import styles from "@/components/PortDeck.module.css";

export function LogoutButton() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleSignOut = async () => {
		setIsLoggingOut(true);
		try {
			await signOut({ redirectTo: "/login" });
		} catch (error) {
			console.error("Logout failed:", error);
			setIsLoggingOut(false); // Re-enable button if something goes wrong
		}
	};

	return (
		<button
			className={styles.buttonSecondary}
			onClick={handleSignOut}
			disabled={isLoggingOut}
			type="button"
			title="Sign out"
			aria-label="Sign out"
		>
			<SignOutIcon style={{ width: '1rem', height: '1rem' }} />
			<span className={styles.signOutLabel}>
				{isLoggingOut ? "Signing out..." : "Sign out"}
			</span>
		</button>
	);
}
