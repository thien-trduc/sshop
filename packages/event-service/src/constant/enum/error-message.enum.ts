export const enum ErrorMessage {
    INTERNAL = 'Hệ thống lỗi ! Xin vui lòng quay lại sau!',
    INTERNAL_FIREBASE = 'Hệ thống đăng nhập bằng phương thức mạng xã hội lỗi ! Xin vui lòng quay lại sau!',
    AUTHORIZATION = 'Xác thực tài khoản không thành công! Xin đăng nhập lại!',
}

export const enum ValidationMessage {
    EMPTY = 'không được để trống',
    EMAIL = `Email không đúng định dạng ! Xin nhập lại !`,
    PASSWORD = 'Password bao gồm chữ thường hoặc chữ hoa, số, ký tự đặc biệt! Xin nhập lại',
    PHONE = 'Số điện thoại không đúng định dạng',
}

export const enum ServiceError {
    MAIL = 'Gửi mail không thành công xin thử lại!',
    PUSH = 'Gửi thông báo không thành công xin thử lại!',
    PUSH_EVENT = 'Push event không thành công!',
}
