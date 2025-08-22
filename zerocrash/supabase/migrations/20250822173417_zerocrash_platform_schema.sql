-- Location: supabase/migrations/20250822173417_zerocrash_platform_schema.sql
-- Schema Analysis: Fresh project with no existing schema
-- Integration Type: Complete new schema for ZeroCrash IT search platform
-- Dependencies: None (fresh installation)

-- 1. Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'premium', 'user');
CREATE TYPE public.content_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.item_type AS ENUM ('search', 'result', 'seo', 'article');
CREATE TYPE public.content_source AS ENUM ('google', 'youtube', 'reddit', 'perplexity', 'manual');
CREATE TYPE public.search_status AS ENUM ('pending', 'completed', 'failed');

-- 2. Core user profiles table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'user'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories for organizing content
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT 'primary',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Search queries and history
CREATE TABLE public.searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sources public.content_source[] DEFAULT ARRAY[]::public.content_source[],
    results_count INTEGER DEFAULT 0,
    status public.search_status DEFAULT 'pending'::public.search_status,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Trending topics tracking
CREATE TABLE public.trending_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    trend_count INTEGER DEFAULT 0,
    popularity_score INTEGER DEFAULT 0,
    growth_percentage DECIMAL(5,2) DEFAULT 0,
    recent_trends TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Content items (search results, articles, etc.)
CREATE TABLE public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    content TEXT,
    item_type public.item_type DEFAULT 'result'::public.item_type,
    source public.content_source DEFAULT 'manual'::public.content_source,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    difficulty public.content_difficulty DEFAULT 'medium'::public.content_difficulty,
    popularity_score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Saved items by users
CREATE TABLE public.saved_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
    folder_name TEXT DEFAULT 'Default',
    notes TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. SEO-generated content
CREATE TABLE public.seo_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    meta_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    optimization_score INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. User settings and preferences
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    search_preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    ui_preferences JSONB DEFAULT '{}',
    api_keys JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Analytics and metrics
CREATE TABLE public.user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC DEFAULT 0,
    date_recorded DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_category_id ON public.searches(category_id);
CREATE INDEX idx_searches_created_at ON public.searches(created_at);
CREATE INDEX idx_content_items_category_id ON public.content_items(category_id);
CREATE INDEX idx_content_items_type ON public.content_items(item_type);
CREATE INDEX idx_content_items_source ON public.content_items(source);
CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);
CREATE INDEX idx_saved_items_content_id ON public.saved_items(content_item_id);
CREATE INDEX idx_trending_topics_category_id ON public.trending_topics(category_id);
CREATE INDEX idx_seo_content_user_id ON public.seo_content(user_id);
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_date ON public.user_analytics(date_recorded);

-- 12. Create functions for automatic profile creation and updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- 13. Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- 14. Create RLS policies using safe patterns

-- Pattern 1: Core user tables (simple ownership)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for categories
CREATE POLICY "public_can_read_categories"
ON public.categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_categories"
ON public.categories
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
));

-- Pattern 2: Simple user ownership
CREATE POLICY "users_manage_own_searches"
ON public.searches
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_saved_items"
ON public.saved_items
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_seo_content"
ON public.seo_content
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_user_settings"
ON public.user_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_user_analytics"
ON public.user_analytics
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, admin write for trending topics
CREATE POLICY "public_can_read_trending_topics"
ON public.trending_topics
FOR SELECT
TO public
USING (true);

CREATE POLICY "admins_manage_trending_topics"
ON public.trending_topics
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'moderator')
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'moderator')
));

-- Pattern 4: Public read, authenticated write for content items
CREATE POLICY "public_can_read_content_items"
ON public.content_items
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_manage_content_items"
ON public.content_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 15. Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER handle_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_content_items
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_seo_content
  BEFORE UPDATE ON public.seo_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 16. Insert sample data for development
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    ai_category_id UUID := gen_random_uuid();
    web_category_id UUID := gen_random_uuid();
    cyber_category_id UUID := gen_random_uuid();
    cloud_category_id UUID := gen_random_uuid();
    mobile_category_id UUID := gen_random_uuid();
    data_category_id UUID := gen_random_uuid();
    content1_id UUID := gen_random_uuid();
    content2_id UUID := gen_random_uuid();
    content3_id UUID := gen_random_uuid();
    content4_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@zerocrash.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@zerocrash.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Regular User", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert categories
    INSERT INTO public.categories (id, name, description, icon, color) VALUES
        (ai_category_id, 'AI/ML', 'Artificial Intelligence and Machine Learning', 'Brain', 'accent'),
        (web_category_id, 'Web Development', 'Frontend and Backend Web Development', 'Code', 'success'),
        (cyber_category_id, 'Cybersecurity', 'Security and Privacy Technologies', 'Shield', 'error'),
        (cloud_category_id, 'Cloud/DevOps', 'Cloud Computing and Development Operations', 'Cloud', 'primary'),
        (mobile_category_id, 'Mobile Development', 'iOS, Android, and Cross-platform Development', 'Smartphone', 'warning'),
        (data_category_id, 'Data Science', 'Data Analysis and Big Data Technologies', 'BarChart3', 'accent');

    -- Insert trending topics
    INSERT INTO public.trending_topics (category_id, topic, trend_count, popularity_score, growth_percentage, recent_trends) VALUES
        (ai_category_id, 'AI/ML', 45, 92, 25.0, ARRAY['GPT-4 Turbo Performance Updates', 'Machine Learning Model Optimization', 'Neural Network Architecture Trends']),
        (cyber_category_id, 'Cybersecurity', 38, 87, 18.0, ARRAY['Zero Trust Architecture Implementation', 'Ransomware Protection Strategies', 'Cloud Security Best Practices']),
        (cloud_category_id, 'Cloud/DevOps', 52, 84, 15.0, ARRAY['Kubernetes Security Enhancements', 'Serverless Architecture Patterns', 'CI/CD Pipeline Optimization']),
        (web_category_id, 'Web Development', 41, 79, 12.0, ARRAY['React 18 Performance Features', 'Next.js 14 App Router Updates', 'TypeScript 5.0 New Features']),
        (mobile_category_id, 'Mobile Development', 29, 73, 8.0, ARRAY['Flutter 3.16 Widget Updates', 'React Native Performance Tips', 'iOS 17 Development Changes']),
        (data_category_id, 'Data Science', 35, 68, 6.0, ARRAY['Python Data Analysis Libraries', 'Big Data Processing Frameworks', 'Statistical Modeling Techniques']);

    -- Insert content items
    INSERT INTO public.content_items (id, title, description, url, item_type, source, category_id, difficulty, popularity_score, published_at) VALUES
        (content1_id, 'GPT-4 Turbo: New Features and Performance Improvements for Developers', 'Comprehensive overview of GPT-4 Turbo updates including enhanced reasoning capabilities, improved context handling, and new API features for enterprise applications.', 'https://example.com/gpt4-turbo', 'article', 'google', ai_category_id, 'medium', 94, now() - interval '1 hour'),
        (content2_id, 'Kubernetes Security: Implementing Zero Trust Architecture in Production', 'Step-by-step guide to implementing zero trust security principles in Kubernetes clusters, covering network policies, RBAC, and service mesh integration.', 'https://example.com/k8s-security', 'article', 'youtube', cloud_category_id, 'hard', 89, now() - interval '2 hours'),
        (content3_id, 'React 18 Concurrent Features: A Deep Dive into Performance Optimization', 'Detailed analysis of React 18 concurrent features including Suspense improvements, automatic batching, and startTransition API for better user experience.', 'https://example.com/react18-concurrent', 'article', 'reddit', web_category_id, 'medium', 86, now() - interval '3 hours'),
        (content4_id, 'Cybersecurity Trends 2024: Emerging Threats and Defense Strategies', 'Analysis of current cybersecurity landscape including AI-powered attacks, supply chain vulnerabilities, and next-generation security frameworks.', 'https://example.com/cyber-trends-2024', 'article', 'google', cyber_category_id, 'easy', 82, now() - interval '4 hours');

    -- Insert searches
    INSERT INTO public.searches (user_id, query, category_id, sources, results_count, status) VALUES
        (user_uuid, 'React 18 performance optimization', web_category_id, ARRAY['google', 'youtube'], 127, 'completed'),
        (user_uuid, 'Kubernetes security best practices', cloud_category_id, ARRAY['google', 'reddit'], 89, 'completed'),
        (user_uuid, 'Machine learning model deployment', ai_category_id, ARRAY['google', 'youtube', 'reddit'], 156, 'completed'),
        (admin_uuid, 'Zero trust architecture implementation', cyber_category_id, ARRAY['google'], 73, 'completed');

    -- Insert saved items
    INSERT INTO public.saved_items (user_id, content_item_id, folder_name, is_favorite) VALUES
        (user_uuid, content3_id, 'Web Development', true),
        (user_uuid, content2_id, 'DevOps', false),
        (admin_uuid, content1_id, 'AI Research', true),
        (admin_uuid, content4_id, 'Security', false);

    -- Insert user analytics
    INSERT INTO public.user_analytics (user_id, metric_name, metric_value, date_recorded) VALUES
        (user_uuid, 'total_searches', 1247, CURRENT_DATE),
        (user_uuid, 'saved_items', 89, CURRENT_DATE),
        (user_uuid, 'api_calls_today', 2341, CURRENT_DATE),
        (admin_uuid, 'total_searches', 892, CURRENT_DATE),
        (admin_uuid, 'saved_items', 156, CURRENT_DATE),
        (admin_uuid, 'api_calls_today', 1876, CURRENT_DATE);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 17. Create cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs to delete
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@zerocrash.com';

    -- Delete in dependency order (children first)
    DELETE FROM public.user_analytics WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.saved_items WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.seo_content WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.searches WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_settings WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    
    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
    
    RAISE NOTICE 'Cleanup completed successfully';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;