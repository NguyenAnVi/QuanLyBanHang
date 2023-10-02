const AvailableEmployeeDuties = [
  'EMPLOYEE',
  'LEADER',
  'MANAGER',
  'MODERATOR',
  'ADMIN'
]
const AvailableOrderStatus = [
  'TO_PAY',
  'TO_SHIP',
  'TO_RECEIVE',
  'COMPLETED',
  'CANCELLED'
]

// Cancellable time (hours): After an order is placed, customer 
// can request to cancel within this time.
const CANCELLABLE_TIME = 24;

const AvailablePaymentMethods = [
  'CASH_ON_DELIVERY'
]

export {
  AvailableEmployeeDuties,
  AvailableOrderStatus,
  CANCELLABLE_TIME,
  AvailablePaymentMethods
}