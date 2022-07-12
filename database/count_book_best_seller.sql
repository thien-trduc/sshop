create function count_book_best_seller(timestamp without time zone, timestamp without time zone) returns numeric
    language plpgsql
as
$$
DECLARE
    total numeric;
BEGIN
    with temp_cart as (
        select c.id
        from cart c
        where $1 <= c.createdat and  createdat <= $2 AND status = 2
    ), temp_book_seller as (
        select cd.book_id, sum(cd.quantity) as total
        from temp_cart tc
        inner join cart_detail cd
        on tc.id = cd.cart_id
        group by cd.book_id
    )
    select count(*) into total  from temp_book_seller;
    return total;
END;
$$;

alter function count_book_best_seller(timestamp, timestamp) owner to postgres;