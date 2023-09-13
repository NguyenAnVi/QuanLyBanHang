<script>
import ProductListItem from '@/components/ProductListItem.vue'
import { RouterLink } from "vue-router";
export default {
  name: "ProductList",
  components: {
    RouterLink,
    ProductListItem
  },
  data(){
    const headerItem = {
      name:"Name",
      quantity:"Quantity",
      price:"Price",
      actions:"Actions"
    }
    return {
      headerItem,
    }
  },
  computed: {
    productItems(){
      return JSON.parse(JSON.stringify(this.$store.getters['product/productItems']));
    }
  },
  created() {
    this.$store.dispatch('product/getProductItems');
  }
};
</script>
<template>
  <div class="container is-fluid">
    <h3>{{$route.name}}</h3>
    <hr/>
    <RouterLink to="/m/product/add"><button>Add new product</button></RouterLink>
    <div class="is-ancestor">
      <div class="is-parent">
        <ProductListItem header :productItem="headerItem"/>
        <ProductListItem  v-for="productItem in productItems" :key="productItem.id" :productItem="productItem"/>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container{
  padding:16px;
  background-color: transparent;
}
.is-ancestor{
  background-color: transparent;
  padding:8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.is-parent{
  width: 100%;

  display: table;
  flex-wrap: wrap;
  border-spacing: 4px;
  border: 1px solid #888888;
  gap: 8px;
  row-gap: 8px;
  & > *:nth-child(odd){
    background-color:#d6d6d6; 
  }
  & > *:nth-child(even){
    background-color:#ffffff; 
  }
}
</style>