<script>
  import { page } from "$app/stores";
</script>

<h1>{$page.status} {$page.error?.message}</h1>
<h1>Unable to load the link! Try again</h1>
