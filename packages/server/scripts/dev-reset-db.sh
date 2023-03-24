#!/usr/bin/env bash

pnpm db:reset
psql -U rudraprasaddas -w -d cms_now -f ~/db_backup/backup-cms-now.sql
node db/migrate-old
psql -U rudraprasaddas -w -d cms_now -f ~/db_backup/backup-public-now.sql
