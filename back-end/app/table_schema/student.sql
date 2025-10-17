-- Table: public.student

-- DROP TABLE IF EXISTS public.student;

CREATE TABLE IF NOT EXISTS public.student
(
    id character varying(9) COLLATE pg_catalog."default" NOT NULL,
    firstname character varying(100) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(100) COLLATE pg_catalog."default" NOT NULL,
    course character varying(100) COLLATE pg_catalog."default",
    year integer,
    gender character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT student_pkey PRIMARY KEY (id),
    CONSTRAINT fk_student_program FOREIGN KEY (course)
        REFERENCES public.program (code) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT student_year_check CHECK (year >= 1 AND year <= 6),
    CONSTRAINT student_gender_check CHECK (gender::text = ANY (ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.student
    OWNER to postgres;