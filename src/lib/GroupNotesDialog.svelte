<script lang="ts">
	import Button from '@smui/button';
	import Dialog, { Header, Title, Content } from '@smui/dialog';
	import IconButton from '@smui/icon-button';
	import Textfield from '@smui/textfield';
	import { get } from 'svelte/store';
	import { groupStore } from './_modules/stores';
	import SvelteMarkdown from 'svelte-markdown';
	import HelperText from '@smui/textfield/helper-text';

	export let openDialog = false;
	export let putNotesCallback: Function = () => {};

	let editNotesValue = '';
	let isEditMode = false;
	let isSaving = false;

	const submitNotes = () => {
		isSaving = true;
		putNotesCallback(editNotesValue, (args) => {
			isEditMode = false;
			isSaving = false;
		});
	};
</script>

<Dialog
	fullscreen
	bind:open={openDialog}
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
>
	<Header>
		<Title id="fullscreen-title">📝 Group Notes</Title>
		<IconButton action="close" class="material-icons">close</IconButton>
	</Header>
	<Content
		id="default-focus-content"
		style="
			padding-top: .5rem;
		"
	>
		{#if isEditMode}
			<Textfield
				style="width: 100%; height: 260px; resize: none;"
				helperLine$style="width: 100%;"
				textarea
				bind:value={editNotesValue}
				label="Leave any notes here"
			>
				<HelperText slot="helper">Notes will be rendered with markdown</HelperText>
			</Textfield>
			<div class="buttons">
				<Button on:click={() => (isEditMode = false)}>cancel</Button>
				<Button disabled={isSaving} on:click={submitNotes}>save</Button>
			</div>
		{:else}
			<SvelteMarkdown source={$groupStore.groupNotes || '_no notes here yet..._'} />
			<div class="buttons">
				<Button
					on:click={() => {
						editNotesValue = get(groupStore).groupNotes;
						isEditMode = true;
					}}>Edit</Button
				>
			</div>
		{/if}
	</Content>
</Dialog>

<style>
	.buttons {
		padding-top: 1rem;
		justify-content: flex-end;
		display: flex;
	}
</style>
