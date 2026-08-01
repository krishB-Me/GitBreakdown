ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all repos"
    ON repositories 
    FOR SELECT USING ( true );

CREATE POLICY "Enable insert/update for all repos"
    ON repositories
    FOR ALL USING ( true );

CREATE POLICY "Enable read for all files"
    ON files
    FOR SELECT USING ( true );

CREATE POLICY "Enable insert/update for all files"
    ON files
    FOR ALL USING ( true );

ALTER TABLE files 
    DROP CONSTRAINT IF EXISTS files_repo_id_fkey;

ALTER TABLE files 
    ADD CONSTRAINT files_repo_id_fkey 
    FOREIGN KEY (repo_id)
    REFERENCES repositories(id)
    ON DELETE CASCADE;