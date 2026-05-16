create extension if not exists vector;

create or replace function public.match_products_by_embedding(
  query_embedding vector(768),
  match_limit integer default 8,
  match_category text default null
)
returns table (
  slug text,
  similarity double precision,
  reason text
)
language sql
stable
as $$
  select
    p.slug,
    1 - (p.embedding_vector <=> query_embedding) as similarity,
    case
      when match_category is not null then 'Khớp embedding trong cùng danh mục ' || match_category
      else 'Khớp embedding toàn catalog'
    end as reason
  from public.products p
  where p.embedding_vector is not null
    and (match_category is null or p.category = match_category)
  order by p.embedding_vector <=> query_embedding
  limit greatest(match_limit, 1);
$$;
