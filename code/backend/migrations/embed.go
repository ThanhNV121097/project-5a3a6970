package migrations

import "embed"

// Files contains embedded up migrations.
//go:embed *.up.sql
var Files embed.FS
