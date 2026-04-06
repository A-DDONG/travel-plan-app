-- Supabase SQL 스키마
-- Supabase 대시보드 > SQL Editor에 붙여넣고 실행하세요

create table if not exists travel_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  budget numeric not null default 0,
  description text not null default '',
  status text not null default '계획중' check (status in ('계획중', '예약완료', '여행중', '완료')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists travel_places (
  id uuid primary key default gen_random_uuid(),
  travel_plan_id uuid not null references travel_plans(id) on delete cascade,
  name text not null,
  category text not null check (category in ('식당', '관광지', '카페', '숙소', '쇼핑', '기타')),
  address text not null default '',
  rating numeric not null default 0 check (rating >= 0 and rating <= 5),
  memo text not null default '',
  visit_date date not null,
  is_visited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at 자동 업데이트 함수
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger travel_plans_updated_at
  before update on travel_plans
  for each row execute function update_updated_at();

create or replace trigger travel_places_updated_at
  before update on travel_places
  for each row execute function update_updated_at();

-- RLS (Row Level Security) - 모든 사용자가 읽기/쓰기 가능 (공유 앱)
alter table travel_plans enable row level security;
alter table travel_places enable row level security;

create policy "allow all" on travel_plans for all using (true) with check (true);
create policy "allow all" on travel_places for all using (true) with check (true);
