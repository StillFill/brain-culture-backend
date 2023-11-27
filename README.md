CREATE TABLE public.produtor
(
documento character varying(14) NOT NULL,
nome_produtor character varying(100) NOT NULL,
cidade character varying(30) NOT NULL,
estado character varying(30) NOT NULL,
nome_fazenda character varying(150) NOT NULL,
area_total_fazenda integer NOT NULL,
area_agricultavel_fazenda integer NOT NULL,
area_vegetacao_fazenda integer NOT NULL,
PRIMARY KEY (documento)
)
