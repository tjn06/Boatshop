# Boatshop
Boatshop
För att demonstrera API funktionen i frontend

1. Starta Servern

Öppna en terminal KÖR kommando: mongod , Öppna en terminal till KÖR kommando : npm run start-server

2. Lägg upp båtobjekten

Öppna en terminal i Rootmappen där nodescript-filerna ligger mata in kommando: 
node restore-boatshop-script.js  - (Kör nodescriptet restore-boatshop-script.js för att rensa databsen och lägga upp alla båtobjekt)
(för att bara lägga upp eller ta bort separat KÖR: add-boats-script.js eller delete-boats-script.js)

3. Lägg in bilderna i databasen

Skriv in http://localhost:1337/handleimages i adressfältet för att gå till routen bildhantering
Tryck på browse för flera filer. Markera alla filer(bildfiler) i mappen public/assets
Tryck ladda upp filer

4. Demonstration av api:et i frontend

Skriv in http://localhost:1337/ i adressfältet för att gå till routen frontend.html
Testa api-funktionerna i frontend!

Viktiga Filer
- /public/frontend.html(scriptfil: frontend-script.js) : Vanilla JavaScript-app som demonstrerar API-funktioner
- /public/frontend-test(scriptfil: frontend-script.js) : Dina testfiler(lite påverkade av css-klasser men ej ändras)
- public/image-handeling.ejs : För bildhantering, frontend för att lägga upp alla bilder till databasen
- restore-boatshop-script.js : Kör för att lägga in alla båtaobjekt (rensar databsen och lägger in båtobjekten på nytt)

Jag har implementerat följande level ups:
1. Minst 20 dokument i databasen
2. Node-skript som återställer databasen (tar bort allt och lägger in alla dokument igen)
3. Vanilla JavaScript-app som demonstrerar API-funktioner
4. Ändra ett båt-dokument i databasen med ett PUT request

5. Varje båtobjekt i databasen har en URL till en bild. 6. Bilderna finns i databasen)
Kommentar: Har ej publicerad kod på level up 5. Då jag inte publicerat uppgiften med hjäp av
Netlify har jag valt att köra en frontend för att lätt ladda upp bilderna i databasen(se guide För att demonstrera API funktionen i frontend)
så att bilderna hämtas ifrån databasen.

7. Fler alternativ på sökning
