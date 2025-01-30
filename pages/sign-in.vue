<script setup lang="ts">
import { ref } from "vue";
import { useSignIn, useClerk } from "@clerk/vue";
import { useToast } from "@/composables/useToast";
import { navigateTo } from "#app/composables/router";
import { PiEyeFill, PiEyeClosed } from "vue-icons-plus/pi";

const { isLoaded, signIn, setActive } = useSignIn();
const { showToast } = useToast();
const clerk = useClerk();

const form = ref({
	email: "",
	password: "",
});

const passwordVisibility = ref(false);

const togglePasswordVisibility = () => {
	passwordVisibility.value = !passwordVisibility.value;
};

const handleSignIn = async () => {
	try {
		if (!signIn.value || !isLoaded.value) {
			showToast("Sign-in is not ready. Please try again later.", "error");
			return;
		}

		const signInResponse = await signIn.value.create({
			identifier: form.value.email,
			password: form.value.password,
		});

		if (signInResponse.status === "complete") {
			await clerk.value?.setActive({
				session: signInResponse.createdSessionId,
			});
			showToast("Sign-in successful", "success");
			await navigateTo("/");
		}
	} catch (error) {
		console.error(error);
		showToast("Invalid email or password", "error");
	}
};

definePageMeta({
	layout: "auth-layout",
});
</script>

<template>
	<div v-if="isLoaded">
		<form @submit.prevent="handleSignIn" class="flex flex-col gap-4">
			<div class="grid gap-4 p-4 bg-black/25 backdrop-blur-sm">
				<div class="flex flex-col gap-2">
					<label for="email" class="text-[#e31e24]"
						>Email Address:</label
					>
					<input
						type="email"
						id="email"
						v-model="form.email"
						required
						placeholder="johndoe@nerv.jp"
						class="w-full bg-[#071013] text-[#ebebd3] border border-white/20 p-2 rounded focus:outline-none focus:border-[#e31e24] transition-colors"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="password" class="text-[#e31e24]"
						>Password:</label
					>
					<div class="relative">
						<input
							:type="passwordVisibility ? 'text' : 'password'"
							id="password"
							v-model="form.password"
							required
							class="w-full bg-[#071013] text-[#ebebd3] border border-white/20 p-2 rounded focus:outline-none focus:border-[#e31e24] transition-colors"
						/>
						<button
							type="button"
							@click="togglePasswordVisibility"
							class="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
						>
							<PiEyeFill
								v-if="!passwordVisibility"
								class="w-5 h-5"
							/>
							<PiEyeClosed v-else class="w-5 h-5" />
						</button>
					</div>
				</div>

				<button
					type="submit"
					class="mt-4 px-4 py-2 bg-[#e31e24] text-[#071013] rounded border border-white/20 hover:border-transparent active:bg-[#071013] active:text-[#e31e24] active:border-[#e31e24] transition-all duration-200"
				>
					Sign In
				</button>

				<p class="text-sm text-[#f18f01] text-center">
					Don't have an account?
					<NuxtLink to="/sign-up" class="text-[#e31e24]"
						>Sign Up</NuxtLink
					>
				</p>
			</div>
		</form>
	</div>

	<div v-else>Loading...</div>
</template>
