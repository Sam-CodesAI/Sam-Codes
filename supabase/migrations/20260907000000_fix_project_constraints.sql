-- Fix schema constraints on projects, capabilities, and assistant_knowledge

-- 1. Projects status and category constraints
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('DRAFT', 'IDEA', 'BUILDING', 'TESTING', 'VERIFIED', 'PUBLISHED', 'ARCHIVED', 'In Development', 'Shipped', 'Experimental'));

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE projects ADD CONSTRAINT projects_category_check
  CHECK (length(category) > 0);

-- 2. Capabilities category constraints
ALTER TABLE capabilities DROP CONSTRAINT IF EXISTS capabilities_category_check;
ALTER TABLE capabilities ADD CONSTRAINT capabilities_category_check
  CHECK (length(category) > 0);

-- 3. Assistant knowledge category constraints
ALTER TABLE assistant_knowledge DROP CONSTRAINT IF EXISTS assistant_knowledge_category_check;
