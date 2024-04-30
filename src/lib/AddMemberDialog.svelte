<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';

	export let openDialog = false;
	export let addCallback: Function = () => {};

	let inputName: string = '';
</script>

<Dialog
	bind:open={openDialog}
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
>
	<Title id="default-focus-title">👋 Add New Member</Title>
	<Content id="default-focus-content">
		<div>
			Enter new member name:
			<Textfield bind:value={inputName} />
		</div>

		<p>⚠️ Once added, <strong>You can't edit nor delete a member</strong>, so choose wisely!</p>
	</Content>
	<Actions>
		<Button>
			<Label>cancel</Label>
		</Button>
		<Button
			variant="unelevated"
			disabled={inputName === ''}
			on:click={() => {
				addCallback(inputName);
				inputName = '';
			}}
		>
			<Label>add</Label>
		</Button>
	</Actions>
</Dialog>
