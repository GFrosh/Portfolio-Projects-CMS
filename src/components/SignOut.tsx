import { signOut } from "@/app/auth";

export function SignOut() {
	return (
		<form
		action={async () => {
			"use server"
			// This clears the cookies/session and logs the user out
			await signOut()
		}}
		>
		<button type="submit">Sign Out</button>
		</form>
	);
}
