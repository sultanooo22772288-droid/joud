import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      return res.status(500).json({ error: 'Supabase server configuration is missing.' });
    }

    const supabase = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) {
      return res.status(401).json({ error: 'غير مصرح.' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return res.status(401).json({ error: 'جلسة الدخول غير صالحة.' });
    }

    const { data: caller } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', authData.user.id)
      .maybeSingle();

    if (!caller || caller.role !== 'admin') {
      return res.status(403).json({ error: 'هذه العملية متاحة للإدارة فقط.' });
    }

    const body = req.body || {};
    const action = body.action;

    if (action === 'create') {
      const profile = body.profile || {};
      const password = body.password || '';

      if (!profile.email || !password) {
        return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' });
      }

      const { data: created, error: createError } =
        await supabase.auth.admin.createUser({
          email: profile.email,
          password,
          email_confirm: true
        });

      if (createError) throw createError;

      const row = {
        ...profile,
        auth_user_id: created.user.id
      };

      const { data: saved, error: saveError } = await supabase
        .from('profiles')
        .insert(row)
        .select()
        .single();

      if (saveError) {
        await supabase.auth.admin.deleteUser(created.user.id);
        throw saveError;
      }

      return res.status(200).json({ profile: saved });
    }

    if (action === 'update') {
      const profile = body.profile || {};
      const authUserId = profile.auth_user_id;

      if (!authUserId) {
        return res.status(400).json({ error: 'معرف المستخدم مفقود.' });
      }

      const authUpdates = {};

      if (profile.email) authUpdates.email = profile.email;
      if (body.password) authUpdates.password = body.password;

      if (Object.keys(authUpdates).length) {
        const { error } = await supabase.auth.admin.updateUserById(
          authUserId,
          authUpdates
        );
        if (error) throw error;
      }

      const row = { ...profile };
      delete row.auth_user_id;

      const { data: saved, error: saveError } = await supabase
        .from('profiles')
        .update(row)
        .eq('auth_user_id', authUserId)
        .select()
        .single();

      if (saveError) throw saveError;

      return res.status(200).json({ profile: saved });
    }

    if (action === 'delete') {
      const authUserId = body.auth_user_id;

      if (!authUserId) {
        return res.status(400).json({ error: 'معرف المستخدم مفقود.' });
      }

      const { error } = await supabase.auth.admin.deleteUser(authUserId);
      if (error) throw error;

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'عملية غير معروفة.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error?.message || 'حدث خطأ في الخادم.'
    });
  }
}
