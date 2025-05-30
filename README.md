# Boatshop
Guide för att demonstrera api:t i frontend
---------------------------------------

**1. Starta Servern**

Öppna en terminal i rotmappen KÖR kommando: **mongod** för att få tillgång till databasen. Öppna en terminal till i rotmappen KÖR kommando : **npm run start-server**

**2. Lägg upp båtobjekten**

Öppna en terminal i rotmappen där nodescript-filerna ligger mata in kommando: 
**node restore-boatshop-script.js**  - Kör nodescriptet för att rensa databasen och lägga upp alla båtobjekt.
(För att bara lägga upp eller ta bort separat KÖR **add-boats-script.js** eller **delete-boats-script.js**).

**3. Lägg in bilderna i databasen**

Mata in http://localhost:1337/handleimages i adressfältet i webbläsaren för att gå till routen bildhantering.
Klicka på browse-knappen för flera filer. Markera alla filer(bildfiler) i mappen **public/assets**
Klicka på ladda upp filer.

**4. Demonstration av api:t i frontend**

Skriv in http://localhost:1337/ i adressfältet i webbläsaren för att gå till routen **frontend.html**.
Testa api-funktionerna i frontend!


Viktiga Filer
---------------------------------------
- /public/**frontend.html**(scriptfil: **frontend-script.js**) : Vanilla JavaScript-app som demonstrerar API-funktioner.
- /public/**frontend-test**(scriptfil: **frontend-script-test.js**) : Testfiler-frontend(test av requests).
- public/**image-handeling.ejs** : För bildhantering, frontend för att lägga upp alla bilder till databasen.
- **restore-boatshop-script.js** : KÖR för att lägga in alla båtaobjekt (rensar databasen och lägger in båtobjekten på nytt).


Jag har implementerat följande level ups:
---------------------------------------
1. Minst 20 dokument i databasen
2. Node-skript som återställer databasen (tar bort allt och lägger in alla dokument igen)
3. Vanilla JavaScript-app som demonstrerar API-funktioner
4. Ändra ett båt-dokument i databasen med ett PUT request

5. Varje båtobjekt i databasen har en URL till en bild. 6. Bilderna finns i databasen)
Kommentar: Har ej publicerad kod på level up 5. Då jag inte publicerat uppgiften med hjäp av
Netlify har jag valt att köra en frontend för att lätt ladda upp bilderna i databasen(se guide För att demonstrera API funktionen i frontend)
så att bilderna hämtas ifrån databasen.

7. Fler alternativ på sökning
