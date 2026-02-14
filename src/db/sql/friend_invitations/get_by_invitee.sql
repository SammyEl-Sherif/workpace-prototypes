-- Get all pending invitations for a user
SELECT 
  fi.*,
  inviter.email as inviter_email,
  invitee.email as invitee_email
FROM public.friend_invitations fi
LEFT JOIN auth.users inviter ON fi.inviter_user_id = inviter.id
LEFT JOIN auth.users invitee ON fi.invitee_user_id = invitee.id
WHERE fi.invitee_user_id = $1 AND fi.status = 'pending'
ORDER BY fi.created_at DESC;
