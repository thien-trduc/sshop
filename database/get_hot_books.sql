create function get_hot_books()
    returns TABLE(isbn character varying)
    language plpgsql
as
$$
BEGIN
    return query with hot_book as (select od.book_id, sum(od.quantity) as count
        from "order" o
        inner join order_detail od
        on o.id = od.order_id
        group by od.book_id
        order by count desc
        limit 4)
        select hb.book_id as isbn from hot_book hb;
END;
$$;

alter function get_hot_books() owner to postgres;

