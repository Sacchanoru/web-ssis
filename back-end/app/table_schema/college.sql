-- Table: public.college

-- DROP TABLE IF EXISTS public.college;

CREATE TABLE IF NOT EXISTS public.college
(
    code character varying(100) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT college_pkey PRIMARY KEY (code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.college
    OWNER to postgres;