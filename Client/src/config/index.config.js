const config = {
  API_URL: 'http://127.0.0.1:3000',
  ROOT_DIR: 'C:/Users/An Vi/Desktop/Space/Video-Streaming-With-ExpressJS/Client/'
}
export const OrderStatus = Object.freeze({
  ALL: ({
    name: "all",
    label: "All",
    query: {}
  }),
  TO_PAY: ({
    name: "topay",
    label: "To Pay",
    status: "💳 The order is waiting to pay",
    query: {
      status: "TO_PAY"
    }
  }),
  TO_SHIP: ({
    name: "toship",
    label: "To Ship",
    status: "🚚 The order is being shipping",
    query: {
      status: "TO_SHIP"
    }
  }),
  TO_RECEIVE: ({
    name: "toreceive",
    label: "To Receive",
    status: "🚚 The order is on the way to you",
    query: {
      status: "TO_RECEIVE"
    }
  }),
  COMPLETED: ({
    name: "completed",
    label: "Completed",
    status: "🏁 The order is delivered",
    query: {
      status: "COMPLETED"
    }
  }),
  CANCELLED: ({
    name: "cancelled",
    label: "Cancelled",
    status: "😢 The order is cancelled",
    query: {
      status: "CANCELLED"
    }
  })
});
export default config;