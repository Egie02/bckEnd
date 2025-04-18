SELECT TOP (1000) [mobID]
      ,[PhoneNumber]
      ,[OTCP]
      ,[authStatus]
      ,[Username]
      ,[Empstatus]
      ,[Department]
      ,[Shares]
      ,[Sharesmark]
      ,[SHstatus]
      ,[Savings]
      ,[Savingsmark]
      ,[SVstatus]
      ,[RegularLoan]
      ,[Regmark]
      ,[Rstatus]
      ,[AdditionalLoan]
      ,[Addmark]
      ,[Astatus]
      ,[AppliancesLoan]
      ,[Appmark]
      ,[Appstatus]
      ,[GroceryLoan]
      ,[Gromark]
      ,[Gstatus]
      ,[OthLoan]
      ,[Othmark]
      ,[Othstatus]
      ,[QuickLoan]
      ,[Quimark]
      ,[Qstatus]
      ,[First]
      ,[Second]
      ,[Third]
      ,[Fourth]
      ,[Fifth]
  FROM [mpcmob_user].[dbo].[Members]
  WHERE [PhoneNumber] = @PhoneNumber