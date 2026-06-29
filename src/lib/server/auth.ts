import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import { ALLOWED_GITHUB_ID } from "$env/static/private";

export const { handle, signIn, signOut } = SvelteKitAuth(async () => ({
  providers: [GitHub],
  trustHost: true,
  callbacks: {
    async signIn({ profile }) {
      return String(profile?.id) === ALLOWED_GITHUB_ID;
    }
  }
}));
