-- Table: public.program

-- DROP TABLE IF EXISTS public.program;

CREATE TABLE IF NOT EXISTS public.program
(
    code character varying(100) COLLATE pg_catalog."default" NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    college_code character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT program_pkey PRIMARY KEY (code),
    CONSTRAINT fk_program_college FOREIGN KEY (college_code)
        REFERENCES public.college (code) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.program
    OWNER to postgres;