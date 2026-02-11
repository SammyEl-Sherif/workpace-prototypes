-- Get all invitations sent by a user
SELECT 
  fi.*,
  inviter.email as inviter_email,
  invitee.email as invitee_email
FROM public.friend_invitations fi
LEFT JOIN auth.users inviter ON fi.inviter_user_id = inviter.id
LEFT JOIN auth.users invitee ON fi.invitee_user_id = invitee.id
WHERE fi.inviter_user_id = $1
ORDER BY fi.created_at DESC;
