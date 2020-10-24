# lk-import
Import LegendKeeper JSON into FoundryVTT
Note: this module is a very hacked together attempt at achieving integration. It is likely many foundryvtt versions out of date at this point, and will probably never see another update. Feel free to use any portion of the code in you're own development.

# Instructions:
Export your LegendKeeper wiki in JSON format.  
Combine all of the files into a compatible tree with 'format.py [Path to Wiki folder] [Output file]'  
Click the LegendKeeper Import button on the Journal Entries side bar  
Paste the contents of the output file into the text box and click import.

# Limitations:
Python script needs the 'anytree' package.
FoundryVTT only supports 3 layers of folders, therefore any Wiki page too deep will have its contents appended to the parent page.  
Each layer has both a folder and a page, as pages cannot be linked directly to pages.  
Links will be converted to '@JournalEntry[NAME]', if the referenced page has been compressed due to the depth limitation, the link will break.  
Secret blocks and other like them are simply removed.  
