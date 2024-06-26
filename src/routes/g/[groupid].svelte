<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page }) {
		return {
			props: {
				groupId: page.params.groupid
			}
		};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Fab, { Icon as FabIcon } from '@smui/fab';
	import List, { Item, Text, Meta, Graphic } from '@smui/list';
	import Snackbar, { Label, SnackbarComponentDev } from '@smui/snackbar';
	import { initAppDB } from '$lib/_modules/initGun';
	import AddExpenseDialog from '$lib/AddExpenseDialog.svelte';
	import AddMemberDialog from '$lib/AddMemberDialog.svelte';
	import { getMemberAvatarURL } from '$lib/_modules/utils';
	import ViewBalancesDialog from '$lib/ViewBalancesDialog.svelte';
	import Chip, { Set, LeadingIcon, Text as ChipText } from '@smui/chips';
	import { deleteSecure, onSecure, putSecure, setSecure } from '$lib/_modules/secure';
	import { secretKey, groupDB, groupStore, resetGroupStore } from '$lib/_modules/stores';
	import LoadingSpinnerOverlay from '$lib/LoadingSpinnerOverlay.svelte';
	import { storeRecentGroup } from '$lib/_modules/recentGroupsStorage';
	import TransactionsList from '$lib/TransactionsList.svelte';
	import { CURRENCY_SYMBOLS, PLACEHOLDER_GROUP_NAME } from '$lib/_modules/constants';
	import { GroupNodeStates } from '$lib/_modules/types';
	import GroupNotFoundDialog from '$lib/GroupNotFoundDialog.svelte';
	import GroupNotesDialog from '$lib/GroupNotesDialog.svelte';

	export let groupId: string;

	let openAddMemberDialog: boolean = false;
	let openAddExpenseDialog: boolean = false;
	let openViewBalancesDialog: boolean = false;
	let openGroupNotesDialog: boolean = false;
	let copiedLinkSnackbar: SnackbarComponentDev;

	let groupNodeState = GroupNodeStates.Unknown;

	let chips = [
		{
			title: 'Balances',
			icon: 'balance',
			onClick: () => (openViewBalancesDialog = true)
		},
		{
			title: 'Group Notes',
			icon: 'description',
			onClick: () => (openGroupNotesDialog = true)
		},
		{
			title: 'Share Group',
			icon: 'share',
			onClick: () => {
				if (navigator.share) {
					navigator
						.share({
							title: 'SplitIO',
							text: "Let's split bills with this group in SplitIO 💰",
							url: window.location.href
						})
						.then(() => console.log('Successful share'))
						.catch((error) => console.log('Error sharing', error));
				} else {
					navigator.clipboard.writeText(window.location.href).then(copiedLinkSnackbar.open);
				}
			}
		},
	];

	onMount(() => {
		resetGroupStore();
		const appDB = initAppDB();
		$secretKey = window.location.hash;
		const GROUPID = groupId || 'unknown group';
		$groupDB = appDB.get(GROUPID);

		// detect group not found
		$groupDB.once(
			(val) => {
				if (val === undefined) groupNodeState = GroupNodeStates.NotFound;
				else groupNodeState = GroupNodeStates.Found;
			},
			{ wait: 5000 }
		);

		onSecure(
			$groupDB.get('expenses').map(),
			$secretKey,
			(plain, key) => ($groupStore.expenses[key] = plain),
			(key) => {
				delete $groupStore.expenses[key];
				$groupStore.expenses = $groupStore.expenses;
			}
		);

		onSecure(
			$groupDB.get('members').map(),
			$secretKey,
			(plain, key) => ($groupStore.members[plain.name] = plain),
			(key) => {
				delete $groupStore.members[key];
				$groupStore.members = $groupStore.members;
			}
		);

		onSecure(
			$groupDB.get('groupInfo'),
			$secretKey,
			(plain, key) => {
				$groupStore.groupInfo.name = plain.name;
				$groupStore.groupInfo.currency = plain.currency;
				storeRecentGroup(GROUPID, $secretKey, plain.name);
			},
			(key) => {
				delete $groupStore.groupInfo[key];
				$groupStore.groupInfo = $groupStore.groupInfo;
			}
		);

		onSecure(
			$groupDB.get('payments').map(),
			$secretKey,
			(plain, key) => ($groupStore.payments[key] = plain),
			(key) => {
				delete $groupStore.payments[key];
				$groupStore.payments = $groupStore.payments;
			}
		);

		onSecure(
			$groupDB.get('groupNotes'),
			$secretKey,
			(plain, key) => {
				$groupStore.groupNotes = plain;
			},
			(key) => {
				$groupStore.groupNotes = '';
			}
		);
	});

	const addExpense = async (
		expense: Expense
	) => {
		const memberExists = expense.paidBy in $groupStore.members;
		if (!memberExists) throw SyntaxError;
		setSecure(
			$groupDB!.get('expenses'),
			expense,
			$secretKey
		);
	};

	const addMember = (memberName: string) => {
		setSecure($groupDB.get('members'), { name: memberName }, $secretKey);
	};

	const putGroupNotes = (noteValue: string, onCompletion: Function) => {
		let node = $groupDB.get('groupNotes');
		if (!noteValue) deleteSecure(node, onCompletion)
		else putSecure(node, noteValue, $secretKey, onCompletion);
	};

	$: transactions = Object.entries({ ...$groupStore.expenses, ...$groupStore.payments }).sort(
		(a, b) => b[1].timestamp - a[1].timestamp
	);
	$: members = Object.entries($groupStore.members);

	$: currency = $groupStore.groupInfo.currency || 'SGD'
</script>

<svelte:head>
	<title>SplitIO | {$groupStore.groupInfo.name}</title>
</svelte:head>

<div class="mdc-typography--headline4" style="font-weight: bold; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">{$groupStore.groupInfo.name}</div>

<Set
	{chips}
	style="overflow-x: auto; flex-wrap: nowrap;"
	let:chip
>
	<Chip style={"font-size: 16px; margin-top: 16px;"} {chip} shouldRemoveOnTrailingIconClick={false} on:click={chip.onClick}>
		<LeadingIcon class="material-icons">{chip.icon}</LeadingIcon>
		<ChipText style="font-weight: bold" tabindex={0}>{chip.title}</ChipText>
	</Chip>
</Set>

<div class="mdc-typography--headline5" style="margin-top: 15px; font-weight: 500">💸 Group Transactions</div>

<TransactionsList {transactions} {currency} />

<div class="mdc-typography--headline5" style="font-weight: 500">🫂 Members</div>

<List oneLine avatarList style="margin-bottom: 70px;">
	{#each members as [key, member] (key)}
		<Item class="rounded-item">
			<Graphic style="background-image: url({getMemberAvatarURL(member.name)});" />
			<p style="font-weight: 500;">{member.name}</p>
		</Item>
	{/each}
	<Item on:click={() => (openAddMemberDialog = true)} class="rounded-item">
		<Text style="font-weight: bold">➕ Add new member</Text>
		<Meta class="material-icons">person_add</Meta>
	</Item>
</List>

<!-- floating action button -->
<div class="flexy">
	<div class="margins">
		<Fab style="border-radius: 17px;" on:click={() => (openAddExpenseDialog = true)}>
			<FabIcon class="material-icons">post_add</FabIcon>
		</Fab>
	</div>
</div>

<!-- loading overlay -->
<LoadingSpinnerOverlay showOverlay={$groupStore.groupInfo.name === PLACEHOLDER_GROUP_NAME} />

<GroupNotFoundDialog {groupNodeState} />

<!-- add member dialog -->
<AddMemberDialog bind:openDialog={openAddMemberDialog} addCallback={addMember} />

<!-- add expense dialog -->
<AddExpenseDialog
	membersList={members}
	currency={currency}
	bind:openDialog={openAddExpenseDialog}
	addCallback={addExpense}
/>

<ViewBalancesDialog
	bind:openDialog={openViewBalancesDialog}
	expensesObj={$groupStore.expenses}
	paymentsObj={$groupStore.payments}
	membersList={members}
	{currency}
/>

<GroupNotesDialog
	bind:openDialog={openGroupNotesDialog}
	putNotesCallback={putGroupNotes}
/>

<Snackbar bind:this={copiedLinkSnackbar}>
	<Label>📋 Link copied to clipboard!</Label>
</Snackbar>

<style>
	.flexy {
		position: fixed;
		bottom: 10px;
		right: 10px;
		z-index: 1;
	}

	* :global(.margins) {
		margin: 0 0.4em 0.4em 0;
	}
</style>
