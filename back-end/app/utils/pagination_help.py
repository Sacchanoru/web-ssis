from math import ceil

def paginate_query(cur, base_sql, params=None, page=1, per_page=10, count_sql=None, count_params=None):
    if params is None:
        params = []
    if count_params is None:
        count_params = params

    # add pagination to sql
    offset = (page - 1) * per_page
    paginated_sql = f"{base_sql} LIMIT %s OFFSET %s"
    cur.execute(paginated_sql, [*params, per_page, offset])
    rows = cur.fetchall()

    # for counting total rows
    if not count_sql:
        count_sql = f"SELECT COUNT(*) FROM ({base_sql}) AS total_count"
    cur.execute(count_sql, count_params)
    total = cur.fetchone()[0]

    # return pagination info
    return {
        "data": rows,
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": ceil(total / per_page)
    }