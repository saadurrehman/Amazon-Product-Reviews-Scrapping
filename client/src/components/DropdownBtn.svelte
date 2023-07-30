<script lang="ts">
  import { getSVGName } from "../utils";
  import type { DropDownValues } from "../type";

  export let dropdownValue: string;
  export let dropdownClicked: boolean;
  export let BtnName = "" as DropDownValues;
</script>

<img
  alt="excel-icon"
  width="30"
  height="30"
  src={"/src/icons/" + getSVGName(BtnName)}
/>
<button
  type="button"
  on:click={() => {
    dropdownValue = BtnName;
    dropdownClicked = false;
  }}
  class="inline-flex text-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
  >{BtnName.toUpperCase()}</button
>
