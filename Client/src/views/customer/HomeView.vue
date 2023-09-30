<script>
import Pills from '@/components/pills.vue';

export default {
  name: "HomeView",
  components: {
    Pills,
  },
  data() {
    return {
      tags: [
        "plants", "vegetables", "fruits", "dairy", "meat", "fish", "dresses", "speaker", "shoes", "bags", "shoes", "pant", "shirt", "shoes", "bags", "shoes", "pant", "others"
      ],
      products: [],
      productImages: [],
      origin: location.origin
    }
  },
  methods: {
    clickPill(value) {
      this.$emit('search', value);
    },
    clickProduct($event) {
      const pid = $event.currentTarget.getAttribute('data-pid');
      this.$router.push({ name: "CustomerProductDetail", params: { id: pid } })
    },
    toPrice(value) {
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
  },
  created() {
    try {
      this.$store.dispatch('product/getRecommendedProducts')
        .then((data) => {
          this.products = data.products;
          this.productImages = data.images;
        })
        .catch((err) => {
          this.$emit('notification', { message: err.message, type: 'error' });
        })
    } catch (err) {
      err.message = "Dispatching ('product/getRecommendedProduct'): " + err.message
      this.$emit('notification', { message: err.message, type: 'error' });
    }
  }
}
</script>

<template>
  <main>
    <Pills :pills="tags" @clickPill="clickPill" />
    <div class="section banner">
      banner here
    </div>
    <div class="section">
      <div class="section-title">
        <span>Recommended</span>
        <router-link to="">Learn more &gt;</router-link>
      </div>
      <div class="section-body products-list">

        <div class="product" @click="clickProduct" v-for="product in products" :data-pid="product._id">
          <div class="product-item-img">
            <img
              :src="productImages[product._id].length > 0 ? productImages[product._id][0].publicPath : (origin + '/noimage.png')"
              alt="">
          </div>
          <div class="product-item-text">
            <h4>{{ product.name }}</h4>
            <span class="price">{{ toPrice(product.price) }}</span>
            <span>Stock: {{ product.quantity }}</span>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 0px;
  padding-top: 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  width: inherit;
  box-sizing: border-box;
}

main>* {
  margin-inline: 16px;
}

.section {
  background-color: transparent;

}

.section-title {
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  font-weight: 700;
  padding: 8px;
  display: block;

  &>*:last-child {
    float: right;
  }
}

.section-body {
  padding-block: 8px;
  overflow: hidden;
}

.products-list {
  --column: 1;
  --gap: 8px;
  padding-inline: 8px;
  border-radius: 8px;

  background-color: #ffffff99;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  row-gap: var(--gap);
  overflow: visible;

  @media screen and (min-width: 512px) {
    --column: 2;
  }

  @media screen and (min-width: 768px) {
    --column: 4;
  }

  @media screen and (min-width: 1024px) {
    --column: 6;
  }

  @media screen and (min-width: 2048px) {
    --column: 8;
  }
}

.product {
  cursor: pointer;
  width: calc((100% / var(--column)) - ((var(--gap) * (var(--column) - 1)) / var(--column)));
  border-radius: 8px;
  background-color: white;

  & img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;

    border-radius: 8px;
  }

  &>.product-item-text {
    display: flex;
    justify-content: space-between;
    align-items: end;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 8px;

    &>h4 {
      margin: 0;
      width: 100%;
    }

    &>.price {
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      font-size: 1.2em;
      color: red;

    }

  }
}

.product {
  box-shadow: 0 0 0px #aaa;
  transition-property: transform, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}

.product:hover {
  box-shadow: 0 10px 10px #aaa;
  transform: scale(1.05);
}

.tags-wrapper {
  height: 36px;
  display: flex;
  gap: 12px;
  overflow-X: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0;
  }

  &>* {
    display: flex;
    min-width: fit-content;
    align-items: center;
    justify-content: center;
    padding-inline: 16px;
    padding-block: 4px;
    background-color: var(--color-background-1);
    border-radius: 25px;
  }
}
</style>
