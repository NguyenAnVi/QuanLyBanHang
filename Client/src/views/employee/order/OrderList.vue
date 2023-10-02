<script>
import { ref } from 'vue';
import InputTypeDate from '@/components/InputTypeDate.vue';
import InputTypeSelect from '@/components/InputTypeSelect.vue';
import Modal from '@/components/Modal.vue';
import { OrderStatus } from '@/config/index.config';

export default {
  name: "OrderList",
  components: {
    Modal,
    InputTypeDate,
    InputTypeSelect
  },
  data() {
    return {
      origin: location.origin,
      OrderStatus,
      orderStatus: [],
      orderStatusOption: [],
      userSuggest: [],
      filters: {},
      orders: [],
      mongoObjectIdRegExp: '^([0-9a-fA-F]){24}$',
      currentOrderDetail: {},
      newOrderStatus: ""
    }
  },
  methods: {
    getDetail(e) {
      this.currentOrderDetail = (this.orders[e.currentTarget.getAttribute('data-index')]);
      this.$refs.detailModal.show();
    },
    showModalHandler() {
      this.showModal = true;
    },
    hideModalHandler() {
      this.showModal = false;
    },
    toPrice(value = "") {
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    addFilter(filter) {
      this.filters = {
        ...this.filters,
        ...filter
      }
    },
    orderStatusFilter(e) {
      const siblings = e.target.parentNode.querySelectorAll(e.target.localName)
      siblings.forEach(element => {
        element.classList.remove('active');
      });
      e.target.classList.add('active');

      const q = JSON.parse(e.target.getAttribute('data-query'));
      this.addFilter({ status: q.status });
    },
    searchCustomer(e) {
      this.userSuggest = [];
      if (e.target.value) {
        this.$store.dispatch('order/searchUser', e.target.value)
          .then(res => {
            console.log(res);
            this.userSuggest = res.data;
          })
      }
      if (e.target.checkValidity()) {
        this.addFilter({ customerId: (e.target.value !== "") ? e.target.value : undefined })
      } else {
        this.addFilter({ customerId: undefined })
      }
    },
    getSuggest(e) {
      this.$refs.suggestInput.value = e.target.getAttribute('data-id');
      this.$refs.suggestInput.dispatchEvent(new Event('input'))
    },
    inputTypeDateChangeHandler(d) {
      if (d == "Invalid Date") {
        this.addFilter({ createdAt: undefined })
      } else {
        this.addFilter({
          createdAt: {
            $gt: d
          }
        })
      }
    },
    saveNewOrderStatus(newVal) {
      this.newOrderStatus = newVal.query.status
    },
    processOrder() {
      this.$refs.processOrderModal.hide()
      this.$refs.detailModal.hide()
      this.$store.dispatch('order/processOrder', {
        orderId: this.currentOrderDetail._id,
        newStatus: this.newOrderStatus
      }).then(res => {
        this.addFilter({});
        this.$emit('notification', {
          message: res.message,
          type: 'success'
        })
      }).catch(errres => {
        this.$emit('notification', {
          message: errres.response.data.message,
          type: 'error'
        })
      })
    }
  },
  computed: {
    productItems() {
      return JSON.parse(JSON.stringify(this.$store.getters['product/productItems']));
    }
  },
  watch: {
    async filters(newVal) {
      console.log(newVal);
      this.orders = [];
      this.$store.dispatch('order/getorderlistadmin', newVal)
        .then(res => {
          console.log(res);
          this.orders = res.data
        });
    }
  },
  created() {
    this.orderStatus = ref([]);
    this.orderStatusOption = ref([]);
    Object.keys(OrderStatus).forEach((os, index) => {
      this.orderStatus.push(OrderStatus[os])
      this.orderStatusOption.push({
        label: OrderStatus[os].name.toString(),
        value: os,
      })
    });
  }
};
</script>
<template>
  <main class="container">
    <h3>{{ $route.meta.title }}</h3>
    <div class="is-ancestor">
      <div class="filters">
        <div class="suggest-wrapper" ref="suggestUser">
          <input @click="$event.target.select()" ref="suggestInput" placeholder="Type Customer's Id or Name..."
            type="text" class="filter-item suggest" @input="searchCustomer" :pattern="mongoObjectIdRegExp" />
          <div id="suggests">
            <div class="suggest-item" v-for="(user, ind) in userSuggest" @click="getSuggest" :data-id="user._id">
              {{
                user.name }}</div>
          </div>
        </div>
        <InputTypeDate @changed="inputTypeDateChangeHandler" />
        <div class="filter-item" @click="orderStatusFilter" v-for="item in orderStatus"
          :data-query="JSON.stringify(item.query)">{{
            item.label }}</div>

      </div>
      <transition name="fade" mode="out-in">
        <div class="is-parent" v-if="orders.length > 0">
          <div class="card header">
            <div class="cell shrink">
              ID
            </div>
            <div class="cell shrink">
              <p>Status</p>
            </div>
            <div class="cell">
              <strong>Total</strong>
            </div>
            <div class="cell shrink">
              Ordered At
            </div>
          </div>
          <div class="card" v-for="(item, index) in orders" @click="getDetail" :data-index="index">
            <div class="cell">
              <p>{{ item._id }}</p>
            </div>
            <div class="cell shrink">
              <p>{{ OrderStatus[item.status].label }}</p>
            </div>
            <div class="cell shrink">
              <strong>{{ toPrice(item.subTotal + item.shippingFee) }}</strong>
            </div>
            <div class="cell shrink">
              <p>{{ item.createdAt }}</p>
            </div>
          </div>
        </div>
        <div style="background-color: #ededed; margin:4px; display: table-cell;box-sizing: border-box;border-radius: 4px;"
          v-else>
          <img :src="origin + '/noorders.png'" alt=""
            style=" margin-top:2rem;width: 200px; aspect-ratio: 4/3; margin-left: auto;margin-right: auto; display: block;"
            v-once>
          <h4 style="text-align: center;">No orders yet</h4>
        </div>
      </transition>

    </div>
    <Teleport to="body">
      <Modal width="800px" ref="detailModal">
        <template #header>
          <h3>Order Detail ({{ currentOrderDetail._id }})</h3>
        </template>
        <template #body>
          <div style="display: flex; align-items: stretch;">
            <div style="width: 400px; height: inherit; padding-inline: 1rem;">
              <div class="strip"></div>
              <div style="display: block; margin-block:1rem">
                <div style="display: flex;flex-wrap: wrap;  width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Receiver's Name: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.receiverName }}</span>
                </div>
                <div style="display: flex;flex-wrap: wrap;  width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Receiver's phone: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.receiverPhone }}</span>
                </div>
                <div
                  style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between; align-items: start;margin-block:8px">
                  <span>Receiver's address: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.receiverAddress }}</span>
                </div>
                <div style="display: flex;flex-wrap: wrap;  width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Order's status: </span>
                  <span style="color: red; text-align: right;">{{ currentOrderDetail.status }}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Ordered At: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.createdAt }}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Payment Method: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.paymentMethod }}</span>
                </div>
              </div>
            </div>
            <div style="width:calc(100% - 400px);">
              <div class="order-card body">
                <div class="order-items">
                  <div class="order-item" v-for="orderItem in currentOrderDetail.list">
                    <div>
                      <span>
                        {{ orderItem.productName }}
                      </span>
                      <span style="font-size: 0.9em; color: gray;">
                        x{{ orderItem.quantity }}
                      </span>
                    </div>
                    <div>
                      {{ toPrice(orderItem.orderPrice) }}
                    </div>
                  </div>

                </div>
              </div>
              <div class="order-card footer">
                <div style="text-align: right ; display: flex; align-items: end; min-height: 1.6em;">
                  <span>Mechandise Subtotal:</span>
                  <span style="margin-left:1rem; width: 9rem;">
                    {{ toPrice(currentOrderDetail.subTotal) }}
                  </span>
                </div>
                <div style="text-align: right ; display: flex; align-items: end; min-height: 1.6em;">
                  <span>Shipping Fee:</span>
                  <span style="margin-left:1rem; width: 9rem;">
                    {{ toPrice(currentOrderDetail.shippingFee) }}
                  </span>
                </div>
                <div style="text-align: right ; display: flex; align-items: end; min-height: 1.6em;">
                  <span>Order Total:</span>
                  <span style="margin-left:1rem; font-size: 1.5em; color: red; font-weight: 550;width: 9rem;">
                    {{ toPrice(currentOrderDetail.subTotal + currentOrderDetail.shippingFee) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="display: flex; align-items: end; justify-content: flex-end;">
            <button style="background-color: var(--primary-color); color: #fff;"
              @click="$refs.processOrderModal.show()">Process this order</button>
            <button @click="$refs.detailModal.hide()">OK</button>

          </div>
        </template>
      </Modal>
      <Modal width="400px" ref="processOrderModal">
        <template #header>
          <h3>Process Order</h3>
        </template>
        <template #body>
          <InputTypeSelect :options="orderStatus" @changed="saveNewOrderStatus"
            style="min-width:100% !important;margin-left: auto;margin-right:auto; box-shadow: 0 0 5px #888;">
          </InputTypeSelect>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <button @click="processOrder" style="background-color: var(--primary-color); color:#fff">Process this
              order</button>
            <button @click="$refs.processOrderModal.hide()">Close</button>
          </div>

        </template>
      </Modal>
    </Teleport>
  </main>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: transparent;

  &>div,
  &>h3 {
    padding-inline: 16px;
  }
}

.is-ancestor {
  background-color: transparent;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.filters {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 8px;
}

.filter-item {
  display: block;
  background-color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 25px;
  box-sizing: border-box;
  transition: all .2s ease;
  cursor: pointer;

  &:hover,
  &:focus,
  &:valid,
  &.active {
    background-color: var(--primary-color);
    color: #fff;
    outline: none;
  }
}

input.filter-item.suggest {
  padding: 8px 16px;
  width: 30ch !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
  user-select: all;

  &:invalid {
    background-color: rgb(198, 52, 52);
    color: #fff;
  }

  &::placeholder {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: lightgray;
  }
}

#suggests {
  width: 30ch;
  font-size: 1.1em;
  box-sizing: border-box;
  margin: 0 !important;

  position: absolute;
  z-index: 1000;
  background-color: beige;
  border-radius: 8px;
}

.suggest-item {
  margin: 4px;
  padding: 8px 16px !important;
  flex-direction: column;
  position: relative;
  border-radius: 4px;

  &:hover {
    background-color: var(--primary-color);
    color: #fff;
  }
}

.is-parent {
  width: 100%;

  display: table;
  flex-wrap: wrap;
  border-spacing: 4px;
  gap: 8px;
  row-gap: 8px;

  &>*:nth-child(odd) {
    background-color: #ededed;
  }

  &>*:nth-child(even) {
    background-color: #ffffff;
  }

  .card.header {
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

  .card:hover .cell {
    background-color: rgb(189, 189, 189);
  }

  .card.header:hover .cell {
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

.order-card {
  padding: 8px
}

.order-card.header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid lightgray;
}

.order-items {
  display: block;

  &>*:nth-child(odd) {
    background: linear-gradient(to right, transparent, rgb(239, 243, 239), transparent)
  }

  &>*:nth-child(even) {
    background: linear-gradient(to right, transparent, rgb(255, 255, 255), transparent)
  }
}

.order-item {
  padding-block: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff99;

  &>* {
    flex-grow: 1;
  }

  &>*:first-child {
    display: flex;
    flex-direction: column;
  }

  &>*:last-child {
    flex-grow: 0;
    white-space: nowrap;
  }
}

.order-card.footer {
  border-top: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

hr.vertical-divider {
  height: 1em;
  margin: 0px 8px;
  border: 1px solid lightgray;
  border-radius: 1px;
}

.strip {
  height: 3px !important;
  width: 100%;
  background-position-x: 0px;
  background-size: 116px 3px;
  background-image: repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>