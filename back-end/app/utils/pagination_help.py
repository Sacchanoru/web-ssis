from math import ceil

def paginate_query(cur, base_sql, params=None, page=1, per_page=10, count_sql=None, count_params=None):
    """
    Generic pagination utility.
    Executes a paginated SQL query and returns data with pagination metadata.

    Args:
        cur: psycopg2 cursor
        base_sql (str): The main SELECT query (without LIMIT/OFFSET)
        params (list): Parameters for the main query
        page (int): Current page
        per_page (int): Records per page
        count_sql (str): Optional custom count query
        count_params (list): Optional count query params
    """

    if params is None:
        params = []
    if count_params is None:
        count_params = params

    # ✅ Add pagination to SQL
    offset = (page - 1) * per_page
    paginated_sql = f"{base_sql} LIMIT %s OFFSET %s"
    cur.execute(paginated_sql, [*params, per_page, offset])
    rows = cur.fetchall()

    # ✅ Count total rows
    if not count_sql:
        count_sql = f"SELECT COUNT(*) FROM ({base_sql}) AS total_count"
    cur.execute(count_sql, count_params)
    total = cur.fetchone()[0]

    # ✅ Return structured pagination info
    return {
        "data": rows,
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": ceil(total / per_page)
    }