create function get_sale_book(character varying)
    returns TABLE(title character varying, value double precision, price double precision, status boolean, price_discount double precision)
    language plpgsql
as
$$
declare
    current_date timestamp:= current_timestamp;
--     book_input_id varchar(255) := $1;
BEGIN
return query (with temp_book_price as (
    select *
    from book_price as bp
    where book_id =  $1
    order by bp.date desc limit 1
), temp_discount as (
    select d.id, d.name, d.description
    from discount as d
    where current_date <= end_date and current_date >= start_date
), temp_discount_detail as (
    select dd.status, dd.book_id, dd.discount_id, dd.value
    from discount_detail as dd
    where dd.book_id =  $1 and dd.status = true
), temp_discount_join_detail as (
    select td.name, td.description, tdd.value, tdd.book_id, tdd.status
    from temp_discount as td
    inner join temp_discount_detail as tdd
    on tdd.discount_id = td.id
), temp_book_join_book_price as (
    select b.isbn, tbp.price as book_price
    from book as b
    inner join temp_book_price as tbp
    on tbp.book_id = b.isbn
)
    select tdjd.name as title,
           tdjd.value as value,
           tbjp.book_price as price,
           tdjd.status as status,
           (tbjp.book_price - (tdjd.value::float/100) * tbjp.book_price) as price_discount
    from temp_book_join_book_price as tbjp
    inner join temp_discount_join_detail as tdjd
    on tbjp.isbn = tdjd.book_id);
END;
$$;

alter function get_sale_book(varchar) owner to postgres;

