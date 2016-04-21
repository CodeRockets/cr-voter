DO

$do$
declare acount integer;
 bcount integer;
  r RECORD;
BEGIN
--FOR i IN 1..(select count(*) from question) LOOP
  FOR r IN SELECT * FROM question WHERE app=1 LOOP

acount:=(select round(random() * 49)::integer);
bcount:=50-acount;

UPDATE question
  set option_a_count=acount,option_b_count=bcount
  where id=r.id;


RAISE NOTICE 'a %s %s',acount::VARCHAR(5),bcount::VARCHAR(5);
END LOOP;
END
$do$;