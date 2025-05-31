-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('ADMIN', 'CUSTOMER');
create type order_status as enum ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- Create tables
create table public.users (
    id uuid references auth.users on delete cascade,
    email text unique not null,
    name text,
    role user_role default 'CUSTOMER',
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_login_at timestamp with time zone,
    is_active boolean default true,
    preferences jsonb,
    primary key (id)
);

create table public.addresses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade,
    street text not null,
    city text not null,
    state text not null,
    postal_code text not null,
    country text not null,
    is_default boolean default false,
    label text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text unique not null,
    description text,
    image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    price decimal(10,2) not null,
    stock integer not null,
    image text,
    category_id uuid references public.categories(id) on delete restrict,
    unit text not null,
    unit_quantity decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(name, category_id)
);

create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete restrict,
    status order_status default 'PENDING',
    total decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete restrict,
    quantity integer not null,
    price decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index addresses_user_id_idx on public.addresses(user_id);
create index products_category_id_idx on public.products(category_id);
create index orders_user_id_idx on public.orders(user_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Create RLS Policies

-- Users policies
create policy "Users can view their own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own data"
    on public.users for update
    using (auth.uid() = id);

-- Addresses policies
create policy "Users can view their own addresses"
    on public.addresses for select
    using (auth.uid() = user_id);

create policy "Users can insert their own addresses"
    on public.addresses for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own addresses"
    on public.addresses for update
    using (auth.uid() = user_id);

create policy "Users can delete their own addresses"
    on public.addresses for delete
    using (auth.uid() = user_id);

-- Categories policies (public read, admin write)
create policy "Anyone can view categories"
    on public.categories for select
    using (true);

create policy "Only admins can modify categories"
    on public.categories for all
    using (exists (
        select 1 from public.users
        where users.id = auth.uid()
        and users.role = 'ADMIN'
    ));

-- Products policies (public read, admin write)
create policy "Anyone can view products"
    on public.products for select
    using (true);

create policy "Only admins can modify products"
    on public.products for all
    using (exists (
        select 1 from public.users
        where users.id = auth.uid()
        and users.role = 'ADMIN'
    ));

-- Orders policies
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Users can create their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

create policy "Only admins can update orders"
    on public.orders for update
    using (exists (
        select 1 from public.users
        where users.id = auth.uid()
        and users.role = 'ADMIN'
    ));

-- Order items policies
create policy "Users can view their own order items"
    on public.order_items for select
    using (exists (
        select 1 from public.orders
        where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    ));

create policy "Users can create their own order items"
    on public.order_items for insert
    with check (exists (
        select 1 from public.orders
        where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    ));

-- Create functions and triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

create trigger handle_addresses_updated_at
    before update on public.addresses
    for each row
    execute function public.handle_updated_at();

create trigger handle_categories_updated_at
    before update on public.categories
    for each row
    execute function public.handle_updated_at();

create trigger handle_products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();

create trigger handle_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

create trigger handle_order_items_updated_at
    before update on public.order_items
    for each row
    execute function public.handle_updated_at(); 