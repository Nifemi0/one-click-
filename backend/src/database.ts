import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class Database {
  private static instance: Database;
  private supabase: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Proxy all Supabase methods to make them available directly on Database instance
  public from(table: string) {
    return this.supabase.from(table);
  }

  public getSupabase(): SupabaseClient {
    return this.supabase;
  }
}
