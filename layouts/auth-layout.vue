<script setup lang="ts">
interface Props {
	title: string;
	subtitle?: string;
}

defineProps<Props>();
</script>

<template>
	<div
		class="min-h-screen grid md:grid-cols-5 bg-cover"
		style="background-image: url('/images/background.jpg')"
	>
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

			<div class="flex flex-col gap-4">
				<legend class="text-xl font-bold text-crimson">
					{{ title }}
				</legend>
				<p v-if="subtitle" class="text-sm text-[#f18f01]">
					{{ subtitle }}
				</p>

				<!-- Content Slot -->
				<slot></slot>
			</div>
		</main>
	</div>
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
