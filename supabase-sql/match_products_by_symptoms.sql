create function public.match_products_by_symptoms(
  symptom_keywords text,
  match_limit integer default 5
)
returns table (
  id uuid,
  name text,
  description text,
  price numeric,
  score double precision
)
language sql stable security definer
as $$
  select
    p.id,
    p.name,
    p.description,
    p.price,
    1 - (p.embedding <=> query_vector) as score
  from (
    select embeddings('text-embedding-3-large', symptom_keywords) as query_vector
  ) q,
  public.products p
  order by p.embedding <=> q.query_vector
  limit match_limit;
$$;
