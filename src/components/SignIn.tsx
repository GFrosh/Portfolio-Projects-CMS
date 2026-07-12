"use client";


import { useState } from "react";
import { signIn } from "next-auth/react";
import { GitHubIcon } from "@/components/icons";
import styles from './PortDeck.module.css';

export function GitHubLoginButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);
		try {
			await signIn("github", { redirectTo: "/dashboard" });
		} catch (error) {
			console.error("Login failed:", error);
			setIsLoading(false);
		}
	};

	return (
		<button 
			className={`${styles.buttonSecondary} ${styles.authSocialButton}`}
			onClick={handleLogin}
			disabled={isLoading}
			type="button"
			title="Sign in with GitHub"
			aria-label="Sign in with GitHub"
		>
			<GitHubIcon height={24} />
			{isLoading ? "Connecting..." : "GitHub"}
		</button>
	);
}
