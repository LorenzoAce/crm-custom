-- Funzione per ottenere le colonne di una tabella
CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' AND 
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$;

-- Funzione per aggiungere una colonna alla tabella clients
CREATE OR REPLACE FUNCTION public.add_column_to_clients(column_name text, column_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sql_statement text;
BEGIN
  -- Verifica che la colonna non esista già
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'clients' 
    AND column_name = add_column_to_clients.column_name
  ) THEN
    sql_statement := format('ALTER TABLE public.clients ADD COLUMN %I %s', 
                           add_column_to_clients.column_name, 
                           add_column_to_clients.column_type);
    EXECUTE sql_statement;
  END IF;
END;
$$;

-- Funzione per rinominare una colonna nella tabella clients
CREATE OR REPLACE FUNCTION public.rename_column_in_clients(old_column_name text, new_column_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sql_statement text;
BEGIN
  -- Verifica che la vecchia colonna esista
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'clients' 
    AND column_name = rename_column_in_clients.old_column_name
  ) THEN
    sql_statement := format('ALTER TABLE public.clients RENAME COLUMN %I TO %I', 
                           rename_column_in_clients.old_column_name, 
                           rename_column_in_clients.new_column_name);
    EXECUTE sql_statement;
  END IF;
END;
$$;

-- Funzione per eliminare una colonna dalla tabella clients
CREATE OR REPLACE FUNCTION public.drop_column_from_clients(column_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sql_statement text;
BEGIN
  -- Verifica che la colonna esista
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'clients' 
    AND column_name = drop_column_from_clients.column_name
  ) THEN
    sql_statement := format('ALTER TABLE public.clients DROP COLUMN %I', 
                           drop_column_from_clients.column_name);
    EXECUTE sql_statement;
  END IF;
END;
$$;

-- Concedi i permessi per eseguire queste funzioni
GRANT EXECUTE ON FUNCTION public.get_table_columns(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.add_column_to_clients(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.rename_column_in_clients(text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.drop_column_from_clients(text) TO anon, authenticated, service_role;