<template>
	<header>
		<h1>This should always be here</h1>
		<SignedIn>
			<UserButton />
		</SignedIn>
		{{ user ? user.firstName : "" }}
	</header>
</template>

<script setup>
import { SignedIn, UserButton, useAuth } from "@clerk/vue";

const { user, isAuthenticated } = useAuth();

definePageMeta({
	// `auth` is the name of the middleware file
	// middleware: ["auth"],
});
</script>
