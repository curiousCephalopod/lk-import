# lk-import
Import LegendKeeper JSON into FoundryVTT

# Instructions:
Export your LegendKeeper wiki in JSON format.  
Combine all of the files into a compatible tree with 'format.py [Path to Wiki folder] [Output file]'  
Click the LegendKeeper Import button on the Journal Entries side bar  
Paste the contents of the output file into the text box and click import.

# Limitations:
FoundryVTT only supports 3 layers of folders, therefore any Wiki page too deep will have its contents appended to the parent page.  
Each layer has both a folder and a page, as pages cannot be linked directly to pages.  
Links will be converted to '@JournalEntry[NAME]', if the referenced page has been compressed due to the depth limitation, the link will break.  
Secret blocks and other like them are simply removed.  
