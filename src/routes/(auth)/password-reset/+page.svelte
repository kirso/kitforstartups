<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { createToast } from '$lib/components/Toast.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let running = false;
	const submitSendResetPasswordLink: SubmitFunction = () => {
		running = true;

		return async ({ update }) => {
			running = false;
			await update();
		};
	};

	$: {
		if (form?.feedback) {
			createToast({
				type: form.feedback.type,
				title: form.feedback.title,
				description: form.feedback.message
			});
		}
	}
</script>

<svelte:head>
	<title>Get a reset link</title>
</svelte:head>

<div class="text-center">
	<h1 class="text-3xl font-bold">Get a reset link</h1>
</div>

<div class="p-8 border border-gray-300 rounded-sm shadow-sm">
	<form method="post" action="?/sendPasswordResetLink" use:enhance={submitSendResetPasswordLink}>
		<div class="form-control">
			<label for="email">Email</label>
			<input type="email" name="email" placeholder="Your email address" required />
		</div>

		<SubmitButton {running} text="Email password reset link" />
	</form>
</div>

{#if !data.user}
	<div class="text-center">
		<p class="text-sm text-gray-600">
			Already have an account? <a href="/auth/login" class="font-medium text-blue-600 underline"
				>Login instead</a
			>
		</p>
	</div>
{/if}
