import { 
    Book,
    Category,
    Publisher, 
    Department,
    Employee,
    User, 
    UserProfile,
    Customer,
    BookPrice,
    Cart,
    CartDetail,
    Receipt, 
    Discount,
    DiscountDetail,
    Order,
    OrderDetail,
    Role,
    RoleUser,
    CustomerAddress,
    Author,
    TokenVerifyOtp,
    OtpNumber,
    MailTemplate,
    event,
} from '@prisma/client';

export type BookModel = Book;
export type BookModelJoinPublisherCategory = Book & { category?: CategoryModel; publisher?: PublisherModel };
export type BookPriceModel = BookPrice;
export interface BookWithSaleModel {
    isbn: string;
    title: string;
    value: number;
    price: number;
    status: boolean;
    price_discount: number;
}

export interface BookSellerModel {
    isbn: string;
    total: number;
}
export type UserPolicies = UserModel & { customer_id?: number, roles?: string[] }

export type CategoryModel = Category;

export type PublisherModel = Publisher;

export type DepartmentModel = Department;

export type EmployeeModel = Employee;

export type UserModel = User;
export type UserProfileModel = UserProfile;

export type CustomerModel = Customer;
export type CustomerModelJoinAddress = CustomerModel & { customer_address?: CustomerAddressModel[] };
export type CustomerAddressModel = CustomerAddress;

export type CartModel = Cart;
export type CartDetailModel = CartDetail;
export type CartDetailModelJoinBookAndCart = CartDetail & { book?: BookModel; cart?: CartModel };

export type ReceiptModel = Receipt;

export type DiscountModel = Discount;
export type DiscountDetailModel = DiscountDetail;

export type OrderModel = Order;
export type OrderModelJoinEmployeeAndCustomer = Order & { employee?: EmployeeModel; customer?: CustomerModel };
export type OrderDetailModel = OrderDetail;
export type OrderDetailModelJoinBookAndOrder = OrderDetail & { book?: BookModel ; order?: OrderModel };

export type RoleModel = Role;
export type RoleUserModel = RoleUser;
export interface RoleForUserModel {
    id: number;
    name: string;
}

export type AuthorModel = Author;

export type TokenVerifyOtpModel = TokenVerifyOtp;
export type OtpModel = OtpNumber;
export type MailTemplateModel = MailTemplate;

export type EventModel = event;