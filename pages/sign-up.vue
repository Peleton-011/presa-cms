<script setup lang="ts">
import { ref } from "vue";
import { useSignUp, useClerk } from "@clerk/vue";
import { useToast } from "@/composables/useToast";
import { navigateTo } from "#app/composables/router";

import { PiEyeFill, PiEyeDuotone, PiEyeClosed } from "vue-icons-plus/pi";

const { isLoaded, signUp, setActive } = useSignUp();
const { showToast } = useToast();
const clerk = useClerk();

interface formField {
	name: string;
	id: string;
	label: string;
	type: string;
	required: boolean;
	placeholder: string;
	pattern: RegExp;
	validationHint: string;
}

const formFields: formField[] = [
	{
		name: "first_name",
		id: "first-name",
		label: "First Name:",
		type: "text",
		required: true,
		placeholder: "John",
		pattern: /^[a-z]{1,20}$/i,
		validationHint: "First name must only include letters",
	},
	{
		name: "last_name",
		id: "last-name",
		label: "Last Name:",
		type: "text",
		required: true,
		placeholder: "Doe",
		pattern: /^[a-z]{1,20}$/i,
		validationHint: "Last name must only include letters",
	},
	{
		name: "email",
		id: "mail",
		label: "Email Address:",
		type: "email",
		required: true,
		placeholder: "johndoe@nerv.jp",
		pattern: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
		validationHint: "Email must be a valid address, e.g. johndoe@nerv.jp",
	},
	{
		name: "phone_number",
		id: "phone-number",
		label: "Phone Number:",
		type: "tel",
		required: true,
		placeholder: "+34 690-420-011",
		pattern: /^\d{9}$|^\+\d{11}$/,
		validationHint: "Phone number must include the correct prefix",
	},
	{
		name: "password",
		id: "password",
		label: "Password:",
		type: "password",
		required: true,
		pattern: /^[\d\w@-]{8,20}$/i,
		placeholder: "",
		validationHint:
			"Password must be alphanumeric (@, _ and - are also allowed) and be 8 - 20 characters",
	},
	{
		name: "password_confirmation",
		id: "password-confirm",
		label: "Confirm Password:",
		type: "password",
		required: true,
		pattern: /^[\d\w@-]{8,20}$/i,
		placeholder: "",
		validationHint: "Passwords must match",
	},
] as const;

const pendingVerification = ref(false);
const verificationCode = ref("");
const verificationError = ref(false);

const passwordVisibility = ref<Record<string, boolean>>({
	password: false,
	password_confirmation: false,
});

const form = ref(
	formFields.reduce((acc, field) => {
		acc[field.name] = "";
		return acc;
	}, {} as Record<string, string>)
);

const fieldValidation = ref<Record<string, boolean>>({});

const shouldShake = ref<Record<string, boolean>>({});

const togglePasswordVisibility = (fieldName: string) => {
	passwordVisibility.value[fieldName] = !passwordVisibility.value[fieldName];
};

const validateField = (field: (typeof formFields)[number], value: string) => {
	if (field.name === "password_confirmation") {
		return !!value && value === form.value.password;
	}
	return field.pattern?.test(value) ?? true;
};

const handleInput = (field: (typeof formFields)[number]) => {
	fieldValidation.value[field.name] = validateField(
		field,
		form.value[field.name]
	);
};

const handleBlur = (field: (typeof formFields)[number]) => {
	const isValid = validateField(field, form.value[field.name]);
	fieldValidation.value[field.name] = isValid;

	if (!isValid) {
		shouldShake.value[field.name] = true;
		// Remove the shake class after animation completes
		setTimeout(() => {
			shouldShake.value[field.name] = false;
		}, 500); // 500ms matches the total animation duration
	}
};

const handleSignUp = async () => {
	try {
		if (!signUp.value || !isLoaded.value) {
			showToast("Sign-up is not ready. Please try again later.", "error");
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

		// Start the sign-up process
		const signUpResponse = await signUp.value.create({
			emailAddress: form.value.email,
			password: form.value.password,
			firstName: form.value.first_name,
			lastName: form.value.last_name,
			// phoneNumber: form.value.phone_number,
		});

		// Start email verification
		await signUp.value.prepareEmailAddressVerification({
			strategy: "email_code",
		});

		pendingVerification.value = true;
	} catch (error) {
		console.error(error);
		showToast("Error during sign-up. Please try again.", "error");
	}
};

const handleVerification = async () => {
	try {
		const completeSignUp =
			await signUp.value?.attemptEmailAddressVerification({
				code: verificationCode.value,
			});

		if (completeSignUp?.status === "complete") {
			await clerk.value?.setActive({
				session: completeSignUp.createdSessionId,
			});
			showToast("Sign-up successful", "success");
			await navigateTo("/");
		} else {
			throw new Error("Verification failed");
		}
	} catch (error) {
		console.error(error);
		showToast("Error during verification. Please try again.", "error");
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
					<!-- Using standard size classes instead of clamp -->
					<img
						src="/images/NERV-logo.png"
						alt="NERV Logo"
						class="w-20 md:w-40 lg:w-44 h-auto m-12"
					/>
					<div class="flex flex-col">
						<!-- Using standard text size classes -->
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
					@submit.prevent="handleSignUp"
					class="flex flex-col gap-4"
					v-if="!pendingVerification"
				>
					<legend class="text-xl font-bold text-crimson">
						Let's do this!
					</legend>

					<div
						class="grid md:grid-cols-2 gap-4 p-4 bg-black/25 backdrop-blur-sm"
					>
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
											? passwordVisibility[field.name]
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
									@click="
										togglePasswordVisibility(field.name)
									"
									class="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
								>
									<PiEyeFill
										v-if="!passwordVisibility[field.name]"
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
							class="md:col-span-2 mt-4 px-4 py-2 bg-[#e31e24] text-[#071013] rounded border border-white/20 hover:border-transparent active:bg-[#071013] active:text-[#e31e24] active:border-[#e31e24] transition-all duration-200"
						>
							Join Us
						</button>
					</div>
				</form>
				<form
					v-else
					class="flex flex-col gap-4"
					@submit.prevent="handleVerification"
				>
					<legend class="text-xl font-bold text-crimson">
						Just one last step!
					</legend>

					<div
						class="grid md:grid-cols-1 gap-4 p-4 bg-black/25 backdrop-blur-sm"
					>
						<div class="flex flex-col gap-2">
							<label for="code" class="text-[#e31e24]">
								Enter the validation code sent to your email
							</label>
							<input
								type="text"
								name="code"
								id="code"
								required="true"
								placeholder="XXX XXX"
								v-model="verificationCode"
								class="w-full bg-[#071013] text-[#ebebd3] border border-white/20 p-2 rounded focus:outline-none focus:border-[#e31e24] transition-colors"
							/>
							<p
								class="text-sm text-[#f18f01] transition-opacity duration-200"
								:class="{
									' opacity-100': verificationError,
									' opacity-0': !verificationError,
								}"
							>
								Wrong code. Please try again.
							</p>
						</div>

						<button
							type="submit"
							class="md:col-span-2 mt-4 px-4 py-2 bg-[#e31e24] text-[#071013] rounded border border-white/20 hover:border-transparent active:bg-[#071013] active:text-[#e31e24] active:border-[#e31e24] transition-all duration-200"
						>
							Verify
						</button>
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

/* Add any custom colors to your tailwind.config.js instead of using them directly in classes */
</style>
