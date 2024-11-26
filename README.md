# Tatrappak

Tento repozitár obsahuje aplikáciu Tatrapak. Postupujte podľa pokynov nižšie na nastavenie a spustenie aplikácie.

## Pre porotu

Rátam s tým, že tento kolos si nechcete sami hostovať, preto som Vám pripravil link, kde to je celé hostnuté. Nájdete ho na https://tatrapak.em1t.xyz/ .

Prihlasovacie údaje:
### Správca
admin@tatrapak.sk  
Admin123

### Administratívny pracovník
administrativa@tatrapak.sk  
Administrativa123

### Výroba (oddelenie: Sklad)
vyroba@tatrapak.sk  
Vyroba123  
Poznámka: Ak Administratívny pracovník nastaví na produkt oddelenie iné ako je Sklad, z tohto účtu to neuvidíte, pokiaľ za Správcu nezmeníte oddelenie tomuto účtu v `/pouzivatelia`

### Obchodník
obchod@tatrapak.sk  
Obchod123

## Predpoklady na server

- Node.js (verzia 14 alebo vyššie)
- Docker
- Docker Compose

## Nastavenie

1. Naklonujte repozitár:
   ```sh
   git clone https://github.com/Em1tt/tatrapak-portal.git
   cd tatrapak
   ```
2. Nainštalujte dependencies:
    ```sh
    npm install
    ```
3. Vytvorte súbor `.env` v koreňovom adresári s nasledujúcim obsahom:
    ```
    SQLURI=database_connection_string
    ```
## Spustenie aplikácie
### Použitie Docker Compose
1. Vytvorte a spustite služby:
```sh
sudo docker-compose up --build -d
```
2. Na zastavenie služieb:
```sh
sudo docker-compose down
```

### Použitie Docker príkazov
1. Vytvorte Docker image:
```sh
sudo docker build -t tatrapak-image .
```
2. Spustite Docker kontajner:
```sh
sudo docker run -p 8096:3000 -d --restart always tatrapak-image
```
## Prístup k aplikácii
Keď je aplikácia spustená, môžete ju otvoriť vo svojom webovom prehliadači na adrese `http://localhost:8096`.

## Vývoj
Na spustenie aplikácie v režime vývoja:

1. Spustite aplikáciu:
```sh
npm run dev
```

2. Otvorte svoj prehliadač a prejdite na `http://localhost:5173`.
