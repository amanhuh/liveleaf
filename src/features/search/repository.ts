import prisma from "@/lib/prisma";

export interface SearchDocumentItem {
  id: string;
  title: string | null;
  parentId: string | null;
  icon: string | null;
  updatedAt: Date;
  finalScore: number;
  snippet: string | null;
  pathIds: string[];
  pathTitles: string[];
}

export async function searchDocuments(
  ownerId: string,
  query: string,
  limit: number,
): Promise<SearchDocumentItem[]> {
  try {
    const candidateLimit = Math.min(Math.max(limit * 5, 50), 200);

    const results = await prisma.$queryRaw<SearchDocumentItem[]>`
      WITH RECURSIVE search_input AS (
        SELECT
          ${query}::text AS query,
          websearch_to_tsquery('english', ${query}) AS tsq
      ),

      exact_matches AS (
        SELECT
          d.id,
          d.title,
          d."parentId",
          d.icon,
          d."updatedAt",
          1::int AS is_exact,
          0::int AS is_prefix,
          0::float8 AS fts_rank,
          0::float8 AS trigram_similarity,
          ts_headline(
            'english',
            COALESCE(d."plainText", ''),
            phraseto_tsquery('english', search_input.query),
            'MaxWords=15, MinWords=8, StartSel=<<, StopSel=>>, HighlightAll=false'
          )::text AS snippet
        FROM "Document" d
        CROSS JOIN search_input
        WHERE d."ownerId" = ${ownerId}
          AND d."archivedAt" IS NULL
          AND (
            d.title ILIKE search_input.query
            OR COALESCE(d."plainText", '') ILIKE search_input.query
            OR COALESCE(d."plainText", '') ILIKE '% ' || search_input.query || ' %'
            OR COALESCE(d."plainText", '') ILIKE search_input.query || ' %'
            OR COALESCE(d."plainText", '') ILIKE '% ' || search_input.query
          )
        ORDER BY d."updatedAt" DESC
        LIMIT ${candidateLimit}
      ),

      prefix_matches AS (
        SELECT
          d.id,
          d.title,
          d."parentId",
          d.icon,
          d."updatedAt",
          0::int AS is_exact,
          1::int AS is_prefix,
          0::float8 AS fts_rank,
          0::float8 AS trigram_similarity,
          ts_headline(
            'english',
            COALESCE(d."plainText", ''),
            websearch_to_tsquery('english', search_input.query),
            'MaxWords=15, MinWords=8, StartSel=<<, StopSel=>>, HighlightAll=false'
          )::text AS snippet
        FROM "Document" d
        CROSS JOIN search_input
        WHERE d."ownerId" = ${ownerId}
          AND d."archivedAt" IS NULL
          AND (
            d.title ILIKE search_input.query || '%'
            OR d.title ILIKE '% ' || search_input.query || '%'
            OR COALESCE(d."plainText", '') ILIKE search_input.query || '%'
            OR COALESCE(d."plainText", '') ILIKE '% ' || search_input.query || '%'
          )
        ORDER BY
          CASE
            WHEN d.title ILIKE search_input.query THEN 1
            WHEN COALESCE(d."plainText", '') ILIKE search_input.query THEN 1
            ELSE 0
          END DESC,
          d."updatedAt" DESC
        LIMIT ${candidateLimit}
      ),

      fts_matches AS (
        SELECT
          d.id,
          d.title,
          d."parentId",
          d.icon,
          d."updatedAt",
          0::int AS is_exact,
          0::int AS is_prefix,
          ts_rank_cd(d."searchVector", search_input.tsq)::float8 AS fts_rank,
          0::float8 AS trigram_similarity,
          ts_headline(
            'english',
            COALESCE(d."plainText", ''),
            search_input.tsq,
            'MaxWords=15, MinWords=8, StartSel=<<, StopSel=>>, HighlightAll=false'
          )::text AS snippet
        FROM "Document" d
        CROSS JOIN search_input
        WHERE d."ownerId" = ${ownerId}
          AND d."archivedAt" IS NULL
          AND numnode(search_input.tsq) > 0
          AND d."searchVector" @@ search_input.tsq
        ORDER BY
          ts_rank_cd(d."searchVector", search_input.tsq) DESC,
          d."updatedAt" DESC
        LIMIT ${candidateLimit}
      ),

      trigram_matches AS (
        SELECT
          d.id,
          d.title,
          d."parentId",
          d.icon,
          d."updatedAt",
          0::int AS is_exact,
          0::int AS is_prefix,
          0::float8 AS fts_rank,
          GREATEST(
            similarity(COALESCE(d.title, ''), search_input.query),
            word_similarity(search_input.query, COALESCE(d.title, '')),
            word_similarity(search_input.query, COALESCE(d."plainText", ''))
          )::float8 AS trigram_similarity,
          COALESCE(
            NULLIF(
              ts_headline(
                'english',
                COALESCE(d."plainText", ''),
                websearch_to_tsquery('english', search_input.query),
                'MaxWords=15, MinWords=8, StartSel=<<, StopSel=>>, HighlightAll=false'
              ),
              ''
            ),
            NULLIF(
              SUBSTRING(
                COALESCE(d."plainText", '')
                FROM GREATEST(1, STRPOS(LOWER(COALESCE(d."plainText", '')), LOWER(SUBSTRING(trim(search_input.query) FROM 1 FOR GREATEST(3, LENGTH(trim(search_input.query)) - 2)))) - 30)
                FOR 100
              ),
              ''
            )
          )::text AS snippet
        FROM "Document" d
        CROSS JOIN search_input
        WHERE d."ownerId" = ${ownerId}
          AND d."archivedAt" IS NULL
          AND (
            word_similarity(search_input.query, COALESCE(d.title, '')) > 0.45
            OR COALESCE(d.title, '') % search_input.query
            OR COALESCE(d."plainText", '') %> search_input.query
          )
        ORDER BY
          GREATEST(
            word_similarity(search_input.query, COALESCE(d.title, '')),
            similarity(COALESCE(d.title, ''), search_input.query),
            word_similarity(search_input.query, COALESCE(d."plainText", ''))
          ) DESC,
          d."updatedAt" DESC
        LIMIT ${candidateLimit}
      ),

      merged_candidates AS (
        SELECT
          matches.id,
          max(matches.title) AS title,
          max(matches."parentId") AS "parentId",
          max(matches.icon) AS icon,
          max(matches."updatedAt") AS "updatedAt",
          MAX(matches.is_exact) AS is_exact,
          MAX(matches.is_prefix) AS is_prefix,
          MAX(matches.fts_rank) AS fts_rank,
          MAX(matches.trigram_similarity) AS trigram_similarity,
          MAX(matches.snippet) AS snippet
        FROM (
          SELECT * FROM exact_matches
          UNION ALL
          SELECT * FROM prefix_matches
          UNION ALL
          SELECT * FROM fts_matches
          UNION ALL
          SELECT * FROM trigram_matches
        ) matches
        GROUP BY matches.id
      ),

      ranked_candidates AS (
        SELECT
          mc.id,
          mc.title,
          mc."parentId",
          mc.icon,
          mc."updatedAt",
          mc.snippet,
          (
            CASE WHEN mc.is_exact = 1 THEN 1000 ELSE 0 END +
            CASE WHEN mc.is_prefix = 1 THEN 200 ELSE 0 END +
            (mc.fts_rank * 100) +
            (mc.trigram_similarity * 50)
          )::float8 AS "finalScore"
        FROM merged_candidates mc
      ),

      limited_candidates AS (
        SELECT *
        FROM ranked_candidates
        ORDER BY "finalScore" DESC, "updatedAt" DESC
        LIMIT ${limit}
      ),

      recursive_paths AS (
        SELECT
          lc.id AS "matchId",
          d.id,
          d."parentId",
          d.title,
          d."archivedAt",
          0 AS depth
        FROM limited_candidates lc
        INNER JOIN "Document" d ON d.id = lc.id

        UNION ALL

        SELECT
          rp."matchId",
          parent.id,
          parent."parentId",
          parent.title,
          parent."archivedAt",
          rp.depth + 1 AS depth
        FROM recursive_paths rp
        INNER JOIN "Document" parent ON parent.id = rp."parentId"
      ),

      candidate_paths AS (
        SELECT
          rp."matchId",
          ARRAY_AGG(rp.id ORDER BY rp.depth DESC) AS "pathIds",
          ARRAY_AGG(
            COALESCE(NULLIF(rp.title, ''), 'New Page')
            ORDER BY rp.depth DESC
          ) AS "pathTitles",
          BOOL_OR(rp.depth > 0 AND rp."archivedAt" IS NOT NULL) AS "hasArchivedAncestor"
        FROM recursive_paths rp
        GROUP BY rp."matchId"
      ),

      active_ranked_candidates AS (
        SELECT
          lc.id,
          lc.title,
          lc."parentId",
          lc.icon,
          lc."updatedAt",
          lc.snippet,
          lc."finalScore",
          cp."pathIds",
          cp."pathTitles"
        FROM limited_candidates lc
        INNER JOIN candidate_paths cp ON cp."matchId" = lc.id
        WHERE cp."hasArchivedAncestor" = false
      )

      SELECT
        arc.id,
        arc.title,
        arc."parentId",
        arc.icon,
        arc."updatedAt",
        arc.snippet,
        arc."finalScore",
        arc."pathIds",
        arc."pathTitles"
      FROM active_ranked_candidates arc
      ORDER BY
        arc."finalScore" DESC,
        arc."updatedAt" DESC;
    `;
    return results;
  } catch (error) {
    console.error("Search query execution error handled safely:", error);
    return [];
  }
}
