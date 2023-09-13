<script>
// import {mapActions} from 'vuex'
export default {
  name: "ProductListItem",
  props: ["productItem", "header"],
  methods: {
    // ...mapActions(["cart/addCartItem"]),
  },
};
</script>
<template>
  <div class="card">
      <div class="cell" :header="header" data-name>{{ productItem.name }}
        <!-- <a
          class="button is-rounded is-pulled-left"
          @click="addCartItem(productItem)"
        >
          <strong>Add to Cart</strong>
        </a> -->
      </div>
      <div class="cell" :header="header" data-quantity>
          <p>{{ productItem.quantity }}</p>
      </div>
      <div class="cell" :header="header" data-price>
        <strong>{{ productItem.price }}</strong>
      </div>
      <div class="cell" :header="header" data-actions>
        <button type="button">Edit</button>
        <button type="button">Delete</button>
      </div>
  </div>
</template>
<style scoped>
  [header]{
    font-size: bold;
    background-color: black;
    color: white;
  }
  .card {
    width: inherit;
    flex-wrap: nowrap;
    display: table-row;
    & > .cell{
      padding-inline: 16px;
      display: table-cell;
      box-sizing: border-box;
    }
  }
  .card:not([header]) > .cell:hover{
    background-color: rgb(146, 146, 146);
  }
  [data-name]{
    width: auto;
  }
  [data-quantity]{
    text-align: center;
    width: 1%;
    white-space: nowrap;
  }
  [data-price]{
    text-align: center;
    width: 1%;
    white-space: nowrap;
  }
  [data-actions]{
    text-align: center;
    width: 1%;
    white-space: nowrap;
  }
</style>