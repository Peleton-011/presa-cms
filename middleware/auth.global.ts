import { useAuth } from "@clerk/nuxt/composables";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
	const { userId } = useAuth();

	// If the user is not signed in, redirect to the signup page
	if (!userId.value && !["/signup", "/signin"].includes(to.path)) {
		return navigateTo("/signup");
	}
});
