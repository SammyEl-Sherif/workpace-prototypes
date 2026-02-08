UPDATE public.event_guests
SET
  invite_status = $2::invite_status,
  sms_invite_message_id = $3,
  last_invite_sent_at = NOW()
WHERE id = $1
RETURNING *;
