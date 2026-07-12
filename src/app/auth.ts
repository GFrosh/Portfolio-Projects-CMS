import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { GitHubSignupController } from "@/controllers/signup.controller";

export const { handlers, auth, signIn, signOut } = NextAuth({
  	providers: [GitHub],
	session: { strategy: "jwt" },
	callbacks: {
		async signIn({ user }) {
			if (!user.email) return false;

			const response = await GitHubSignupController({ name: user.name, email: user.email});	
			if (response.status === 200 || response.status === 201) {
				return true;
			}
		
			return false;
		}
	},
	pages: {
		signIn: "/login"
	}
});
