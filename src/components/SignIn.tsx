import { signIn } from "@/app/auth";

export function SignIn() {
	return (
		<form
		action={async () => {
			"use server"
			// This tells Auth.js to redirect the browser to GitHub login screen
			await signIn("github")
		}}
		>
		<button type="submit">Sign In with GitHub</button>
		</form>
	);
}
