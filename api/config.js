export default function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return res.status(500).json({
      error: 'Supabase environment variables are missing.'
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');

  return res.status(200).json({
    url,
    anonKey
  });
}
