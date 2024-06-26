<script lang="ts">
	import SplitioIcon from '$lib/SplitioIcon.svelte';
	import Button from '@smui/button';
	import CreateGroupDialog from '$lib/CreateGroupDialog.svelte';
	import { getSEA, initAppDB } from '$lib/_modules/initGun';
	import { redirectToGroup } from '$lib/_modules/utils';
	import { putSecure } from '$lib/_modules/secure';
	import type { IGunStaticSEA } from 'gun/types/static/sea';
	import LoadingSpinnerOverlay from '$lib/LoadingSpinnerOverlay.svelte';
	import RecentGroupsList from '$lib/RecentGroupsList.svelte';

	let openCreateGroupDialog: boolean = false;
	let showLoadingSpinner: boolean = false;

	let appDB: any = undefined;
	let SEA: IGunStaticSEA | undefined = undefined;

	const initGunIfNew = () => {
		if (!appDB) appDB = initAppDB();
		if (!SEA) SEA = getSEA();
	};

	const createGroup = async (groupName: string, currency: string) => {
		showLoadingSpinner = true;
		const pair = await SEA.pair();
		const result = appDB.set({ expenses: {}, members: {}, groupInfo: {}, pubKey: pair?.pub });
		const secretKey = '#' + pair.priv;
		const nodeid = result._.has;
		let infoNode = appDB.get(nodeid).get('groupInfo');
		putSecure(infoNode, { name: groupName, currency }, secretKey, (ack) => {
			if (!ack.err) {
				redirectToGroup(nodeid, secretKey);
			} else {
				alert('error creating group :( please try again. code: ' + ack.err);
				showLoadingSpinner = false;
			}
		});
	};
</script>

<div class="homepage-container">
	<SplitioIcon />
	<div class="group-text-container">
		<RecentGroupsList />
		<Button
			style="border-radius: 8px; margin: 1rem"
			variant="unelevated"
			color="secondary"
			on:click={() => {
				openCreateGroupDialog = true;
				initGunIfNew();
			}}
		>
			<p style="text-transform: none; font-weight: bold; font-size: 1rem">➕ Create Group</p>
		</Button>
	</div>
</div>

<LoadingSpinnerOverlay showOverlay={showLoadingSpinner} />

<CreateGroupDialog bind:openDialog={openCreateGroupDialog} addCallback={createGroup} />

<style>
	.homepage-container {
		min-height: calc(100vh - 2rem);
		padding-top: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 500px) {
		.homepage-container {
			padding-top: 5rem;
			min-height: calc(100vh - 5rem);
		}
	}

	.group-text-container {
		/* padding: 0px 1px; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 1.5rem;
	}

	* :global(.solo-paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 1rem 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.solo-paper > *) {
		display: inline-block;
		margin: 0 12px;
	}
	* :global(.solo-input) {
		flex-grow: 1;
		color: var(--mdc-theme-on-surface, gray);
	}
	* :global(.solo-input::placeholder) {
		color: var(--mdc-theme-on-surface, gray);
		opacity: 0.6;
	}
	* :global(.solo-fab) {
		flex-shrink: 0;
		height: 60px;
		width: 60px;
		/* margin-top: 0rem; */
	}

	* :global(.info-btn) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>
