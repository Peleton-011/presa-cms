// Sample clerk middleware
import { clerkMiddleware } from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
	const { userId } = useAuth();
	const isInvoicesRoute = event.path.startsWith("/");

	// Check if user is accessing sensitive customer data
	if (isInvoicesRoute) {
		// Check if user has the required permission
		if (!userId.value) {
			navigateTo("/sign-up");
            // throw createError({
			// 	statusCode: 403,
			// 	statusMessage:
			// 		"Unauthorized: Missing permission to create invoices",
			// });
		}
	}
});
