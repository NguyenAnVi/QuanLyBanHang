<script>
import Modal from '@/components/Modal.vue'

export default {
  name: "OrderListCustomer",
  components: {
    Modal
  },
  data() {
    const listQueries = [
      {
        name: "all",
        label: "All",
        query: {}
      },
      {
        name: "topay",
        label: "To Pay",
        status: "💳 The order is waiting to pay",
        query: {
          status: "TO_PAY"
        }
      },
      {
        name: "toship",
        label: "To Ship",
        status: "🚚 The order is being shipping",
        query: {
          status: "TO_SHIP"
        }
      },
      {
        name: "toreceive",
        label: "To Receive",
        status: "🚚 The order is on the way to you",
        query: {
          status: "TO_RECEIVE"
        }
      },
      {
        name: "completed",
        label: "Completed",
        status: "🏁 The order is delivered",
        query: {
          status: "COMPLETED"
        }
      },
      {
        name: "cancelled",
        label: "Cancelled",
        status: "😢 The order is cancelled",
        query: {
          status: "CANCELLED"
        }
      },

    ]
    return {
      origin: location.origin,
      listQueries,
      currentOrdersList: [],
      currentOrderDetail: {},
      showModal: false
    }
  },
  methods: {
    async getTab(e) {
      let tabName = ""
      switch (typeof (e)) {
        case 'object':
          const siblings = e.target.parentNode.querySelectorAll(e.target.localName)
          siblings.forEach(element => {
            element.classList.remove('active');
          });
          e.target.classList.add('active');
          tabName = (e.target.getAttribute('data-tab'));
          e.target.classList.add()
          break;

        case 'string':
          tabName = (e).toLowerCase();
          break;
      }
      const desiredTab = this.listQueries.find(item => (item.name == tabName));
      await this.$store.dispatch('order/getorderlist', desiredTab.query)
        .then((res) => {
          this.currentOrdersList = (res.data);
        })
        .catch(err => {
          this.$emit('notification', {
            message: err.message,
            type: 'error'
          })
        })

    },
    getDetail(e) {
      this.currentOrderDetail = (this.currentOrdersList[e.currentTarget.getAttribute('data-index')]);
      this.showModalHandler()
    },
    toLabelStatus(str) {
      return this.listQueries.find(el => (el.query.status === str)).status
    },
    toPrice(value = "") {
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    showModalHandler() {
      this.showModal = true;
    },
    hideModalHandler() {
      this.showModal = false;
    },
  },
  mounted() {
  }
}
</script>

<template>
  <main>
    <div>
      <div class="section header" v-once>
        <div class="form-group">
          <h2 style="display: block; width: 100%; padding: 8px;">{{ $route.meta.title }}</h2>
        </div>
      </div>
      <div class="section tabs-wrapper" v-once>
        <div class="form-group tabs">
          <button v-for="item in listQueries" @click="getTab" class="tab" :data-tab="item.name">{{ item.label }}</button>
        </div>
      </div>
      <div class="section" v-for="(item, index) in currentOrdersList">
        <div class="order-card header">
          <span> {{ toLabelStatus(item.status) }}</span>
          <hr class="vertical-divider">
          <span style="color: red;">{{ item.status }}</span>
        </div>
        <div class="order-card body">
          <div class="order-items">
            <div class="order-item">
              <div>
                <span>
                  {{ item.list[0].productName }}
                </span>
                <span style="font-size: 0.9em; color: gray;">
                  x{{ item.list[0].quantity }}
                </span>
              </div>
              <div>
                {{ toPrice(item.list[0].orderPrice) }}
              </div>
            </div>
            <div class="order-item" v-if="item.list.length > 1">
              <div>
                <i style="color: gray;">
                  +{{ item.list.length - 1 }} more
                </i>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
        <div class="order-card footer">
          <div style="text-align: right ;">
            <span>Order Total:</span>
            <span style="margin-left:1rem; font-size: 1.5em; color: red; font-weight: 550;">
              {{ toPrice(item.subTotal + item.shippingFee) }}
            </span>
          </div>
          <div style="margin-block: 1rem;">
            <button style="min-width: 10rem;" @click="">Buy Again</button>
            <button style="min-width: 10rem;" @click="">Contact Seller</button>
            <button style="min-width: 10rem;" @click="getDetail" :data-index="index">Detail</button>

          </div>
        </div>
      </div>
      <div class="section" v-if="currentOrdersList.length <= 0">
        <img :src="origin + '/noorders.png'" alt=""
          style=" margin-top:2rem;width: 200px; aspect-ratio: 4/3; margin-left: auto;margin-right: auto; display: block;"
          v-once>
        <h4 style="text-align: center;">No orders yet</h4>
      </div>
    </div>
    <Teleport to="body">
      <Modal width="800px" :show="showModal" @close="hideModalHandler">
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
      </Modal>
    </Teleport>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

main>* {
  padding: 8px;
}

.tabs {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: nowrap !important;
  overflow-x: auto;
  overflow-y: hidden;
}

button.tab {
  flex: 1 0 auto;
  width: auto !important;
  margin: 0;
  text-wrap: nowrap;
  transform: translateY(10%);
}

button.tab.active {
  z-index: 10;
  background-color: aqua;
  transform: scaleY(1.1) translateY(-2%);
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
</style>
