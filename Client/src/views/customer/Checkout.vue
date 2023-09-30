<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from 'vee-validate';
import InputTypeNumber from '@/components/InputTypeNumber.vue';
import InputTypeSelect from '@/components/InputTypeSelect.vue';

export default {
  name: "CheckoutCustomer",
  components: {
    Form,
    Field,
    ErrorMessage,
    InputTypeNumber,
    InputTypeSelect
  },
  data() {
    const schema = yup.object().shape({
      receiverName: yup.string().required("Receiver's name is required!"),
      receiverPhone: yup.string().required("Phone is required!"),
      receiverAddress: yup.string().required("Address is required!"),
      paymentMethod: yup.string().required("Please select payment method"),
      shippingFee: yup.number(),
      subTotal: yup.number(),
      message: yup.string(),
    });
    return {
      id: "",
      cart: [],
      paymentMethods: [{
        label: "Cash On Delivery",
        value: "CASH_ON_DELIVERY",
      },],
      paymentMethod: null,
      origin: location.origin,
      schema
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
    toPrice(value = "") {
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    changePaymentMethod(newMethod) {
      this.paymentMethod = newMethod;
      this.$refs.paymentMethodInput.$el.value = newMethod?.value || "";
      this.$refs.paymentMethodInput.$el.dispatchEvent(new Event('change'));
    },
    async submitHandler(order) {
      console.log(order.paymentMethod);
      order.list = JSON.parse(JSON.stringify(this.cart))
      console.log(order);
      await this.$store.dispatch('order/placeorder', order)
        .then((res) => {
          this.$emit('notification', {
            message: res.message,
            type: "success"
          })
          this.$store.dispatch('cart/removeAllCartItems')
          this.$router.push({ name: "CustomerOrderSuccess" })
        })
        .catch(err => {
          this.$emit('notification', {
            message: err.message,
            type: "error"
          })
        })
    }
  },
  computed: {
    cartQuantity() {
      return this.$store.getters['cart/cartQuantity'];
    },
    cartTotal() {
      return this.$store.getters['cart/cartTotal'];
    },
    currentUserC() {
      return this.$store.state.userC.user;
    },
    shippingFee() {
      return 0;
    }
  },
  mounted() {
    this.cart = JSON.parse(localStorage.getItem('cartItems' + this.currentUserC._id));
  }
}
</script>

<template>
  <main>
    <Form @submit="submitHandler" :validation-schema="schema" class="wrapper">
      <div class="section header">
        <div class="strip"></div>
        <div class="form-group">
          <h2 style="display: block; width: 100%; padding: 8px;">Checkout</h2>
        </div>
      </div>
      <div class="section">
        <h4>🚚 Delivery Address</h4>
        <div class="form-group">
          <label class="w-50">
            Full name:
            <Field type="text" name="receiverName" placeholder="Receiver's name" />
          </label>
          <label class="w-50">
            Phone number:
            <Field type="tel" name="receiverPhone" placeholder="Receiver's phone number" />
          </label>
          <label>
            Address:
            <Field type="text" autocomplete="address" :rows="2" name="receiverAddress" />
          </label>
          <ErrorMessage name="receiverName" />
          <ErrorMessage name="receiverPhone" />
          <ErrorMessage name="receiverAddress" />
        </div>
      </div>
      <div class="section">
        <h4>📦 Products Ordered</h4>
        <div class="form-group">
          <table>
            <tr>
              <th></th>
              <th class="shrink">Unit Price</th>
              <th class="">Amount</th>
              <th class="shrink">Item Subtotal</th>
            </tr>
            <tr v-for="cartitem in cart">
              <td>{{ cartitem.productName }}</td>
              <td class="right">{{ toPrice(cartitem.orderPrice) }}</td>
              <td class="center">{{ cartitem.quantity }}</td>
              <td class="right">{{ toPrice(cartitem.orderPrice * cartitem.quantity) }}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">Order Total ({{ cartQuantity }} item):&NonBreakingSpace;&NonBreakingSpace;
              </td>
              <td class="right important">{{ toPrice(cartTotal) }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="section">
        <h4>🎫 Vouchers</h4>
        <div class="form-group">
          <i>Coming soon</i>
        </div>
      </div>
      <div class="section">
        <h4>💳 Payment methods</h4>
        <div class="form-group">
          <table>
            <tr>
              <td class=" right">Methods: </td>
              <td class="shrink has-select">
                <InputTypeSelect @changed="changePaymentMethod" :options="paymentMethods" label="Payment Methods" />
                <Field ref="paymentMethodInput" name="paymentMethod" type="hidden" />
                <ErrorMessage name="paymentMethod" style="display: block; width: 100%; text-align: left;" />
              </td>
            </tr>
            <tr>
              <td class="right">Mechandise Subtotal: </td>
              <td class="right">{{ toPrice(cartTotal) }}</td>
              <Field name="subTotal" type="hidden" :value="cartTotal" />
            </tr>
            <tr>
              <td class="right">Shipping Total: </td>
              <td class="right">{{ toPrice(shippingFee) }}</td>
              <Field name="shippingFee" type="hidden" :value="shippingFee" />

            </tr>
            <tr>
              <td class="right">Total Payment: </td>
              <td class="right">
                <h3 class="totalPrice">{{ toPrice(cartTotal + shippingFee) }}</h3>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="section">
        <div class="form-group">
          <label>
            📝 Message:
            <Field name="message" placeholder="Leave a message for seller..." />
          </label>
          <hr>
          <button class="block primary" type="submit">Place Order</button>
          <i>
            By clicking "Place Order", you are agreeing to
            <a href="#" target="_blank" rel="noopener noreferrer">QuanLyBanHang's General Transaction Terms</a>
          </i>
        </div>
      </div>

    </form>

  </main>
</template>

<style scoped>
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

.wrapper {
  max-width: calc(768px - var(--sidebar-icon-width));
  margin: 8px;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  border-radius: 8px;
  flex: 1 0 auto;
  box-sizing: border-box;

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

.wrapper {
  display: block;
}

.section {
  background-color: #ffffff99;
  max-width: inherit;
  border-radius: 8px;
  margin-bottom: 8px;
  padding-inline: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

.section.header {
  padding: 0px;
  padding-top: 0px !important;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 8px;

  &>* {
    width: 100%;
  }

  & .w-50 {
    width: 50%;

    @media (width <=768px) {
      width: 100%;
    }
  }

}

.strip {
  height: 3px;
  width: 100%;
  background-position-x: -30px;
  background-size: 116px 3px;
  background-image: repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px);
}

label {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px;

  box-sizing: border-box;

  &::after {
    content: none;
  }

  @media screen and (max-width:512px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;

    & input {
      width: 100% !important;
    }
  }
}

input {
  width: calc(100% - 10rem) !important;
  float: right;
  background-color: transparent;

  transition: (transform, padding) .5s ease-in-out;
  font-size: 16px;
  line-height: 8px;
  color: #575756;
  background-color: transparent;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-transition: (transform, padding) .5s ease-in-out;
  -moz-transition: (transform, padding) .5s ease-in-out;
  -ms-transition: (transform, padding) .5s ease-in-out;
  -o-transition: (transform, padding) .5s ease-in-out;
  padding: 12px 0;
  outline: 0;
  border: 1px solid transparent;
  border-bottom: 1px solid #575756;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
}

table {
  margin: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgb(222, 222, 222);


  & th {
    color: #aaa;

  }

  & tr {
    display: table-row;
    height: 2em;
  }

  & td {
    display: table-cell;
    padding-inline: 4px;

    &.center {
      text-align: center;
    }

    &.right {
      text-align: right;
    }

    &.important {
      font-size: larger;
      font-weight: 700;
    }
  }

  & .shrink {
    text-align: center;
    width: 1%;
    padding-inline: 8px;
    min-width: 20px;
    white-space: nowrap;
    text-align: right;
  }

  & .shrink.has-select {
    min-width: fit-content;
  }

  &>tr:last-child {
    height: 3em;
  }
}

.totalPrice {
  color: red;
}

button.primary {
  background-color: var(--primary-color);
  color: #fff;
}
</style>
