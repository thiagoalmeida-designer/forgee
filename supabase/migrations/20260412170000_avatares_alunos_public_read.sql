-- Fotos de alunos em <img src> precisam de URL pública (GET sem JWT).
-- Mantém INSERT/UPDATE/DELETE restritos a staff (políticas existentes).
UPDATE storage.buckets
SET public = true
WHERE id = 'avatares-alunos';
