<script lang="ts">
  import "./styles.css";
  import Spinner from "../components/Spinner.svelte";
  import type { DropDownValues } from "../type";
  import { handleScrapping } from "../services/main.service";
  import Dropdown from "../components/Dropdown.svelte";
  import { getSVGName } from "../utils";

  $: link = "";
  $: dropdownValue = "pdf" as DropDownValues;
  $: dropdownClicked = false;
  $: loading = false; //for api call

  const handleDownloadFile = async () => {
    try {
      loading = true;
      await handleScrapping(dropdownValue, link);
    } catch (err) {
      throw new Error("Unable to process request");
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>AWS</title>
  <meta name="description" content="Amazon Scrapper" />
</svelte:head>

<section>
  <h1
    class="p-4 border-2 border-r-0 border-l-0 text-center font-bold text-lg mb-10 bg-slate-700 rounded-lg text-cyan-50"
  >
    AMAZON PRODUCT REVIEW SCAPPER
  </h1>
  <form class="flex justify-center w-full">
    <div class="flex w-4/5 border border-slate-100 rounded-md">
      <label
        for="search-dropdown"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >Your Email</label
      >
      <img
        alt="excel-icon"
        width="30"
        height="30"
        src={"/src/icons/" + getSVGName(dropdownValue)}
      />
      <button
        id="dropdown-button"
        data-dropdown-toggle="dropdown"
        class="flex-shrink-0 z-10 inline-flex outline-none border-none items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 border rounded-l-lg hover:bg-gray-200 focus:outline-none bg-slate-700 dark:hover:bg-slate-700 dark:focus:bg-slate-700 dark:text-white dark:border-gray-600"
        type="button"
        on:click={() => (dropdownClicked = !dropdownClicked)}
        >{dropdownValue.toUpperCase()}<svg
          class="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg></button
      >

      {#if dropdownClicked}
        <Dropdown bind:dropdownValue bind:dropdownClicked />
      {/if}

      <div class="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          class="block w-full outline-none p-2.5 z-20 text-sm text-gray-900 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 bg-slate-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Enter Url"
          required
          bind:value={link}
        />
        <button
          type="button"
          on:click={handleDownloadFile}
          class="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white dark:border-gray-600 rounded-r-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:placeholder-gray-400"
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </div>
    </div>
  </form>
</section>

{#if loading}
  <Spinner />
{/if}

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }
</style>
