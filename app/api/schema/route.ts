import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get tables and columns
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select(`
        table_name,
        table_schema,
        columns:information_schema.columns!inner(
          column_name,
          data_type,
          is_nullable,
          column_default,
          udt_name
        )
      `)
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      return NextResponse.json({ error: tablesError.message }, { status: 500 });
    }

    // Get foreign keys
    const { data: foreignKeys, error: fkError } = await supabase
      .from('information_schema.table_constraints')
      .select(`
        table_name,
        constraint_name,
        constraint_type,
        key_column_usage:information_schema.key_column_usage!inner(
          column_name,
          referenced_table_name:information_schema.constraint_column_usage!inner(
            table_name
          ),
          referenced_column_name:information_schema.constraint_column_usage!inner(
            column_name
          )
        )
      `)
      .eq('constraint_type', 'FOREIGN KEY')
      .eq('table_schema', 'public');

    if (fkError) {
      console.error('Error fetching foreign keys:', fkError);
      return NextResponse.json({ error: fkError.message }, { status: 500 });
    }

    // Get primary keys
    const { data: primaryKeys, error: pkError } = await supabase
      .from('information_schema.table_constraints')
      .select(`
        table_name,
        constraint_name,
        key_column_usage:information_schema.key_column_usage!inner(
          column_name
        )
      `)
      .eq('constraint_type', 'PRIMARY KEY')
      .eq('table_schema', 'public');

    if (pkError) {
      console.error('Error fetching primary keys:', pkError);
      return NextResponse.json({ error: pkError.message }, { status: 500 });
    }

    // Format the response
    const formattedTables = tables.map((table: any) => {
      const tableFks = foreignKeys?.filter((fk: any) => fk.table_name === table.table_name) || [];
      const tablePks = primaryKeys?.find((pk: any) => pk.table_name === table.table_name);

      return {
        name: table.table_name,
        columns: table.columns.map((col: any) => ({
          name: col.column_name,
          type: col.udt_name.toUpperCase(),
          nullable: col.is_nullable === 'YES',
          default: col.column_default,
          isPrimaryKey: tablePks?.key_column_usage.some((kcu: any) => kcu.column_name === col.column_name) || false
        })),
        foreignKeys: tableFks.map((fk: any) => ({
          name: fk.constraint_name,
          columns: fk.key_column_usage.map((kcu: any) => ({
            column: kcu.column_name,
            references: {
              table: kcu.referenced_table_name.table_name,
              column: kcu.referenced_column_name.column_name
            }
          }))
        }))
      };
    });

    return NextResponse.json(formattedTables);
  } catch (error) {
    console.error('Error fetching schema:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 