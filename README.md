# Tatrapak

Tento repozitár obsahuje aplikáciu Tatrapak. Postupujte podľa pokynov nižšie na nastavenie a spustenie aplikácie.

## Predpoklady

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