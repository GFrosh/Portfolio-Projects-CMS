import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { GitHubSignupController } from "@/controllers/signup.controller";
import { authAuthorizeController } from "@/controllers/login.controller";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		GitHub,
		Credentials({
			name: "Credentials",
			async authorize(credentials) {
				return await authAuthorizeController(credentials);
			}
		})
	],
	session: { strategy: "jwt" },
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === "credentials") {
				return true;
			}

			if (!user.email) return false;

			const response = await GitHubSignupController({ 
				name: user.name ?? "", 
				email: user.email 
			});	
			
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
