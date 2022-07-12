create function get_employee_handle_customer_order()
    returns TABLE(id integer, fullname text, value double precision)
    language plpgsql
as
$$
declare
    total integer;
BEGIN
    select count(*) into total from cart as c where status = 1;
    return query
        WITH cartTemp AS (
            select c.id, c.employee_id
            from cart as c
            where status = 1
        )
        select e.id, format('%s %s', e.surname, e.name) as fullname, (count(c.id)::float / total) * 100 as value
        from employee as e
                 left join cartTemp as c
                           on e.id = c.employee_id
        where department_id = 1
        group by e.id, e.surname, e.name
        order by value asc
        limit 1;
END;
$$;

alter function get_employee_handle_customer_order() owner to postgres;

