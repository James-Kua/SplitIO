<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				message: error.message,
				status
			}
		};
	}
</script>

<script lang="ts">
	import SplitioIcon from '$lib/SplitioIcon.svelte';
	import Button, { Label, Icon } from '@smui/button';
	import Paper, { Title, Content } from '@smui/paper';
	export let message: string = '';
	export let status: string = '';
</script>

<svelte:head>
	<title>SplitIO | error</title>
</svelte:head>

<div class="homepage-container">
	<div>
		<SplitioIcon />
	</div>
	<div class="group-text-container">
		<Paper class="paper-demo" elevation={5} style="width: 460px; max-width: 80vw;">
			<Title>😟 Error</Title>
			<Content>
				{message}
				<p class="mdc-typography--subtitle2" style="margin: 0; color: #888;">status: {status}</p>
				<Button href="/" variant="raised" style="display: flex; margin-top: 1rem" color="secondary">
					<Icon class="material-icons">home</Icon>
					<Label style="text-transform: none; font-weight: semi-bold;">Return Home</Label>
				</Button>
			</Content>
		</Paper>
	</div>
</div>

<style>
	.homepage-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.group-text-container {
		padding-top: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	* :global(.info-btn) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	* :global(.paper-demo) {
		margin: 1.5rem 1rem;
		max-width: 600px;
	}
</style>
