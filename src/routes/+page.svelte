<script>

	import { enhance } from "$app/forms";

</script>
<h1 class="text-primary">Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<form action="?/theme" method="post" use:enhance>
    <input type="text" name="theme" id="theme">
    <button type="submit">Submit</button>
</form>