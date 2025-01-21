<script setup lang="ts">
// Components are automatically imported
</script>

<template>
	<header>
		<SignedOut>
			<SignInButton />
		</SignedOut>
		<SignedIn>
			<UserButton />
		</SignedIn>
	</header>

	<main>
		<NuxtPage />
		<div>
			<NuxtRouteAnnouncer />
			<NuxtWelcome />
		</div>
	</main>
</template>
