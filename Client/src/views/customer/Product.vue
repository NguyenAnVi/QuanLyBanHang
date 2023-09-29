<script>
import Pills from '@/components/pills.vue';
import Gallery from '@/components/Gallery.vue';
import { RouterLink } from 'vue-router';
import InputTypeNumber from '@/components/InputTypeNumber.vue';

export default {
  name: "ProductDetailCustomer",
  components: {
    Pills,
    RouterLink,
    Gallery,
    InputTypeNumber
  },
  data() {
    return {
      id: "",
      tags: [
        "plants", "vegetables", "fruits", "dairy", "meat", "fish", "dresses", "speaker", "shoes", "bags", "shoes", "pant", "shirt", "shoes", "bags", "shoes", "pant", "others"
      ],
      product: [],
      quantity: 0,
      productImages: [],
      recommendedProducts: [],
      recommendedProductImages: [],
      origin: location.origin
    }
  },
  methods: {
    async fetchProduct(id) {
      this.$refs.inputQuantity.reset();
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
    },
    quantityValueChanged(val) {
      this.quantity = val;
    },
    addToCart() {
      const item = {
        productId: this.product._id,
        productName: this.product.name,
        quantity: this.quantity,
        maxQuantity: this.product.quantity,
        orderPrice: this.product.price
      }
      this.$store.dispatch('cart/addCartItem', item)
      this.$emit('updateCart')
      this.$emit('notification', { message: "Added to cart!", type: "success" })
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
  },
  mounted() {
    this.id = this.$route.params.id;
  }
}
</script>

<template>
  <main>
    <div class="product-detail">
      <div class="section">
        <div class="product-images">
          <Gallery :images="productImages" />
        </div>
        <div class="product-text">
          <h3 style="display: block; width: 100%;">{{ product.name }}</h3>
          <h2 class="price">{{ toPrice(product.price) }}</h2>
          <span>Stock: {{ product.quantity > 0 ? product.quantity : "Out of stock" }}</span>
          <table class="tbl">
            <tr>
              <td>Shipping: &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td><img style="border-radius: 0;height:1em; aspect-ratio: 1; transform: scale(2); margin-inline: 1em;"
                  :src="origin + '/freeshipping.png'" alt="" srcset=""> Free
                shipping</td>
            </tr>
            <tr>
              <td>Quantity: &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>
                <InputTypeNumber :disabled="product.quantity <= 0" ref="inputQuantity" :max="product.quantity"
                  :min="(Math.min(1, product.quantity) || 0)" @change.self="quantityValueChanged" />
              </td>
            </tr>
          </table>
          <button :disabled="product.quantity <= 0" class="btn primary" @click="addToCart">Add to cart</button>
          <button :disabled="product.quantity <= 0" class="btn secondary">Buy now</button>
          <div style="padding-top: 2em;border-top: 1px solid #ddd;margin-block: 1em;">
            <img style="height:16px; aspect-ratio: 1; transform: scale(2); margin-inline: 1em;"
              :src="origin + '/guarantee.png'" alt="">
            <span style="font-weight: 700;">Guarantee</span>
            &nbsp;
            <span style="color: #888;">Get the items you ordered or get your money back</span>

          </div>
        </div>
      </div>
      <div class="section">
        <div class="product-description">
          <h4>Description</h4>
          <ul>
            <li>Stock: {{ product.quantity }}</li>
          </ul>
          <div class="html" v-html="product.description" />
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
                <h3>{{ p.name }}</h3>
                <h4 class="price">{{ toPrice(p.price) }}</h4>
              </div>
            </div>
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
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}

main>* {
  padding: 8px;
}

.product-detail {
  max-width: 1080px;
  margin: 8px;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  border-radius: 8px;
  flex: 1 0 auto;

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
  margin-block: 0.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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

.product-detail>*:nth-child(2) {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 8px;
  align-content: flex-start;
  margin-bottom: 8px;
  box-sizing: border-box;
  background-color: transparent;
}

.product-images {
  width: 500px;
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

table {
  margin-block: 8px;
  width: auto;

  & * {
    color: #888;
  }

  & tr {
    margin-block: 8px;
  }

  & td {
    display: inline-block;
  }
}

.btn.primary {
  background-color: var(--primary-color);
  color: white;
  font-size: 1.5em;
}

.product-description {
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

.recommended-products {
  width: 500px;
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
  height: 8rem;

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

  .recommended-products {
    width: 100%;
  }

  .product-detail>*:nth-child(2) {
    flex-direction: column;
  }
}
</style>
