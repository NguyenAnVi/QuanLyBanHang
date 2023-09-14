<script>
export default {
  name: "ProductListItem",
  props: ["productItem", "header"],
  methods: {
    callEdit($event) {
      this.$emit('edit', $event.currentTarget.getAttribute("data-pid"));
    },
    callDelete($event) {
      this.$emit('delete', $event.currentTarget.getAttribute("data-pid"));
    }
  },
};
</script>
<template>
  <div class="card">
    <div class="cell" :header="header" data-name>
      {{ productItem.name }}
    </div>
    <div class="cell shrink" :header="header" data-quantity>
      <p>{{ productItem.quantity }}</p>
    </div>
    <div class="cell shrink" :header="header" data-price>
      <strong>{{ productItem.price }}</strong>
    </div>
    <div class="cell shrink" :header="header" data-actions>
      <button @click="callEdit" :data-pid="productItem._id" type="button">Edit</button>
      <button @click="callDelete" :data-pid="productItem._id" type="button">Delete</button>
    </div>
  </div>
</template>
<style scoped>
[header] {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold !important;
  background-color: black;
  color: white;
}

.card {
  width: inherit;
  flex-wrap: nowrap;
  display: table-row;
  overflow: hidden;
}

.cell {
  padding-inline: 16px;
  display: table-cell;
  box-sizing: border-box;
  border-radius: 4px;
}

.cell:hover {
  background-color: rgb(189, 189, 189);
}

[header]:hover {
  background-color: black !important;
}

[data-name] {
  width: auto;
}



.cell.shrink {
  text-align: center;
  width: 1%;
  white-space: nowrap;
}
</style>