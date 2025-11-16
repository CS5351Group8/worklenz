DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'tasks'::regclass
      AND contype = 'f'
  )
  LOOP
    EXECUTE 'ALTER TABLE tasks DROP CONSTRAINT ' || quote_ident(r.conname) || ' CASCADE';
  END LOOP;
END
$$;