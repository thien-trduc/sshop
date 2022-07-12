export const enum OrderStatus {
    INIT = 'init',
    NOT_PAYMENT = 'not_payment',
    PAYMENT = 'payment',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    WAITING = 'waiting',
    CANCEL = 'cancel',
    ALL = 'all',
}

export const orderStatusObj = {
    [`${OrderStatus.INIT}`]: {
        label: '_',
        value: `${OrderStatus.INIT}`,
    },
    [`${OrderStatus.NOT_PAYMENT}`]: {
        label: 'Chưa thanh toán',
        value: `${OrderStatus.NOT_PAYMENT}`,
    },
    [`${OrderStatus.PAYMENT}`]: {
        label: 'Đã thanh toán',
        value: `${OrderStatus.PAYMENT}`,
    },
    [`${OrderStatus.SHIPPING}`]: {
        label: 'Đang giao',
        value: `${OrderStatus.SHIPPING}`,
    },
    [`${OrderStatus.DELIVERED}`]: {
        label: 'Đã giao',
        value: `${OrderStatus.SHIPPING}`,
    },
    [`${OrderStatus.WAITING}`]: {
        label: 'Đã giao',
        value: `${OrderStatus.WAITING}`,
    },
    [`${OrderStatus.CANCEL}`]: {
        label: 'Đã giao',
        value: `${OrderStatus.CANCEL}`,
    },
};
