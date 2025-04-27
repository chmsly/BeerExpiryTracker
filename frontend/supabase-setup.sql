-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  device_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create beers table
CREATE TABLE beers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  brand_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT,
  expiry_date DATE NOT NULL,
  reminder_date DATE NOT NULL,
  image_url TEXT,
  reminder_sent BOOLEAN DEFAULT false NOT NULL,
  reminder_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX beers_user_id_idx ON beers (user_id);

-- Set up RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own profile
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- IMPORTANT: Policy to allow profile creation during registration and auth
CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Set up RLS policies for beers
ALTER TABLE beers ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own beers
CREATE POLICY "Users can view their own beers" 
  ON beers FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own beers
CREATE POLICY "Users can insert their own beers" 
  ON beers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own beers
CREATE POLICY "Users can update their own beers" 
  ON beers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own beers
CREATE POLICY "Users can delete their own beers" 
  ON beers FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to handle profile creation
-- Automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 