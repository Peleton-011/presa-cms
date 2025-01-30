<script setup lang="ts">
import { ref } from "vue";
import { useSignIn, useClerk } from "@clerk/vue";
import { useToast } from "@/composables/useToast";
import { navigateTo } from "#app/composables/router";

import { PiEyeFill, PiEyeClosed } from "vue-icons-plus/pi";

const { isLoaded, signIn, setActive } = useSignIn();
const { showToast } = useToast();
const clerk = useClerk();

interface FormField {
	name: string;
	id: string;
	label: string;
	type: string;
	required: boolean;
	placeholder: string;
	pattern: RegExp;
	validationHint: string;
}

const formFields: FormField[] = [
	{
		name: "email",
		id: "mail",
		label: "Email Address:",
		type: "email",
		required: true,
		placeholder: "johndoe@nerv.jp",
		pattern: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
		validationHint: "Please enter a valid email address",
	},
	{
		name: "password",
		id: "password",
		label: "Password:",
		type: "password",
		required: true,
		pattern: /^[\d\w@-]{8,20}$/i,
		placeholder: "",
		validationHint: "Invalid password format",
	},
] as const;

const passwordVisibility = ref(false);

const form = ref(
	formFields.reduce((acc, field) => {
		acc[field.name] = "";
		return acc;
	}, {} as Record<string, string>)
);

const fieldValidation = ref<Record<string, boolean>>({});
const shouldShake = ref<Record<string, boolean>>({});

const togglePasswordVisibility = () => {
	passwordVisibility.value = !passwordVisibility.value;
};

const validateField = (field: FormField, value: string) => {
	return field.pattern?.test(value) ?? true;
};

const handleInput = (field: FormField) => {
	fieldValidation.value[field.name] = validateField(
		field,
		form.value[field.name]
	);
};

const handleBlur = (field: FormField) => {
	const isValid = validateField(field, form.value[field.name]);
	fieldValidation.value[field.name] = isValid;

	if (!isValid) {
		shouldShake.value[field.name] = true;
		setTimeout(() => {
			shouldShake.value[field.name] = false;
		}, 500);
	}
};

const handleSignIn = async () => {
	try {
		if (!signIn.value || !isLoaded.value) {
			showToast("Sign-in is not ready. Please try again later.", "error");
			return;
		}

		// Validate all fields before submission
		const isValid = formFields.every((field) =>
			validateField(field, form.value[field.name])
		);

		if (!isValid) {
			showToast("Please correct the form errors", "error");
			return;
		}

		const result = await signIn.value.create({
			identifier: form.value.email,
			password: form.value.password,
		});

		if (result.status === "complete") {
			await clerk.value?.setActive({
				session: result.createdSessionId,
			});
			showToast("Sign-in successful", "success");
			await navigateTo("/");
		} else {
			throw new Error("Sign-in failed");
		}
	} catch (error) {
		console.error(error);
		showToast("Invalid email or password", "error");
	}
};
</script>

<template>
	<div v-if="isLoaded">
		<div
			class="min-h-screen grid md:grid-cols-5 bg-cover"
			style="background-image: url('/images/background.jpg')"
		>
			<ToastContainer />

			<!-- Sidebar -->
			<aside
				class="md:col-span-2 flex flex-col justify-between items-center py-16 px-4 bg-black/75"
			>
				<div
					class="w-full flex flex-row flex-nowrap justify-center items-center"
				>
					<img
						src="/images/NERV-logo.png"
						alt="NERV Logo"
						class="w-20 md:w-40 lg:w-44 h-auto m-12"
					/>
					<div class="flex flex-col">
						<p
							class="font-bold text-fluidLarge border-b-2 border-[#e31e24] text-nerv"
						>
							NERV
						</p>
						<p class="w-full text-xs md:text-sm mt-2">
							To protect. To attack. To explore.
						</p>
					</div>
				</div>
				<footer class="text-xs md:text-sm text-tnr">
					Under the supervision of
					<a
						href="https://www.un.org/"
						target="_blank"
						class="text-[#f18f01] hover:text-[#ebebd3] active:text-[#e31e24] transition-colors"
					>
						the UN
					</a>
				</footer>
			</aside>

			<!-- Main Content -->
			<main
				class="md:col-span-3 p-8 bg-black/50 backdrop-blur-md flex flex-col gap-8"
			>
				<blockquote
					class="pl-6 border-l-4 border-[#e31e24] text-2xl italic text-tnr"
				>
					Extreme situations call for extreme measures.<br />
					Do what you know is right.
				</blockquote>

				<form
					@submit.prevent="handleSignIn"
					class="flex flex-col gap-4"
				>
					<legend class="text-xl font-bold text-crimson">
						Welcome Back
					</legend>

					<div class="grid gap-4 p-4 bg-black/25 backdrop-blur-sm">
						<div
							v-for="field in formFields"
							:key="field.id"
							class="flex flex-col gap-2"
						>
							<label :for="field.id" class="text-[#e31e24]">
								{{ field.label }}
							</label>
							<div class="relative">
								<input
									:type="
										field.type === 'password'
											? passwordVisibility
												? 'text'
												: 'password'
											: field.type
									"
									:name="field.name"
									:id="field.id"
									v-model="form[field.name]"
									:required="field.required"
									:placeholder="field.placeholder"
									@input="handleInput(field)"
									@blur="handleBlur(field)"
									class="w-full bg-[#071013] text-[#ebebd3] border border-white/20 p-2 rounded focus:outline-none focus:border-[#e31e24] transition-colors"
									:class="{
										'border-[#f18f01]':
											fieldValidation[field.name] ===
											false,
										shake: shouldShake[field.name],
									}"
								/>
								<button
									v-if="field.type === 'password'"
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
							<p
								class="text-sm text-[#f18f01] transition-opacity duration-200"
								:class="{
									'opacity-100':
										fieldValidation[field.name] === false,
									'opacity-0':
										fieldValidation[field.name] !== false,
								}"
							>
								{{ field.validationHint }}
							</p>
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
			</main>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>

<style scoped>
@keyframes shake {
	0% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(0.5rem);
	}
	75% {
		transform: translateX(-0.5rem);
	}
	100% {
		transform: translateX(0);
	}
}

.shake {
	animation: shake 0.25s ease-in-out 0s 2;
	box-shadow: 0 0 4px #f18f01;
}
</style>
