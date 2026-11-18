export type Database = {
  public: {
    Tables: {
      mantras: {
        Row: {
          id: string;
          name: string;
          category: string;
          author: string;
          description: string;
          strokes: unknown[];
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          author?: string | null;
          description?: string | null;
          strokes?: unknown[];
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          author?: string | null;
          description?: string | null;
          strokes?: unknown[];
          created_at?: string;
          user_id?: string | null;
        };
      };
    };
  };
};
