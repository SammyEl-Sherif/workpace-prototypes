SELECT
  eg.id,
  eg.event_id,
  eg.user_id,
  eg.phone_number,
  eg.name,
  eg.invite_status,
  eg.sms_invite_message_id,
  eg.last_invite_sent_at,
  eg.created_at,
  eg.updated_at
FROM public.event_guests eg
WHERE eg.event_id = $1
ORDER BY eg.created_at ASC;
