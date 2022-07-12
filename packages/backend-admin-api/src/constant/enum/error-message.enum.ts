export enum ErrorMessage {
    INTERNAL = 'Hệ thống lỗi ! Xin liên hệ admin để được giải quyết!',
    INTERNAL_FIREBASE = 'Hệ thống đăng nhập bằng phương thức mạng xã hội lỗi ! Xin vui lòng quay lại sau!',
    AUTHORIZATION = 'Xác thực tài khoản không thành công! Xin đăng nhập lại!',
    BOOK_NOT_FOUND = 'Xin lỗi vì điều này, chúng tôi đang cập nhật sách cho danh mục này!',
}

export enum ValidationMessage {
    EMPTY = 'không được để trống',
    EMAIL = `Email không đúng định dạng ! Xin nhập lại !`,
    PASSWORD = 'Password bao gồm chữ thường hoặc chữ hoa, số, ký tự đặc biệt! Xin nhập lại',
    PHONE = 'Số điện thoại không đúng định dạng',
}
