<script lang="ts">
  import './styles.css';
  import { browser } from '$app/environment';
  import axios, { type AxiosResponse } from 'axios';
  import { BACKEND_PATH } from '../constants';

  $: link = '';
  $: loading = false; //for api call
  $: error = false; // for input field

  if (browser) {
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdown = document.getElementById('dropdown');

    dropdownButton?.addEventListener('click', () => {
      dropdown?.classList.toggle('hidden');
    });
  }

  const handleDownloadFile = async () => {
    try {
      console.log('link', link);
      const data: AxiosResponse<string> = await axios.post(BACKEND_PATH, {
        url: link,
      });
      console.log('data', data.data);
      const uint8ArrayData = Uint8Array.from(atob(data.data), (c) =>
        c.charCodeAt(0),
      );

      // Create a Blob from the Uint8Array data
      const blob = new Blob([uint8ArrayData], { type: 'application/pdf' });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a download link for the Blob and trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'reviews.pdf';
      downloadLink.click();

      // Clean up the URL object after the download
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };
</script>

<svelte:head>
  <title>AWS</title>
  <meta name="description" content="Amazon Scrapper" />
</svelte:head>

<section>
  <h1
    class=" p-4 border-2 border-r-0 border-l-0 text-center font-bold text-lg mb-10 bg-slate-700 rounded-lg text-cyan-50"
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
      <button
        id="dropdown-button"
        data-dropdown-toggle="dropdown"
        class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 bg-slate-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
        type="button"
        >All OPTIONS <svg
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
      <div
        id="dropdown"
        class="z-10 border border-slate-100 outline-none hidden absolute mt-11 divide-y divide-gray-100 rounded-lg shadow w-44 bg-slate-700"
      >
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdown-button"
        >
          <li class="flex">
            <img
              alt="excel-icon"
              width="30"
              height="30"
              src="/src/icons/icons8-excel.svg"
            />
            <button
              type="button"
              class="inline-flex text-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >EXCEL</button
            >
          </li>
          <li class="flex">
            <img
              alt="excel-icon"
              width="30"
              height="30"
              src="/src/icons/pdf-svgrepo-com.svg"
            />
            <button
              type="button"
              class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >PDF</button
            >
          </li>
          <li>
            <button
              type="button"
              class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >BOTH</button
            >
          </li>
        </ul>
      </div>
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

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }
</style>
