create function get_book_best_seller(integer, integer, timestamp without time zone, timestamp without time zone)
    returns TABLE(isbn character varying, total numeric)
    language plpgsql
as
$$
BEGIN
    return query with temp_cart as (
        select c.id
        from cart c
        where $3 <= c.createdat and  createdat <= $4 AND status = 2
    )   select cd.book_id, sum(cd.quantity) as total
        from temp_cart tc
        inner join cart_detail cd
        on tc.id = cd.cart_id
        group by cd.book_id
        order by total
        offset $1
        limit $2;
END;
$$;

alter function get_book_best_seller(integer, integer, timestamp, timestamp) owner to postgres;

