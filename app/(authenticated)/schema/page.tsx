'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ForeignKey {
  name: string;
  columns: {
    column: string;
    references: {
      table: string;
      column: string;
    };
  }[];
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
  isPrimaryKey: boolean;
}

interface Table {
  name: string;
  columns: Column[];
  foreignKeys: ForeignKey[];
}

export default function SchemaPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch('/api/schema');
        if (!response.ok) throw new Error('Failed to fetch schema');
        const data = await response.json();
        setTables(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching schema:', err);
        setError('Failed to load database schema');
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/4 mb-6" />
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 rounded-lg px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg">
          Database Schema
        </h1>
      </div>

      <div className="grid gap-6">
        {tables.map((table) => (
          <Card key={table.name} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-bold">{table.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-2 px-4">Column</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Constraints</th>
                      <th className="text-left py-2 px-4">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((column) => (
                      <tr key={column.name} className="border-b last:border-0">
                        <td className="py-2 px-4 font-medium">
                          {column.name}
                          {column.isPrimaryKey && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              PK
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-gray-600">{column.type}</td>
                        <td className="py-2 px-4">
                          <div className="flex flex-wrap gap-2">
                            {!column.nullable && (
                              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                NOT NULL
                              </span>
                            )}
                            {table.foreignKeys
                              .filter(fk => fk.columns.some(col => col.column === column.name))
                              .map(fk => (
                                <span key={fk.name} className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full" title={`References ${fk.columns[0].references.table}.${fk.columns[0].references.column}`}>
                                  FK
                                </span>
                              ))}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-gray-600">
                          {column.default || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {table.foreignKeys.length > 0 && (
                <div className="p-4 bg-gray-50 border-t">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Foreign Keys</h3>
                  <div className="space-y-2">
                    {table.foreignKeys.map((fk) => (
                      <div key={fk.name} className="text-sm text-gray-600">
                        <span className="font-medium">{fk.name}:</span>{' '}
                        {fk.columns.map((col, i) => (
                          <span key={col.column}>
                            {i > 0 && ', '}
                            {col.column} → {col.references.table}.{col.references.column}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 