SELECT [PIN], [PhoneNumber], [AuthStatus], [OTCP], [mobID]
FROM [dbo].[MemberAuth]
WHERE [PhoneNumber] = @PhoneNumber 
