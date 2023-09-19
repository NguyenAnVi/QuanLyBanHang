<script>
import Pills from '@/components/pills.vue';
import Gallery from '@/components/Gallery.vue';
import { RouterLink } from 'vue-router';

export default {
  name: "ProductDetailCustomer",
  components: {
    Pills,
    RouterLink,
    Gallery
  },
  data() {
    return {
      id: "",
      tags: [
        "plants", "vegetables", "fruits", "dairy", "meat", "fish", "dresses", "speaker", "shoes", "bags", "shoes", "pant", "shirt", "shoes", "bags", "shoes", "pant", "others"
      ],
      product: [],
      productImages: [],
      recommendedProducts: [],
      recommendedProductImages: [],
      origin: location.origin
    }
  },
  methods: {
    async fetchProduct(id) {
      try {
        this.$store.dispatch('product/getProduct', id)
          .then((data) => {
            this.product = data.product;
            this.productImages = data.images;
          })
          .catch((err) => {
            this.$emit('notification', { message: err.message, type: 'error' });
          })
      } catch (err) {
        console.log(err);
        err.message = "Dispatching ('product/getProduct'): " + err.message
        this.$emit('notification', { message: err.message, type: 'error' });
      }
    },
    clickPill(value) {
      this.$emit('search', value);
    },
    clickProduct($event) {
      const pid = $event.currentTarget.getAttribute('data-pid');
      this.$router.push({ name: "c.product", params: { id: pid } })
      this.id = pid;
    },
    toPrice(value = "") {
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
  },
  watch: {
    async id(newVal) {
      await this.fetchProduct(newVal)
    }
  },
  created() {
    try {
      this.$store.dispatch('product/getRecommendedProducts')
        .then((data) => {
          this.recommendedProducts = data.products;
          this.recommendedProductImages = data.images;
        })
        .catch((err) => {
          this.$emit('notification', { message: err.message, type: 'error' });
        })
    } catch (err) {
      err.message = "Dispatching ('product/getRecommendedProduct'): " + err.message
      this.$emit('notification', { message: err.message, type: 'error' });
    }
    this.id = this.$route.params.id;
  }
}
</script>

<template>
  <main>
    <div class="product-detail">
      <div>
        <div class="product-images">
          <Gallery :images="productImages" />
        </div>
        <div class="product-text">
          <h3 style="display: block; width: 100%;">{{ product.name }}</h3>
          <span>Stock: {{ product.stock }}</span>
          <span class="price">{{ toPrice(product.price) }}</span>
          <button class="btn primary">Add to cart</button>
          <button class="btn secondary">Buy now</button>
        </div>
      </div>
      <div class="product-description">
        <h4>Description</h4>
        <ul>
          <li>Stock: {{ product.quantity }}</li>
        </ul>
        <div class="html" v-html="product.description" />
      </div>
    </div>
    <div class="recommended-products">
      <Pills :pills="tags" @clickPill="clickPill" />
      <div class="products-list">
        <div class="product-item" v-for="p in recommendedProducts" @click="clickProduct" :data-pid="p._id">
          <div class="product-item-img">
            <img
              :src="recommendedProductImages[p._id].length > 0 ? recommendedProductImages[p._id][0].publicPath : origin + '/noimage.png'"
              alt="">
          </div>
          <div class="product-item-text">
            <h4>{{ p.name }}</h4>
            <span class="price">{{ toPrice(p.price) }}</span>

          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
img {
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
}

main>* {
  padding: 8px;
}

.product-detail {
  width: auto;
  margin: 8px;
  padding: 8px;
  border-radius: 8px;
  flex: 1 0 auto;

}

.recommended-products {
  width: 300px;
  overflow: hidden;
  padding: 8px;
  margin: 8px;
}

.products-list {
  --column: 1;
  --gap: 8px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;

  background-color: #ffffff99;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  row-gap: var(--gap);
  overflow: visible;
}

.price {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 1.2em;
  color: red;
}



.product-detail {
  display: block;
}

.product-detail>* {
  background-color: #ffffff99;
  border-radius: 8px;
}

.product-detail>*:first-child {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-content: flex-start;
  margin-bottom: 8px;
  padding: 8px;
  box-sizing: border-box;
}



.product-images {
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.product-text {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 8px;
}

.btn {
  display: inline-block;
}

.btn.primary {
  background-color: rgb(0, 141, 96);
  color: white;
  font-size: 1.5em;
}

.product-description {
  display: block;
  width: 100%;
  border-radius: 8px;
  background-color: #ffffffaa;
  padding: 8px;
  box-sizing: border-box;

  & h4 {
    padding: 1rem;
    margin: 0px;
  }

  & .html {
    background-color: #ffffffaa;
    margin: 8px;
    padding: 1rem;
    box-shadow: inset 0 0 5px #ddd;
  }
}

.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  row-gap: 8px;
  align-content: flex-start;
  justify-items: stretch;
}

.product-item {
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 4rem;

  gap: 8px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 0px #aaa;
  transition-property: transform, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}

.product-item:hover {
  box-shadow: 0 10px 10px #aaa;
  transform: scale(1.05);
}

.product-item-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 8px;

  & h4 {
    margin: 0
  }
}

.product-item-img {
  height: 100%;

  & img {
    height: 100%;
  }
}

@media screen and (max-width:1024px) {
  .product-detail>*:first-child {
    flex-wrap: wrap;
  }

  /* .product-images {
    width: 100% !important;
  } */

  main {
    flex-direction: column;
  }

  .recommended-products {
    padding: 16px;
  }
}
</style>
