<script lang="ts">
  import DropdownBtn from "./DropdownBtn.svelte";

  export let dropdownValue: string;
  export let dropdownClicked: boolean;
</script>

<div
  id="dropdown"
  class="z-10 border border-slate-100 outline-none absolute mt-11 divide-y divide-gray-100 rounded-lg shadow w-44 bg-slate-700"
>
  <ul
    class="py-2 text-sm text-gray-700 dark:text-gray-200"
    aria-labelledby="dropdown-button"
  >
    <li class="flex">
      <DropdownBtn bind:dropdownValue bind:dropdownClicked BtnName={"excel"} />
    </li>
    <li class="flex">
      <DropdownBtn bind:dropdownValue bind:dropdownClicked BtnName={"pdf"} />
    </li>
    <li class="flex">
      <DropdownBtn bind:dropdownValue bind:dropdownClicked BtnName={"both"} />
    </li>
  </ul>
</div>
