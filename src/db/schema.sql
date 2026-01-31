-- Tabla para guardar URLs acortadas
CREATE TABLE IF NOT EXISTS short_urls (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,      -- Código corto (ej: "abc123")
  original_url TEXT NOT NULL,             -- URL original larga
  created_at TIMESTAMP DEFAULT NOW(),     -- Cuándo se creó
  clicks INTEGER DEFAULT 0,               -- Contador de clicks
  last_clicked_at TIMESTAMP               -- Última vez que se usó
);

-- Índice para búsqueda rápida por código
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(code);
