# Chemin vers le répertoire pizza-api
$PizzaApiPath = Resolve-Path ".\pizza-api"

# Ouvre la première fenêtre CMD pour exécuter start.ps1 dans pizza-api en utilisant PowerShell
Start-Process cmd.exe -ArgumentList "/K cd /d `"$PizzaApiPath`" && powershell.exe -ExecutionPolicy Bypass -File .\start-api.ps1"

# Chemin vers le répertoire distributeur-pizza
$DistributeurPizzaPath = Resolve-Path ".\distributeur-pizza"

# Ouvre la deuxième fenêtre CMD pour installer et démarrer distributeur-pizza
Start-Process cmd.exe -ArgumentList "/K cd /d `"$DistributeurPizzaPath`" && npm install && npm run start"
