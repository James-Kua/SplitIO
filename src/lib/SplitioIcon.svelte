<script lang="ts">
	import { Title as TopTitle } from '@smui/top-app-bar';
	import Ripple from '@smui/ripple';
	import { goto } from '$app/navigation';

	export let isTopApp = false;
</script>

{#if isTopApp}
	<div
		use:Ripple={{ surface: true }}
		tabindex="0"
		style="display: flex; flex-direction: row; align-items: center; border-radius: 12px; padding: 6px"
		on:click={() => goto('/')}
	>
		<TopTitle style="font-size: x-large; margin-left: -13px; font-weight: bold">
			SplitIO
		</TopTitle>
	</div>
{:else}
	<div
		use:Ripple={{ surface: true }}
		on:click={() => goto('/')}
		style="align-items: center; display: flex; flex-direction: column; border-radius: 12px; padding: 12px;"
	>
		<div class="logo-home">SplitIO</div>
	</div>
{/if}

<style>
	.logo-home {
		font-family: Josefin Sans;
		font-size: 3rem;
	}

	[tabindex='0'] {
		cursor: pointer;
	}
</style>
